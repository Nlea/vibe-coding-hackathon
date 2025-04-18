import { html } from 'hono/html'

export default function RegisterTemplate({ error }: { error?: string }) {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Register - VinylVault</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: #f5f5f5;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
          }
          .container {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
          }
          h1 {
            margin: 0 0 1.5rem;
            color: #333;
            text-align: center;
          }
          .form-group {
            margin-bottom: 1rem;
          }
          label {
            display: block;
            margin-bottom: 0.5rem;
            color: #555;
          }
          input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
          }
          button {
            width: 100%;
            padding: 0.75rem;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            cursor: pointer;
          }
          button:hover {
            background: #45a049;
          }
          .error {
            color: #f44336;
            margin-bottom: 1rem;
            text-align: center;
          }
          .login-link {
            text-align: center;
            margin-top: 1rem;
          }
          .login-link a {
            color: #2196F3;
            text-decoration: none;
          }
          .login-link a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Create Account</h1>
          ${error ? `<div class="error">${error}</div>` : ''}
          <form action="/auth/register" method="POST">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" required minlength="8">
            </div>
            <button type="submit">Register</button>
          </form>
          <div class="login-link">
            <p>Already have an account? <a href="/auth/login">Login</a></p>
          </div>
        </div>
      </body>
    </html>
  `
}
