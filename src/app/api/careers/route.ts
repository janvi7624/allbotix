// app/api/careers/route.ts

import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

/* ─── Types ── */
interface CareerSubmission {
  id:             string
  submittedAt:    string
  name:           string
  email:          string
  phone:          string
  dept:           string
  role:           string
  linkedin:       string
  resume:         string  // S3 URL
  resumeFilename: string  // original filename for display
  experience:     string
  why:            string
}

/* ─── Config — from .env.local ── */
const HOST_EMAIL = process.env.HOST_EMAIL ?? ''
const SMTP_USER  = process.env.SMTP_USER  ?? ''
const SMTP_PASS  = process.env.SMTP_PASS  ?? ''

const AWS_REGION     = process.env.AWS_REGION     ?? ''
const AWS_S3_BUCKET  = process.env.AWS_S3_BUCKET  ?? ''
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID     ?? ''
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY ?? ''
const S3_PUBLIC_BASE = process.env.AWS_S3_PUBLIC_BASE_URL ?? '' // optional CDN/custom-domain

const MAX_RESUME_BYTES = 5 * 1024 * 1024 // 5 MB

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

/* ─── S3 ── */
let s3Client: S3Client | null = null
function getS3(): S3Client {
  if (!s3Client) {
    s3Client = new S3Client({
      region:      AWS_REGION,
      credentials: { accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY },
    })
  }
  return s3Client
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 80)
}

async function uploadResumeToS3(file: File, submissionId: string): Promise<{ url: string; filename: string }> {
  if (!AWS_REGION || !AWS_S3_BUCKET || !AWS_ACCESS_KEY || !AWS_SECRET_KEY) {
    throw new Error('S3 is not configured. Set AWS_REGION, AWS_S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY in .env.local.')
  }

  const safeName = sanitizeFilename(file.name || 'resume.pdf')
  const key      = `resumes/${submissionId}_${safeName}`
  const bytes    = Buffer.from(await file.arrayBuffer())

  await getS3().send(new PutObjectCommand({
    Bucket:      AWS_S3_BUCKET,
    Key:         key,
    Body:        bytes,
    ContentType: file.type || 'application/pdf',
    ContentDisposition: `inline; filename="${safeName}"`,
  }))

  const url = S3_PUBLIC_BASE
    ? `${S3_PUBLIC_BASE.replace(/\/$/, '')}/${key}`
    : `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`

  return { url, filename: safeName }
}

/* ─── Email HTML ── */
function buildHtml(d: CareerSubmission): string {
  const row = (label: string, value: string) => value ? `
    <tr>
      <td style="padding:10px 16px;font-weight:600;color:#b03a2e;white-space:nowrap;font-family:Arial,sans-serif;font-size:13px;border-bottom:1px solid #1e1e1e;">${label}</td>
      <td style="padding:10px 16px;color:#e0dbd5;font-family:Arial,sans-serif;font-size:13px;border-bottom:1px solid #1e1e1e;">${value}</td>
    </tr>` : ''

  const resumeCell = d.resume
    ? `<a href="${d.resume}" style="color:#e0dbd5;text-decoration:underline;">${d.resumeFilename || 'View PDF'}</a>`
    : ''

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
            ${row('Resume',      resumeCell)}
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
    const fd = await req.formData()

    const name       = String(fd.get('name')       ?? '')
    const email      = String(fd.get('email')      ?? '')
    const phone      = String(fd.get('phone')      ?? '')
    const dept       = String(fd.get('dept')       ?? '')
    const role       = String(fd.get('role')       ?? '')
    const linkedin   = String(fd.get('linkedin')   ?? '')
    const experience = String(fd.get('experience') ?? '')
    const why        = String(fd.get('why')        ?? '')
    const resumeFile = fd.get('resume')

    if (!name || !email || !dept || !why)
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })

    const submissionId = `career_${Date.now()}`

    // 1 — Validate & upload resume (if provided)
    let resumeUrl      = ''
    let resumeFilename = ''
    if (resumeFile && resumeFile instanceof File && resumeFile.size > 0) {
      if (resumeFile.type !== 'application/pdf')
        return NextResponse.json({ error: 'Resume must be a PDF file.' }, { status: 400 })
      if (resumeFile.size > MAX_RESUME_BYTES)
        return NextResponse.json({ error: 'Resume must be under 5 MB.' }, { status: 400 })

      const uploaded = await uploadResumeToS3(resumeFile, submissionId)
      resumeUrl      = uploaded.url
      resumeFilename = uploaded.filename
    }

    const entry: CareerSubmission = {
      id:             submissionId,
      submittedAt:    new Date().toISOString(),
      name, email, phone, dept, role, linkedin, experience, why,
      resume:         resumeUrl,
      resumeFilename: resumeFilename,
    }

    // 2 — Send email
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
      text:    `New job application\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nDepartment: ${dept}\nRole: ${role}\nExperience: ${experience}\nLinkedIn: ${linkedin}\nResume: ${resumeUrl || '(none)'}\n\nWhy Allbotix:\n${why}`,
    })

    // 3 — Save to file only after email succeeds
    saveSubmission(entry)

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[careers/route] error:', err)
    const msg = err instanceof Error ? err.message : 'Failed to submit. Please try again.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
