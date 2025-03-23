import React, { useState } from 'react'
import AdminPanel from '../components/AdminPanel'

const Admin = () => {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === 'YOUR_ADMIN_PASSWORD') {
      setAuthenticated(true)
    } else {
      alert('Incorrect password')
    }
  }

  return authenticated ? (
    <AdminPanel />
  ) : (
    <form onSubmit={handleLogin}>
      <input
        type="password"
        placeholder="Enter Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  )
}

export default Admin