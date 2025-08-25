CREATE DATABASE school_management;

USE school_management;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('principal', 'teacher') NOT NULL
);

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    gender VARCHAR(255) NOT NULL,
    father_name VARCHAR(255) NOT NULL,
    mother_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL
);

CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('Present', 'Absent') NOT NULL,
    reason VARCHAR(255),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

CREATE TABLE tests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    subject VARCHAR(255) NOT NULL,
    marks INT NOT NULL,
    test_date DATE NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Insert dummy data
INSERT INTO users (username, password, role) VALUES
('principal', 'principal123', 'principal'),
('teacher', 'teacher123', 'teacher');
