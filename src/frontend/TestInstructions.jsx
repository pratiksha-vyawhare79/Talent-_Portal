import { useState } from 'react'
import { Container, Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FaClock, FaCheckCircle, FaExclamationTriangle, FaPlay, FaCalculator, FaBookOpen, FaBrain, FaChartBar, FaGraduationCap } from 'react-icons/fa'
import codevergeLogo from './codeverge.svg'
import { enterFullscreen } from './utils/testSecurity'
import './TestInstructions.css'

const TestInstructions = () => {
  const navigate = useNavigate()
  const [showStartModal, setShowStartModal] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const testSections = [
    {
      name: 'Numerical Ability',
      questions: 20,
      duration: '20 minutes',
      icon: <FaCalculator className="section-formal-icon" />,
      description: 'Mathematical problems, calculations, and numerical reasoning'
    },
    {
      name: 'Verbal Ability',
      questions: 20,
      duration: '20 minutes',
      icon: <FaBookOpen className="section-formal-icon" />,
      description: 'Language comprehension, vocabulary, and verbal reasoning'
    },
    {
      name: 'Logical Reasoning',
      questions: 20,
      duration: '20 minutes',
      icon: <FaBrain className="section-formal-icon" />,
      description: 'Logical patterns, analytical reasoning, and problem-solving'
    }
  ]

  const instructions = [
    {
      icon: <FaClock className="instruction-icon" />,
      title: 'Time Management',
      description: 'Total test duration: 60 minutes (20 minutes per section)'
    },
    {
      icon: <FaCheckCircle className="instruction-icon" />,
      title: 'Question Format',
      description: 'Multiple Choice Questions (MCQ) with 4 options each'
    },
    {
      icon: <FaExclamationTriangle className="instruction-icon" />,
      title: 'No Negative Marking',
      description: 'No marks deducted for wrong answers'
    },
    {
      icon: <FaCheckCircle className="instruction-icon" />,
      title: 'Section Navigation',
      description: 'You can navigate between sections but time continues'
    }
  ]

  const importantRules = [
    'Do not refresh the page during the test',
    'Do not open any other browser tabs or applications',
    'Do not use any external resources or help',
    'Do not copy or share questions',
    'Do not attempt to cheat in any manner',
    'Your screen and activity may be monitored',
    'Any violation will result in immediate disqualification',
    'Do not give the test multiple times',
    'Do not go back after you start the test',
    'Multiple attempts will be logged out and your account may be suspended',
    'Warning: Any violation of these rules will result in immediate disqualification and possible blacklisting from future opportunities.'
  ]

  const handleStartTest = () => {
    if (!agreedToTerms) {
      alert('Please agree to the terms and conditions before starting the test.')
      return
    }
    setShowStartModal(true)
  }

  const confirmStartTest = async () => {
    await enterFullscreen()
    navigate('/compatibility-check')
  }

  return (
    <div className="test-instructions-wrapper">
      <Container className="test-instructions-container">
        <Row className="justify-content-center">
          <Col xl={10} className="w-100">
            <Card className="test-instructions-card shadow-lg">
              <Card.Body className="p-5">
                {/* Logo */}
                <div className="text-center mb-4">
                  <img 
                    src={codevergeLogo} 
                    alt="Codeverge Logo" 
                    className="test-instructions-logo"
                  />
                </div>
                
                {/* Header */}
                <div className="text-center mb-5">
                  <div className="test-header">
                    <h1 className="test-title">Aptitude Test Instructions</h1>
                    <p className="test-subtitle">
                      Welcome <span className="user-name">{user.firstName || 'Candidate'}</span>!
                    </p>
                    <p className="test-description">
                      Please read all instructions carefully before starting the test
                    </p>
                  </div>
                </div>

                {/* Test Overview */}
                <div className="test-overview mb-5">
                  <h3 className="section-title">Test Overview</h3>
                  <div className="row g-4">
                    {testSections.map((section, index) => (
                      <Col md={4} key={index}>
                        <div className="test-section-card">
                          <div className="section-icon">{section.icon}</div>
                          <h4 className="section-name">{section.name}</h4>
                          <p className="section-details">
                            <span className="questions-count">{section.questions} Questions</span>
                            <span className="duration">{section.duration}</span>
                          </p>
                          <p className="section-description">{section.description}</p>
                        </div>
                      </Col>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="instructions-section mb-5">
                  <h3 className="section-title">Important Instructions</h3>
                  <div className="row g-3">
                    {instructions.map((instruction, index) => (
                      <Col md={6} key={index}>
                        <div className="instruction-item">
                          <div className="instruction-icon-wrapper">
                            {instruction.icon}
                          </div>
                          <div className="instruction-content">
                            <h5 className="instruction-title">{instruction.title}</h5>
                            <p className="instruction-text">{instruction.description}</p>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </div>
                </div>

                {/* Important Rules */}
                <div className="rules-section mb-5">
                  <h3 className="section-title text-danger">Does and Don't</h3>
                  <Alert variant="danger" className="rules-alert">
                    <Alert.Heading>
                      <FaExclamationTriangle className="me-2" />
                      Strictly Prohibited
                    </Alert.Heading>
                    <ul className="rules-list">
                      {importantRules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                    <p className="rules-warning">
                      <strong>Warning:</strong> Any violation of these rules will result in immediate 
                      disqualification and possible blacklisting from future opportunities.
                    </p>
                  </Alert>
                </div>

                {/* Terms and Conditions */}
                <div className="terms-section mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className={`form-check-input ${agreedToTerms ? 'border-white' : ''}`}
                      id="termsCheckbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="termsCheckbox">
                      I have read and understood all the instructions. I agree to abide by all 
                      rules and confirm that I will not engage in any form of cheating or 
                      misconduct during the test.
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <Button 
                    variant="success" 
                    className="btn-start-test"
                    onClick={handleStartTest}
                  >
                    <FaPlay className="me-2" />
                    Start Test
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Start Confirmation Modal */}
      <Modal 
        show={showStartModal} 
        onHide={() => setShowStartModal(false)}
        centered
        className="start-test-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Start Aptitude Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <FaClock className="modal-icon text-warning mb-3" />
            <h4>Are you ready to begin?</h4>
            <p className="modal-description">
              Once you start the test, the timer will begin immediately. 
              You will have <strong>60 minutes</strong> to complete all sections.
            </p>
            <Alert variant="info">
              Make sure you have a stable internet connection and are in a quiet environment.
            </Alert>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStartModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={confirmStartTest}>
            <FaPlay className="me-2" />
            Start Test Now
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default TestInstructions
