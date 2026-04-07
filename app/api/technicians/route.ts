import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const technicians = await sql`
      SELECT id, name, email, phone, specialization, is_internal, is_active, 
             hourly_rate, commission_rate, total_repairs, success_rate, notes, created_at
      FROM technicians
      ORDER BY name
    `
    return NextResponse.json(technicians)
  } catch (error) {
    console.error('Error fetching technicians:', error)
    return NextResponse.json({ error: 'Failed to fetch technicians' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, email, phone, specialization, is_internal, hourly_rate } = data

    const result = await sql`
      INSERT INTO technicians (name, email, phone, specialization, is_internal, hourly_rate, is_active, created_at)
      VALUES (${name}, ${email}, ${phone}, ${specialization}, ${is_internal ?? true}, ${hourly_rate ?? 0}, true, NOW())
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating technician:', error)
    return NextResponse.json({ error: 'Failed to create technician' }, { status: 500 })
  }
}
