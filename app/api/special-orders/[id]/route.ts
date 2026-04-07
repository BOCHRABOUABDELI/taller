import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Obtener pedido especial con datos del cliente
    const orders = await sql`
      SELECT 
        so.*,
        c.name as customer_name, c.email as customer_email, c.phone as customer_phone,
        c.is_vip as customer_is_vip
      FROM special_orders so
      LEFT JOIN customers c ON so.customer_id = c.id
      WHERE so.id = ${id}
    `

    if (orders.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Obtener incidencias relacionadas
    const incidents = await sql`
      SELECT 
        i.*,
        u.name as reported_by_name
      FROM incidents i
      LEFT JOIN users u ON i.reported_by = u.id
      WHERE i.special_order_id = ${id}
      ORDER BY i.created_at DESC
    `

    return NextResponse.json({
      order: orders[0],
      incidents
    })
  } catch (error) {
    console.error('Error fetching special order:', error)
    return NextResponse.json({ error: 'Failed to fetch special order' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await req.json()
    const {
      order_type, title, description, specifications, status, priority,
      cost_materials, cost_labor, price_customer,
      deposit_amount, deposit_paid, expected_date, completion_date, notes
    } = data

    const result = await sql`
      UPDATE special_orders SET
        order_type = ${order_type},
        title = ${title},
        description = ${description},
        specifications = ${specifications},
        status = ${status},
        priority = ${priority},
        cost_materials = ${cost_materials},
        cost_labor = ${cost_labor},
        price_customer = ${price_customer},
        deposit_amount = ${deposit_amount},
        deposit_paid = ${deposit_paid},
        expected_date = ${expected_date},
        completion_date = ${completion_date},
        notes = ${notes},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating special order:', error)
    return NextResponse.json({ error: 'Failed to update special order' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await sql`DELETE FROM special_orders WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting special order:', error)
    return NextResponse.json({ error: 'Failed to delete special order' }, { status: 500 })
  }
}
