import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Use environment variable with fallback to the deployed backend
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://test-backend-deploy-homh.onrender.com'

function App() {
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
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      })

      if (response.ok) {
        try {
          const data = await response.json()
          setResponseMessage(data.message || 'Data submitted successfully')
          setName('')
          setEmail('')
          setMessage('')
        } catch (jsonError) {
          // If JSON parsing fails, still consider it a success
          setResponseMessage('Data submitted successfully')
          setName('')
          setEmail('')
          setMessage('')
        }
      } else {
        setErrorMessage(`Failed to send data: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      setErrorMessage('Error: ' + error.message)
    }
    setLoading(false)
  }

  const handleGetRequest = async () => {
    setGetResponse('')
    try {
      // Add credentials and headers to the fetch request
      const response = await fetch(`${backendUrl}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Don't use 'no-cors' mode as it will make the response opaque
        // and you won't be able to read the response body
      })

      if (response.ok) {
        try {
          const data = await response.json()
          setGetResponse(JSON.stringify(data, null, 2))
        } catch (jsonError) {
          // If JSON parsing fails, try to get text
          const text = await response.text()
          setGetResponse(text)
        }
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
