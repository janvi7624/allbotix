// app/api/careers/route.ts

import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { buildEmail, escapeHtml, EMAIL_COLORS } from '@/lib/emailTemplate'

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
  const resumeCell = d.resume
    ? `<a href="${escapeHtml(d.resume)}" style="color:${EMAIL_COLORS.RED};text-decoration:none;font-weight:600;border-bottom:1px solid ${EMAIL_COLORS.RED};">${escapeHtml(d.resumeFilename || 'View PDF')}</a>`
    : ''

  return buildEmail({
    badge: 'New Job Application',
    title: 'Allbotix — Careers',
    fields: [
      { label: 'Full Name',   value: escapeHtml(d.name) },
      { label: 'Email',       value: escapeHtml(d.email) },
      { label: 'Phone',       value: escapeHtml(d.phone) },
      { label: 'Department',  value: escapeHtml(d.dept) },
      { label: 'Target Role', value: escapeHtml(d.role) },
      { label: 'Experience',  value: escapeHtml(d.experience) },
      { label: 'LinkedIn',    value: escapeHtml(d.linkedin) },
      { label: 'Resume',      value: resumeCell },
      { label: 'Submitted',   value: escapeHtml(new Date(d.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })) },
    ],
    blocks: [
      { heading: 'Why Allbotix?', html: escapeHtml(d.why).replace(/\n/g, '<br/>') },
    ],
  })
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
