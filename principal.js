document.addEventListener('DOMContentLoaded', () => {
    const addStudentBtn = document.getElementById('add-student-btn');
    const studentModal = document.getElementById('student-modal');
    const closeModal = document.querySelector('.close');
    const studentForm = document.getElementById('student-form');
    const studentsTableBody = document.querySelector('#students-table tbody');
    const totalStudents = document.getElementById('total-students');
    const modalTitle = document.getElementById('modal-title');

    let students = [];
    let editingStudentId = null;

    const fetchStudents = async () => {
        const response = await fetch('/api/students');
        students = await response.json();
        renderStudents();
    };

    const renderStudents = () => {
        studentsTableBody.innerHTML = '';
        students.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.roll_no}</td>
                <td>${student.name}</td>
                <td>${student.gender}</td>
                <td>${student.father_name}</td>
                <td>${student.mother_name}</td>
                <td>${student.address}</td>
                <td>
                    <button class="edit-btn" data-id="${student.id}">Edit</button>
                    <button class="delete-btn" data-id="${student.id}">Delete</button>
                </td>
            `;
            studentsTableBody.appendChild(row);
        });
        totalStudents.textContent = students.length;
    };

    const openModal = () => {
        studentModal.style.display = 'block';
    };

    const closeModalHandler = () => {
        studentModal.style.display = 'none';
        studentForm.reset();
        editingStudentId = null;
        modalTitle.textContent = 'Add Student';
    };

    addStudentBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalHandler);

    window.addEventListener('click', (e) => {
        if (e.target === studentModal) {
            closeModalHandler();
        }
    });

    studentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const studentData = {
            roll_no: document.getElementById('roll-no').value,
            name: document.getElementById('name').value,
            gender: document.getElementById('gender').value,
            father_name: document.getElementById('father-name').value,
            mother_name: document.getElementById('mother-name').value,
            address: document.getElementById('address').value,
        };

        if (editingStudentId) {
            await fetch(`/api/students/${editingStudentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData),
            });
        } else {
            await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData),
            });
        }

        fetchStudents();
        closeModalHandler();
    });

    studentsTableBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-btn')) {
            editingStudentId = parseInt(e.target.dataset.id);
            const student = students.find(s => s.id === editingStudentId);
            document.getElementById('roll-no').value = student.roll_no;
            document.getElementById('name').value = student.name;
            document.getElementById('gender').value = student.gender;
            document.getElementById('father-name').value = student.father_name;
            document.getElementById('mother-name').value = student.mother_name;
            document.getElementById('address').value = student.address;
            modalTitle.textContent = 'Edit Student';
            openModal();
        }

        if (e.target.classList.contains('delete-btn')) {
            const studentId = parseInt(e.target.dataset.id);
            await fetch(`/api/students/${studentId}`, { method: 'DELETE' });
            fetchStudents();
        }
    });

    fetchStudents();
});
