import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Use environment variable with fallback to localhost
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [responseMessage, setResponseMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [getResponse, setGetResponse] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponseMessage('')
    setErrorMessage('')
    try {
      const response = await fetch(`${backendUrl}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      })
      if (response.ok) {
        const data = await response.json()
        setResponseMessage(data.message)
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setErrorMessage('Failed to send data')
      }
    } catch (error) {
      setErrorMessage('Error: ' + error.message)
    }
    setLoading(false)
  }

  const handleGetRequest = async () => {
    setGetResponse('')
    try {
      const response = await fetch(`${backendUrl}/`)
      if (response.ok) {
        const data = await response.json()
        setGetResponse(JSON.stringify(data, null, 2))
      } else {
        setGetResponse('Failed to fetch: ' + response.status)
      }
    } catch (error) {
      setGetResponse('Error: ' + error.message)
    }
  }

  // Check backend connection on component mount
  useEffect(() => {
    handleGetRequest()
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <h2>Contact Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label><br />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label><br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Message:</label><br />
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      {responseMessage && <p style={{ color: 'green' }}>{responseMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <h2>Backend Connection Status</h2>
      <button onClick={handleGetRequest}>Refresh Connection Status</button>
      {getResponse && (
        <pre style={{
          textAlign: 'left',
          background: '#f0f0f0',
          padding: '10px',
          borderRadius: '5px',
          maxWidth: '400px',
          margin: '10px auto'
        }}>
          {getResponse}
        </pre>
      )}
    </>
  )
}

export default App;
