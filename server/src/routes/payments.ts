import { Router, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import nodemailer from 'nodemailer';
import { db } from '../db.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();
router.use(authenticate);

const FIXED_AMOUNT_RUPEES = 25000;
const FIXED_AMOUNT_PAISE = FIXED_AMOUNT_RUPEES * 100;

// Initialize Razorpay
const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_id';
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_dummy_key_secret';

let razorpay: Razorpay | null = null;
if (keyId && keySecret && !keyId.includes('dummy')) {
  try {
    razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
  } catch (err) {
    console.warn('Razorpay init warning:', err);
  }
}

// Initialize Nodemailer transporter
const createMailTransporter = () => {
  let host = process.env.SMTP_HOST || 'smtp.gmail.com';
  if (host.includes('@')) {
    host = 'smtp.gmail.com';
  }

  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const isPlaceholderPass = !pass || pass === 'demo_password' || pass.includes('placeholder') || pass.includes('your_');

  if (user && pass && !isPlaceholderPass && !user.includes('dummy') && !user.includes('ethereal')) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  console.log('ℹ️ Nodemailer: Dev Stream mode active (SMTP_PASS is placeholder). To dispatch real emails to inbox, replace SMTP_PASS in server/.env with your 16-character Gmail App Password.');

  // Fallback dev stream transporter (logs message output cleanly in console without auth errors)
  return nodemailer.createTransport({
    jsonTransport: true,
  });
};

const transporter = createMailTransporter();

// Create Razorpay Order
router.post('/create-order', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { requestId } = req.body;

    if (!requestId) {
      res.status(400).json({ error: 'Request ID is required.' });
      return;
    }

    const demoReq = await db.demoRequest.findFirst({
      where: { id: Number(requestId), userId },
    });

    if (!demoReq) {
      res.status(404).json({ error: 'Demo request not found.' });
      return;
    }

    if (demoReq.status === 'confirmed') {
      res.status(400).json({ error: 'This demo request is already confirmed.' });
      return;
    }

    let orderId = `order_test_${Date.now()}_${demoReq.id}`;

    if (razorpay) {
      const order = await razorpay.orders.create({
        amount: FIXED_AMOUNT_PAISE,
        currency: 'INR',
        receipt: `receipt_demo_${demoReq.id}`,
        notes: {
          requestId: demoReq.id.toString(),
          userId: userId.toString(),
          businessName: demoReq.businessName,
        },
      });
      orderId = order.id;
    }

    // Save order ID to demo request
    await db.demoRequest.update({
      where: { id: demoReq.id },
      data: { razorpayOrderId: orderId },
    });

    res.json({
      orderId,
      amount: FIXED_AMOUNT_RUPEES,
      currency: 'INR',
      keyId,
      businessName: demoReq.businessName,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to create payment order.' });
  }
});

// Verify Payment Signature & Confirm Booking
router.post('/verify', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { requestId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!requestId || !razorpay_order_id || !razorpay_payment_id) {
      res.status(400).json({ error: 'Missing payment verification details.' });
      return;
    }

    const demoReq = await db.demoRequest.findUnique({
      where: { id: Number(requestId) },
      include: { user: true },
    });

    if (!demoReq) {
      res.status(404).json({ error: 'Demo request not found.' });
      return;
    }

    // Cryptographic signature check if using real keys
    if (razorpay_signature && keySecret && !keySecret.includes('dummy')) {
      const body = razorpay_order_id + '|' + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body.toString())
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        res.status(400).json({ error: 'Invalid payment signature.' });
        return;
      }
    }

    // Mark request as confirmed (idempotent update)
    const updatedRequest = await db.demoRequest.update({
      where: { id: demoReq.id },
      data: {
        status: 'confirmed',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    // Trigger Email Notification to NOTIFICATION_EMAIL specified in .env & user
    const targetEmail = process.env.NOTIFICATION_EMAIL || demoReq.user?.email;
    const recipients = [targetEmail, demoReq.user?.email].filter((e, idx, arr) => e && arr.indexOf(e) === idx).join(', ');

    if (recipients) {
      const fromAddr = process.env.SMTP_FROM || 'TrollyWise <no-reply@trollywise.com>';
      transporter
        .sendMail({
          from: fromAddr,
          to: recipients,
          subject: `[TrollyWise Payment Captured] Demo Request TW-${String(demoReq.id).padStart(4, '0')} - ${demoReq.businessName}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #0b0f19; color: #f1f5f9; padding: 32px; border-radius: 16px;">
              <h2 style="color: #34d399; margin-top: 0;">Payment Captured Successfully</h2>
              <p>A new hardware demo pilot deposit of ₹25,000 has been captured via Razorpay.</p>
              
              <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin: 20px 0; font-size: 14px; line-height: 1.6;">
                <h3 style="color: #38bdf8; margin-top: 0; border-b: 1px solid #334155; padding-bottom: 8px;">Order & Deposit Summary</h3>
                <p style="margin: 6px 0;"><strong>Ticket ID:</strong> TW-${String(demoReq.id).padStart(4, '0')}</p>
                <p style="margin: 6px 0;"><strong>Retail Brand:</strong> ${demoReq.businessName}</p>
                <p style="margin: 6px 0;"><strong>Store Address:</strong> ${demoReq.storeAddress}</p>
                <p style="margin: 6px 0;"><strong>Phone:</strong> ${demoReq.phone}</p>
                <p style="margin: 6px 0;"><strong>Deposit Paid:</strong> ₹25,000</p>
                <p style="margin: 6px 0;"><strong>Razorpay Payment ID:</strong> ${razorpay_payment_id}</p>
                <p style="margin: 6px 0;"><strong>Razorpay Order ID:</strong> ${razorpay_order_id}</p>
                <p style="margin: 6px 0;"><strong>Customer Name:</strong> ${demoReq.user?.name || 'N/A'}</p>
                <p style="margin: 6px 0;"><strong>Customer Email:</strong> ${demoReq.user?.email || 'N/A'}</p>
              </div>

              <p style="color: #94a3b8; font-size: 12px;">This is an automated notification from TrollyWise Infrastructure Server.</p>
            </div>
          `,
        })
        .then((info) => {
          console.log(`✉️ Nodemailer email sent successfully to [${recipients}]:`, info.messageId || info);
        })
        .catch((emailErr) => {
          console.error('Nodemailer email sending error (gracefully handled):', emailErr);
        });
    }

    res.json({
      message: 'Payment verified and demo request confirmed.',
      request: updatedRequest,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ error: 'Failed to verify payment.' });
  }
});

export default router;
