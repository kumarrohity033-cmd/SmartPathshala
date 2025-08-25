document.addEventListener('DOMContentLoaded', () => {
    const attendanceTableBody = document.querySelector('#attendance-table tbody');
    const marksTableBody = document.querySelector('#marks-table tbody');
    const totalStudents = document.getElementById('total-students');
    const saveAttendanceBtn = document.getElementById('save-attendance');
    const saveMarksBtn = document.getElementById('save-marks');
    const downloadAttendancePdfBtn = document.getElementById('download-attendance-pdf');
    const downloadMarksPdfBtn = document.getElementById('download-marks-pdf');

    let students = [];

    const fetchStudents = async () => {
        const response = await fetch('/api/students');
        students = await response.json();
        totalStudents.textContent = students.length;
        renderAttendance();
        renderMarks();
    };

    const renderAttendance = () => {
        attendanceTableBody.innerHTML = '';
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.roll_no}</td>
                <td>${student.name}</td>
                <td>
                    <select class="attendance-status" data-id="${student.id}">
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                    </select>
                </td>
                <td>
                    <input type="text" class="reason" data-id="${student.id}" disabled>
                </td>
            `;
            attendanceTableBody.appendChild(row);
        });
    };

    const renderMarks = () => {
        marksTableBody.innerHTML = '';
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.roll_no}</td>
                <td>${student.name}</td>
                <td><input type="text" class="subject" data-id="${student.id}"></td>
                <td><input type="number" class="marks" data-id="${student.id}"></td>
            `;
            marksTableBody.appendChild(row);
        });
    };

    attendanceTableBody.addEventListener('change', (e) => {
        if (e.target.classList.contains('attendance-status')) {
            const reasonInput = e.target.parentElement.nextElementSibling.querySelector('.reason');
            reasonInput.disabled = e.target.value !== 'Absent';
        }
    });

    saveAttendanceBtn.addEventListener('click', async () => {
        const attendanceData = [];
        const rows = attendanceTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const studentId = row.querySelector('.attendance-status').dataset.id;
            const status = row.querySelector('.attendance-status').value;
            const reason = row.querySelector('.reason').value;
            attendanceData.push({
                student_id: studentId,
                date: new Date().toISOString().slice(0, 10),
                status,
                reason: status === 'Absent' ? reason : '',
            });
        });

        await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(attendanceData),
        });
        alert('Attendance saved!');
    });

    saveMarksBtn.addEventListener('click', async () => {
        const marksData = [];
        const rows = marksTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const studentId = row.querySelector('.subject').dataset.id;
            const subject = row.querySelector('.subject').value;
            const marks = row.querySelector('.marks').value;
            if (subject && marks) {
                marksData.push({
                    student_id: studentId,
                    subject,
                    marks,
                    date: new Date().toISOString().slice(0, 10),
                });
            }
        });

        await fetch('/api/tests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(marksData),
        });
        alert('Marks saved!');
    });

    downloadAttendancePdfBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.autoTable({ html: '#attendance-table' });
        doc.save('attendance_report.pdf');
    });

    downloadMarksPdfBtn.addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.autoTable({ html: '#marks-table' });
        doc.save('class_test_report.pdf');
    });

    fetchStudents();
});
