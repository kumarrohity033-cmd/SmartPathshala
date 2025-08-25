const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'school_management'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password, role } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ? AND role = ?';
    db.query(sql, [username, password, role], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    });
});

// Get all students
app.get('/api/students', (req, res) => {
    const sql = 'SELECT * FROM students';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Add a student
app.post('/api/students', (req, res) => {
    const newStudent = req.body;
    const sql = 'INSERT INTO students SET ?';
    db.query(sql, newStudent, (err, result) => {
        if (err) throw err;
        res.json({ success: true, id: result.insertId });
    });
});

// Update a student
app.put('/api/students/:id', (req, res) => {
    const updatedStudent = req.body;
    const sql = 'UPDATE students SET ? WHERE id = ?';
    db.query(sql, [updatedStudent, req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

// Delete a student
app.delete('/api/students/:id', (req, res) => {
    const sql = 'DELETE FROM students WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

// Get attendance
app.get('/api/attendance', (req, res) => {
    const { date } = req.query;
    const sql = 'SELECT * FROM attendance WHERE attendance_date = ?';
    db.query(sql, [date], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Save attendance
app.post('/api/attendance', (req, res) => {
    const attendanceData = req.body;
    const sql = 'INSERT INTO attendance (student_id, attendance_date, status, reason) VALUES ?';
    const values = attendanceData.map(item => [item.student_id, item.date, item.status, item.reason]);
    db.query(sql, [values], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

// Get test marks
app.get('/api/tests', (req, res) => {
    const sql = 'SELECT * FROM tests';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Save test marks
app.post('/api/tests', (req, res) => {
    const testData = req.body;
    const sql = 'INSERT INTO tests (student_id, subject, marks, test_date) VALUES ?';
    const values = testData.map(item => [item.student_id, item.subject, item.marks, item.date]);
    db.query(sql, [values], (err, result) => {
        if (err) throw err;
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
