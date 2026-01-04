"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BarChart3, PiggyBank, Receipt, Target } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              {/* Finance-themed logo: Dollar sign */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-primary"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-primary">FinTrack</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="animate-glow">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              Take Control of Your <span className="text-primary">Financial Future</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Transform your financial habits with intelligent expense tracking, smart budgeting, and powerful analytics.
              Turn your money goals into reality with comprehensive reporting and goal achievement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 animate-glow">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="text-lg px-8 glass bg-transparent">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative animate-float">
            <div className="glass-strong rounded-2xl p-8 max-w-3xl mx-auto">
              <div className="grid grid-cols-3 gap-4">
                <div className="glass rounded-xl p-4">
                  <BarChart3 className="w-8 h-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Analytics</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <Receipt className="w-8 h-8 text-accent mb-2" />
                  <p className="text-sm text-muted-foreground">Receipts</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <PiggyBank className="w-8 h-8 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Savings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for <span className="text-primary">Smart Finance</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to master your money, from expense tracking to financial planning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expense Tracking</h3>
              <p className="text-muted-foreground">
                Effortlessly track every expense with smart categorization and receipt scanning. Know exactly where your money goes.
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Monthly Budget</h3>
              <p className="text-muted-foreground">
                Set overall monthly budgets for your allowance or part-time income. Stay within limits automatically.
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-primary"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Textbook Tracker</h3>
              <p className="text-muted-foreground">
                Track textbook expenses by semester. Plan ahead for expensive course materials.
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <PiggyBank className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Savings Goals</h3>
              <p className="text-muted-foreground">
                Save for a new laptop, trip, or emergency fund. Track progress and stay motivated.
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Spending Analytics</h3>
              <p className="text-muted-foreground">
                Visualize spending patterns with charts. Understand your habits and improve over time.
              </p>
            </div>

            <div className="glass-strong rounded-2xl p-6 hover:scale-105 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                <Receipt className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Monthly Reports</h3>
              <p className="text-muted-foreground">
                Generate PDF reports automatically. Perfect for tracking allowances or reimbursements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple Yet Powerful</h2>
            <p className="text-xl text-muted-foreground">Get started in three easy steps</p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-xl">
                1
              </div>
              <div className="glass-strong rounded-xl p-6 flex-1">
                <h3 className="text-2xl font-bold mb-2">Sign Up with Email</h3>
                <p className="text-muted-foreground">
                  Create your account using our secure OTP email verification system. No passwords to remember.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-xl">
                2
              </div>
              <div className="glass-strong rounded-xl p-6 flex-1">
                <h3 className="text-2xl font-bold mb-2">Track Your Expenses</h3>
                <p className="text-muted-foreground">
                  Add expenses as they happen. Categorize, add notes, and upload receipts for complete records.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-primary font-bold text-xl">
                3
              </div>
              <div className="glass-strong rounded-xl p-6 flex-1">
                <h3 className="text-2xl font-bold mb-2">Achieve Your Goals</h3>
                <p className="text-muted-foreground">
                  Watch your progress with analytics, stay within budgets, and reach your savings goals faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="glass-strong rounded-3xl p-12 text-center animate-glow">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Take Control?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands who have transformed their financial lives with FinTrack
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-12">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 FinTrack. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
