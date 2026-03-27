import React, { useState, useEffect } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Row, ProgressBar } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  FaRocket, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaHome,
  FaCode,
  FaLaptopCode,
  FaWifi,
  FaHourglassHalf,
  FaBrain,
  FaLightbulb
} from 'react-icons/fa'
import Header from './components/Header'
import Footer from './components/Footer'
import './TechnicalResultCodingRound.css'

const readStoredJson = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '{}')
  } catch (error) {
    console.error(`Failed to parse ${key}:`, error)
    return {}
  }
}

function CodingRound() {
  const navigate = useNavigate()
  const [showPrepTimer, setShowPrepTimer] = useState(false)
  const [prepTimeLeft, setPrepTimeLeft] = useState(300) // 5 minutes in seconds
  const [codingRoundStarted, setCodingRoundStarted] = useState(false)
  const location = useLocation()
  const user = readStoredJson('user')
  const codingEligibility = readStoredJson('codingRoundEligibility')

  // Check eligibility on component mount
  useEffect(() => {
    if (!codingEligibility.eligibleForCodingRound) {
      alert('❌ Not eligible for coding round!\n\nYou must pass the technical test first.')
      navigate('/technical-test-relaxation')
      return
    }

    // Start preparation timer automatically
    setShowPrepTimer(true)
    setPrepTimeLeft(300)
  }, [codingEligibility, navigate])

  // Preparation timer effect
  useEffect(() => {
    let interval = null
    
    if (showPrepTimer && prepTimeLeft > 0) {
      interval = setInterval(() => {
        setPrepTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setShowPrepTimer(false)
            // Auto-start coding round when timer ends
            setCodingRoundStarted(true)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [showPrepTimer, prepTimeLeft])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${String(secs).padStart(2, '0')}`
  }

  const handleStartCodingRound = () => {
    if (prepTimeLeft > 0) {
      const confirm = window.confirm(
        '⏰ Preparation time remaining!\n\n' +
        `You still have ${formatTime(prepTimeLeft)} of preparation time.\n\n` +
        'Are you sure you want to start the coding round now?'
      )
      if (!confirm) return
    }
    
    setShowPrepTimer(false)
    setCodingRoundStarted(true)
  }

  const handleCancelPrep = () => {
    const confirm = window.confirm(
      '❌ Cancel Preparation?\n\n' +
      'Are you sure you want to cancel the coding round preparation?\n\n' +
      'You can return later when you\'re ready.'
    )
    if (confirm) {
      navigate('/')
    }
  }

  if (!codingEligibility.eligibleForCodingRound) {
    return (
      <div className="result-wrap">
        <Header />
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>❌ Access Denied</Alert.Heading>
            <p>You must pass the technical test before accessing the coding round.</p>
            <Button variant="primary" onClick={() => navigate('/technical-test-relaxation')}>
              Take Technical Test
            </Button>
          </Alert>
        </Container>
        <Footer />
      </div>
    )
  }

  return (
    <div className="result-wrap">
      <Header />
      <Container className="result-container">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="result-card shadow-lg">
              <Card.Body className="p-4 p-md-5">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                  <h3 className="mb-0 result-title">🚀 Coding Round</h3>
                  <Badge bg="primary" className="result-badge-large">
                    <FaRocket className="me-2" />
                    PREPARATION
                  </Badge>
                </div>

                {/* Welcome Message */}
                <div className="success-message mb-4">
                  <h4 className="message-title">🎉 Welcome to the Coding Round!</h4>
                  <p className="message-text">
                    Congratulations on passing the technical test! Now it's time to showcase your programming skills and problem-solving abilities.
                  </p>
                  <p className="message-text" style={{ color: '#ffffff', fontWeight: '600', marginTop: '0.5rem' }}>
                    This round will test your coding proficiency and logical thinking through practical programming challenges.
                  </p>
                  <div className="coding-eligibility-badge">
                    Technical Test Passed ✅
                  </div>
                </div>

                {/* Preparation Timer */}
                {showPrepTimer && !codingRoundStarted && (
                  <div className="coding-prep-timer mb-4">
                    <Card className="timer-card">
                      <Card.Body className="text-center">
                        <h5 className="timer-title">🚀 Coding Round Preparation</h5>
                        <div className="timer-display">
                          <div className="timer-circle">
                            <div className="timer-value">
                              {formatTime(prepTimeLeft)}
                            </div>
                          </div>
                        </div>
                        <p className="timer-message">Get ready for your coding challenge!</p>
                        
                        <Row className="mt-4">
                          <Col md={6}>
                            <div className="prep-checklist">
                              <h6 className="checklist-title">📋 Preparation Checklist</h6>
                              <ul className="checklist-items">
                                <li><FaWifi className="me-2" /> Stable internet connection</li>
                                <li><FaLaptopCode className="me-2" /> Modern web browser</li>
                                <li><FaHourglassHalf className="me-2" /> 60-90 minutes available</li>
                                <li><FaBrain className="me-2" /> Ready to code!</li>
                              </ul>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="prep-tips">
                              <h6 className="tips-title">💡 Pro Tips</h6>
                              <ul className="tips-items">
                                <li>Read questions carefully</li>
                                <li>Plan before coding</li>
                                <li>Test your solutions</li>
                                <li>Manage your time</li>
                              </ul>
                            </div>
                          </Col>
                        </Row>

                        <div className="timer-actions mt-4">
                          <Button 
                            variant="success" 
                            size="lg" 
                            onClick={handleStartCodingRound}
                            className="me-3 coding-round-btn"
                          >
                            <FaCode className="me-2" />
                            Start Coding Round
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            onClick={handleCancelPrep}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                )}

                {/* Coding Round Started */}
                {codingRoundStarted && (
                  <div className="coding-round-started mb-4">
                    <Card className="coding-round-card">
                      <Card.Body className="text-center">
                        <h5 className="coding-title">🚀 Coding Round in Progress</h5>
                        <div className="coding-status">
                          <FaCode className="coding-icon" />
                          <p className="coding-message">
                            Your coding round is ready to begin!
                          </p>
                          <p className="coding-instructions">
                            The coding assessment platform will open in a new window.<br/>
                            Make sure you have everything prepared.
                          </p>
                          <div className="coding-actions mt-4">
                            <Button 
                              variant="success" 
                              size="lg"
                              onClick={() => alert('🚀 Coding Round Platform Coming Soon!\n\nThe actual coding assessment is being prepared.\n\nYou will receive an email with the coding round link shortly.\n\nGood luck! 🚀')}
                            >
                              <FaCode className="me-2" />
                              Open Coding Platform
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                )}

                {/* Technical Test Results Summary */}
                <div className="tech-summary mb-4">
                  <h5 className="summary-title">📊 Your Technical Test Performance</h5>
                  <Row>
                    <Col md={4}>
                      <Card className="summary-card">
                        <Card.Body className="text-center">
                          <div className="summary-icon"><FaLaptopCode /></div>
                          <h6 className="summary-title">Technical Score</h6>
                          <div className="summary-value">{codingEligibility.technicalTestScore || 0}</div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="summary-card">
                        <Card.Body className="text-center">
                          <div className="summary-icon"><FaCheckCircle /></div>
                          <h6 className="summary-title">Status</h6>
                          <div className="summary-value">✅ PASSED</div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="summary-card">
                        <Card.Body className="text-center">
                          <div className="summary-icon"><FaRocket /></div>
                          <h6 className="summary-title">Next Round</h6>
                          <div className="summary-value">🚀 CODING</div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 d-flex gap-2 flex-wrap justify-content-center">
                  <Button variant="outline-primary" size="sm" onClick={() => navigate('/')}>
                    <FaHome className="me-2" />
                    Dashboard
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  )
}

export default CodingRound
