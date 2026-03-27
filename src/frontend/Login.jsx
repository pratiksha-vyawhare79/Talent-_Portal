import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaKey, FaArrowLeft } from 'react-icons/fa'
import './Login.css'
import { markTestCompleted } from './utils/testCompletion'

const Login = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState('email') // 'email' | 'otp' | 'success'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        setSuccess('OTP has been sent to your email address')
        setStep('otp')
      } else {
        setError(data.message || 'Failed to send OTP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const checkTestCompletionStatus = async (userEmail) => {
    try {
      // Check for aptitude test completion
      const aptitudeResponse = await fetch(`/api/aptitude-test-results/by-email/${userEmail}`)
      const aptitudeCompleted = aptitudeResponse.ok

      // Check for technical test completion
      const technicalResponse = await fetch(`/api/technical-test-results/by-email/${userEmail}`)
      const technicalCompleted = technicalResponse.ok

      // Check for coding test completion
      const codingResponse = await fetch(`/api/coding-test-results/by-email/${userEmail}`)
      const codingCompleted = codingResponse.ok

      console.log('Test completion status:', {
        aptitude: aptitudeCompleted,
        technical: technicalCompleted,
        coding: codingCompleted
      })

      // Determine redirect based on completed tests
      if (aptitudeCompleted && technicalCompleted && codingCompleted) {
        return '/all-tests-completed'
      } else if (aptitudeCompleted && technicalCompleted) {
        return '/technical-result'
      } else if (aptitudeCompleted) {
        return '/result'
      } else {
        return '/test-instructions'
      }
    } catch (error) {
      console.error('Error checking test completion:', error)
      return '/test-instructions' // Default fallback
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json().catch(() => ({}))

      if (response.ok) {
        setSuccess('Login successful! Checking your progress...')
        setStep('success')
        // Store user info in localStorage or context
        localStorage.setItem('user', JSON.stringify(data.user))
        
        // Check test completion status and redirect accordingly
        const userEmail = data.user.email
        const redirectPath = await checkTestCompletionStatus(userEmail)
        
        console.log('Redirecting to:', redirectPath)
        
        // Redirect to appropriate page after 2 seconds
        setTimeout(() => {
          navigate(redirectPath)
        }, 2000)
      } else {
        setError(data.message || 'Invalid OTP')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setStep('email')
    setOtp('')
    setError('')
    setSuccess('')
  }

  return (
    <div className="login-wrapper">
      <Container className="login-container">
        <Row className="justify-content-center w-100">
          <Col md={6} lg={5}>
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
                  <h2 className="login-title">
                    {step === 'email' && 'Sign In to Your Account'}
                    {step === 'otp' && 'Enter OTP'}
                    {step === 'success' && 'Login Successful!'}
                  </h2>
                  <p className="login-subtitle">
                    {step === 'email' && 'Enter your email to receive OTP'}
                    {step === 'otp' && `Check your email: ${email}`}
                    {step === 'success' && 'Welcome back to Codeverge Talent Portal'}
                  </p>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                {success && <Alert variant="success" className="mb-3">{success}</Alert>}

                {step === 'email' && (
                  <Form onSubmit={handleSendOTP}>
                    <Form.Group className="mb-4">
                      <div className="input-wrapper">
                        <FaEnvelope className="input-icon" />
                        <Form.Control
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
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
                          <span className="ms-2">Sending OTP...</span>
                        </>
                      ) : (
                        <>
                          <FaKey className="me-2" />
                          Send OTP
                        </>
                      )}
                    </Button>
                  </Form>
                )}

                {step === 'otp' && (
                  <Form onSubmit={handleVerifyOTP}>
                    <Form.Group className="mb-4">
                      <div className="input-wrapper">
                        <FaKey className="input-icon" />
                        <Form.Control
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                          required
                          className="form-input"
                        />
                      </div>
                    </Form.Group>

                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-secondary"
                        className="btn-back"
                        onClick={handleBack}
                        disabled={loading}
                      >
                        <FaArrowLeft className="me-2" />
                        Back
                      </Button>
                      
                      <Button
                        type="submit"
                        className="btn-verify flex-grow-1"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <Spinner as="span" animation="border" size="sm" />
                            <span className="ms-2">Verifying...</span>
                          </>
                        ) : (
                          <>
                            <FaKey className="me-2" />
                            Verify OTP
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                )}

                {step === 'success' && (
                  <div className="text-center">
                    <div className="success-icon mb-3">
                      <FaKey className="icon-success" />
                    </div>
                    <p className="success-message">
                      You have successfully logged in!
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
