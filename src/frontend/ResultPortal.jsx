import React, { useState, useEffect } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Row, ProgressBar } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  FaTrophy, 
  FaChartLine, 
  FaClock, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaArrowLeft, 
  FaGraduationCap,
  FaUserGraduate,
  FaAward,
  FaChartBar,
  FaBook,
  FaHome,
  FaRocket,
  FaCertificate,
  FaMedal,
  FaChartPie,
  FaClipboardCheck,
  FaHourglassHalf,
  FaUser,
  FaStar,
  FaCheck
} from 'react-icons/fa'
import './ResultPortal.css'

// Enhanced chart components with animations
const ScoreChart = ({ score, total, label, color }) => {
  const percentage = (score / total) * 100
  return (
    <div className="result-chart-item">
      <h6 className="result-chart-label">{label}</h6>
      <div className="result-chart-container">
        <div className="result-chart-circle">
          <div className="result-chart-fill" style={{ 
            background: `conic-gradient(${color} ${percentage}% 0%, ${color} 100%)`,
            transform: `rotate(-90deg)`
          }}></div>
          <div className="result-chart-center">
            <span className="result-chart-percentage">{Math.round(percentage)}%</span>
            <span className="result-chart-score">{score}/{total}</span>
          </div>
        </div>
      </div>
      <div className="result-chart-status">
        {percentage >= 75 && <span className="result-status-excellent"><FaStar className="me-1" /> Excellent</span>}
        {percentage >= 50 && percentage < 75 && <span className="result-status-good"><FaCheck className="me-1" /> Good</span>}
        {percentage >= 35 && percentage < 50 && <span className="result-status-average"><FaChartBar className="me-1" /> Average</span>}
        {percentage < 35 && <span className="result-status-poor"><FaUser className="me-1" /> Keep Trying</span>}
      </div>
    </div>
  )
}

const PerformanceMeter = ({ score, total }) => {
  const percentage = (score / total) * 100
  const getColor = (percent) => {
    if (percent >= 80) return '#10b981' // Excellent - Green
    if (percent >= 60) return '#F4780A' // Good - Orange  
    if (percent >= 40) return '#ef4444' // Average - Yellow
    return '#ef4444' // Poor - Red
  }
  
  const getEmoji = (percent) => {
    if (percent >= 80) return <FaGraduationCap />
    if (percent >= 60) return <FaAward />
    if (percent >= 40) return <FaStar />
    return <FaUser />
  }
  
  return (
    <div className="result-performance-meter">
      <h6 className="result-meter-title">
        {getEmoji(percentage)} Overall Performance
      </h6>
      <div className="result-meter-container">
        <div className="result-meter-track">
          <div 
            className="result-meter-fill" 
            style={{ 
              width: `${percentage}%`,
              backgroundColor: getColor(percentage)
            }}
          ></div>
        </div>
        <div className="result-meter-labels">
          <span className="result-meter-score">{score}/{total}</span>
          <span className="result-meter-percentage">{Math.round(percentage)}%</span>
        </div>
      </div>
      <div className="result-meter-grade">
        {percentage >= 80 && <span className="result-grade-excellent">🎯 Excellent Performance!</span>}
        {percentage >= 60 && percentage < 80 && <span className="result-grade-good">👍 Good Job!</span>}
        {percentage >= 40 && percentage < 60 && <span className="result-grade-average">📈 Average Score</span>}
        {percentage < 40 && <span className="result-grade-poor">💪 Room for Improvement</span>}
      </div>
    </div>
  )
}

