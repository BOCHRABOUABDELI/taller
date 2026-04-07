import { neon } from '@neondatabase/serverless';
import bcryptjs from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL);

async function createTestUser() {
  try {
    // Hash the test password
    const hashedPassword = await bcryptjs.hash('Test123!', 10);
    
    // Insert test user
    const result = await sql`
      INSERT INTO users (
        email,
        password,
        nombre,
        apellido,
        role,
        estado,
        fecha_creacion
      ) VALUES (
        ${`admin@luxerepair.test`},
        ${hashedPassword},
        ${'Admin'},
        ${'Test'},
        ${'admin'},
        ${'activo'},
        ${new Date().toISOString()}
      )
      RETURNING id, email, nombre, role, estado;
    `;
    
    console.log('[v0] Test user created successfully:', result[0]);
    console.log('[v0] Login credentials:');
    console.log('[v0] Email: admin@luxerepair.test');
    console.log('[v0] Password: Test123!');
    
  } catch (error) {
    console.error('[v0] Error creating test user:', error);
  }
}

createTestUser();
