import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const notifications = await sql`
      SELECT id, type, category, subject, message, is_sent, is_read, sent_at, read_at, created_at
      FROM notifications
      ORDER BY created_at DESC
      LIMIT 50
    `
    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { user_id, customer_id, type, category, subject, message } = data

    const result = await sql`
      INSERT INTO notifications (user_id, customer_id, type, category, subject, message, is_sent, is_read, created_at)
      VALUES (${user_id}, ${customer_id}, ${type}, ${category}, ${subject}, ${message}, false, false, NOW())
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}
