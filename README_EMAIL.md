# FinTrack Email Templates

This document explains how to customize email templates in Supabase Auth for FinTrack branding.

## Overview

FinTrack uses Supabase Auth for user authentication and email sending. Instead of custom SMTP, you can customize the email templates that Supabase sends through their dashboard. This provides branded emails while maintaining all security benefits of Supabase Auth.

## Available Email Templates

Supabase Auth supports customizing these email types:

- **Email Confirmation**: Sent when users sign up or change email addresses
- **Password Reset**: Sent when users request password reset
- **Email Change**: Sent when users update their email address
- **Magic Link**: Sent for passwordless login (if enabled)

## How to Customize Email Templates

### 1. Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your FinTrack project
3. Navigate to **Authentication** → **Email Templates**

### 2. Customize Templates

For each email type, you can customize:

- **Subject Line**: The email subject
- **Email Content**: HTML template with variables
- **Sender Name**: Display name for emails

### 3. Template Variables

Supabase provides these variables you can use in templates:

- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email address
- `{{ .ConfirmationURL }}` - Confirmation link (for email confirmation)
- `{{ .Token }}` - Reset token (for password reset)
- `{{ .RedirectTo }}` - Redirect URL after action

### 4. Example Custom Template

Here's an example email confirmation template with FinTrack branding:

**Subject:**
```
Welcome to FinTrack - Confirm Your Email
```

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Confirm Your FinTrack Account</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb;">Welcome to FinTrack!</h1>
    <p>Your personal finance management companion</p>
  </div>

  <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2>Confirm Your Email Address</h2>
    <p>Thank you for signing up for FinTrack. To complete your registration, please confirm your email address by clicking the button below:</p>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="{{ .ConfirmationURL }}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Confirm Email Address
    </a>
  </div>

  <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
    <p style="margin: 0; color: #92400e;">
      <strong>This link expires in 24 hours</strong> for security reasons.
    </p>
  </div>

  <div style="color: #6b7280; font-size: 14px;">
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all;">{{ .ConfirmationURL }}</p>
  </div>

  <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

  <div style="text-align: center; color: #6b7280; font-size: 14px;">
    <p>Questions? Contact our support team.</p>
    <p>Happy budgeting with FinTrack! 💰</p>
  </div>
</body>
</html>
```

## Password Reset Template Example

**Subject:**
```
Reset Your FinTrack Password
```

**HTML Content:**
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb;">Reset Your Password</h1>
  </div>

  <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <p>We received a request to reset your FinTrack password. If you made this request, click the button below:</p>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <a href="{{ .SiteURL }}/auth/reset-password?token={{ .Token }}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
      Reset Password
    </a>
  </div>

  <div style="background-color: #fee2e2; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
    <p style="margin: 0; color: #991b1b;">
      <strong>If you didn't request this password reset, please ignore this email.</strong> Your password will remain unchanged.
    </p>
  </div>

  <div style="color: #6b7280; font-size: 14px;">
    <p>This link expires in 1 hour for security reasons.</p>
  </div>
</body>
</html>
```

## Best Practices

### Branding
- Use consistent colors matching your app's theme
- Include your app logo or icon
- Use professional, friendly language

### Security
- Always include expiration notices
- Warn users about unexpected emails
- Use secure HTTPS links

### Mobile Responsiveness
- Use responsive design with max-width containers
- Test emails on mobile devices
- Keep important buttons and links easily clickable

## Testing Email Templates

### Supabase Dashboard Testing

1. Go to **Authentication** → **Email Templates**
2. Click **Send test email** for any template
3. Enter your email address to receive a test

### Production Testing

- Create a test account to receive real emails
- Test all email flows: signup, password reset, email change
- Verify links work correctly

## Email Settings

In addition to templates, you can configure:

- **SMTP Settings**: Use custom SMTP provider instead of Supabase's default
- **Sender Email**: Customize the "From" email address
- **Rate Limiting**: Control email sending frequency

### Custom SMTP (Optional)

If you want to use your own SMTP provider:

1. Go to **Authentication** → **Email**
2. Enable "Custom SMTP"
3. Configure your SMTP settings:
   - Host, Port, Username, Password
   - TLS/SSL settings

## Troubleshooting

### Emails Not Being Sent

1. Check your Supabase project settings
2. Verify email templates are enabled
3. Check spam/junk folders
4. Ensure custom SMTP is configured correctly (if used)

### Template Variables Not Working

- Use exact variable names: `{{ .SiteURL }}`, `{{ .ConfirmationURL }}`, etc.
- Variables are case-sensitive
- Test templates to ensure variables are replaced correctly

### Styling Issues

- Use inline CSS for better email client compatibility
- Test emails across different clients (Gmail, Outlook, Apple Mail)
- Avoid complex CSS that may not render properly

## Migration from Default Templates

Your current setup uses Supabase Auth's default email templates. To migrate to custom templates:

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Customize each template with FinTrack branding
3. Test the templates thoroughly
4. Deploy the changes

Users will now receive branded emails that match your app's identity while maintaining all the security and functionality of Supabase Auth.
