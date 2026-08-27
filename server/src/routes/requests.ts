import { Router, Response } from 'express';
import { db } from '../db.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Protect all request endpoints
router.use(authenticate);

// Get user's demo requests
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const requests = await db.demoRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ requests });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch demo requests.' });
  }
});

// Create new demo request
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { businessName, storeAddress, phone } = req.body;

    if (!businessName || !storeAddress || !phone) {
      res.status(400).json({ error: 'Business name, store address, and phone number are required.' });
      return;
    }

    const newRequest = await db.demoRequest.create({
      data: {
        userId,
        businessName: businessName.trim(),
        storeAddress: storeAddress.trim(),
        phone: phone.trim(),
        status: 'pending_payment',
      },
    });

    res.status(201).json({ request: newRequest });
  } catch (error) {
    console.error('Error creating demo request:', error);
    res.status(500).json({ error: 'Failed to create demo request.' });
  }
});

// Get single request detail by ID
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const requestId = parseInt(req.params.id as string, 10);

    if (isNaN(requestId)) {
      res.status(400).json({ error: 'Invalid request ID.' });
      return;
    }

    const request = await db.demoRequest.findFirst({
      where: { id: requestId, userId },
    });

    if (!request) {
      res.status(404).json({ error: 'Demo request not found or unauthorized.' });
      return;
    }

    res.json({ request });
  } catch (error) {
    console.error('Error fetching request detail:', error);
    res.status(500).json({ error: 'Failed to fetch request detail.' });
  }
});

export default router;
