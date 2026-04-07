import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const repairs = await sql`
      SELECT 
        r.id, r.repair_number, r.status, r.repair_type, r.priority,
        r.cost_parts, r.cost_labor, r.cost_technician, r.price_customer, r.profit,
        r.description, r.diagnosis, r.estimated_days, r.created_at,
        w.brand, w.model, w.serial_number,
        c.name as customer_name, c.phone as customer_phone,
        t.name as technician_name
      FROM repairs r
      LEFT JOIN watches w ON r.watch_id = w.id
      LEFT JOIN customers c ON w.customer_id = c.id
      LEFT JOIN technicians t ON r.technician_id = t.id
      ORDER BY r.created_at DESC
      LIMIT 100
    `
    return NextResponse.json(repairs)
  } catch (error) {
    console.error('Error fetching repairs:', error)
    return NextResponse.json({ error: 'Failed to fetch repairs' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { customer_id, watch_id, description, cost, selling_price, assigned_to } = data

    const result = await sql`
      INSERT INTO repairs (
        customer_id, watch_id, description, status, cost, selling_price, 
        assigned_to, created_at
      )
      VALUES (
        ${customer_id}, ${watch_id}, ${description}, 'pending', 
        ${cost}, ${selling_price}, ${assigned_to}, NOW()
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating repair:', error)
    return NextResponse.json({ error: 'Failed to create repair' }, { status: 500 })
  }
}
