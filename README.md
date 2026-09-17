# M-Pesa STK Push Web App

A full-stack web application that lets users pay via M-Pesa STK Push directly from a browser — enter a phone number and amount, receive a real-time payment prompt, and see the result instantly.

🔗 **Live app:** https://symphonious-dolphin-7c8634.netlify.app
🔗 **Backend API:** https://mpesa-stk-push-74z5.onrender.com

## What it does

1. User enters their phone number and payment amount
2. Clicking "Pay" triggers Safaricom's Daraja API to send a real STK Push prompt to their phone
3. User enters their M-Pesa PIN to approve the payment
4. Safaricom sends the transaction result back to the app via a callback
5. The app reflects the outcome to the user

## Tech stack

- **Frontend:** HTML, CSS, JavaScript (vanilla) — deployed on Netlify
- **Backend:** Node.js, Express — deployed on Render
- **Payments:** Safaricom Daraja API (M-Pesa STK Push, sandbox environment)

## How it works

The backend authenticates with Safaricom using OAuth to get a temporary access token, then uses that token to initiate an STK Push request with a securely generated password (Base64-encoded shortcode + passkey + timestamp). Safaricom sends the payment result to a callback endpoint, which the backend logs and can be extended to store or forward.

## Running it locally

**Backend:**