import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    message: 'FinTrack Email Configuration',
    info: 'Emails are sent through Supabase Auth with custom templates. Configure email templates in your Supabase dashboard under Authentication > Email Templates.',
    templates: {
      email_confirm: 'Sent when users sign up or change email',
      password_reset: 'Sent when users request password reset',
      email_change: 'Sent when users change their email address',
      invite: 'Sent when inviting users to organizations'
    },
    setup_instructions: 'Go to https://supabase.com/dashboard -> Your Project -> Authentication -> Email Templates'
  })
}

export async function POST() {
  return NextResponse.json({
    error: 'Custom email sending is not configured',
    message: 'FinTrack uses Supabase Auth email templates. Configure custom email templates in your Supabase dashboard.',
    dashboard_url: 'https://supabase.com/dashboard'
  }, { status: 501 })
}
