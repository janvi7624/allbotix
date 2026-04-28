import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { buildEmail, escapeHtml } from '@/lib/emailTemplate'

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
  const fullName = `${d.firstName} ${d.lastName}`.trim()
  return buildEmail({
    badge: 'New Contact Submission',
    title: 'Allbotix — Contact Form',
    fields: [
      { label: 'Full Name',    value: escapeHtml(fullName) },
      { label: 'Email',        value: escapeHtml(d.email) },
      { label: 'Phone',        value: escapeHtml(d.phone) },
      { label: 'Company',      value: escapeHtml(d.company) },
      { label: 'Service',      value: escapeHtml(d.service) },
      { label: 'Found Us Via', value: escapeHtml(d.source) },
      { label: 'Submitted',    value: escapeHtml(new Date(d.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })) },
    ],
    blocks: [
      { heading: 'Message', html: escapeHtml(d.message).replace(/\n/g, '<br/>') },
    ],
  })
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