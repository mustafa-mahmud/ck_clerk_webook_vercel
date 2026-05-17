import { Request, Response } from 'express';
import { Webhook } from 'svix';
import { User } from '../models/User.js';

export const handleClerkWebhook = async (req: Request, res: Response) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  const svixHeaders = {
    'svix-id': req.headers['svix-id'] as string,
    'svix-timestamp': req.headers['svix-timestamp'] as string,
    'svix-signature': req.headers['svix-signature'] as string,
  };

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(JSON.stringify(req.body), svixHeaders) as any;
  } catch (error) {
    console.error('Webhook verification failed:', error);
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const eventType = evt.type;

  try {
    if (eventType === 'user.created' || eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt.data;

      const email = email_addresses?.[0]?.email_address || '';

      if (!email) {
        return res.status(400).json({ error: 'No email found in webhook' });
      }

      if (eventType === 'user.created') {
        const existingUser = await User.findOne({ clerkId: id });

        if (!existingUser) {
          const newUser = new User({
            clerkId: id,
            email,
            firstName: first_name,
            lastName: last_name,
            password: '', // Clerk handles passwords
          });

          await newUser.save();
          console.log(`User created: ${email}`);
        }
      } else if (eventType === 'user.updated') {
        await User.findOneAndUpdate(
          { clerkId: id },
          {
            email,
            firstName: first_name,
            lastName: last_name,
          },
          { new: true },
        );
        console.log(`User updated: ${email}`);
      }
    } else if (eventType === 'user.deleted') {
      const { id } = evt.data;
      await User.findOneAndDelete({ clerkId: id });
      console.log(`User deleted: ${id}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Failed to process webhook' });
  }
};
