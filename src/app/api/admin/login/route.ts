// app/api/admin/login/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()

    const validUsername = process.env.ADMIN_USERNAME ?? ''
    const validPassword = process.env.ADMIN_PASSWORD ?? ''

    if (!validUsername || !validPassword) {
      return NextResponse.json({ error: 'Admin credentials not configured.' }, { status: 500 })
    }

    if (username === validUsername && password === validPassword) {
      const res = NextResponse.json({ success: true })

      // Set a simple httpOnly cookie valid for 8 hours
      res.cookies.set('admin_auth', 'allbotix_admin', {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge:   60 * 60 * 8, // 8 hours
        path:     '/',
      })

      return res
    }

    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 })

  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}