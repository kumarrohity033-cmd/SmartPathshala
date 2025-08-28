// This is a serverless function that will run on Vercel's servers.
// It will handle the login logic.

export default function handler(request, response) {
  // 1. Make sure we are only handling POST requests from your form.
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests are allowed' });
  }

  // 2. Get the username, password, and role from the frontend.
  const { username, password, role } = request.body;

  // --- 3. This is where you define your ID and Password logic ---
  // For a real application, you would check these against a database.
  // For now, we will use hardcoded values as an example.

  // A more scalable way to store users. You can add more users here.
  const users = [
    { id: 'principal01', pass: 'princi@123', role: 'principal' },
    { id: 'teacher01', pass: 'teach@123', role: 'teacher' },
    { id: 'teacher02', pass: 'newteach@456', role: 'teacher' },
    { id: 'harsh', pass: 'harsh@789', role: 'teacher' }
  ];

  // Find a user that matches all the provided credentials (username, password, and role)
  const foundUser = users.find(user =>
    user.id === username &&
    user.pass === password &&
    user.role === role
  );

  // 4. Respond based on whether the login was successful.
  if (foundUser) {
    return response.status(200).json({ success: true, message: 'Login successful!' });
  } else {
    return response.status(401).json({ success: false, message: 'Invalid username, password, or role.' });
  }
}