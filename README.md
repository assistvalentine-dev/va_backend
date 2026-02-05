# Frontend - Blind Dating React App

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_PAYMENT_GATEWAY=razorpay
VITE_PAYMENT_AMOUNT=499
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Pages

- `/` - Landing page
- `/form` - User registration form
- `/payment` - Payment page
- `/success` - Success page after payment


# va_frontend
