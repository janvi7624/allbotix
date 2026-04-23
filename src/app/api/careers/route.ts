// app/api/careers/route.ts

import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

/* ─── Types ── */
interface CareerSubmission {
  id:          string
  submittedAt: string
  name:        string
  email:       string
  phone:       string
  dept:        string
  role:        string
  linkedin:    string
  resume:      string
  experience:  string
  why:         string
}

/* ─── Config — from .env.local ── */
const HOST_EMAIL = process.env.HOST_EMAIL ?? ''
const SMTP_USER  = process.env.SMTP_USER  ?? ''
const SMTP_PASS  = process.env.SMTP_PASS  ?? ''

/* ─── Storage ── */
const DATA_DIR  = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'careers.json')

function loadSubmissions(): CareerSubmission[] {
  try {
    if (!fs.existsSync(DATA_DIR))  fs.mkdirSync(DATA_DIR, { recursive: true })
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8')
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch { return [] }
}

function saveSubmission(entry: CareerSubmission) {
  const all = loadSubmissions()
  all.push(entry)
  fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2), 'utf-8')
}

/* ─── Email HTML ── */
function buildHtml(d: CareerSubmission): string {
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

        <!-- Header -->
        <tr>
          <td colspan="2" style="background:linear-gradient(135deg,#b03a2e,#7a2820);padding:28px 32px;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.7);margin-bottom:6px;">New Job Application</p>
            <h1 style="margin:0;font-family:Arial,sans-serif;font-size:22px;font-weight:900;color:#fff;">Allbotix — Careers</h1>
          </td>
        </tr>

        <!-- Fields -->
        <tr><td colspan="2">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row('Full Name',   d.name)}
            ${row('Email',       d.email)}
            ${row('Phone',       d.phone)}
            ${row('Department',  d.dept)}
            ${row('Target Role', d.role)}
            ${row('Experience',  d.experience)}
            ${row('LinkedIn',    d.linkedin)}
            ${row('Resume',      d.resume)}
            ${row('Submitted',   new Date(d.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))}
          </table>
        </td></tr>

        <!-- Why Allbotix -->
        <tr>
          <td colspan="2" style="padding:20px 16px 4px;font-weight:600;color:#b03a2e;font-family:Arial,sans-serif;font-size:13px;">Why Allbotix?</td>
        </tr>
        <tr>
          <td colspan="2" style="padding:0 16px 24px;">
            <div style="background:#1a1a1a;border:1px solid #2a1a1a;border-radius:8px;padding:16px;font-family:Arial,sans-serif;font-size:13px;color:#e0dbd5;line-height:1.75;">
              ${d.why.replace(/\n/g, '<br/>')}
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td colspan="2" style="padding:16px 32px;border-top:1px solid #1e1e1e;text-align:center;">
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#555;letter-spacing:0.1em;">
              ALLBOTIX TECHNOLOGIES · Ahmedabad, Gujarat · allbotix.com
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}

/* ─── Route Handler ── */
export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, dept, role, linkedin, resume, experience, why } = await req.json()

    if (!name || !email || !dept || !why)
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })

    const entry: CareerSubmission = {
      id:          `career_${Date.now()}`,
      submittedAt: new Date().toISOString(),
      name:        name       ?? '',
      email:       email      ?? '',
      phone:       phone      ?? '',
      dept:        dept       ?? '',
      role:        role       ?? '',
      linkedin:    linkedin   ?? '',
      resume:      resume     ?? '',
      experience:  experience ?? '',
      why:         why        ?? '',
    }

    // 1 — Send email first
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    await transporter.sendMail({
      from:    `"Allbotix Careers" <${SMTP_USER}>`,
      to:      HOST_EMAIL,
      replyTo: email,
      subject: `New Application: ${name} — ${dept}${role ? ` (${role})` : ''}`,
      html:    buildHtml(entry),
      text:    `New job application\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nDepartment: ${dept}\nRole: ${role}\nExperience: ${experience}\nLinkedIn: ${linkedin}\nResume: ${resume}\n\nWhy Allbotix:\n${why}`,
    })

    // 2 — Save to file only after email succeeds
    saveSubmission(entry)

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[careers/route] error:', err)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}