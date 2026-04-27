// app/api/contact/submissions/route.ts

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface ContactSubmission {
  id:          string
  submittedAt: string
  firstName:   string
  lastName:    string
  email:       string
  phone:       string
  company:     string
  service:     string
  source:      string
  message:     string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'contacts.json')

function isAuthed(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_auth')
  const secret = process.env.ADMIN_SECRET ?? 'allbotix_admin'
  return !!cookie && cookie.value === secret
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
    const entries = JSON.parse(raw) as ContactSubmission[]

    let deletedCount: number
    let remaining:    ContactSubmission[]

    if (all) {
      deletedCount = entries.length
      remaining    = []
    } else {
      const before = entries.length
      remaining    = entries.filter(e => e.id !== id)
      deletedCount = before - remaining.length
      if (deletedCount === 0) {
        return NextResponse.json({ error: 'Submission not found.' }, { status: 404 })
      }
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(remaining, null, 2), 'utf-8')

    return NextResponse.json({ success: true, deleted: deletedCount })
  } catch (err) {
    console.error('[contact/submissions] DELETE error:', err)
    const msg = err instanceof Error ? err.message : 'Failed to delete.'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
