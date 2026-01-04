# 🎯 FinTrack - Smart Expense Tracker & Budget Planner

[![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2024-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-2024-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Take control of your finances with intelligent expense tracking, smart budgeting, and insightful analytics.**

![FinTrack Dashboard](https://via.placeholder.com/800x400/2563eb/ffffff?text=FinTrack+Dashboard+Screenshot)

## ✨ Features

### 💰 **Expense Management**
- ✅ Add, edit, and delete expenses with categories
- ✅ Quick expense entry from dashboard
- ✅ Receipt tracking and PDF generation
- ✅ Expense search and filtering

### 📊 **Budget & Analytics**
- ✅ Set monthly budgets by category
- ✅ Real-time budget progress tracking
- ✅ Spending analytics and trends
- ✅ Category-wise breakdown charts

### 🎯 **Savings Goals**
- ✅ Create and track savings goals
- ✅ Progress visualization
- ✅ Goal completion notifications
- ✅ Multiple active goals support

### 📱 **User Experience**
- ✅ Responsive design for all devices
- ✅ Dark/Light theme support
- ✅ Intuitive dashboard interface
- ✅ Real-time data updates

### 🔒 **Security & Privacy**
- ✅ Secure authentication with Supabase
- ✅ Row-level security (RLS) policies
- ✅ Data encryption at rest
- ✅ GDPR compliant

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download here](https://nodejs.org/))
- **Git** ([Download here](https://git-scm.com/))
- **Supabase Account** ([Sign up here](https://supabase.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/roha301/FinTrack.git
   cd FinTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your values:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Optional: Email Service (for future notifications)
   RESEND_API_KEY=your_resend_api_key
   CRON_SECRET=your_random_secret_string
   ```

4. **Set up the database**
   - Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   - Navigate to SQL Editor
   - Run the migration scripts in order:
     - `scripts/00_setup_all.sql` (Complete setup)
     - `scripts/007_add_personal_fields.sql` (Add profile fields)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## 🗄️ Database Schema

The application uses PostgreSQL with the following main tables:

- **`profiles`** - User profile information
- **`categories`** - Expense categories
- **`expenses`** - User expenses with categories
- **`budgets`** - Monthly budget allocations
- **`savings_goals`** - Financial goals tracking
- **`receipts`** - PDF receipt storage

## 🎨 Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Radix UI** - Accessible component primitives

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Primary database
- **Supabase Auth** - User authentication
- **Row Level Security** - Data access control

### **Deployment**
- **Vercel** - Frontend deployment
- **Supabase** - Database hosting

## 📁 Project Structure

```
FinTrack/
├── 📁 src/
│   ├── 📁 app/                 # Next.js App Router
│   │   ├── 📁 api/            # API routes
│   │   ├── 📁 auth/           # Authentication pages
│   │   ├── 📁 dashboard/      # Dashboard pages
│   │   └── layout.tsx         # Root layout
│   ├── 📁 components/         # React components
│   │   ├── 📁 ui/            # Reusable UI components
│   │   └── ...               # Feature components
│   └── 📁 lib/               # Utility libraries
├── 📁 scripts/               # Database migrations
├── 📁 public/                # Static assets
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind configuration
└── README.md                # This file
```

## 🛠️ Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:setup     # Run database migrations
npm run db:seed      # Seed database with sample data
```

### **Code Quality**

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Pre-commit hooks** - Code quality enforcement

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Connect your GitHub repository** to Vercel
2. **Add environment variables** in Vercel dashboard
3. **Deploy automatically** on every push to main

### **Manual Deployment**

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - The React framework for production
- **Supabase** - Open source Firebase alternative
- **Tailwind CSS** - A utility-first CSS framework
- **Radix UI** - Low-level UI primitives for React
- **Lucide** - Beautiful & consistent icon toolkit

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/roha301/FinTrack/issues)
- **Discussions**: [GitHub Discussions](https://github.com/roha301/FinTrack/discussions)
- **Email**: [your-email@example.com](mailto:your-email@example.com)

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**

⭐ **Star this repo** if you found it helpful!
