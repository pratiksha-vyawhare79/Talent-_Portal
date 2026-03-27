import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Container, Card, Alert, ProgressBar } from 'react-bootstrap'
import {
  FaClock, 
  FaPlay, 
  FaArrowLeft,
  FaHourglassHalf,
  FaBrain,
  FaHeart,
  FaCoffee,
  FaLightbulb,
  FaCheckCircle,
  FaGraduationCap,
  FaRocket,
  FaCode
} from 'react-icons/fa'
import './TechnicalTestRelaxation.css'
import { enterFullscreen } from './utils/testSecurity'

const readCodingEligibility = () => {
  try {
    return JSON.parse(localStorage.getItem('codingRoundEligibility') || '{}')
  } catch (error) {
    console.error('Failed to parse coding round eligibility:', error)
    return {}
  }
}

const CodingTestRelaxation = () => {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes = 300 seconds
  const [isRelaxationComplete, setIsRelaxationComplete] = useState(false)

  useEffect(() => {
    // Check if user is eligible for coding round
    const codingEligibility = readCodingEligibility()
    if (!codingEligibility.eligibleForCodingRound) {
      alert('❌ Not eligible for coding round!\n\nYou must pass the technical test first.')
      navigate('/technical-test-relaxation')
      return
    }

    if (timeLeft <= 0) {
      setIsRelaxationComplete(true)
      // Don't auto-redirect, wait for user to click start button
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, navigate])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const startCodingTest = async () => {
    // Check eligibility again before starting coding test
    const codingEligibility = readCodingEligibility()
    if (!codingEligibility.eligibleForCodingRound) {
      alert('❌ Not eligible for coding round!\n\nYou must pass the technical test first.')
      navigate('/technical-test-relaxation')
      return
    }
    
    // Navigate to compatibility check page with coding test as next route
    await enterFullscreen()
    navigate('/compatibility-check', {
      state: {
        nextRoute: '/coding-test',
        backRoute: '/coding-test-relaxation'
      }
    })
  }

  const goBack = () => {
    navigate('/technical-result')
  }

  const progressPercentage = ((300 - timeLeft) / 300) * 100

  return (
    <div className="relaxation-page">
      <Container className="py-5">
        <div className="relaxation-container">
          <Card className="relaxation-card">
            <Card.Body className="text-center p-5">
              <div className="relaxation-header mb-4">
                <FaCode className="celebration-icon mb-3" />
                <h2 className="relaxation-title">
                  Congratulations! You Passed Technical Test!
                </h2>
                <p className="relaxation-subtitle">
                  <FaRocket className="me-2" />
                  Get ready for your Coding Round
                </p>
              </div>

              <Alert variant="info" className="mb-4">
                <FaHourglassHalf className="me-2" />
                Take a 5-minute relaxation break before starting coding test.
                This will help you perform better in the final round.
              </Alert>

              <div className="timer-section mb-4">
                <div className="timer-display">
                  <div className="timer-circle">
                    <div className="timer-text">{formatTime(timeLeft)}</div>
                  </div>
                </div>
                
                <div className="progress-section">
                  <ProgressBar 
                    now={progressPercentage} 
                    variant="info" 
                    className="relaxation-progress"
                  />
                  <p className="progress-text">
                    {isRelaxationComplete ? 'Relaxation Complete!' : 'Relaxation in Progress...'}
                  </p>
                </div>
              </div>

              <div className="action-buttons">
                <Button 
                  variant="secondary" 
                  onClick={goBack}
                  className="me-3 back-btn"
                >
                  <FaArrowLeft className="me-2" />
                  Back to Results
                </Button>
                
                {isRelaxationComplete && (
                  <div className="text-center">
                    <Alert variant="success" className="mb-3">
                      <FaRocket className="me-2" />
                      Relaxation time complete! Click the button below to start your coding test.
                    </Alert>
                    <Button 
                      variant="success" 
                      onClick={startCodingTest}
                      className="start-test-btn"
                      size="lg"
                    >
                      <FaPlay className="me-2" />
                      Start Coding Test
                    </Button>
                  </div>
                )}
                
                {!isRelaxationComplete && (
                  <Button 
                    variant="warning" 
                    disabled
                    className="start-test-btn"
                    size="lg"
                  >
                    <FaClock className="me-2" />
                    Go for Coding Round ({formatTime(timeLeft)})
                  </Button>
                )}
              </div>

              <div className="relaxation-tips">
                <h5><FaLightbulb className="me-2" />Relaxation Tips:</h5>
                <ul>
                  <li><FaBrain className="me-2" />Take deep breaths and relax your mind</li>
                  <li><FaHeart className="me-2" />Stretch your body and eyes</li>
                  <li><FaCoffee className="me-2" />Drink some water</li>
                  <li><FaCode className="me-2" />Prepare yourself mentally for coding round</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default CodingTestRelaxation
