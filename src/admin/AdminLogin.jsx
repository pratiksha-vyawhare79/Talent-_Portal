import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaKey } from 'react-icons/fa'
import '../frontend/Login.css'

function AdminLogin() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Login successful! Redirecting...')
        
        // Store admin info in localStorage
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('adminUser', JSON.stringify(data.admin))
        
        // Redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          navigate('/admin/dashboard')
        }, 2000)
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <Container className="login-container">
        <Row className="justify-content-center w-100">
          <Col md={8} lg={6}>
            <Card className="login-card shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div className="login-logo mb-3">
                    <img 
                      src="/codeverge.svg" 
                      alt="Codeverge Logo" 
                      className="logo-image"
                    />
                  </div>
                  <h2 className="login-title">Admin Portal</h2>
                  <p className="login-subtitle">Talent Portal Administration</p>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                {success && <Alert variant="success" className="mb-3">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <div className="input-wrapper">
                      <FaEnvelope className="input-icon" />
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter admin email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="input-wrapper">
                      <FaKey className="input-icon" />
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="form-input"
                      />
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-login w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" />
                        <span className="ms-2">Signing in...</span>
                      </>
                    ) : (
                      <>
                        <FaKey className="me-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="register-link">
                    Secure admin access only
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AdminLogin
