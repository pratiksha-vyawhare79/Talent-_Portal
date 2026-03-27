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
  FaRocket
} from 'react-icons/fa'
import { setTestSubmitted, stopProctoring, startProctoring } from './proctoringSession'
import './TechnicalTestRelaxation.css'

const TechnicalTestRelaxation = () => {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes = 300 seconds
  const [isRelaxationComplete, setIsRelaxationComplete] = useState(false)

  useEffect(() => {
    // Stop camera during relaxation period
    stopProctoring()
    
    if (timeLeft <= 0) {
      setIsRelaxationComplete(true)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const startTechnicalTest = () => {
    // Restart camera for technical test
    startProctoring()
    // First go to compatibility check
    navigate('/compatibility-check', {
      state: {
        nextRoute: '/technical-test',
        backRoute: '/technical-test-relaxation'
      }
    })
  }

  const goBack = () => {
    navigate('/result')
  }

  const progressPercentage = ((300 - timeLeft) / 300) * 100

  return (
    <div className="relaxation-page">
      <Container className="py-5">
        <div className="relaxation-container">
          <Card className="relaxation-card">
            <Card.Body className="text-center p-5">
              <div className="relaxation-header mb-4">
                <FaGraduationCap className="celebration-icon mb-3" />
                <h2 className="relaxation-title">
                  Congratulations! You Passed the Aptitude Test!
                </h2>
                <p className="relaxation-subtitle">
                  <FaRocket className="me-2" />
                  Get ready for your Technical Round
                </p>
              </div>

              <Alert variant="info" className="mb-4">
                <FaHourglassHalf className="me-2" />
                Take a 5-minute relaxation break before starting the technical test.
                This will help you perform better in the next round.
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
                  <Button 
                    variant="success" 
                    onClick={startTechnicalTest}
                    className="start-test-btn"
                    size="lg"
                  >
                    <FaCheckCircle className="me-2" />
                    Start Technical Test
                  </Button>
                )}
                
                {!isRelaxationComplete && (
                  <Button 
                    variant="warning" 
                    disabled
                    className="start-test-btn"
                    size="lg"
                  >
                    <FaClock className="me-2" />
                    Start Technical Test ({formatTime(timeLeft)})
                  </Button>
                )}
              </div>

              <div className="relaxation-tips">
                <h5><FaLightbulb className="me-2" />Relaxation Tips:</h5>
                <ul>
                  <li><FaBrain className="me-2" />Take deep breaths and relax your mind</li>
                  <li><FaHeart className="me-2" />Stretch your body and eyes</li>
                  <li><FaCoffee className="me-2" />Drink some water</li>
                  <li><FaGraduationCap className="me-2" />Prepare yourself mentally for the technical round</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default TechnicalTestRelaxation
