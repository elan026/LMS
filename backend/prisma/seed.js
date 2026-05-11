import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

const uri = "mongodb://root:root@ac-feso6cw-shard-00-00.idrpxvm.mongodb.net:27017,ac-feso6cw-shard-00-01.idrpxvm.mongodb.net:27017,ac-feso6cw-shard-00-02.idrpxvm.mongodb.net:27017/lms?ssl=true&replicaSet=atlas-12snz8-shard-0&authSource=admin&appName=Cluster0";

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
    console.log('Connected!');
    const db = client.db('lms');

    console.log('Clearing existing collections...');
    await Promise.all([
        db.collection('Grade').deleteMany({}),
        db.collection('Attendance').deleteMany({}),
        db.collection('Enrollment').deleteMany({}),
        db.collection('Assignment').deleteMany({}),
        db.collection('Announcement').deleteMany({}),
        db.collection('Course').deleteMany({}),
        db.collection('User').deleteMany({})
    ]);

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
    console.log('Creating faculty...');
    const createdFaculty = [];
    const facultyDocs = [];

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
        facultyDocs.push(fac);
        createdFaculty.push(fac);
    }

    // 3. Generate Fake Faculty
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
        facultyDocs.push(fac);
        createdFaculty.push(fac);
    }
    await db.collection('User').insertMany(facultyDocs);
    console.log(`Created ${createdFaculty.length} faculty`);

    // 4. Generate Students (bulk)
    console.log('Generating students...');
    const createdStudents = [];
    const studentDocs = [];
    for (let i = 0; i < 100; i++) {
        const stu = {
            _id: new ObjectId(),
            name: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            password_hash: defaultPassword,
            role: 'STUDENT',
            createdAt: now,
            updatedAt: now
        };
        studentDocs.push(stu);
        createdStudents.push(stu);
    }
    await db.collection('User').insertMany(studentDocs);
    console.log(`Created ${createdStudents.length} students`);

    // 5. Create Courses (bulk)
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
    await db.collection('Course').insertMany(createdCourses);
    console.log(`Created ${createdCourses.length} courses`);

    // 6. Bulk insert Assignments, Enrollments, Grades, Attendance
    console.log('Simulating enrollments, grades, attendance, assignments...');

    const allAssignments = [];
    const allEnrollments = [];
    const allGrades = [];
    const allAttendance = [];
    const allAnnouncements = [];

    for (const course of createdCourses) {
        // Assignments
        allAssignments.push(
            { _id: new ObjectId(), title: 'Midterm Project', dueDate: faker.date.future(), maxScore: 100, courseId: course._id, createdAt: now, updatedAt: now },
            { _id: new ObjectId(), title: 'Final Exam', dueDate: faker.date.future(), maxScore: 100, courseId: course._id, createdAt: now, updatedAt: now }
        );

        // Enroll students
        const shuffled = [...createdStudents].sort(() => 0.5 - Math.random());
        const enrolled = shuffled.slice(0, faker.number.int({ min: 20, max: 40 }));

        for (const stu of enrolled) {
            allEnrollments.push({
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

                allGrades.push({
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
                allAttendance.push({
                    _id: new ObjectId(),
                    studentId: stu._id,
                    courseId: course._id,
                    date,
                    status: faker.helpers.arrayElement(['PRESENT', 'PRESENT', 'PRESENT', 'ABSENT', 'LATE']),
                    createdAt: now, updatedAt: now
                });
            }
        }

        allAnnouncements.push({
            _id: new ObjectId(),
            title: `Welcome to ${course.title}`,
            content: faker.lorem.paragraph(),
            courseId: course._id,
            createdBy: course.instructorId,
            createdAt: now, updatedAt: now
        });
    }

    allAnnouncements.push({
        _id: new ObjectId(),
        title: "System Maintenance Scheduled",
        content: "The LMS will be down for maintenance this weekend.",
        courseId: null,
        createdBy: admin._id,
        createdAt: now, updatedAt: now
    });

    // Bulk insert all at once
    console.log('Inserting all data to Atlas...');
    await Promise.all([
        db.collection('Assignment').insertMany(allAssignments),
        db.collection('Enrollment').insertMany(allEnrollments),
        db.collection('Grade').insertMany(allGrades),
        db.collection('Attendance').insertMany(allAttendance),
        db.collection('Announcement').insertMany(allAnnouncements),
    ]);

    console.log('\nSeed completed successfully!');
    console.log(`Assignments: ${allAssignments.length}`);
    console.log(`Enrollments: ${allEnrollments.length}`);
    console.log(`Grades: ${allGrades.length}`);
    console.log(`Attendance: ${allAttendance.length}`);
    console.log(`\n--- LOGIN ACCOUNTS (Password for all: 'password123') ---`);
    console.log(`Admin:   admin@lms.com`);
    console.log(`Faculty: ${createdFaculty[0].email}`);
    console.log(`Student: ${createdStudents[0].email}`);

    await client.close();
}

main().catch(console.error);