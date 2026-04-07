import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const users = await sql`
      SELECT id, email, password_hash, name, role FROM users WHERE email = ${email}
    `
    
    console.log('[v0] Login attempt for email:', email)
    console.log('[v0] Users found:', users.length)

    if (users.length === 0) {
      console.log('[v0] No user found with email:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const user = users[0]
    console.log('[v0] User found:', { id: user.id, email: user.email, hasHash: !!user.password_hash })

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    console.log('[v0] Password match result:', passwordMatch)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // In production, create a session token
    const response = NextResponse.json(
      { 
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        message: 'Login successful'
      },
      { status: 200 }
    )

    // Set secure HTTP-only cookie with session
    response.cookies.set('auth_token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
