-- ============================================
-- CLEAR ALL DATA SCRIPT
-- This script clears all data from tables while keeping the structure
-- Use this to reset the database for testing or fresh start
-- ============================================

-- Clear data from tables (in correct order due to foreign key constraints)

-- Clear receipts table
DELETE FROM public.receipts;

-- Clear textbooks table
DELETE FROM public.textbooks;

-- Clear savings_goals table
DELETE FROM public.savings_goals;

-- Clear budgets table
DELETE FROM public.budgets;

-- Clear expenses table
DELETE FROM public.expenses;

-- Clear categories table
DELETE FROM public.categories;

-- Clear profiles table (this will cascade delete due to foreign key constraints)
DELETE FROM public.profiles;

-- Clear OTP codes table (optional, as these expire anyway)
DELETE FROM public.otp_codes WHERE expires_at < NOW();

-- Reset sequences if needed (optional)
-- ALTER SEQUENCE IF EXISTS <sequence_name> RESTART WITH 1;

-- ============================================
-- VERIFICATION QUERIES
-- Uncomment to verify data has been cleared
-- ============================================

-- SELECT COUNT(*) as expenses_count FROM public.expenses;
-- SELECT COUNT(*) as categories_count FROM public.categories;
-- SELECT COUNT(*) as profiles_count FROM public.profiles;
-- SELECT COUNT(*) as budgets_count FROM public.budgets;
-- SELECT COUNT(*) as savings_count FROM public.savings_goals;
-- SELECT COUNT(*) as textbooks_count FROM public.textbooks;

COMMIT;
