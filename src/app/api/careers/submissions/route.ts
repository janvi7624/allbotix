// app/api/careers/submissions/route.ts

import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'careers.json')

export async function GET(req: NextRequest) {
  // Guard — must have valid auth cookie
  const cookie = req.cookies.get('admin_auth')
  const secret = process.env.ADMIN_SECRET ?? 'allbotix_admin'

  if (!cookie || cookie.value !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    if (!fs.existsSync(DATA_FILE)) return NextResponse.json([])
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    return NextResponse.json((JSON.parse(raw) as unknown[]).reverse())
  } catch {
    return NextResponse.json([], { status: 500 })
  }
}