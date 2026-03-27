import { useState } from 'react'
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    education: '',
    college: '',
    year: '',
    skills: ''
  })
  
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/students/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        setSubmitted(true)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          education: '',
          college: '',
          year: '',
          skills: ''
        })
        
        // Add success animation
        document.querySelector('.registration-card')?.classList.add('form-success')
        setTimeout(() => {
          document.querySelector('.registration-card')?.classList.remove('form-success')
        }, 600)
      } else {
        alert('Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-wrapper">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">Build Your Career with Codeverge</h1>
              <p className="hero-subtitle">Join our elite talent community and unlock amazing opportunities</p>
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-number">15+</div>
                  <div className="stat-label">Active Students</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Partner Companies</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Success Rate</div>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title">Why Choose Codeverge?</h2>
            <p className="section-subtitle">Empowering talent with cutting-edge technology and opportunities</p>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3 className="feature-title">Career Growth</h3>
                <p className="feature-description">Accelerate your career with personalized learning paths and industry connections.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon">💡</div>
                <h3 className="feature-title">Skill Assessment</h3>
                <p className="feature-description">Comprehensive aptitude testing to identify your strengths and areas for improvement.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3 className="feature-title">Job Placement</h3>
                <p className="feature-description">Direct connections to top companies looking for talent like you.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Recruitment Process Section */}
      <section className="recruitment-section">
        <Container>
          <div className="section-header">
            <h2 className="section-title-black">Our Recruitment Process</h2>
            <p className="section-subtitle-black">Simple steps to join our talent network</p>
          </div>
          <Row className="g-4">
            <Col md={3}>
              <div className="process-step">
                <div className="step-number">1</div>
                <h3 className="step-title">Registration</h3>
                <p className="step-description">Create your profile and showcase your skills</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="process-step">
                <div className="step-number">2</div>
                <h3 className="step-title">Aptitude Test</h3>
                <p className="step-description">Take our comprehensive assessment test</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="process-step">
                <div className="step-number">3</div>
                <h3 className="step-title">Interview</h3>
                <p className="step-description">Connect with potential employers</p>
              </div>
            </Col>
            <Col md={3}>
              <div className="process-step">
                <div className="step-number">4</div>
                <h3 className="step-title">Placement</h3>
                <p className="step-description">Get placed in your dream company</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Registration Form */}
      <Container fluid className="py-5">
        <Row className="justify-content-center">
          <Col md={12} lg={10} xl={8}>
            <Card className="registration-card">
              <div className="card-header-custom">
                <h2 className="card-title-custom">Student Registration</h2>
                <p className="card-subtitle-custom">Start your journey with us today</p>
              </div>
              
              <Card.Body className="card-body-custom">
                {submitted && (
                  <Alert variant="success" className="success-alert mb-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <strong>Registration Successful!</strong><br />
                        We've received your application and will contact you soon.
                      </div>
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="form-row mb-4">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name <span className="required-indicator">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          placeholder="Enter your first name"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name <span className="required-indicator">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          placeholder="Enter your last name"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="form-row mb-4">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address <span className="required-indicator">*</span></Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="your.email@example.com"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number <span className="required-indicator">*</span></Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          placeholder="+1 (555) 123-4567"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="form-row mb-4">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Education Level <span className="required-indicator">*</span></Form.Label>
                        <Form.Select
                          name="education"
                          value={formData.education}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select education level</option>
                          <option value="Bachelors">Bachelor's Degree</option>
                          <option value="Masters">Master's Degree</option>
                          <option value="PhD">PhD</option>
                          <option value="Diploma">Diploma</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Year of Study <span className="required-indicator">*</span></Form.Label>
                        <Form.Select
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                          <option value="Graduated">Graduated</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="form-row mb-4">
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>College/University <span className="required-indicator">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="college"
                          value={formData.college}
                          onChange={handleChange}
                          required
                          placeholder="Enter your college/university name"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="form-row mb-4">
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Technical Skills</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="skills"
                          value={formData.skills}
                          onChange={handleChange}
                          className="textarea-custom"
                          rows={4}
                          placeholder="Tell us about your technical skills (e.g., Java, Python, React, JavaScript, SQL, etc.)"
                        />
                        <small className="help-text">
                          💡 Tip: List your strongest skills first
                        </small>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-center mt-4">
                    <Button 
                      variant="primary" 
                      type="submit" 
                      size="lg"
                      className="btn-register px-5"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="loading-spinner"></span>
                          Registering...
                        </>
                      ) : (
                        'Register Now'
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  )
}

export default App
