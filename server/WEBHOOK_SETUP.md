# Clerk Webhook Setup Guide

এই গাইড আপনাকে Clerk webhooks সেটআপ করতে সাহায্য করবে যাতে ব্যবহারকারী তৈরি হলে স্বয়ংক্রিয়ভাবে MongoDB-তে সংরক্ষিত হয়।

## ১. সার্ভার প্যাকেজ ইনস্টল করুন

```bash
npm install svix
npm install -D @types/svix
```

## ২. .env ফাইল তৈরি করুন

```bash
cp .env.example .env
```

তারপর `.env` ফাইল এডিট করুন:

```
MONGODB_URI=mongodb://localhost:27017/clerk-app
PORT=3000
CLERK_WEBHOOK_SECRET=whsec_your_secret_here
```

## ৩. Clerk Dashboard এ Webhook সেটআপ করুন

1. [Clerk Dashboard](https://dashboard.clerk.com) খুলুন
2. **Webhooks** সেকশনে যান
3. **Add Endpoint** ক্লিক করুন
4. URL এ এটি ডালুন:
   ```
   http://localhost:3000/api/webhooks/clerk
   ```
   (Production এ আপনার actual URL ব্যবহার করুন)

5. Events সিলেক্ট করুন:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`

6. **Create** ক্লিক করুন

## ৪. Webhook Secret কপি করুন

Webhook তৈরির পর, আপনি একটি signing secret পাবেন যা `whsec_` দিয়ে শুরু হয়। এটি `.env` ফাইলে পেস্ট করুন:

```
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## ৫. সার্ভার চালান

```bash
npm install ts-node -D
ts-node server.ts
```

## কীভাবে কাজ করে

1. **ক্লায়েন্ট সাইড**: ব্যবহারকারী sign up করে
2. **Clerk**: User তৈরি হয়
3. **Webhook**: Clerk আপনার `/api/webhooks/clerk` এ একটি POST request পাঠায়
4. **MongoDB**: আমাদের হ্যান্ডলার স্বয়ংক্রিয়ভাবে ব্যবহারকারীকে MongoDB-তে সংরক্ষণ করে

## টেস্টিং (স্থানীয়ভাবে)

স্থানীয়ভাবে Clerk webhooks পরীক্ষা করতে:

1. **Ngrok ব্যবহার করুন**:
   ```bash
   ngrok http 3000
   ```

2. Ngrok URL (যেমন `https://abc123.ngrok.io`) কপি করুন

3. Clerk Dashboard এ webhook URL আপডেট করুন:
   ```
   https://abc123.ngrok.io/api/webhooks/clerk
   ```

4. এখন আপনি Clerk Dashboard থেকে test events পাঠাতে পারবেন

## Webhook Events

আমাদের হ্যান্ডলার এই events সাপোর্ট করে:

- **`user.created`**: নতুন user MongoDB-তে যুক্ত হয়
- **`user.updated`**: user তথ্য MongoDB-তে আপডেট হয়
- **`user.deleted`**: user MongoDB থেকে মুছে যায়

## সমস্যা সমাধান

### "Webhook secret not configured"
✅ `.env` ফাইলে `CLERK_WEBHOOK_SECRET` সেট আছে কিনা চেক করুন

### "Invalid webhook signature"
✅ Secret সঠিক কিনা নিশ্চিত করুন
✅ Clerk Dashboard থেকে secret কপি করুন এবং আবার পেস্ট করুন

### MongoDB সংযোগ ত্রুটি
✅ MongoDB চলছে কিনা চেক করুন
✅ `MONGODB_URI` সঠিক কিনা নিশ্চিত করুন

