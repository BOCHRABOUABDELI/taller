import { neon } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Estadísticas generales
    const generalStats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM repairs WHERE status NOT IN ('completed', 'delivered', 'cancelled')) as active_repairs,
        (SELECT COUNT(*) FROM repairs WHERE status IN ('completed', 'delivered')) as completed_repairs,
        (SELECT COUNT(*) FROM repairs WHERE DATE(created_at) = CURRENT_DATE) as repairs_today,
        (SELECT COUNT(*) FROM customers) as total_customers,
        (SELECT COUNT(*) FROM customers WHERE is_vip = true) as vip_customers,
        (SELECT COUNT(*) FROM technicians WHERE is_active = true) as active_technicians,
        (SELECT COUNT(*) FROM special_orders WHERE status NOT IN ('completed', 'delivered', 'cancelled')) as pending_orders,
        (SELECT COUNT(*) FROM repairs WHERE status = 'waiting_parts') as waiting_parts
    `

    // Ingresos y beneficios
    const financialStats = await sql`
      SELECT 
        COALESCE(SUM(price_customer), 0) as total_revenue,
        COALESCE(SUM(profit), 0) as total_profit,
        COALESCE(SUM(CASE WHEN DATE(created_at) >= DATE_TRUNC('month', CURRENT_DATE) THEN price_customer ELSE 0 END), 0) as revenue_this_month,
        COALESCE(SUM(CASE WHEN DATE(created_at) >= DATE_TRUNC('month', CURRENT_DATE) THEN profit ELSE 0 END), 0) as profit_this_month,
        COALESCE(AVG(CASE WHEN completion_date IS NOT NULL AND assigned_date IS NOT NULL 
          THEN EXTRACT(DAY FROM completion_date - assigned_date) END), 0) as avg_repair_days
      FROM repairs
      WHERE status IN ('completed', 'delivered')
    `

    // Reparaciones por estado
    const repairsByStatus = await sql`
      SELECT status, COUNT(*) as count
      FROM repairs
      GROUP BY status
      ORDER BY count DESC
    `

    // Top técnicos por reparaciones completadas
    const topTechnicians = await sql`
      SELECT 
        t.id, t.name, t.specialization,
        COUNT(r.id) as total_repairs,
        COALESCE(SUM(r.profit), 0) as profit_generated
      FROM technicians t
      LEFT JOIN repairs r ON t.id = r.technician_id AND r.status IN ('completed', 'delivered')
      WHERE t.is_active = true
      GROUP BY t.id, t.name, t.specialization
      ORDER BY total_repairs DESC
      LIMIT 5
    `

    // Reparaciones recientes
    const recentRepairs = await sql`
      SELECT 
        r.id, r.repair_number, r.status, r.priority, r.price_customer, r.profit,
        r.created_at,
        w.brand, w.model,
        c.name as customer_name,
        t.name as technician_name
      FROM repairs r
      LEFT JOIN watches w ON r.watch_id = w.id
      LEFT JOIN customers c ON w.customer_id = c.id
      LEFT JOIN technicians t ON r.technician_id = t.id
      ORDER BY r.created_at DESC
      LIMIT 8
    `

    // Ingresos últimos 6 meses
    const monthlyRevenue = await sql`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') as month,
        EXTRACT(MONTH FROM created_at) as month_num,
        COALESCE(SUM(price_customer), 0) as revenue,
        COALESCE(SUM(cost_parts + cost_labor + cost_technician), 0) as costs,
        COALESCE(SUM(profit), 0) as profit,
        COUNT(*) as repairs
      FROM repairs
      WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
        AND status IN ('completed', 'delivered')
      GROUP BY DATE_TRUNC('month', created_at), EXTRACT(MONTH FROM created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `

    // Marcas más reparadas
    const topBrands = await sql`
      SELECT 
        w.brand,
        COUNT(*) as count,
        COALESCE(SUM(r.price_customer), 0) as revenue
      FROM repairs r
      JOIN watches w ON r.watch_id = w.id
      GROUP BY w.brand
      ORDER BY count DESC
      LIMIT 5
    `

    // Pedidos especiales pendientes
    const pendingOrders = await sql`
      SELECT 
        so.id, so.order_number, so.title, so.status, so.expected_date, so.priority,
        c.name as customer_name
      FROM special_orders so
      LEFT JOIN customers c ON so.customer_id = c.id
      WHERE so.status NOT IN ('completed', 'delivered', 'cancelled')
      ORDER BY so.expected_date ASC
      LIMIT 5
    `

    // Alertas/Notificaciones no leídas
    const unreadNotifications = await sql`
      SELECT COUNT(*) as count FROM notifications WHERE is_read = false
    `

    return NextResponse.json({
      general: generalStats[0],
      financial: financialStats[0],
      repairsByStatus,
      topTechnicians,
      recentRepairs,
      monthlyRevenue,
      topBrands,
      pendingOrders,
      unreadNotifications: unreadNotifications[0]?.count || 0
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
