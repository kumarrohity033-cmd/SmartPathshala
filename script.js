document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, role }),
            });

            const data = await response.json();

            if (data.success) {
                if (role === 'principal') {
                    window.location.href = 'principal.html';
                } else if (role === 'teacher') {
                    window.location.href = 'teacher.html';
                }
            } else {
                alert('Invalid login credentials');
            }
        });
    }
});
