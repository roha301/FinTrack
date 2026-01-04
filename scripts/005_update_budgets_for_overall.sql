-- Remove category constraint from budgets to make them overall monthly budgets
ALTER TABLE public.budgets DROP CONSTRAINT IF EXISTS budgets_user_id_category_id_month_year_key;
ALTER TABLE public.budgets DROP CONSTRAINT IF EXISTS budgets_category_id_fkey;
ALTER TABLE public.budgets DROP COLUMN IF EXISTS category_id;

-- Add new unique constraint for overall monthly budgets
ALTER TABLE public.budgets ADD CONSTRAINT budgets_user_id_month_year_key UNIQUE(user_id, month, year);

-- Add semester tracking to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS course TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS year_of_study TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;

-- Create textbooks table for students
CREATE TABLE IF NOT EXISTS public.textbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  purchased_date DATE NOT NULL,
  semester TEXT NOT NULL,
  condition TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for textbooks
CREATE INDEX IF NOT EXISTS idx_textbooks_user_id ON public.textbooks(user_id);
