import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Modal, ProgressBar } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaArrowRight, FaClock, FaQuestionCircle, FaCheckCircle, FaTimesCircle, FaPlay, FaSpinner, FaExclamationTriangle } from 'react-icons/fa'
import codevergeLogo from './codeverge.svg'
import CameraCornerPreview from './CameraCornerPreview'
import { setTestSubmitted } from './proctoringSession'
import { markTestCompleted } from './utils/testCompletion'
import { enterFullscreen, exitFullscreen, lockBackNavigation, unlockBackNavigation } from './utils/testSecurity'
import './TechnicalTest.css'
import './TechnicalTestModal.css'
import './TechnicalTestSubmitModal.css'

const SECTION_TIME_SECONDS = 30 * 60
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)
const pickRandom = (arr, count) => shuffle(arr).slice(0, count)

const fmt = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

function TechnicalTest() {
  const navigate = useNavigate()
  const location = useLocation()

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState([])
  const [activeSection, setActiveSection] = useState(0)
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [sectionTimers, setSectionTimers] = useState([SECTION_TIME_SECONDS])
  const [answers, setAnswers] = useState({})
  const [visited, setVisited] = useState(new Set())
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showSectionModal, setShowSectionModal] = useState(true)
  const [showSectionEndModal, setShowSectionEndModal] = useState(false)
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false)
  const [showSubmitTestConfirmModal, setShowSubmitTestConfirmModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTimeWarningModal, setShowTimeWarningModal] = useState(false)
  const [timeWarningShown, setTimeWarningShown] = useState({})
  const [sectionResults, setSectionResults] = useState({})
  const hasFinalizedSubmissionRef = useRef(false)

  const fetchQuestionsFromDB = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/technical-questions')
      if (response.ok) {
        const data = await response.json()
        const allQuestions = data.questions || []
        
        // Transform database questions to match frontend format
        const transformedQuestions = allQuestions.map(q => ({
          q: q.question,
          o: [q.optionA, q.optionB, q.optionC, q.optionD],
          a: ['a', 'b', 'c', 'd'].indexOf(q.correctAnswer.toLowerCase()),
          category: q.category
        }))
        
        console.log('Loaded technical questions from database:', transformedQuestions.length)
        setQuestions(transformedQuestions)
      } else {
        console.error('Failed to fetch technical questions')
        setQuestions([])
      }
    } catch (error) {
      console.error('Error fetching technical questions:', error)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const sectionConfigs = useMemo(() => [
    {
      key: 'technical',
      title: 'Technical Test',
      pool: questions
    }
  ], [questions])

  const buildSectionQuestions = () =>
    sectionConfigs.map((section) => ({
      ...section,
      // Shuffle so each attempt is different, but keep all available questions.
      questions: pickRandom(section.pool, section.pool.length)
    }))

  useEffect(() => {
    fetchQuestionsFromDB()
  }, [])

  useEffect(() => {
    if (questions.length > 0) {
      const freshSections = buildSectionQuestions()
      setSections(freshSections)
      setVisited(new Set([`${freshSections[0]?.key || 'technical'}-0`]))
    }
  }, [questions])

  // Mark current question as visited when it changes
  useEffect(() => {
    if (sections.length > 0 && activeQuestion >= 0) {
      const key = `${currentSection.key}-${activeQuestion}`
      setVisited(prev => new Set([...prev, key]))
    }
  }, [activeQuestion, activeSection, sections])

  useEffect(() => {
    if (isSubmitted || showSectionModal) return

    const timerId = setInterval(() => {
      setSectionTimers((prev) => {
        const updated = [...prev]
        if (updated[activeSection] > 0) {
          updated[activeSection] = Math.max(0, updated[activeSection] - 1)
          
          // Show warning when 2 minutes (120 seconds) remaining
          if (updated[activeSection] === 120 && !timeWarningShown[activeSection]) {
            setShowTimeWarningModal(true)
            setTimeWarningShown(prev => ({ ...prev, [activeSection]: true }))
          }
        } else if (updated[activeSection] === 0) {
          // Time's up - automatically submit the test
          console.log('Time expired - Auto-submitting technical test')
          finalizeTestSubmission()
        }
        return updated
      })
    }, 1000)

    return () => clearInterval(timerId)
  }, [activeSection, isSubmitted, showSectionModal, timeWarningShown])

  // Camera snapshot timer
  useEffect(() => {
    if (isSubmitted || showSectionModal) return

    const cameraTimerId = setInterval(() => {
      captureCameraSnapshot()
    }, 10 * 60 * 1000)

    return () => clearInterval(cameraTimerId)
  }, [isSubmitted, showSectionModal])

  useEffect(() => {
    if (!showSectionModal && !isSubmitted) {
      lockBackNavigation()
      return () => unlockBackNavigation()
    }
  }, [showSectionModal, isSubmitted])

  const currentSection = sections[activeSection] || { key: 'technical', title: 'Technical Test', questions: [] }
  const currentQuestion = currentSection.questions?.[activeQuestion] || { q: 'No questions available.', o: [], a: -1 }
  const currentKey = `${currentSection.key}-${activeQuestion}`
  const currentSectionCount = currentSection.questions?.length || 0

  const getTimerColor = (time) => {
    if (time <= 60) return 'danger'
    if (time <= 300) return 'warning'
    return 'success'
  }

  const getPaletteClass = (sectionKey, questionIndex) => {
    const key = `${sectionKey}-${questionIndex}`
    if (answers[key] !== undefined) return 'palette-btn answered'
    if (visited.has(key)) return 'palette-btn visited'
    return 'palette-btn unvisited'
  }

  const startSection = async () => {
    await enterFullscreen()
    setShowSectionModal(false)
  }

  const selectAnswer = (answerIndex) => {
    if (sectionTimers[activeSection] === 0) return
    const key = `${currentSection.key}-${activeQuestion}`
    setAnswers(prev => ({ ...prev, [key]: answerIndex }))
    setVisited(prev => new Set([...prev, key]))
  }

  const openQuestionFromPalette = (sectionIndex, questionIndex) => {
    if (sectionTimers[sectionIndex] === 0 && sectionIndex !== activeSection) return
    setActiveSection(sectionIndex)
    setActiveQuestion(questionIndex)
  }

  const goPrev = () => {
    if (activeQuestion > 0) {
      setActiveQuestion(activeQuestion - 1)
    }
  }

  const goNext = () => {
    if (activeQuestion < currentSection.questions.length - 1) {
      setActiveQuestion(activeQuestion + 1)
    }
  }

  const showSubmitConfirmation = () => {
    const sectionKey = currentSection.key
    const answeredInSection = Object.keys(answers).filter(key => key.startsWith(sectionKey)).length
    
    if (answeredInSection === 0) {
      alert('Please answer at least one question before submitting the section.')
      return
    }
    
    setShowSubmitConfirmModal(true)
  }

  const submitSection = () => {
    const sectionKey = currentSection.key
    const sectionAnswers = {}
    currentSection.questions.forEach((_, idx) => {
      const key = `${sectionKey}-${idx}`
      sectionAnswers[key] = answers[key]
    })

    const correct = currentSection.questions.filter((q, idx) => {
      const key = `${sectionKey}-${idx}`
      return answers[key] === q.a
    }).length

    const result = {
      sectionKey,
      sectionTitle: currentSection.title,
      total: currentSection.questions.length,
      correct,
      percentage: Math.round((correct / currentSection.questions.length) * 100),
      answers: sectionAnswers
    }

    setSectionResults(prev => ({ ...prev, [sectionKey]: result }))
    setShowSubmitConfirmModal(false)
    setShowSectionEndModal(true)
  }

  const showSubmitTestConfirmation = () => {
    const totalAnswered = Object.keys(answers).length
    const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0)
    
    if (totalAnswered === 0) {
      alert('Please answer at least one question before submitting the test.')
      return
    }
    
    // Prevent multiple submissions
    if (isSubmitted || hasFinalizedSubmissionRef.current) {
      return
    }
    
    setShowSubmitTestConfirmModal(true)
  }

  const finalizeTestSubmission = async () => {
    if (hasFinalizedSubmissionRef.current || isSubmitting) return
    hasFinalizedSubmissionRef.current = true
    setIsSubmitting(true)

    try {
      await captureCameraSnapshot()
      setIsSubmitted(true)
      setTestSubmitted()
      unlockBackNavigation()
      exitFullscreen()
      
      // Calculate section results for the single technical section
      const sectionKey = currentSection.key
      const sectionAnswers = {}
      let correctCount = 0
      
      sections.forEach(section => {
        section.questions.forEach((question, qIndex) => {
          const key = `${section.key}-${qIndex}`
          if (answers[key] !== undefined) {
            sectionAnswers[key] = answers[key]
            if (answers[key] === question.a) {
              correctCount++
            }
          }
        })
      })
      
      const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0)
      const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
      
      // Calculate actual time taken
      const timeLimit = SECTION_TIME_SECONDS // 30 minutes in seconds
      const timeRemaining = sectionTimers[0] || 0
      const timeTaken = timeLimit - timeRemaining

      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const fallbackEmail = location?.state?.email || location?.state?.user?.email || ''
      const candidateEmail = (user.email || fallbackEmail || '').trim().toLowerCase()
      const candidateName = (`${user.firstName || ''} ${user.lastName || ''}`.trim()) || 'Unknown'
      
      const sectionResult = {
        sectionKey: sectionKey,
        sectionTitle: currentSection.title,
        total: totalQuestions,
        correct: correctCount,
        percentage: percentage,
        answers: sectionAnswers
      }
      
      // Calculate final results
      const finalResults = {
        sections: { [sectionKey]: sectionResult },
        totalStats: {
          answered: Object.keys(answers).length,
          total: totalQuestions,
          remaining: totalQuestions - Object.keys(answers).length
        },
        timeTaken: timeTaken, // Actual time taken in seconds
        submittedAt: new Date().toISOString(),
        email: candidateEmail,
        candidateName: candidateName
      }
      
      console.log('Technical test submitted:', finalResults)
      localStorage.setItem('technicalTestResult', JSON.stringify(finalResults))
      
      // Save results to database
      try {
        const response = await fetch('/api/technical-test-results/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalResults)
        })
        
        if (!response.ok) {
          console.error('Failed to save technical test results to database')
        } else {
          console.log('Technical test results saved to database successfully')
        }
      } catch (dbError) {
        console.error('Error saving to database:', dbError)
      }
      
      // Mark technical test as completed
      markTestCompleted('technical')
      
      // Close modal and redirect
      setShowSubmitTestConfirmModal(false)
      
      // Redirect to results page
      setTimeout(() => {
        navigate('/technical-result', { state: finalResults })
      }, 1500)
      
    } catch (error) {
      console.error('Error submitting test:', error)
      setIsSubmitting(false)
      hasFinalizedSubmissionRef.current = false
      setShowSubmitTestConfirmModal(false)
      alert('There was an error submitting your test. Please try again.')
    }
  }

  const cancelSectionEnd = () => {
    setShowSectionEndModal(false)
  }

  const goToNextSection = () => {
    setShowSubmitTestConfirmModal(true)
  }

  const captureCameraSnapshot = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const fallbackEmail = location?.state?.email || location?.state?.user?.email || ''
      const candidateEmail = (user.email || fallbackEmail || '').trim().toLowerCase()
      const candidateName = (`${user.firstName || ''} ${user.lastName || ''}`.trim()) || 'Unknown'
      const video = document.querySelector('#camera-preview')
      if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) return

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(video, 0, 0)

      const imageData = canvas.toDataURL('image/jpeg', 0.8)
      await fetch('/api/camera-snapshots/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateEmail,
          candidateName,
          imageData,
          testResult: 'IN_PROGRESS'
        })
      })
    } catch (error) {
      console.error('Error capturing camera snapshot:', error)
    }
  }

  if (loading) {
    return (
      <div className="test-page-wrap">
        <div className="test-header">
          <div className="test-header-content">
            <div className="test-header-left">
              <img src={codevergeLogo} alt="Codeverge" className="test-header-logo" />
            </div>
            <div className="test-header-info">
              <h5>Loading technical questions...</h5>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const canAnswer = sectionTimers[activeSection] > 0

  return (
    <div className="test-page-wrap">
      {/* Custom Test Header */}
      <div className="test-header">
        <div className="test-header-content">
          <div className="test-header-left">
            <img src={codevergeLogo} alt="Codeverge" className="test-header-logo" />
          </div>
          <div className="test-header-center">
            <Badge bg="dark">Question {currentSectionCount ? Math.min(activeQuestion + 1, currentSectionCount) : 0} / {currentSectionCount}</Badge>
            <Badge bg={getTimerColor(sectionTimers[activeSection])}>
              Time Left: {fmt(sectionTimers[activeSection])}
            </Badge>
          </div>
          <div className="test-header-right">
            <div className="user-email">
              {(() => {
                const user = JSON.parse(localStorage.getItem('user') || '{}')
                const fallbackEmail = location?.state?.email || location?.state?.user?.email || ''
                const candidateEmail = (user.email || fallbackEmail || '').trim().toLowerCase()
                return candidateEmail || 'user@example.com'
              })()}
            </div>
          </div>
        </div>
      </div>

      <Container fluid className="test-layout">
        <div className="test-page-title">
          <h2>{currentSection.title}</h2>
        </div>
        <Row>
          <Col lg={9} className="mb-3">
            <Card className="test-main-card">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                </div>

                <Alert variant="warning" className="instruction-box">
                  <strong>Instructions:</strong> You have 30 minutes to complete all questions in one section.
                  Palette colors: Green = Answered, Red = Unattended/Not visited, Grey = Visited but not answered.
                </Alert>

                {sectionTimers[activeSection] === 0 && (
                  <Alert variant="danger" className="mb-3">
                    This section time is over. Please move to another section with remaining time.
                  </Alert>
                )}

                <h6 className="question-text">
                  <span className="question-number">Q{activeQuestion + 1}. </span>
                  {currentQuestion.q}
                </h6>

                <Form>
                  {currentQuestion.o.map((opt, idx) => (
                    <Form.Check
                      key={idx}
                      type="radio"
                      className="mb-2"
                      name={currentKey}
                      label={opt}
                      checked={answers[currentKey] === idx}
                      onChange={() => selectAnswer(idx)}
                      disabled={!canAnswer}
                    />
                  ))}
                </Form>

                <div className="mt-4 d-flex gap-2 flex-wrap">
                  <Button onClick={goPrev} disabled={activeQuestion === 0} variant="outline-secondary" className="prev-btn-visible">
                    <FaArrowLeft className="me-2" />
                    Previous
                  </Button>
                  <Button
                    onClick={goNext}
                    disabled={activeSection === sections.length - 1 && activeQuestion >= currentSectionCount - 1}
                    variant="outline-primary"
                  >
                    Next
                    <FaArrowRight className="ms-2" />
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3}>
            <Card className="palette-card">
              <Card.Body>
                <div className="submit-test-container mb-3">
                  <Button 
                    onClick={showSubmitTestConfirmation} 
                    variant="danger" 
                    className="submit-test-btn w-100"
                    disabled={isSubmitted || hasFinalizedSubmissionRef.current || isSubmitting}
                  >
                    <FaCheckCircle className="me-2" />
                    {isSubmitting ? 'Submitting...' : isSubmitted ? 'Submitted' : 'Submit Test'}
                  </Button>
                </div>
                
                <h6>Question Palette</h6>
                <div className="legend mb-3">
                  <span className="legend-item"><span className="dot green"></span> Answered</span>
                  <span className="legend-item"><span className="dot red"></span> Unattended</span>
                  <span className="legend-item"><span className="dot grey"></span> Attended, no answer</span>
                </div>

                {sections.map((section, sectionIndex) => (
                  <div key={section.key} className="mb-3">
                    <div className="palette-section-title">{section.title}</div>
                    <div className="palette-grid">
                      {section.questions.map((_, qIndex) => (
                        <button
                          key={`${section.key}-${qIndex}`}
                          type="button"
                          className={getPaletteClass(section.key, qIndex)}
                          onClick={() => openQuestionFromPalette(sectionIndex, qIndex)}
                        >
                          {qIndex + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {/* Custom Test Footer */}
      <div className="test-footer">
        <div className="test-footer-content">
          <div className="terms-conditions">
            <h6>Terms & Conditions</h6>
            <p>
              By taking this test, you agree to our terms of service. This test is monitored for academic integrity. 
              Any form of cheating or unauthorized assistance will result in disqualification. 
              Your camera and microphone may be recorded during the test for proctoring purposes.
            </p>
            <p className="footer-note">
              © 2024 Codeverge Talent Portal. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      
      {!isSubmitted && <CameraCornerPreview />}
      
      {/* Section Start Modal */}
      <Modal
        show={showSectionModal}
        centered
        backdrop="static"
        keyboard={false}
        className="section-modal"
      >
        <Modal.Body className="text-center p-5">
          <div className="modal-icon mb-4">
            {currentSection.key === 'programming' && '💻'}
            {currentSection.key === 'web' && '🌐'}
            {currentSection.key === 'database' && '🗄️'}
          </div>
          <h2 className="modal-title">{currentSection.title}</h2>
          <p className="modal-description">
            {currentSection.key === 'programming' && 'Programming languages, algorithms, data structures, and coding concepts'}
            {currentSection.key === 'web' && 'Web development, HTML, CSS, JavaScript, and frameworks'}
            {currentSection.key === 'database' && 'Database design, SQL queries, and data management'}
          </p>
          <div className="modal-info">
            <div className="info-item">
              <FaClock className="info-icon" />
              <span>Duration: 20 minutes</span>
            </div>
            <div className="info-item">
              <FaQuestionCircle className="info-icon" />
              <span>Questions: {currentSectionCount}</span>
            </div>
          </div>
          <Button variant="primary" size="lg" onClick={startSection}>
            <FaPlay className="me-2" />
            Start Section
          </Button>
        </Modal.Body>
      </Modal>

      {/* Time Warning Modal */}
      <Modal show={showTimeWarningModal} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center p-5">
          <h3>⏰ Time Warning</h3>
          <p>You have only 2 minutes remaining for this section!</p>
          <p>Please make sure to submit your answers before time runs out.</p>
          <div className="modal-actions">
            <Button variant="primary" onClick={() => setShowTimeWarningModal(false)}>
              I Understand
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Section End Modal */}
      <Modal show={showSectionEndModal} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center p-5">
          <div className="modal-icon mb-4">
            {currentSection.key === 'programming' && '💻'}
            {currentSection.key === 'web' && '🌐'}
            {currentSection.key === 'database' && '🗄️'}
          </div>
          <h2 className="modal-title">Section Completed!</h2>
          <p className="modal-description">
            You have completed the {currentSection.title} section.
          </p>
          {sectionResults[currentSection.key] && (
            <div className="result-summary">
              <p><strong>Questions:</strong> {sectionResults[currentSection.key].total}</p>
              <p><strong>Correct:</strong> {sectionResults[currentSection.key].correct}</p>
              <p><strong>Score:</strong> {sectionResults[currentSection.key].percentage}%</p>
            </div>
          )}
          <div className="modal-actions">
            <Button variant="secondary" onClick={cancelSectionEnd} className="back-to-test-btn">
              <FaArrowLeft className="me-2" />
              Back to Test
            </Button>
            {activeSection < sections.length - 1 && (
              <Button
                variant="primary"
                size="lg"
                className="next-section-btn"
                onClick={goToNextSection}
              >
                Next Section
                <FaArrowRight className="ms-2" />
              </Button>
            )}
          </div>
        </Modal.Body>
      </Modal>

      {/* Submit Section Confirmation Modal */}
      <Modal show={showSubmitConfirmModal} centered backdrop="static" keyboard={false}>
        <Modal.Body className="text-center p-5">
          <h3>Submit Section?</h3>
          <p>Are you sure you want to submit this section? You won't be able to change your answers after submission.</p>
          <div className="modal-actions">
            <Button variant="secondary" onClick={() => setShowSubmitConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="warning" onClick={submitSection}>
              Submit Section
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Submit Test Confirmation Modal */}
      <Modal show={showSubmitTestConfirmModal} centered backdrop="static" keyboard={false} size="lg">
        <Modal.Header className="bg-danger text-white">
          <Modal.Title className="w-100 text-center">
            <FaExclamationTriangle className="me-2" />
            Submit Technical Test
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center p-4">
          <div className="mb-4">
            <div className="submit-icon mb-3">
              <FaCheckCircle className="text-warning" style={{ fontSize: '4rem' }} />
            </div>
            <h4 className="mb-3">Are you ready to submit your test?</h4>
            <p className="text-muted mb-4">
              Once you submit, you won't be able to change any answers. Please review your answers before final submission.
            </p>
          </div>
          
          <div className="test-summary bg-light p-3 rounded mb-4">
            <div className="row">
              <div className="col-4">
                <div className="summary-item">
                  <div className="summary-number">{Object.keys(answers).length}</div>
                  <div className="summary-label">Answered</div>
                </div>
              </div>
              <div className="col-4">
                <div className="summary-item">
                  <div className="summary-number">
                    {sections.reduce((sum, section) => sum + section.questions.length, 0) - Object.keys(answers).length}
                  </div>
                  <div className="summary-label">Remaining</div>
                </div>
              </div>
              <div className="col-4">
                <div className="summary-item">
                  <div className="summary-number">
                    {Math.round((sectionTimers[0] || 0) / 60)}m
                  </div>
                  <div className="summary-label">Time Left</div>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-warning d-flex align-items-center" role="alert">
            <FaExclamationTriangle className="me-2" />
            <div>
              <strong>Important:</strong> This action cannot be undone. Make sure you have answered all questions you want to attempt.
            </div>
          </div>

          <div className="modal-actions d-flex justify-content-center gap-3 mt-4">
            <Button 
              variant="outline-secondary" 
              size="lg"
              onClick={() => setShowSubmitTestConfirmModal(false)}
              disabled={isSubmitting}
              className="px-4"
            >
              <FaArrowLeft className="me-2" />
              Back to Test
            </Button>
            <Button 
              variant="danger" 
              size="lg"
              onClick={finalizeTestSubmission}
              disabled={isSubmitting || isSubmitted || hasFinalizedSubmissionRef.current}
              className="px-4"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="me-2 fa-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaCheckCircle className="me-2" />
                  Submit Test
                </>
              )}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default TechnicalTest
