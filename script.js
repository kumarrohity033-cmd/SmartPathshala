document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password, role }),
                });

                // Check if the server responded with a success status (e.g., 200 OK)
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Invalid credentials or server error.' }));
                    throw new Error(errorData.message);
                }

                const data = await response.json();

                if (data.success) {
                    if (role === 'principal') {
                        window.location.href = 'principal.html';
                    } else if (role === 'teacher') {
                        window.location.href = 'teacher.html';
                    }
                } else {
                    // This might be redundant if the server uses HTTP status codes correctly
                    alert(data.message || 'Invalid login credentials');
                }
            } catch (error) {
                console.error('Login failed:', error);
                alert(`Login failed: ${error.message}`);
            }
        });
    }
});



