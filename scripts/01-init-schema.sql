-- Watch Repair Shop CRM - Database Schema
-- Run this script to initialize all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS repair_history CASCADE;
DROP TABLE IF EXISTS repairs CASCADE;
DROP TABLE IF EXISTS special_orders CASCADE;
DROP TABLE IF EXISTS watches CASCADE;
DROP TABLE IF EXISTS technicians CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table (admin and staff accounts)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'technician', 'staff')),
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    notes TEXT,
    total_spent DECIMAL(12, 2) DEFAULT 0,
    total_repairs INTEGER DEFAULT 0,
    is_vip BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Technicians table
CREATE TABLE technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    is_internal BOOLEAN DEFAULT true,
    specialization VARCHAR(100),
    hourly_rate DECIMAL(10, 2),
    commission_rate DECIMAL(5, 2) DEFAULT 0,
    total_repairs INTEGER DEFAULT 0,
    success_rate DECIMAL(5, 2) DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watches table
CREATE TABLE watches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100),
    serial_number VARCHAR(100),
    reference_number VARCHAR(100),
    year INTEGER,
    material VARCHAR(100),
    condition VARCHAR(50) CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
    description TEXT,
    photos TEXT[], -- Array of photo URLs
    status VARCHAR(50) DEFAULT 'received' CHECK (status IN ('received', 'in_repair', 'completed', 'delivered', 'returned')),
    entry_date TIMESTAMPTZ DEFAULT NOW(),
    exit_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repairs table
CREATE TABLE repairs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repair_number VARCHAR(20) UNIQUE NOT NULL,
    watch_id UUID NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
    repair_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'waiting_parts', 'quality_check', 'completed', 'delivered', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    description TEXT,
    diagnosis TEXT,
    work_performed TEXT,
    parts_used TEXT,
    cost_parts DECIMAL(10, 2) DEFAULT 0,
    cost_labor DECIMAL(10, 2) DEFAULT 0,
    cost_technician DECIMAL(10, 2) DEFAULT 0, -- What we pay to technician
    price_customer DECIMAL(10, 2) DEFAULT 0, -- What customer pays
    profit DECIMAL(10, 2) GENERATED ALWAYS AS (price_customer - cost_parts - cost_labor - cost_technician) STORED,
    estimated_days INTEGER,
    assigned_date TIMESTAMPTZ,
    started_date TIMESTAMPTZ,
    completion_date TIMESTAMPTZ,
    delivery_date TIMESTAMPTZ,
    warranty_months INTEGER DEFAULT 6,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repair history table (audit trail)
CREATE TABLE repair_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repair_id UUID NOT NULL REFERENCES repairs(id) ON DELETE CASCADE,
    status_from VARCHAR(50),
    status_to VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Special orders table (custom jewelry, special requests)
CREATE TABLE special_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(20) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    order_type VARCHAR(100) NOT NULL, -- 'jewelry', 'custom_watch', 'engraving', etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    specifications TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'in_production', 'quality_check', 'completed', 'delivered', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    cost_materials DECIMAL(10, 2) DEFAULT 0,
    cost_labor DECIMAL(10, 2) DEFAULT 0,
    price_customer DECIMAL(10, 2) DEFAULT 0,
    profit DECIMAL(10, 2) GENERATED ALWAYS AS (price_customer - cost_materials - cost_labor) STORED,
    deposit_amount DECIMAL(10, 2) DEFAULT 0,
    deposit_paid BOOLEAN DEFAULT false,
    expected_date DATE,
    completion_date DATE,
    photos TEXT[],
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Incidents table (problems/issues)
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    repair_id UUID REFERENCES repairs(id) ON DELETE CASCADE,
    special_order_id UUID REFERENCES special_orders(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES users(id) ON DELETE SET NULL,
    incident_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    resolution TEXT,
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'email', 'sms', 'push'
    category VARCHAR(50) NOT NULL, -- 'repair_status', 'delivery_ready', 'reminder', etc.
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMPTZ,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_watches_customer_id ON watches(customer_id);
CREATE INDEX idx_watches_status ON watches(status);
CREATE INDEX idx_repairs_watch_id ON repairs(watch_id);
CREATE INDEX idx_repairs_technician_id ON repairs(technician_id);
CREATE INDEX idx_repairs_status ON repairs(status);
CREATE INDEX idx_repairs_created_at ON repairs(created_at);
CREATE INDEX idx_repair_history_repair_id ON repair_history(repair_id);
CREATE INDEX idx_special_orders_customer_id ON special_orders(customer_id);
CREATE INDEX idx_special_orders_status ON special_orders(status);
CREATE INDEX idx_incidents_repair_id ON incidents(repair_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_customer_id ON notifications(customer_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON technicians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_watches_updated_at BEFORE UPDATE ON watches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_repairs_updated_at BEFORE UPDATE ON repairs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_special_orders_updated_at BEFORE UPDATE ON special_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to generate repair numbers
CREATE OR REPLACE FUNCTION generate_repair_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix VARCHAR(4);
    next_number INTEGER;
BEGIN
    year_prefix := TO_CHAR(NOW(), 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(repair_number FROM 6) AS INTEGER)), 0) + 1
    INTO next_number
    FROM repairs
    WHERE repair_number LIKE year_prefix || '-%';
    NEW.repair_number := year_prefix || '-' || LPAD(next_number::TEXT, 5, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_repair_number BEFORE INSERT ON repairs FOR EACH ROW WHEN (NEW.repair_number IS NULL) EXECUTE FUNCTION generate_repair_number();

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix VARCHAR(4);
    next_number INTEGER;
BEGIN
    year_prefix := 'SO' || TO_CHAR(NOW(), 'YY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS INTEGER)), 0) + 1
    INTO next_number
    FROM special_orders
    WHERE order_number LIKE year_prefix || '-%';
    NEW.order_number := year_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_order_number BEFORE INSERT ON special_orders FOR EACH ROW WHEN (NEW.order_number IS NULL) EXECUTE FUNCTION generate_order_number();
