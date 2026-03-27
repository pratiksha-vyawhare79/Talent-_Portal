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
  FaMedal,
  FaCertificate,
  FaLaptopCode,
  FaUser
} from 'react-icons/fa'
import Header from './components/Header'
import Footer from './components/Footer'
import './TechnicalResult.css'
import './TechnicalResultCodingRound.css'

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch (error) {
    console.error('Failed to parse stored user:', error)
    return {}
  }
}

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
        {percentage >= 75 && <span className="result-status-excellent">🌟 Excellent</span>}
        {percentage >= 50 && percentage < 75 && <span className="result-status-good">👍 Good</span>}
        {percentage >= 35 && percentage < 50 && <span className="result-status-average">📈 Average</span>}
        {percentage < 35 && <span className="result-status-poor">💪 Keep Trying</span>}
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
  
  const getIcon = (percent) => {
    if (percent >= 80) return <FaMedal className="result-performance-icon" />
    if (percent >= 60) return <FaAward className="result-performance-icon" />
    if (percent >= 40) return <FaTrophy className="result-performance-icon" />
    return <FaGraduationCap className="result-performance-icon" />
  }
  
  return (
    <div className="result-performance-meter">
      <h6 className="result-meter-title">
        {getIcon(percentage)} Technical Assessment Performance
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
        {percentage >= 80 && <span className="result-grade-excellent">🎯 Outstanding Technical Performance!</span>}
        {percentage >= 60 && percentage < 80 && <span className="result-grade-good">👍 Strong Technical Skills!</span>}
        {percentage >= 40 && percentage < 60 && <span className="result-grade-average">📈 Developing Technical Competence</span>}
        {percentage < 40 && <span className="result-grade-poor">💪 Technical Skills Enhancement Needed</span>}
      </div>
    </div>
  )
}

function TechnicalResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const storedResult = (() => {
    try {
      return JSON.parse(localStorage.getItem('technicalTestResult') || 'null')
    } catch (error) {
      console.error('Failed to parse cached technical test result:', error)
      return null
    }
  })()
  const results = location.state || storedResult
  const user = readStoredUser()

  const hasResultData = results && (
    (results.sections && Object.keys(results.sections).length > 0) ||
    (results.totalStats && results.totalStats.total > 0)
  )

  if (!hasResultData) {
    return (
      <div className="result-portal-wrapper">     <Container className="result-portal-container">
          <Alert variant="warning" className="result-alert">
            Result not available. Please complete technical test first.
          </Alert>
          <Button onClick={() => navigate('/technical-test-relaxation')} className="result-action-btn">Go to Technical Test</Button>
        </Container>     </div>
    )
  }

  // Calculate result data like AptitudeResult
  const calculateResultData = () => {
    const allSections = Object.values(results.sections || {})
    const totalQuestions = allSections.reduce((sum, section) => sum + (section.total || 0), 0)
    const totalCorrect = allSections.reduce((sum, section) => sum + (section.correct || 0), 0)
    const totalAnswered = allSections.reduce((sum, section) => sum + Object.keys(section.answers || {}).length, 0)
    const percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    const passed = percentage >= 50

    // Calculate actual time taken
    const timeTaken = results.timeTaken || 1800 // Default to 30 minutes if not available
    const timeTakenMinutes = Math.floor(timeTaken / 60)
    const timeTakenSeconds = timeTaken % 60

    // Create section results like AptitudeResult
    const sectionResults = Object.entries(results.sections || {}).map(([key, section]) => ({
      section: section.sectionTitle || key,
      score: section.correct || 0,
      total: section.total || 0,
      percentage: section.percentage || 0
    }))

    // If no sections, create a default technical section
    if (sectionResults.length === 0 && totalQuestions > 0) {
      sectionResults.push({
        section: "Technical Assessment",
        score: totalCorrect,
        total: totalQuestions,
        percentage: percentage
      })
    }

    return {
      pass: passed,
      totalScore: totalCorrect,
      totalQuestions: totalQuestions,
      totalAnswered: totalAnswered,
      totalTimeTaken: timeTaken,
      totalTimeMinutes: timeTakenMinutes,
      totalTimeSeconds: timeTakenSeconds,
      sectionResults: sectionResults
    }
  }

  const result = calculateResultData()

  // Save technical test result to database
  const saveTechnicalTestResult = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const fallbackEmail = location?.state?.email || location?.state?.user?.email || ''
      const resultEmail = results?.email || results?.candidateEmail || results?.user?.email || ''
      const candidateEmail = (user.email || fallbackEmail || resultEmail || '').trim().toLowerCase()
      const resultName = results?.candidateName || results?.user?.name || ''
      const candidateName = (
        (`${user.firstName || ''} ${user.lastName || ''}`.trim()) ||
        (resultName || '').trim()
      ) || 'Unknown'
      const overallPercentage = result.totalQuestions > 0
        ? Math.round((result.totalScore / result.totalQuestions) * 100)
        : 0

      // Extract section data from results
      let sectionScore = 0
      let sectionTotal = 0
      let sectionPercentage = 0
      
      if (results.sections && Object.keys(results.sections).length > 0) {
        const firstSection = Object.values(results.sections)[0]
        sectionScore = firstSection.correct || 0
        sectionTotal = firstSection.total || 0
        sectionPercentage = firstSection.percentage || 0
      }

      const resultData = {
        candidateEmail,
        candidateName,
        totalQuestions: result.totalQuestions,
        totalCorrect: result.totalScore,
        totalAnswered: result.totalAnswered,
        percentageScore: overallPercentage,
        timeTakenSeconds: result.totalTimeTaken,
        passed: overallPercentage >= 50,
        sectionData: JSON.stringify(results.sections || {}),
        technicalSectionScore: sectionScore,
        technicalSectionTotal: sectionTotal,
        technicalSectionPercentage: sectionPercentage
      }

      console.log('Saving technical test result:', resultData)

      const response = await fetch('/api/technical-test-results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData)
      })

      const responseData = await response.json()
      
      if (responseData.success) {
        console.log('Technical test result saved successfully:', responseData)
        localStorage.removeItem('technicalTestResult')
      } else {
        console.error('Failed to save technical test result:', responseData.message)
        console.error('Save response payload:', responseData)
      }
    } catch (error) {
      console.error('Error saving technical test result:', error)
    }
  }

  // Save result when component loads
  useEffect(() => {
    if (result && Object.keys(result).length > 0) {
      saveTechnicalTestResult()
    }
  }, [])

  useEffect(() => {
    if (!result.pass) return

    const storedUser = readStoredUser()
    const codingRoundData = {
      ...storedUser,
      technicalTestPassed: true,
      technicalTestScore: result.totalScore,
      technicalTestDate: new Date().toISOString(),
      eligibleForCodingRound: true
    }

    localStorage.setItem('codingRoundEligibility', JSON.stringify(codingRoundData))
  }, [result.pass, result.totalScore])

  // Handle Go for Coding Round
  const handleGoForCodingRound = () => {
    // Store coding round eligibility
    const user = readStoredUser()
    const codingRoundData = {
      ...user,
      technicalTestPassed: true,
      technicalTestScore: result.totalScore,
      technicalTestDate: new Date().toISOString(),
      eligibleForCodingRound: true
    }
    localStorage.setItem('codingRoundEligibility', JSON.stringify(codingRoundData))
    
    // Navigate directly to coding test relaxation page (no confirmation popup)
    navigate('/coding-test-relaxation')
  }

  return (
    <div className="result-portal-wrapper" style={{
      minHeight: '100vh',
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      margin: 0,
      padding: 0
    }}>
      <Container className="result-portal-container" style={{
        
        width: '100%',
        // display: 'flex',
        alignItems: 'center',
        padding: '2rem',
       
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
                    Technical Test Results Dashboard
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
                      <p className="result-message-text">You have successfully passed technical test. Your performance shows strong technical skills and problem-solving abilities.</p>
                      <p className="result-message-highlight">You have demonstrated excellent technical knowledge and practical skills.</p>
                      <div className="coding-eligibility-badge">
                        Eligible for Coding Round 🚀
                      </div>
                    </div>
                  ) : (
                    <div className="result-portal-failure">
                      <h4 className="result-message-title">
                        <FaUser className="me-2" />
                        Keep Learning!
                      </h4>
                      <p className="result-message-text">Don't worry! This is a learning opportunity. Review your weak areas and try again with better preparation.</p>
                      <p className="result-message-highlight">Focus on strengthening your technical fundamentals and practical skills.</p>
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
                    {result.sectionResults && result.sectionResults.length > 0 ? (
                      result.sectionResults.map((section) => (
                        <ScoreChart 
                          key={section.section}
                          score={section.score}
                          total={section.total}
                          label={section.section}
                          color={section.score >= (section.total * 0.5) ? '#10b981' : '#F4780A'}
                        />
                      ))
                    ) : (
                      <div className="text-center p-4">
                        <p className="text-muted">No section data available</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="result-portal-stats">
                  <Row>
                    <Col md={4}>
                      <Card className="result-stat-card">
                        <Card.Body className="text-center">
                          <div className="result-stat-icon"><FaLaptopCode /></div>
                          <h6 className="result-stat-title">Technical Score</h6>
                          <div className="result-stat-value">{result.totalScore}</div>
                          <div className="result-stat-max">out of {result.totalQuestions}</div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="result-stat-card">
                        <Card.Body className="text-center">
                          <div className="result-stat-icon"><FaCheckCircle /></div>
                          <h6 className="result-stat-title">Questions Completed</h6>
                          <div className="result-stat-value">{result.totalAnswered}</div>
                          <div className="result-stat-max">out of {result.totalQuestions}</div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="result-stat-card">
                        <Card.Body className="text-center">
                          <div className="result-stat-icon"><FaClock /></div>
                          <h6 className="result-stat-title">Assessment Duration</h6>
                          <div className="result-stat-value">
                            {result.totalTimeMinutes}:{String(result.totalTimeSeconds).padStart(2, '0')}
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
                    <Button 
                      variant="warning" 
                      size="sm" 
                      onClick={() => handleGoForCodingRound()} 
                      className="result-action-btn-compact"
                    >
                      <FaRocket className="me-2" />
                      Go for Coding Round
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
      </Container>
    </div>
  )
}

export default TechnicalResult
