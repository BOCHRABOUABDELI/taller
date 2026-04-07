import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get customer details
    const customers = await sql`
      SELECT * FROM customers WHERE id = ${id}
    `

    if (customers.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    const customer = customers[0]

    // Get customer's watches
    const watches = await sql`
      SELECT * FROM watches WHERE customer_id = ${id} ORDER BY created_at DESC
    `

    // Get customer's repairs (through watches)
    const repairs = await sql`
      SELECT 
        r.*,
        w.brand, w.model, w.serial_number,
        t.name as technician_name
      FROM repairs r
      JOIN watches w ON r.watch_id = w.id
      LEFT JOIN technicians t ON r.technician_id = t.id
      WHERE w.customer_id = ${id}
      ORDER BY r.created_at DESC
    `

    // Get customer's special orders
    const specialOrders = await sql`
      SELECT * FROM special_orders WHERE customer_id = ${id} ORDER BY created_at DESC
    `

    // Get notifications sent to customer
    const notifications = await sql`
      SELECT * FROM notifications WHERE customer_id = ${id} ORDER BY created_at DESC LIMIT 10
    `

    return NextResponse.json({
      ...customer,
      watches,
      repairs,
      special_orders: specialOrders,
      notifications
    })
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
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
      name, email, phone, address, city, postal_code, country,
      id_type, id_number, notes, is_vip, preferred_contact
    } = data

    const result = await sql`
      UPDATE customers SET
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email),
        phone = COALESCE(${phone}, phone),
        address = COALESCE(${address}, address),
        city = COALESCE(${city}, city),
        postal_code = COALESCE(${postal_code}, postal_code),
        country = COALESCE(${country}, country),
        id_type = COALESCE(${id_type}, id_type),
        id_number = COALESCE(${id_number}, id_number),
        notes = COALESCE(${notes}, notes),
        is_vip = COALESCE(${is_vip}, is_vip),
        preferred_contact = COALESCE(${preferred_contact}, preferred_contact),
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await sql`DELETE FROM customers WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
  }
}
