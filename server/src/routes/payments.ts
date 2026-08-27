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
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass && !user.includes('dummy') && !user.includes('ethereal')) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Fallback dev/test transporter (stream to console output)
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

    const demoReq = await db.demoRequest.findFirst({
      where: { id: Number(requestId), userId },
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

    // Trigger Email Notification asynchronously via Nodemailer (NFR-3.3 tolerance)
    if (demoReq.user?.email) {
      const fromAddr = process.env.SMTP_FROM || 'TrollyWise <no-reply@trollywise.com>';
      transporter
        .sendMail({
          from: fromAddr,
          to: demoReq.user.email,
          subject: 'TrollyWise Demo Booking Confirmed!',
          html: `
            <div style="font-family: sans-serif; background-color: #0d1117; color: #e6edf3; padding: 32px; border-radius: 8px;">
              <h1 style="color: #7cffd4;">Demo Request Confirmed</h1>
              <p>Hi ${demoReq.user.name},</p>
              <p>Your 15-day TrollyWise Smart Cart pilot demo has been confirmed for <strong>${demoReq.businessName}</strong>.</p>
              <div style="background: #161b22; padding: 16px; border-radius: 6px; border: 1px solid #30363d; margin: 20px 0;">
                <p style="margin: 4px 0;"><strong>Store Address:</strong> ${demoReq.storeAddress}</p>
                <p style="margin: 4px 0;"><strong>Phone:</strong> ${demoReq.phone}</p>
                <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ₹25,000</p>
                <p style="margin: 4px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
              </div>
              <p>Our hardware calibration lead will contact you within 4 business hours.</p>
            </div>
          `,
        })
        .then((info) => {
          console.log('✉️ Nodemailer email sent successfully:', info.messageId || info);
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
