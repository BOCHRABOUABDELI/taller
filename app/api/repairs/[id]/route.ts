import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get repair details with all related data
    const repairs = await sql`
      SELECT 
        r.*,
        w.brand, w.model, w.serial_number, w.reference_number, w.year, 
        w.material, w.condition, w.description as watch_description, w.photos as watch_photos,
        c.id as customer_id, c.name as customer_name, c.email as customer_email, 
        c.phone as customer_phone, c.is_vip,
        t.name as technician_name, t.email as technician_email, t.phone as technician_phone,
        t.specialization as technician_specialization, t.is_internal as technician_internal
      FROM repairs r
      LEFT JOIN watches w ON r.watch_id = w.id
      LEFT JOIN customers c ON w.customer_id = c.id
      LEFT JOIN technicians t ON r.technician_id = t.id
      WHERE r.id = ${id}
    `

    if (repairs.length === 0) {
      return NextResponse.json({ error: 'Repair not found' }, { status: 404 })
    }

    // Get repair history
    const history = await sql`
      SELECT 
        rh.*,
        u.name as changed_by_name
      FROM repair_history rh
      LEFT JOIN users u ON rh.changed_by = u.id
      WHERE rh.repair_id = ${id}
      ORDER BY rh.created_at DESC
    `

    // Get incidents for this repair
    const incidents = await sql`
      SELECT 
        i.*,
        u.name as reported_by_name
      FROM incidents i
      LEFT JOIN users u ON i.reported_by = u.id
      WHERE i.repair_id = ${id}
      ORDER BY i.created_at DESC
    `

    // Get all technicians for assignment dropdown
    const technicians = await sql`
      SELECT id, name, specialization, is_internal, is_active, hourly_rate
      FROM technicians
      WHERE is_active = true
      ORDER BY name
    `

    return NextResponse.json({
      repair: repairs[0],
      history,
      incidents,
      technicians
    })
  } catch (error) {
    console.error('Error fetching repair:', error)
    return NextResponse.json({ error: 'Failed to fetch repair' }, { status: 500 })
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
      technician_id,
      status,
      priority,
      repair_type,
      description,
      diagnosis,
      work_performed,
      parts_used,
      cost_parts,
      cost_labor,
      cost_technician,
      price_customer,
      estimated_days,
      warranty_months,
      notes
    } = data

    // Get current status for history
    const currentRepair = await sql`SELECT status FROM repairs WHERE id = ${id}`
    const oldStatus = currentRepair[0]?.status

    // Update repair
    const result = await sql`
      UPDATE repairs SET
        technician_id = COALESCE(${technician_id || null}, technician_id),
        status = COALESCE(${status || null}, status),
        priority = COALESCE(${priority || null}, priority),
        repair_type = COALESCE(${repair_type || null}, repair_type),
        description = COALESCE(${description || null}, description),
        diagnosis = COALESCE(${diagnosis || null}, diagnosis),
        work_performed = COALESCE(${work_performed || null}, work_performed),
        parts_used = COALESCE(${parts_used || null}, parts_used),
        cost_parts = COALESCE(${cost_parts}::numeric, cost_parts),
        cost_labor = COALESCE(${cost_labor}::numeric, cost_labor),
        cost_technician = COALESCE(${cost_technician}::numeric, cost_technician),
        price_customer = COALESCE(${price_customer}::numeric, price_customer),
        estimated_days = COALESCE(${estimated_days}::integer, estimated_days),
        warranty_months = COALESCE(${warranty_months}::integer, warranty_months),
        notes = COALESCE(${notes || null}, notes),
        assigned_date = CASE WHEN ${status} = 'assigned' AND assigned_date IS NULL THEN NOW() ELSE assigned_date END,
        started_date = CASE WHEN ${status} = 'in_progress' AND started_date IS NULL THEN NOW() ELSE started_date END,
        completion_date = CASE WHEN ${status} = 'completed' AND completion_date IS NULL THEN NOW() ELSE completion_date END,
        delivery_date = CASE WHEN ${status} = 'delivered' AND delivery_date IS NULL THEN NOW() ELSE delivery_date END,
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    // Add to history if status changed
    if (status && status !== oldStatus) {
      await sql`
        INSERT INTO repair_history (repair_id, status_from, status_to, notes)
        VALUES (${id}, ${oldStatus}, ${status}, ${notes || null})
      `
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating repair:', error)
    return NextResponse.json({ error: 'Failed to update repair' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await sql`DELETE FROM repairs WHERE id = ${id}`
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting repair:', error)
    return NextResponse.json({ error: 'Failed to delete repair' }, { status: 500 })
  }
}
