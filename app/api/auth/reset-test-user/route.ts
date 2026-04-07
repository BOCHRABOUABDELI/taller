import { neon } from '@neondatabase/serverless'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    // Generate proper bcrypt hash for Test123!
    const password = 'Test123!'
    const saltRounds = 10
    const hash = await bcrypt.hash(password, saltRounds)
    
    console.log('[v0] Generated hash for Test123!:', hash)

    // Update the test user with the proper hash
    await sql`
      UPDATE users 
      SET password_hash = ${hash}
      WHERE email = 'admin@luxerepair.test'
    `

    return NextResponse.json({ 
      message: 'Test user password reset successfully',
      email: 'admin@luxerepair.test',
      password: 'Test123!'
    })
  } catch (error) {
    console.error('Reset error:', error)
    return NextResponse.json(
      { error: 'Failed to reset test user' },
      { status: 500 }
    )
  }
}
