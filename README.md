# Spendly 💰

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-0055FF?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Spendly** is a smart, modern expense and subscription management platform designed to help you take full control of your finances. With an intuitive dashboard, automated subscription tracking, and real-time budgeting tools, Spendly makes managing money effortless and elegant.

## ✨ Key Features

- **📊 Comprehensive Dashboard**: Get a bird's-eye view of your financial health with real-time charts and summaries.
- **💸 Expense Tracking**: Categorize and track every transaction with ease.
- **📅 Subscription Manager**: Monitor your recurring payments and never miss a renewal date.
- **🎯 Smart Budgeting**: Set monthly budgets for different categories and stay on track.
- **🌗 Dark Mode & Premium UI**: A beautiful, responsive interface with cinematic animations powered by Framer Motion and Base UI.
- **🔐 Secure Authentication**: Robust security powered by NextAuth.js with automatic login for a seamless experience.
- **📄 Export Options**: Download your financial data as PDF or CSV for offline analysis.

## 🚀 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/), [Base UI](https://base-ui.com/), [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend**: Next.js Serverless Functions
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Charts**: [Recharts](https://recharts.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB instance (Local or Atlas)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/gyanaranjan-das/Spendly.git
   cd spendly
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory for local development and add the following:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

   For deployment, set the same variables in your hosting provider's environment settings instead of relying on `.env` files. Make sure `NEXTAUTH_URL` points to the deployed domain, not `http://localhost:3000`.

   After changing environment variables in production, redeploy the app so the new values are picked up.

4. **Run the development server**

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```text
src/
├── app/            # Next.js App Router (Auth, Dashboard, API)
├── components/     # UI and Layout components
├── lib/            # Utilities and database configuration
├── models/         # Mongoose schemas
├── store/          # Zustand state management
└── styles/         # Global styles
```

---

**Version:** 0.1.0 (Prototype / MVP Stage)
**Status:** In Development
**Last Updated:** May 15, 2026

*Made with ❤️.*
