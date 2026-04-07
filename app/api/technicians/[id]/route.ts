import { neon } from '@neondatabase/serverless'
import { NextRequest, NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

// GET - Obtener técnico con estadísticas y reparaciones
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Obtener técnico
    const technicians = await sql`
      SELECT * FROM technicians WHERE id = ${id}
    `

    if (technicians.length === 0) {
      return NextResponse.json({ error: 'Técnico no encontrado' }, { status: 404 })
    }

    const technician = technicians[0]

    // Obtener reparaciones asignadas
    const repairs = await sql`
      SELECT 
        r.id, r.repair_number, r.status, r.repair_type, r.priority,
        r.cost_parts, r.cost_labor, r.cost_technician, r.price_customer, r.profit,
        r.created_at, r.completion_date, r.estimated_days,
        w.brand, w.model, w.serial_number,
        c.name as customer_name
      FROM repairs r
      LEFT JOIN watches w ON r.watch_id = w.id
      LEFT JOIN customers c ON w.customer_id = c.id
      WHERE r.technician_id = ${id}
      ORDER BY r.created_at DESC
    `

    // Calcular estadísticas
    const stats = await sql`
      SELECT 
        COUNT(*) as total_repairs,
        COUNT(CASE WHEN status = 'completed' OR status = 'delivered' THEN 1 END) as completed_repairs,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as active_repairs,
        COALESCE(SUM(cost_technician), 0) as total_earned,
        COALESCE(SUM(profit), 0) as total_profit_generated,
        COALESCE(AVG(CASE WHEN completion_date IS NOT NULL AND assigned_date IS NOT NULL 
          THEN EXTRACT(DAY FROM completion_date - assigned_date) END), 0) as avg_days_to_complete
      FROM repairs
      WHERE technician_id = ${id}
    `

    // Obtener rendimiento mensual (últimos 6 meses)
    const monthlyPerformance = await sql`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
        COUNT(*) as repairs_count,
        COALESCE(SUM(cost_technician), 0) as earned,
        COALESCE(SUM(profit), 0) as profit_generated
      FROM repairs
      WHERE technician_id = ${id}
        AND created_at >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY month DESC
    `

    // Obtener tipos de reparación más frecuentes
    const repairTypes = await sql`
      SELECT 
        repair_type,
        COUNT(*) as count,
        COALESCE(AVG(cost_technician), 0) as avg_cost
      FROM repairs
      WHERE technician_id = ${id} AND repair_type IS NOT NULL
      GROUP BY repair_type
      ORDER BY count DESC
      LIMIT 5
    `

    return NextResponse.json({
      technician,
      repairs,
      stats: stats[0],
      monthlyPerformance,
      repairTypes
    })
  } catch (error) {
    console.error('Error fetching technician:', error)
    return NextResponse.json({ error: 'Error al obtener técnico' }, { status: 500 })
  }
}

// PUT - Actualizar técnico
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await req.json()
    const {
      name, email, phone, specialization, is_internal, is_active,
      hourly_rate, commission_rate, notes
    } = data

    const result = await sql`
      UPDATE technicians SET
        name = ${name},
        email = ${email},
        phone = ${phone},
        specialization = ${specialization},
        is_internal = ${is_internal},
        is_active = ${is_active},
        hourly_rate = ${hourly_rate ?? 0},
        commission_rate = ${commission_rate ?? 0},
        notes = ${notes},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Técnico no encontrado' }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error('Error updating technician:', error)
    return NextResponse.json({ error: 'Error al actualizar técnico' }, { status: 500 })
  }
}

// DELETE - Desactivar técnico
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await sql`
      UPDATE technicians SET is_active = false, updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deactivating technician:', error)
    return NextResponse.json({ error: 'Error al desactivar técnico' }, { status: 500 })
  }
}
