import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const customers = await sql`
      SELECT id, name, email, phone, address, city, total_repairs, total_spent
      FROM customers
      ORDER BY created_at DESC
    `
    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { name, email, phone, address, city } = data

    const result = await sql`
      INSERT INTO customers (name, email, phone, address, city, created_at)
      VALUES (${name}, ${email}, ${phone}, ${address}, ${city}, NOW())
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
  }
}