function ResultPortal() {
  const location = useLocation()
  const navigate = useNavigate()
  const result = location.state
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Send email notification
  const sendEmailNotification = async () => {
    try {
      const recipientEmail = (result.email || user.email || '').trim()
      if (!recipientEmail) {
        console.error('No user email found for result notification')
        return
      }

      const emailData = {
        to: recipientEmail,
        subject: result.pass ? 'Congratulations! You Passed Aptitude Test' : 'Test Results - Keep Learning!',
        message: result.pass 
          ? `Congratulations! You have successfully passed the aptitude test.

You are eligible for the next round, which is the coding round.

The coding round will contain 30 questions and the duration will be 30 minutes.

We will contact you soon with further details.`
          : `Thank you for taking the aptitude test.

Don't worry. This is a learning opportunity.

Review your weak areas and come back with better preparation.`
      }
      const endpoints = ['/api/send-result-email', '/api/auth/send-result-email']
      let lastError = ''

      for (const endpoint of endpoints) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData)
        })

        if (response.ok) {
          console.log(`Email sent successfully via ${endpoint}`)
          return
        }

        const errorBody = await response.text()
        lastError = `${endpoint} -> ${response.status} ${response.statusText} ${errorBody}`
      }

      console.error('Failed to send result email:', lastError)
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  // Send email when component mounts
  React.useEffect(() => {
    if (result) {
      sendEmailNotification()
    }
  }, [result])

  if (!result) {
    return (
      <div className="result-portal-wrapper">     <Container className="result-portal-container">
          <Alert variant="warning" className="result-alert">
            Result not available. Please complete test first.
          </Alert>
          <Button onClick={() => navigate('/test-instructions')} className="result-action-btn">Go to Test Instructions</Button>
        </Container>     </div>
    )
  }

  return (
    <div className="result-portal-wrapper" style={{
      minHeight: '100vh',
      background: '#ffffff',
     
      flexDirection: 'column',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      <Container className="result-portal-container" style={{
      
        width: '100%',
        // display: 'flex',
        alignItems: 'center',
        // padding: '2rem',
      
        maxWidth: 'none'
      }}>
        <Row className="justify-content-center">
          <Col lg={12}>
            <Card className="result-portal-card shadow-lg" style={{
              border: 'none',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #091e3e 0%, #1e3a5f 100%)',
              color: 'white',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              width: '100%',
              margin: 0
            }}>
              <Card.Body className="result-portal-body">
                <div className="result-portal-header">
                  <h3 className="result-portal-title">
                    <FaGraduationCap className="me-2" />
                    Test Results Dashboard
                  </h3>
                  <Badge bg={result.pass ? 'success' : 'danger'} className="result-portal-badge">
                    {result.pass ? '✅ PASSED' : '⚠️ FAILED'}
                  </Badge>
                </div>

                {/* Success/Failure Message */}
                <div className="result-portal-message">
                  {result.pass ? (
                    <div className="result-portal-success">
                      <h4 className="result-message-title">
                        <FaCheckCircle className="me-2" />
                        Congratulations!
                      </h4>
                      <p className="result-message-text">You have successfully passed the aptitude test. Your performance shows strong analytical and reasoning skills.</p>
                      <p className="result-message-highlight">You are eligible for the second round which is the technical round.</p>
                    </div>
                  ) : (
                    <div className="result-portal-failure">
                      <h4 className="result-message-title">
                        <FaUser className="me-2" />
                        Keep Learning!
                      </h4>
                      <p className="result-message-text">Don't worry! This is a learning opportunity. Review your weak areas and try again with better preparation.</p>
                    </div>
                  )}
                </div>

                {/* Performance Overview */}
                <div className="result-portal-performance">
                  <PerformanceMeter score={result.totalScore} total={result.totalQuestions} />
                </div>

                {/* Section-wise Results */}
                <div className="result-portal-sections">
                  <h5 className="result-sections-title">
                    <FaChartBar className="me-2" />
                    Section Performance
                  </h5>
                  <div className="result-charts-grid">
                    {result.sectionResults.map((section) => (
                      <ScoreChart 
                        key={section.section}
                        score={section.score}
                        total={section.total}
                        label={section.section}
                        color={section.score >= 15 ? '#10b981' : '#F4780A'}
                      />
                    ))}
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="result-portal-stats">
                  <Row>
                    <Col md={4}>
                      <Card className="result-stat-card">
                        <Card.Body className="text-center">
                          <FaTrophy className="result-stat-icon" />
                          <h6 className="result-stat-title">Total Score</h6>
                          <div className="result-stat-value">{result.totalScore}</div>
                          <div className="result-stat-max">out of {result.totalQuestions}</div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="result-stat-card">
                        <Card.Body className="text-center">
                          <FaCheckCircle className="result-stat-icon" />
                          <h6 className="result-stat-title">Questions Answered</h6>
                          <div className="result-stat-value">{result.totalAnswered}</div>
                          <div className="result-stat-max">out of {result.totalQuestions}</div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="result-stat-card">
                        <Card.Body className="text-center">
                          <FaClock className="result-stat-icon" />
                          <h6 className="result-stat-title">Time Taken</h6>
                          <div className="result-stat-value">
                            {result.totalTimeMinutes || Math.floor((result.totalTimeTaken || 0) / 60)}:{String(result.totalTimeSeconds || ((result.totalTimeTaken || 0) % 60)).padStart(2, '0')}
                          </div>
                          <div className="result-stat-max">minutes</div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>

                {/* Action Buttons */}
                <div className="result-portal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  {result.pass && (
                    <Button variant="warning" size="sm" onClick={() => navigate('/technical-test-relaxation')} className="result-action-btn-compact">
                      <FaRocket className="me-2" />
                      Technical Test
                    </Button>
                  )}
                  <Button variant="success" size="sm" onClick={() => navigate('/')} className="result-action-btn-compact">
                    <FaHome className="me-2" />
                    Dashboard
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>\r\n    </div>
  )
}

export default ResultPortal
