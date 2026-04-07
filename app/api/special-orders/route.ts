import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const orders = await sql`
      SELECT 
        so.id, so.order_number, so.order_type, so.title, so.description, 
        so.status, so.priority, so.cost_materials, so.cost_labor, so.price_customer, so.profit,
        so.expected_date, so.completion_date, so.deposit_amount, so.deposit_paid,
        so.notes, so.created_at,
        c.name as customer_name, c.phone as customer_phone
      FROM special_orders so
      LEFT JOIN customers c ON so.customer_id = c.id
      ORDER BY so.created_at DESC
    `
    return NextResponse.json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const { customer_id, order_type, title, description, cost_materials, cost_labor, price_customer, expected_date } = data

    const result = await sql`
      INSERT INTO special_orders (customer_id, order_type, title, description, cost_materials, cost_labor, price_customer, expected_date, status, created_at)
      VALUES (${customer_id}, ${order_type}, ${title}, ${description}, ${cost_materials ?? 0}, ${cost_labor ?? 0}, ${price_customer ?? 0}, ${expected_date}, 'pending', NOW())
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
