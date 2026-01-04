-- Add settings column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS settings JSONB DEFAULT '{"emailNotifications": true, "budgetAlerts": true, "expenseReminders": true, "weeklyReports": false, "monthlyReports": true, "savingsGoalAlerts": true}'::jsonb;
