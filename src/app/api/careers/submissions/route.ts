// app/api/careers/submissions/route.ts

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3'

interface CareerSubmission {
  id:              string
  submittedAt:     string
  name:            string
  email:           string
  phone:           string
  dept:            string
  role:            string
  linkedin:        string
  resume:          string
  resumeFilename?: string
  experience:      string
  why:             string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'careers.json')

const AWS_REGION     = process.env.AWS_REGION             ?? ''
const AWS_S3_BUCKET  = process.env.AWS_S3_BUCKET          ?? ''
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID      ?? ''
const AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY  ?? ''

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

function isAuthed(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_auth')
  const secret = process.env.ADMIN_SECRET ?? 'allbotix_admin'
  return !!cookie && cookie.value === secret
}

function extractS3Key(entry: CareerSubmission): string | null {
  if (!entry.resume || !entry.resume.startsWith('http')) return null
  try {
    const url      = new URL(entry.resume)
    const pathname = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname
    return pathname || null
  } catch {
    return null
  }
}

async function deleteFromS3(keys: string[]): Promise<void> {
  if (!AWS_REGION || !AWS_S3_BUCKET || !AWS_ACCESS_KEY || !AWS_SECRET_KEY) return
  if (keys.length === 0) return

  const client = getS3()
  for (let i = 0; i < keys.length; i += 1000) {
    const batch = keys.slice(i, i + 1000)
    await client.send(new DeleteObjectsCommand({
      Bucket: AWS_S3_BUCKET,
      Delete: { Objects: batch.map(k => ({ Key: k })), Quiet: true },
    }))
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    if (!fs.existsSync(DATA_FILE)) return NextResponse.json([])
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return NextResponse.json((JSON.parse(raw) as unknown[]).reverse())
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id  = searchParams.get('id')
  const all = searchParams.get('all') === 'true'

  if (!id && !all) {
    return NextResponse.json({ error: 'Missing id or all=true query param.' }, { status: 400 })
  }

  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ success: true, deleted: 0 })
    }

    const raw     = fs.readFileSync(DATA_FILE, 'utf-8')
    const entries = JSON.parse(raw) as CareerSubmission[]

    let toDelete:  CareerSubmission[]
    let remaining: CareerSubmission[]

    if (all) {
      toDelete  = entries
      remaining = []
    } else {
      toDelete  = entries.filter(e => e.id === id)
      remaining = entries.filter(e => e.id !== id)
      if (toDelete.length === 0) {
        return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })
      }
    }

    const keys = toDelete.map(extractS3Key).filter((k): k is string => !!k)
    try {
      await deleteFromS3(keys)
    } catch (s3Err) {
      console.error('[careers/submissions] S3 delete error (continuing):', s3Err)
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(remaining, null, 2), 'utf-8')

    return NextResponse.json({ success: true, deleted: toDelete.length })
  } catch (err) {
    console.error('[careers/submissions] DELETE error:', err)
    const msg = err instanceof Error ? err.message : 'Failed to delete.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
