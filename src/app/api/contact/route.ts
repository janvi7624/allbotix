import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

interface ContactSubmission {
  id: string
  submittedAt: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  service: string
  source: string
  message: string
}

const HOST_EMAIL = process.env.HOST_EMAIL ?? ''
const SMTP_USER  = process.env.SMTP_USER  ?? ''
const SMTP_PASS  = process.env.SMTP_PASS  ?? ''

const DATA_DIR  = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'contacts.json')

function loadSubmissions(): ContactSubmission[] {
  try {
    if (!fs.existsSync(DATA_DIR))  fs.mkdirSync(DATA_DIR, { recursive: true })
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8')
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch { return [] }
}

function saveSubmission(entry: ContactSubmission) {
  const all = loadSubmissions()
  all.push(entry)
  fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8')
}

function buildHtml(d: ContactSubmission): string {
  const row = (label: string, value: string) => value ? `
    <tr>
      <td style="padding:10px 16px;font-weight:600;color:#b03a2e;white-space:nowrap;font-family:Arial,sans-serif;font-size:13px;border-bottom:1px solid #1e1e1e;">${label}</td>
      <td style="padding:10px 16px;color:#e0dbd5;font-family:Arial,sans-serif;font-size:13px;border-bottom:1px solid #1e1e1e;">${value}</td>
    </tr>` : ''

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0a0a0a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border-radius:12px;overflow:hidden;border:1px solid #2a1a1a;">
        <tr>
          <td colspan="2" style="background:linear-gradient(135deg,#b03a2e,#7a2820);padding:28px 32px;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:6px;">New Contact Submission</p>
            <h1 style="margin:0;font-family:Arial,sans-serif;font-size:22px;font-weight:900;color:#fff;">Allbotix — Contact Form</h1>
          </td>
        </tr>
        <tr><td colspan="2">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row('Full Name',    `${d.firstName} ${d.lastName}`)}
            ${row('Email',        d.email)}
            ${row('Phone',        d.phone)}
            ${row('Company',      d.company)}
            ${row('Service',      d.service)}
            ${row('Found Us Via', d.source)}
            ${row('Submitted',    new Date(d.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))}
          </table>
        </td></tr>
        <tr>
          <td colspan="2" style="padding:20px 16px 4px;font-weight:600;color:#b03a2e;font-family:Arial,sans-serif;font-size:13px;">Message</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:0 16px 24px;">
            <div style="background:#1a1a1a;border:1px solid #2a1a1a;border-radius:8px;padding:16px;font-family:Arial,sans-serif;font-size:13px;color:#e0dbd5;line-height:1.75;">
              ${d.message.replace(/\n/g, '<br/>')}
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:16px 32px;border-top:1px solid #1e1e1e;text-align:center;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#555;letter-spacing:0.1em;">ALLBOTIX TECHNOLOGIES · Ahmedabad, Gujarat</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, phone, company, service, source, message } = await req.json()

    if (!firstName || !email || !message)
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })

    const entry: ContactSubmission = {
      id:          `contact_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      firstName:   firstName ?? '',
      lastName:    lastName  ?? '',
      email:       email     ?? '',
      phone:       phone     ?? '',
      company:     company   ?? '',
      service:     service   ?? '',
      source:      source    ?? '',
      message:     message   ?? '',
    }

    // 2 — Send email via nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',          // just this — no host/port needed
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,         // Gmail App Password
      },
    })

    await transporter.sendMail({
      from:    `"Allbotix Contact" <${SMTP_USER}>`,
      to:      HOST_EMAIL,
      replyTo: email,
      subject: `New Enquiry from ${firstName} ${lastName} — ${service || 'General'}`,
      html:    buildHtml(entry),
      text:    `Name: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\nService: ${service}\nFound Us: ${source}\n\nMessage:\n${message}`,
    })
    
    saveSubmission(entry)

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[contact/route] error:', err)
    return NextResponse.json({ error: 'Failed to send. Please try again.' }, { status: 500 })
  }
}