-- Datos de ejemplo para LuxeRepair CRM
-- Este script inserta clientes, técnicos, relojes, reparaciones y pedidos especiales

-- =====================
-- CLIENTES DE EJEMPLO
-- =====================
INSERT INTO customers (name, email, phone, address, city, notes, is_vip, created_at, updated_at) VALUES
('Carlos Rodríguez García', 'carlos.rodriguez@email.com', '+34 612 345 678', 'Calle Mayor 123', 'Madrid', 'Cliente VIP, coleccionista de Rolex', true, NOW(), NOW()),
('María Fernández López', 'maria.fernandez@email.com', '+34 623 456 789', 'Paseo de Gracia 45', 'Barcelona', 'Prefiere contacto por WhatsApp', false, NOW(), NOW()),
('Antonio Martínez Sánchez', 'antonio.martinez@email.com', '+34 634 567 890', 'Avenida de la Constitución 10', 'Sevilla', 'Herencia familiar de relojes antiguos', false, NOW(), NOW()),
('Laura González Ruiz', 'laura.gonzalez@email.com', '+34 645 678 901', 'Gran Vía 78', 'Bilbao', 'Interesada en restauración de relojes vintage', false, NOW(), NOW()),
('Pedro Sánchez Moreno', 'pedro.sanchez@email.com', '+34 656 789 012', 'Calle Larios 15', 'Málaga', 'Empresario, varios Omega y TAG Heuer', true, NOW(), NOW()),
('Isabel Díaz Torres', 'isabel.diaz@email.com', '+34 667 890 123', 'Plaza del Pilar 3', 'Zaragoza', 'Colección de relojes suizos', false, NOW(), NOW()),
('Francisco López Navarro', 'francisco.lopez@email.com', '+34 678 901 234', 'Calle Colón 22', 'Valencia', 'Busca piezas raras para su Patek Philippe', true, NOW(), NOW()),
('Ana Ruiz Jiménez', 'ana.ruiz@email.com', '+34 689 012 345', 'Calle Real 56', 'A Coruña', 'Primera vez en el taller', false, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================
-- TÉCNICOS DE EJEMPLO
-- =====================
INSERT INTO technicians (name, email, phone, specialization, is_active, hourly_rate, commission_rate, created_at, updated_at) VALUES
('Miguel Ángel Herrera', 'miguel.herrera@luxerepair.com', '+34 611 111 111', 'Relojes mecánicos de alta gama', true, 95.00, 15.00, NOW(), NOW()),
('Carmen Vega Ortiz', 'carmen.vega@luxerepair.com', '+34 622 222 222', 'Restauración de relojes antiguos', true, 85.00, 12.00, NOW(), NOW()),
('Roberto Silva Mendoza', 'roberto.silva@luxerepair.com', '+34 633 333 333', 'Cronógrafos y complicaciones', true, 90.00, 14.00, NOW(), NOW()),
('Elena Castro Prieto', 'elena.castro@luxerepair.com', '+34 644 444 444', 'Relojes de cuarzo y electrónicos', true, 60.00, 10.00, NOW(), NOW()),
('Javier Morales Blanco', 'javier.morales@luxerepair.com', '+34 655 555 555', 'Pulido y acabados estéticos', false, 70.00, 8.00, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================
-- RELOJES DE EJEMPLO
-- =====================
INSERT INTO watches (customer_id, brand, model, serial_number, year, material, condition, description, photos, status, created_at, updated_at)
VALUES
((SELECT id FROM customers WHERE name = 'Carlos Rodríguez García' LIMIT 1), 'Rolex', 'Submariner Date', 'RLX-2023-SUB-001', 2021, 'Acero', 'excellent', 'Caja de acero Oystersteel, bisel cerámico azul, brazalete Oyster', ARRAY['/watches/rolex-sub-1.jpg'], 'in_repair', NOW(), NOW()),
((SELECT id FROM customers WHERE name = 'Carlos Rodríguez García' LIMIT 1), 'Rolex', 'Daytona', 'RLX-2019-DAY-045', 2019, 'Oro blanco 18k', 'excellent', 'Oro blanco 18k, esfera negra, cronógrafo', ARRAY['/watches/rolex-day-1.jpg'], 'received', NOW(), NOW()),
((SELECT id FROM customers WHERE name = 'María Fernández López' LIMIT 1), 'Omega', 'Seamaster Aqua Terra', 'OMG-2022-SAT-112', 2022, 'Acero', 'excellent', 'Acero inoxidable, esfera verde, 38mm', ARRAY['/watches/omega-sat-1.jpg'], 'delivered', NOW(), NOW()),
((SELECT id FROM customers WHERE name = 'Antonio Martínez Sánchez' LIMIT 1), 'Patek Philippe', 'Calatrava', 'PP-1975-CAL-789', 1975, 'Oro amarillo 18k', 'good', 'Reloj de bolsillo heredado, oro amarillo 18k', ARRAY['/watches/pp-cal-1.jpg'], 'in_repair', NOW(), NOW()),
((SELECT id FROM customers WHERE name = 'Antonio Martínez Sánchez' LIMIT 1), 'Longines', 'Conquest Heritage', 'LNG-1968-CON-234', 1968, 'Acero', 'fair', 'Reloj vintage, necesita restauración completa', ARRAY['/watches/longines-1968.jpg'], 'in_repair', NOW(), NOW()),
((SELECT id FROM customers WHERE name = 'Laura González Ruiz' LIMIT 1), 'TAG Heuer', 'Monaco', 'TH-2020-MON-567', 2020, 'Acero', 'excellent', 'Edición especial Gulf, caja cuadrada azul', ARRAY['/watches/tag-monaco.jpg'], 'in_repair', NOW(), NOW()),
((SELECT id FROM customers WHERE name = 'Pedro Sánchez Moreno' LIMIT 1), 'Omega', 'Speedmaster Moonwatch', 'OMG-2018-SPM-890', 2018, 'Acero', 'excellent', 'Professional, cristal Hesalite, correa NATO', ARRAY['/watches/omega-moon.jpg'], 'delivered', NOW(), NOW()),
((SELECT id FROM customers WHERE name = 'Pedro Sánchez Moreno' LIMIT 1), 'TAG Heuer', 'Carrera', 'TH-2021-CAR-123', 2021, 'Acero', 'excellent', 'Cronógrafo automático, 44mm', ARRAY['/watches/tag-carrera.jpg'], 'in_repair', NOW(), NOW()),
((SELECT id FROM customers WHERE name = 'Isabel Díaz Torres' LIMIT 1), 'Jaeger-LeCoultre', 'Reverso Classic', 'JLC-2017-REV-456', 2017, 'Oro rosa', 'excellent', 'Oro rosa, esfera plateada', ARRAY['/watches/jlc-reverso.jpg'], 'received', NOW(), NOW()),
((SELECT id FROM customers WHERE name = 'Francisco López Navarro' LIMIT 1), 'Patek Philippe', 'Nautilus', 'PP-2015-NAU-789', 2015, 'Acero', 'excellent', 'Acero inoxidable, esfera azul gradiente', ARRAY['/watches/pp-nautilus.jpg'], 'in_repair', NOW(), NOW()),
((SELECT id FROM customers WHERE name = 'Ana Ruiz Jiménez' LIMIT 1), 'Cartier', 'Tank Française', 'CTR-2023-TAN-012', 2023, 'Acero', 'excellent', 'Acero inoxidable, movimiento de cuarzo', ARRAY['/watches/cartier-tank.jpg'], 'delivered', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================
-- REPARACIONES DE EJEMPLO
-- =====================
INSERT INTO repairs (repair_number, watch_id, technician_id, repair_type, status, priority, description, diagnosis, cost_parts, cost_labor, cost_technician, price_customer, estimated_days, notes, created_at, updated_at)
VALUES
('REP-2024-001', (SELECT id FROM watches WHERE serial_number = 'RLX-2023-SUB-001' LIMIT 1), (SELECT id FROM technicians WHERE name = 'Miguel Ángel Herrera' LIMIT 1), 'Servicio Completo', 'in_progress', 'normal', 'Revisión completa del movimiento', 'El reloj adelanta 15 segundos por día. Se requiere ajuste de espiral y lubricación general.', 150.00, 500.00, 200.00, 850.00, 7, 'Cliente solicita certificado de servicio oficial', NOW() - INTERVAL '3 days', NOW()),
('REP-2024-002', (SELECT id FROM watches WHERE serial_number = 'RLX-2019-DAY-045' LIMIT 1), (SELECT id FROM technicians WHERE name = 'Miguel Ángel Herrera' LIMIT 1), 'Reparación Cronógrafo', 'pending', 'high', 'Cronógrafo no funciona correctamente', 'Botón superior atascado. Posible problema con la rueda de columnas.', 300.00, 600.00, 300.00, 1200.00, 14, 'Esperando presupuesto de piezas', NOW() - INTERVAL '1 day', NOW()),
('REP-2024-003', (SELECT id FROM watches WHERE serial_number = 'OMG-2022-SAT-112' LIMIT 1), (SELECT id FROM technicians WHERE name = 'Roberto Silva Mendoza' LIMIT 1), 'Cambio de Batería', 'completed', 'low', 'Cambio de pila y verificación de estanqueidad', 'Batería agotada. Verificación de estanqueidad completada.', 20.00, 50.00, 25.00, 95.00, 1, 'Entregado al cliente', NOW() - INTERVAL '10 days', NOW()),
('REP-2024-004', (SELECT id FROM watches WHERE serial_number = 'PP-1975-CAL-789' LIMIT 1), (SELECT id FROM technicians WHERE name = 'Carmen Vega Ortiz' LIMIT 1), 'Restauración Completa', 'in_progress', 'high', 'Restauración completa', 'Limpieza del movimiento, pulido de caja, reemplazo de cristal. Reloj de 1975 con valor sentimental.', 400.00, 1500.00, 600.00, 2500.00, 30, 'Pieza de museo, requiere máximo cuidado', NOW() - INTERVAL '15 days', NOW()),
('REP-2024-005', (SELECT id FROM watches WHERE serial_number = 'LNG-1968-CON-234' LIMIT 1), (SELECT id FROM technicians WHERE name = 'Carmen Vega Ortiz' LIMIT 1), 'Restauración Vintage', 'waiting_parts', 'high', 'Servicio completo vintage', 'Corona original dañada, se ha encargado pieza de reemplazo original. Movimiento necesita servicio completo.', 200.00, 350.00, 130.00, 680.00, 45, 'Pieza encargada a Suiza', NOW() - INTERVAL '20 days', NOW()),
('REP-2024-006', (SELECT id FROM watches WHERE serial_number = 'TH-2020-MON-567' LIMIT 1), (SELECT id FROM technicians WHERE name = 'Roberto Silva Mendoza' LIMIT 1), 'Reparación Cristal', 'pending', 'normal', 'Cambio de cristal', 'El cristal presenta un rayón profundo. Se recomienda reemplazo de cristal zafiro y revisión de juntas.', 150.00, 200.00, 100.00, 450.00, 10, NULL, NOW() - INTERVAL '2 days', NOW()),
('REP-2024-007', (SELECT id FROM watches WHERE serial_number = 'OMG-2018-SPM-890' LIMIT 1), (SELECT id FROM technicians WHERE name = 'Roberto Silva Mendoza' LIMIT 1), 'Servicio Completo', 'completed', 'high', 'Servicio del calibre 1861', 'Servicio completo del calibre 1861. Reemplazo de juntas, lubricación y ajuste de precisión.', 150.00, 450.00, 120.00, 720.00, 14, 'Cronómetro certificado ±2 seg/día', NOW() - INTERVAL '25 days', NOW()),
('REP-2024-008', (SELECT id FROM watches WHERE serial_number = 'JLC-2017-REV-456' LIMIT 1), (SELECT id FROM technicians WHERE name = 'Miguel Ángel Herrera' LIMIT 1), 'Diagnóstico', 'pending', 'normal', 'Diagnóstico de funcionamiento', 'Cliente reporta que el reloj se detiene ocasionalmente. Diagnóstico inicial: posible problema con el muelle real.', 200.00, 600.00, 180.00, 980.00, 21, 'Programada cita para diagnóstico completo', NOW(), NOW()),
('REP-2024-009', (SELECT id FROM watches WHERE serial_number = 'PP-2015-NAU-789' LIMIT 1), (SELECT id FROM technicians WHERE name = 'Miguel Ángel Herrera' LIMIT 1), 'Mantenimiento', 'in_progress', 'urgent', 'Servicio preventivo', 'Servicio de mantenimiento preventivo. Limpieza, lubricación y verificación de reserva de marcha.', 300.00, 1200.00, 300.00, 1800.00, 14, 'Cliente VIP, prioridad alta', NOW() - INTERVAL '7 days', NOW()),
('REP-2024-010', (SELECT id FROM watches WHERE serial_number = 'CTR-2023-TAN-012' LIMIT 1), (SELECT id FROM technicians WHERE name = 'Elena Castro Prieto' LIMIT 1), 'Servicio Rápido', 'completed', 'low', 'Cambio de pila', 'Cambio de pila y pulido ligero de la caja. Verificación de cierre del brazalete.', 10.00, 40.00, 25.00, 75.00, 1, 'Primera visita de la cliente', NOW() - INTERVAL '5 days', NOW())
ON CONFLICT DO NOTHING;

-- =====================
-- PEDIDOS ESPECIALES DE EJEMPLO
-- =====================
INSERT INTO special_orders (order_number, customer_id, order_type, title, description, cost_materials, cost_labor, price_customer, expected_date, status, notes, created_at, updated_at)
VALUES
('PED-2024-001', (SELECT id FROM customers WHERE name = 'Antonio Martínez Sánchez' LIMIT 1), 'parts', 'Corona original Longines ref. L432.1', 'Corona original Longines ref. L432.1 para reloj vintage', 100.00, 80.00, 180.00, NOW()::date + INTERVAL '20 days', 'in_production', 'Envío express desde Saint-Imier', NOW(), NOW()),
('PED-2024-002', (SELECT id FROM customers WHERE name = 'Carlos Rodríguez García' LIMIT 1), 'parts', 'Rueda de columnas calibre 4130', 'Rueda de columnas calibre 4130 para Rolex Daytona', 200.00, 250.00, 450.00, NOW()::date + INTERVAL '30 days', 'pending', 'Pieza original certificada', NOW(), NOW()),
('PED-2024-003', (SELECT id FROM customers WHERE name = 'Antonio Martínez Sánchez' LIMIT 1), 'parts', 'Cristal mineral bombé vintage', 'Cristal mineral bombé vintage para Patek Philippe 1975', 80.00, 40.00, 120.00, NOW()::date - INTERVAL '5 days', 'completed', 'Cristal especial para modelo 1975', NOW(), NOW()),
('PED-2024-004', (SELECT id FROM customers WHERE name = 'Antonio Martínez Sánchez' LIMIT 1), 'parts', 'Estuche de presentación original', 'Estuche de presentación original Patek Philippe', 200.00, 150.00, 350.00, NOW()::date + INTERVAL '15 days', 'in_production', 'Cliente quiere presentación completa', NOW(), NOW()),
('PED-2024-005', (SELECT id FROM customers WHERE name = 'Laura González Ruiz' LIMIT 1), 'parts', 'Cristal zafiro con AR coating', 'Cristal zafiro con AR coating para TAG Heuer Monaco', 150.00, 130.00, 280.00, NOW()::date + INTERVAL '14 days', 'pending', NULL, NOW(), NOW()),
('PED-2024-006', (SELECT id FROM customers WHERE name = 'Isabel Díaz Torres' LIMIT 1), 'parts', 'Muelle real Jaeger-LeCoultre', 'Muelle real Jaeger-LeCoultre para Reverso Classic', 120.00, 100.00, 220.00, NOW()::date + INTERVAL '25 days', 'pending', 'Pieza delicada, envío asegurado', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- =====================
-- HISTORIAL DE REPARACIONES
-- =====================
INSERT INTO repair_history (repair_id, status_to, notes, changed_by, created_at)
VALUES
((SELECT id FROM repairs WHERE repair_number = 'REP-2024-003' LIMIT 1), 'received', 'Reloj recibido en taller', (SELECT id FROM users WHERE role = 'admin' LIMIT 1), NOW() - INTERVAL '10 days'),
((SELECT id FROM repairs WHERE repair_number = 'REP-2024-003' LIMIT 1), 'assigned', 'Asignado a técnico', (SELECT id FROM users WHERE role = 'admin' LIMIT 1), NOW() - INTERVAL '9 days'),
((SELECT id FROM repairs WHERE repair_number = 'REP-2024-003' LIMIT 1), 'in_progress', 'Iniciando reparación', (SELECT id FROM users WHERE role = 'admin' LIMIT 1), NOW() - INTERVAL '8 days'),
((SELECT id FROM repairs WHERE repair_number = 'REP-2024-003' LIMIT 1), 'completed', 'Reparación finalizada, listo para entrega', (SELECT id FROM users WHERE role = 'admin' LIMIT 1), NOW() - INTERVAL '2 days'),
((SELECT id FROM repairs WHERE repair_number = 'REP-2024-007' LIMIT 1), 'received', 'Recibido para servicio completo', (SELECT id FROM users WHERE role = 'admin' LIMIT 1), NOW() - INTERVAL '25 days'),
((SELECT id FROM repairs WHERE repair_number = 'REP-2024-007' LIMIT 1), 'assigned', 'Asignado a técnico especializado', (SELECT id FROM users WHERE role = 'admin' LIMIT 1), NOW() - INTERVAL '24 days'),
((SELECT id FROM repairs WHERE repair_number = 'REP-2024-007' LIMIT 1), 'in_progress', 'Desmontaje del movimiento iniciado', (SELECT id FROM users WHERE role = 'admin' LIMIT 1), NOW() - INTERVAL '20 days'),
((SELECT id FROM repairs WHERE repair_number = 'REP-2024-007' LIMIT 1), 'completed', 'Servicio completado, precisión verificada', (SELECT id FROM users WHERE role = 'admin' LIMIT 1), NOW() - INTERVAL '5 days'),
((SELECT id FROM repairs WHERE repair_number = 'REP-2024-004' LIMIT 1), 'received', 'Reloj de bolsillo antiguo recibido', (SELECT id FROM users WHERE role = 'admin' LIMIT 1), NOW() - INTERVAL '15 days'),
((SELECT id FROM repairs WHERE repair_number = 'REP-2024-004' LIMIT 1), 'assigned', 'Asignado a especialista en restauración', (SELECT id FROM users WHERE role = 'admin' LIMIT 1), NOW() - INTERVAL '14 days')
ON CONFLICT DO NOTHING;

-- =====================
-- NOTIFICACIONES DE EJEMPLO
-- =====================
INSERT INTO notifications (user_id, type, category, subject, message, is_sent, is_read, created_at)
VALUES
((SELECT id FROM users WHERE role = 'admin' LIMIT 1), 'email', 'parts_received', 'Pieza recibida', 'El cristal para el Patek Philippe Calatrava ha llegado al taller.', true, true, NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE role = 'admin' LIMIT 1), 'email', 'repair_completed', 'Reparación completada', 'El Omega Speedmaster de Pedro Sánchez está listo para entrega.', true, true, NOW() - INTERVAL '5 days'),
((SELECT id FROM users WHERE role = 'admin' LIMIT 1), 'email', 'new_repair', 'Nueva reparación', 'Se ha registrado un nuevo Jaeger-LeCoultre Reverso para diagnóstico.', true, false, NOW()),
((SELECT id FROM users WHERE role = 'admin' LIMIT 1), 'email', 'order_delay', 'Pedido retrasado', 'El envío de la corona Longines tiene un retraso de 5 días.', true, false, NOW() - INTERVAL '2 days'),
((SELECT id FROM users WHERE role = 'admin' LIMIT 1), 'email', 'vip_request', 'Cliente VIP', 'Francisco López ha solicitado información sobre su Patek Philippe Nautilus.', true, false, NOW() - INTERVAL '1 day'),
((SELECT id FROM users WHERE role = 'admin' LIMIT 1), 'email', 'reminder', 'Recordatorio', 'La reparación del Rolex Submariner vence en 3 días.', true, false, NOW() - INTERVAL '4 hours'),
((SELECT id FROM users WHERE role = 'admin' LIMIT 1), 'email', 'payment_pending', 'Pago pendiente', 'El Cartier Tank Française está pendiente de cobro (€75).', true, true, NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

-- =====================
-- VERIFICACIÓN DE DATOS
-- =====================
SELECT 'Clientes' as tabla, COUNT(*) as total FROM customers
UNION ALL
SELECT 'Técnicos', COUNT(*) FROM technicians
UNION ALL
SELECT 'Relojes', COUNT(*) FROM watches
UNION ALL
SELECT 'Reparaciones', COUNT(*) FROM repairs
UNION ALL
SELECT 'Pedidos Especiales', COUNT(*) FROM special_orders
UNION ALL
SELECT 'Historial', COUNT(*) FROM repair_history
UNION ALL
SELECT 'Notificaciones', COUNT(*) FROM notifications;
