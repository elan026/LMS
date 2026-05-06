import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import xlsx from 'xlsx';
import path from 'path';
import { faker } from '@faker-js/faker';

// Use the database URL directly
const uri = "mongodb://localhost:27017/lms?replicaSet=rs0";

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

async function main() {
    console.log('Connecting to MongoDB...');
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('lms');

    console.log('Clearing existing collections...');
    await db.collection('Grade').deleteMany({});
    await db.collection('Attendance').deleteMany({});
    await db.collection('Enrollment').deleteMany({});
    await db.collection('Assignment').deleteMany({});
    await db.collection('Announcement').deleteMany({});
    await db.collection('Course').deleteMany({});
    await db.collection('User').deleteMany({});

    const defaultPassword = await bcrypt.hash('password123', 10);
    const now = new Date();

    // 1. Create Admin
    console.log('Creating admin...');
    const admin = {
        _id: new ObjectId(),
        name: 'System Admin',
        email: 'admin@lms.com',
        password_hash: defaultPassword,
        role: 'ADMIN',
        createdAt: now,
        updatedAt: now
    };
    await db.collection('User').insertOne(admin);

    // 2. Create Real Faculty
    console.log('Creating real faculty...');
    const createdFaculty = [];
    for (const f of facultyMembers) {
        const fac = {
            _id: new ObjectId(),
            name: f.name,
            email: f.email,
            password_hash: defaultPassword,
            role: 'FACULTY',
            createdAt: now,
            updatedAt: now
        };
        await db.collection('User').insertOne(fac);
        createdFaculty.push(fac);
    }

    // 3. Generate Fake Faculty to reach ~25 faculty
    console.log('Generating fake faculty...');
    for (let i = 0; i < 12; i++) {
        const fac = {
            _id: new ObjectId(),
            name: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            password_hash: defaultPassword,
            role: 'FACULTY',
            createdAt: now,
            updatedAt: now
        };
        await db.collection('User').insertOne(fac);
        createdFaculty.push(fac);
    }

    // 4. Create Real Students from Excel
    console.log('Reading real students from Excel...');
    const createdStudents = [];
    try {
        const filePath = path.resolve('../AI&DS STUDENT DETAILS.xlsx');
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        
        for (const row of data) {
            if (!row.Name || !row.Reg_Number) continue;
            const stu = {
                _id: new ObjectId(),
                name: row.Name,
                email: `${row.Reg_Number.toLowerCase()}@student.nandhaengg.org`,
                password_hash: defaultPassword,
                role: 'STUDENT',
                createdAt: now,
                updatedAt: now
            };
            await db.collection('User').insertOne(stu);
            createdStudents.push(stu);
        }
    } catch (e) {
        console.error('Failed to parse excel:', e.message);
    }

    // 5. Generate Fake Students to reach >100 total students
    console.log(`Currently ${createdStudents.length} real students. Generating fake students...`);
    const studentsNeeded = Math.max(100 - createdStudents.length, 50);
    const fakeStudents = [];
    for (let i = 0; i < studentsNeeded; i++) {
        const stu = {
            _id: new ObjectId(),
            name: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            password_hash: defaultPassword,
            role: 'STUDENT',
            createdAt: now,
            updatedAt: now
        };
        fakeStudents.push(stu);
        createdStudents.push(stu);
    }
    if (fakeStudents.length > 0) {
        await db.collection('User').insertMany(fakeStudents);
    }
    console.log(`Total students created: ${createdStudents.length}`);

    // 6. Create Courses & Assign to Faculty
    console.log('Creating courses...');
    const createdCourses = [];
    const subjects = ['Data Structures', 'Machine Learning', 'Artificial Intelligence', 'Operating Systems', 'Database Systems', 'Computer Networks', 'Cloud Computing', 'Deep Learning', 'Software Engineering', 'Web Development'];
    
    for (const fac of createdFaculty) {
        const numCourses = faker.number.int({ min: 1, max: 2 });
        for (let i = 0; i < numCourses; i++) {
            const course = {
                _id: new ObjectId(),
                title: `${faker.helpers.arrayElement(subjects)} - ${faker.string.alphanumeric(4).toUpperCase()}`,
                status: 'ACTIVE',
                semester: faker.helpers.arrayElement(['Fall', 'Spring']),
                year: 2026,
                instructorId: fac._id,
                createdAt: now,
                updatedAt: now
            };
            createdCourses.push(course);
        }
    }
    if (createdCourses.length > 0) {
        await db.collection('Course').insertMany(createdCourses);
    }

    // 7. Create Enrollments, Grades, Attendance, Assignments
    console.log('Simulating enrollments, grades, attendance, and assignments...');
    
    for (const course of createdCourses) {
        await db.collection('Assignment').insertMany([
            { _id: new ObjectId(), title: 'Midterm Project', dueDate: faker.date.future(), maxScore: 100, courseId: course._id, createdAt: now, updatedAt: now },
            { _id: new ObjectId(), title: 'Final Exam', dueDate: faker.date.future(), maxScore: 100, courseId: course._id, createdAt: now, updatedAt: now }
        ]);

        const shuffled = [...createdStudents].sort(() => 0.5 - Math.random());
        const enrolled = shuffled.slice(0, faker.number.int({ min: 20, max: 40 }));
        
        for (const stu of enrolled) {
            await db.collection('Enrollment').insertOne({
                _id: new ObjectId(),
                studentId: stu._id,
                courseId: course._id,
                enrolledAt: now
            });

            if (Math.random() > 0.2) {
                const score = faker.number.float({ min: 40, max: 100, fractionDigits: 1 });
                let letter = 'F';
                if (score >= 90) letter = 'A';
                else if (score >= 80) letter = 'B';
                else if (score >= 70) letter = 'C';
                else if (score >= 60) letter = 'D';

                await db.collection('Grade').insertOne({
                    _id: new ObjectId(),
                    studentId: stu._id,
                    courseId: course._id,
                    score, letter,
                    createdAt: now, updatedAt: now
                });
            }

            for (let d = 1; d <= 3; d++) {
                const date = new Date();
                date.setDate(date.getDate() - d);
                await db.collection('Attendance').insertOne({
                    _id: new ObjectId(),
                    studentId: stu._id,
                    courseId: course._id,
                    date: date,
                    status: faker.helpers.arrayElement(['PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'LATE']),
                    createdAt: now, updatedAt: now
                });
            }
        }
        
        await db.collection('Announcement').insertOne({
            _id: new ObjectId(),
            title: `Welcome to ${course.title}`,
            content: faker.lorem.paragraph(),
            courseId: course._id,
            createdBy: course.instructorId,
            createdAt: now, updatedAt: now
        });
    }

    await db.collection('Announcement').insertOne({
        _id: new ObjectId(),
        title: "System Maintenance Scheduled",
        content: "The LMS will be down for maintenance this weekend.",
        courseId: null,
        createdBy: admin._id,
        createdAt: now, updatedAt: now
    });

    console.log('Seed completed successfully!');
    console.log(`\n--- LOGIN ACCOUNTS (Password for all is 'password123') ---`);
    console.log(`Admin: admin@lms.com`);
    console.log(`Faculty Example: ${createdFaculty[0].email}`);
    console.log(`Student Example: ${createdStudents[0].email}`);

    await client.close();
}

main().catch(console.error);
