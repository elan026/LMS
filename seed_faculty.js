const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const facultyMembers = [
    { name: "Dr. Lalitha K", email: "lalitha.k@nandhaengg.org" },
    { name: "Mr. Gunasekar.K", email: "gunasekar.k@nandhaengg.org" },
    { name: "Ms. Parvathi.M", email: "parvathi.m@nandhaengg.org" },
    { name: "Ms. Senthamarai M", email: "senthamarai.m@nandhaengg.org" },
    { name: "Ms. Indhumathi T", email: "indhumathi.t@nandhaengg.org" },
    { name: "Ms. Jahina J", email: "jahina.j@nandhaengg.org" },
    { name: "Ms. Shanmugapriya.S", email: "shanmugapriya.s@nandhaengg.org" },
    { name: "Ms. Suje SA", email: "suje.sa@nandhaengg.org" },
    { name: "Ms. Kokila M M", email: "kokila.mm@nandhaengg.org" },
    { name: "Mr. Dinesh S", email: "dinesh.s@nandhaengg.org" },
    { name: "Mr. Balasubramaniam C", email: "balasubramaniam.c@nandhaengg.org" },
    { name: "Ms. Mythili R", email: "mythili.r@nandhaengg.org" },
    { name: "Mr. Vijayakumar S D", email: "vijayakumar.sd@nandhaengg.org" }
];

async function seedFaculty() {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // Get Tenant ID
        const [tenants] = await connection.query('SELECT id FROM tenants LIMIT 1');
        if (tenants.length === 0) {
            console.error('No tenant found. Please create a tenant first.');
            process.exit(1);
        }
        const tenantId = tenants[0].id;
        
        // Get Faculty Role ID
        const [roles] = await connection.query('SELECT id FROM roles WHERE name = ?', ['faculty']);
        if (roles.length === 0) {
            console.error('Faculty role not found.');
            process.exit(1);
        }
        const facultyRoleId = roles[0].id;

        // Get AI&DS Department ID
        let departmentId = null;
        const [depts] = await connection.query('SELECT id FROM departments WHERE name = ?', ['AI&DS']);
        if (depts.length > 0) {
            departmentId = depts[0].id;
        }

        const password = await bcrypt.hash('Faculty@123', 10);
        
        let created = 0;
        let skipped = 0;

        for (const f of facultyMembers) {
            const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [f.email]);
            if (existing.length > 0) {
                skipped++;
                continue;
            }

            const userId = uuidv4();
            await connection.query(
                `INSERT INTO users (id, tenant_id, name, email, password, role_id, department, department_id, is_active) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, tenantId, f.name, f.email, password, facultyRoleId, 'AI&DS', departmentId, true]
            );
            created++;
        }

        console.log(`Faculty Seeding Completed: ${created} created, ${skipped} skipped.`);
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        if (connection) connection.release();
        process.exit();
    }
}

seedFaculty();
