import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Alert, Badge, Button, Card, Col, Container, Form, Row, Modal, ProgressBar } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaArrowRight, FaClock, FaQuestionCircle, FaCheckCircle, FaTimesCircle, FaPlay, FaSpinner } from 'react-icons/fa'
import CameraCornerPreview from './CameraCornerPreview'
import { setTestSubmitted } from './proctoringSession'
import { markTestCompleted } from './utils/testCompletion'
import { enterFullscreen, exitFullscreen, lockBackNavigation, unlockBackNavigation } from './utils/testSecurity'
import codevergeLogo from './codeverge.svg'
import './AptitudeTest.css'
import './AptitudeTestModal.css'

const SECTION_TIME_SECONDS = 20 * 60
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5)
const pickRandom = (arr, count) => shuffle(arr).slice(0, count)

const fmt = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

function AptitudeTest() {
  const navigate = useNavigate()
  const location = useLocation()

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [sections, setSections] = useState([])
  const [activeSection, setActiveSection] = useState(0)
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [sectionTimers, setSectionTimers] = useState([SECTION_TIME_SECONDS, SECTION_TIME_SECONDS, SECTION_TIME_SECONDS])
  const [answers, setAnswers] = useState({})
  const [visited, setVisited] = useState(new Set())
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [questionsLoaded, setQuestionsLoaded] = useState(false)
  const [showSectionModal, setShowSectionModal] = useState(true)
  const [showSectionEndModal, setShowSectionEndModal] = useState(false)
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false)
  const [showSubmitTestConfirmModal, setShowSubmitTestConfirmModal] = useState(false)
  const [showTimeWarningModal, setShowTimeWarningModal] = useState(false)
  const [timeWarningShown, setTimeWarningShown] = useState({})
  const [sectionResults, setSectionResults] = useState({})
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [showTabWarning, setShowTabWarning] = useState(false)
  const hasFinalizedSubmissionRef = useRef(false)
  const tabSwitchCountRef = useRef(0)
  const isSubmittedRef = useRef(false)
  const isFinalizingSubmissionRef = useRef(false)

  useEffect(() => {
    tabSwitchCountRef.current = tabSwitchCount
  }, [tabSwitchCount])

  useEffect(() => {
    isSubmittedRef.current = isSubmitted
  }, [isSubmitted])

  const fetchQuestionsFromDB = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/aptitude-questions')
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
        
        setQuestions(transformedQuestions)
        setQuestionsLoaded(true)
        console.log(`Loaded ${transformedQuestions.length} questions from database`)
      } else {
        console.error('Failed to fetch questions from database')
        // Fallback to empty questions if API fails
        setQuestions([])
        setQuestionsLoaded(true)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      setQuestions([])
      setQuestionsLoaded(true)
    } finally {
      setLoading(false)
    }
  }

  const sectionConfigs = [
    { key: 'numerical', title: 'Numerical Ability', pool: questions.filter(q => q.category === 'numerical') },
    { key: 'verbal', title: 'Verbal Ability', pool: questions.filter(q => q.category === 'verbal') },
    { key: 'reasoning', title: 'Reasoning Ability', pool: questions.filter(q => q.category === 'reasoning') }
  ]

  const buildSectionQuestions = () =>
    sectionConfigs.map((section) => ({
      ...section,
      questions: pickRandom(section.pool, Math.min(20, section.pool.length))
    }))

  useEffect(() => {
    if (!questionsLoaded) {
      fetchQuestionsFromDB()
    }
    
    // Tab switching detection
    const handleVisibilityChange = () => {
      console.log('Aptitude: Visibility changed, document.hidden:', document.hidden, 'isSubmitted:', isSubmittedRef.current)
      if (document.hidden && !isSubmittedRef.current && !isFinalizingSubmissionRef.current) {
        const newTabSwitchCount = tabSwitchCountRef.current + 1
        tabSwitchCountRef.current = newTabSwitchCount
        console.log('Setting aptitude tab switch count to:', newTabSwitchCount)

        setTabSwitchCount(newTabSwitchCount)
        setShowTabWarning(true)

        if (newTabSwitchCount >= 3) {
          console.log('AUTO-SUBMITTING aptitude due to tab switches!')

          console.log('Calling finalizeTestSubmission from visibility change')
          finalizeTestSubmission('Test auto-submitted due to multiple tab switches. This violates exam rules.')
        } else {
          setTimeout(() => setShowTabWarning(false), 5000)
        }
      }
    }
    
    // Prevent right-click
    const handleContextMenu = (e) => {
      e.preventDefault()
      return false
    }
    
    // Prevent keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault()
        return false
      }
      if (e.ctrlKey && e.key === 'Tab') {
        e.preventDefault()
        return false
      }
      if (e.key === 'F11') {
        e.preventDefault()
        return false
      }
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault()
        return false
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [questionsLoaded])

  useEffect(() => {
    if (questions.length > 0) {
      const freshSections = buildSectionQuestions()
      setSections(freshSections)
      setVisited(new Set([`${freshSections[0]?.key || 'numerical'}-0`]))
    }
  }, [questions])

  const currentSection = sections[activeSection] || { key: 'numerical', title: 'Aptitude Test', questions: [] }
  const currentQuestion = currentSection.questions?.[activeQuestion] || { q: 'No questions available.', o: [], a: -1 }
  const currentKey = `${currentSection.key}-${activeQuestion}`

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

  const resetTestSession = () => {
    const freshSections = buildSectionQuestions()
    setSections(freshSections)
    setActiveSection(0)
    setActiveQuestion(0)
    setSectionTimers([SECTION_TIME_SECONDS, SECTION_TIME_SECONDS, SECTION_TIME_SECONDS])
    setAnswers({})
    setVisited(new Set([`${freshSections[0]?.key || 'numerical'}-0`]))
    setIsSubmitted(false)
    isSubmittedRef.current = false
    hasFinalizedSubmissionRef.current = false
    isFinalizingSubmissionRef.current = false
    setTabSwitchCount(0)
    tabSwitchCountRef.current = 0
    setShowTabWarning(false)
  }

  useEffect(() => {
    // Start a fresh attempt whenever user re-enters /test (including retake).
    resetTestSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  useEffect(() => {
    if (isSubmitted || showSectionModal) return

    const timerId = setInterval(() => {
      setSectionTimers((prev) => {
        const updated = [...prev]
        if (updated[activeSection] > 0) {
          updated[activeSection] -= 1
          
          // Show warning when 2 minutes (120 seconds) remaining
          if (updated[activeSection] === 120 && !timeWarningShown[activeSection]) {
            setShowTimeWarningModal(true)
            setTimeWarningShown(prev => ({ ...prev, [activeSection]: true }))
          }
        } else if (updated[activeSection] === 0) {
          // Section time ended, show end modal
          handleSectionEnd()
        }
        return updated
      })
    }, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [activeSection, isSubmitted, showSectionModal, timeWarningShown])

  useEffect(() => {
    if (isSubmitted || showSectionModal) return

    // First capture shortly after test UI becomes active.
    const firstCaptureTimeout = setTimeout(() => {
      captureCameraSnapshot()
    }, 4000)

    // Then keep capturing every 10 minutes throughout the test.
    const cameraTimerId = setInterval(() => {
      captureCameraSnapshot()
    }, 10 * 60 * 1000)

    return () => {
      clearTimeout(firstCaptureTimeout)
      clearInterval(cameraTimerId)
    }
  }, [isSubmitted, showSectionModal, location.key])

  useEffect(() => {
    if (!showSectionModal && !isSubmitted) {
      lockBackNavigation()
      return () => unlockBackNavigation()
    }
  }, [showSectionModal, isSubmitted])

  const startSection = async () => {
    await enterFullscreen()
    setShowSectionModal(false)
  }

  const calculateSectionScore = () => {
    let correct = 0
    let attempted = 0

    currentSection.questions.forEach((q, index) => {
      const userAnswer = answers[`${currentSection.key}-${index}`]
      if (userAnswer !== undefined) {
        attempted++
        if (userAnswer === q.a) {
          correct++
        }
      }
    })

    return { correct, attempted, total: currentSection.questions.length }
  }

  const calculateSectionStats = () => {
    let attended = 0
    let remaining = 0

    currentSection.questions.forEach((q, index) => {
      const userAnswer = answers[`${currentSection.key}-${index}`]
      if (userAnswer !== undefined) {
        attended++
      } else {
        remaining++
      }
    })

    return { attended, remaining, total: currentSection.questions.length }
  }

  const calculateAllSectionStats = () => {
    return sections.map(section => {
      let attended = 0
      section.questions.forEach((q, index) => {
        const userAnswer = answers[`${section.key}-${index}`]
        if (userAnswer !== undefined) {
          attended++
        }
      })
      return {
        name: section.title,
        attended,
        total: section.questions.length
      }
    })
  }

  const handleSectionEnd = () => {
    const score = calculateSectionScore()
    setSectionResults({
      ...sectionResults,
      [currentSection.key]: score
    })
    
    // Check if this is the last section - if so, auto-submit the entire test
    if (activeSection === sections.length - 1) {
      console.log('Last section time expired - Auto-submitting aptitude test')
      finalizeTestSubmission()
    } else {
      setShowSectionEndModal(true)
    }
  }

  const showSubmitConfirmation = () => {
    setShowSubmitConfirmModal(true)
  }

  const confirmSubmitSection = () => {
    setShowSubmitConfirmModal(false)
    handleSectionEnd()
  }

  const calculateTotalTestStats = () => {
    let totalAttended = 0
    let totalQuestions = 0

    sections.forEach(section => {
      section.questions.forEach((q, index) => {
        const userAnswer = answers[`${section.key}-${index}`]
        if (userAnswer !== undefined) {
          totalAttended++
        }
        totalQuestions++
      })
    })

    return { attended: totalAttended, total: totalQuestions }
  }

  const showSubmitTestConfirmation = () => {
    setShowSubmitTestConfirmModal(true)
  }

  const confirmSubmitTest = () => {
    setShowSubmitTestConfirmModal(false)
    finalizeTestSubmission()
  }

  const dismissTimeWarning = () => {
    setShowTimeWarningModal(false)
  }

  const getTimerColor = (timeLeft) => {
    if (timeLeft <= 120) return 'danger' // 2 minutes or less - red
    return 'primary' // More than 2 minutes - blue
  }

  const goToNextSection = () => {
    setShowSectionEndModal(false)
    
    if (activeSection < sections.length - 1) {
      setActiveSection(activeSection + 1)
      setActiveQuestion(0)
      setShowSectionModal(true)
    } else {
      // Test completed
      handleSubmit()
    }
  }

  const cancelSectionEnd = () => {
    setShowSectionEndModal(false)
    // User can continue working on the section
  }

  useEffect(() => {
    setVisited((prev) => {
      const next = new Set(prev)
      next.add(currentKey)
      return next
    })
  }, [currentKey])

  useEffect(() => {
    if (isSubmitted) return

    if (sectionTimers.every((t) => t === 0)) {
      handleSubmit()
      return
    }

    if (sectionTimers[activeSection] === 0) {
      const nextSection = sectionTimers.findIndex((t, idx) => idx !== activeSection && t > 0)
      if (nextSection !== -1) {
        setActiveSection(nextSection)
        setActiveQuestion(0)
      }
    }
  }, [sectionTimers, activeSection, isSubmitted])

  const canAnswer = !isSubmitted && sectionTimers[activeSection] > 0

  const getQuestionState = (sectionKey, qIndex) => {
    const key = `${sectionKey}-${qIndex}`
    if (answers[key] !== undefined) return 'answered'
    if (visited.has(key)) return 'visited'
    return 'unvisited'
  }

  const getPaletteClass = (sectionKey, qIndex) => {
    const state = getQuestionState(sectionKey, qIndex)
    if (state === 'answered') return 'palette-btn answered'
    if (state === 'visited') return 'palette-btn visited'
    return 'palette-btn unvisited'
  }

  const selectAnswer = (optionIndex) => {
    if (!canAnswer) return
    setAnswers((prev) => ({ ...prev, [currentKey]: optionIndex }))
  }

  const goPrev = () => {
    if (activeQuestion > 0) setActiveQuestion((p) => p - 1)
  }

  const goNext = () => {
    if (activeQuestion < currentSection.questions.length - 1) {
      setActiveQuestion((p) => p + 1)
      return
    }
    // End of section - show end modal
    handleSectionEnd()
  }

  const openQuestionFromPalette = (sectionIndex, questionIndex) => {
    setActiveSection(sectionIndex)
    setActiveQuestion(questionIndex)
  }

  const resultPayload = useMemo(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const sectionResults = sections.map((section) => {
      let score = 0
      let answered = 0
      section.questions.forEach((q, idx) => {
        const key = `${section.key}-${idx}`
        if (answers[key] !== undefined) answered += 1
        if (answers[key] === q.a) score += 1
      })
      return {
        section: section.title,
        score,
        total: 20,
        answered,
        timeTaken: SECTION_TIME_SECONDS - (sectionTimers[sections.indexOf(section)] || 0)
      }
    })

    const totalScore = sectionResults.reduce((acc, s) => acc + s.score, 0)
    const totalAnswered = sectionResults.reduce((acc, s) => acc + s.answered, 0)
    
    // Calculate total time taken across all sections
    const totalTimeTaken = sectionResults.reduce((acc, s) => acc + s.timeTaken, 0)
    const totalTimeMinutes = Math.floor(totalTimeTaken / 60)
    const totalTimeSeconds = totalTimeTaken % 60

    return {
      sectionResults,
      totalScore,
      totalQuestions: 60,
      totalAnswered,
      totalTimeTaken,
      totalTimeMinutes,
      totalTimeSeconds,
      pass: totalScore > 30,
      email: user.email || ''
    }
  }, [answers, sections])

  const saveTestResultsToDatabase = async (result) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      // Extract section scores from result (case-insensitive, supports stored titles)
      const bySection = (key) =>
        result.sectionResults.find(s => String(s.section || '').toLowerCase().includes(key))?.score || 0
      const numericalScore = bySection('numerical')
      const reasoningScore = bySection('reasoning')
      const verbalScore = bySection('verbal')
      
      const candidateResult = {
        email: result.email || user.email || '',
        studentName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
        numericalScore: numericalScore,
        reasoningScore: reasoningScore,
        verbalScore: verbalScore,
        totalMarks: result.totalScore,
        finalResult: result.pass ? 'PASS' : 'FAIL',
        timeTakenMinutes: result.totalTimeMinutes || 0,
        timeTakenSeconds: result.totalTimeSeconds || 0
      }

      const response = await fetch('/api/candidate-results/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidateResult)
      })

      if (response.ok) {
        console.log('Test results saved to database successfully')
        const result = await response.json()
        console.log('Database save response:', result)
      } else {
        console.error('Failed to save test results to database')
      }
    } catch (error) {
      console.error('Error saving test results to database:', error)
    }
  }

  const finalizeTestSubmission = async (submitReason = '') => {
    if (hasFinalizedSubmissionRef.current || isFinalizingSubmissionRef.current) return
    hasFinalizedSubmissionRef.current = true
    isFinalizingSubmissionRef.current = true

    await Promise.race([
      captureCameraSnapshot(),
      new Promise((resolve) => setTimeout(resolve, 2000))
    ])
    setIsSubmitted(true)
    isSubmittedRef.current = true
    setTestSubmitted()
    unlockBackNavigation()
    exitFullscreen()
    stopSystemMonitoring()
    await saveTestResultsToDatabase({
      ...resultPayload,
      autoSubmitReason: submitReason
    })

    // Mark aptitude test as completed
    markTestCompleted('aptitude')

    navigate('/result', {
      state: {
        ...resultPayload,
        autoSubmitReason: submitReason
      }
    })
  }

  const handleSubmit = () => {
    if (isSubmitted || hasFinalizedSubmissionRef.current) return
    finalizeTestSubmission()
  }

  const stopSystemMonitoring = () => {
    // Stop camera stream
    if (window.cameraStream) {
      window.cameraStream.getTracks().forEach(track => {
        track.stop()
        track.enabled = false
      })
      window.cameraStream = null
    }
    
    // Stop microphone stream
    if (window.microphoneStream) {
      window.microphoneStream.getTracks().forEach(track => {
        track.stop()
        track.enabled = false
      })
      window.microphoneStream = null
    }
    
    // Stop recording
    if (window.mediaRecorder) {
      if (window.mediaRecorder.state !== 'inactive') {
        window.mediaRecorder.stop()
      }
      window.mediaRecorder = null
    }
    
    // Clear tab monitoring
    if (window.tabFocusHandler) {
      document.removeEventListener('visibilitychange', window.tabFocusHandler)
      window.tabFocusHandler = null
    }
    
    if (window.tabBlurHandler) {
      window.removeEventListener('blur', window.tabBlurHandler)
      window.tabBlurHandler = null
    }
    
    // Clear window focus monitoring
    if (window.windowFocusHandler) {
      window.removeEventListener('focus', window.windowFocusHandler)
      window.windowFocusHandler = null
    }
    
    if (window.windowBlurHandler) {
      window.removeEventListener('blur', window.windowBlurHandler)
      window.windowBlurHandler = null
    }
    
    // Clear intervals
    if (window.monitoringInterval) {
      clearInterval(window.monitoringInterval)
      window.monitoringInterval = null
    }
    
    // Clear recording chunks
    if (window.recordedChunks) {
      window.recordedChunks = []
    }
    
    console.log('System monitoring stopped and cleaned up')
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
              <h5>Loading questions...</h5>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="test-page-wrap">
      {/* Custom Test Header */}
      <div className="test-header">
        <div className="test-header-content">
          <div className="test-header-left">
            <img src={codevergeLogo} alt="Codeverge" className="test-header-logo" />
          </div>
          <div className="test-header-center">
            <Badge bg="dark">Question {activeQuestion + 1} / 20</Badge>
            <Badge bg={getTimerColor(sectionTimers[activeSection])}>
              Time Left: {fmt(sectionTimers[activeSection])}
            </Badge>
            {tabSwitchCount > 0 && (
              <Badge bg={tabSwitchCount >= 2 ? 'danger' : 'warning'} className="tab-switch-badge">
                Tab Switches: {tabSwitchCount}/3
              </Badge>
            )}
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

      {/* Tab Switch Warning */}
      {showTabWarning && (
        <Alert variant="danger" className="m-3 text-center tab-warning-alert">
          <strong>⚠️ Warning!</strong> Tab switching detected! This is a violation of exam rules.
          <br />
          <small>Tab switches: {tabSwitchCount}/3 (Test will be auto-submitted after 3 switches)</small>
        </Alert>
      )}

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
                  <strong>Instructions:</strong> Each section has 20 minutes. Total sections: Numerical (20), Verbal (20), Reasoning (20).
                  Palette colors: Green = Answered, Red = Unattended/Not visited, Grey = Visited but not answered.
                </Alert>

                {sectionTimers[activeSection] === 0 && (
                  <Alert variant="danger" className="mb-3">
                    This section time is over. Please move to another section with remaining time.
                  </Alert>
                )}

                <div className="section-switch mb-3">
                  {sections.map((s, idx) => (
                    <Button
                      key={s.key}
                      size="sm"
                      variant={idx === activeSection ? 'primary' : 'outline-secondary'}
                      disabled={idx !== activeSection}
                      onClick={() => setActiveSection(idx)}
                    >
                      {s.title} ({fmt(sectionTimers[idx])})
                    </Button>
                  ))}
                </div>

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

                <div className="mt-4 d-flex gap-2 flex-wrap justify-content-between">
                  <div className="d-flex gap-2 flex-wrap">
                    <Button onClick={goPrev} disabled={activeQuestion === 0} variant="outline-secondary" className="prev-btn-visible">
                      <FaArrowLeft className="me-2" />
                      Previous
                    </Button>
                    <Button onClick={goNext} disabled={activeSection === 2 && activeQuestion === 19} variant="outline-primary">
                      Next
                      <FaArrowRight className="ms-2" />
                    </Button>
                  </div>
                  <Button onClick={showSubmitConfirmation} variant="warning" className="submit-section-btn">
                    <FaCheckCircle className="me-2" />
                    Submit Section
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
                  >
                    <FaCheckCircle className="me-2" />
                    Submit Test
                  </Button>
                </div>
                
                <h6>Question Palette</h6>
                <div className="legend mb-3">
                  <span className="legend-item"><span className="dot green"></span> Answered</span>
                  <span className="legend-item"><span className="dot red"></span> Unattended</span>
                  <span className="legend-item"><span className="dot grey"></span> Visited</span>
                </div>
                
                {/* Only show palette for active section */}
                {sections.length > 0 && sections[activeSection] && (
                  <div className="palette-section-title">{sections[activeSection].title}</div>
                )}
                <div className="palette-grid">
                  {sections.length > 0 && sections[activeSection]?.questions?.map((_, qIndex) => (
                    <button
                      key={`${sections[activeSection]?.key}-${qIndex}`}
                      type="button"
                      className={getPaletteClass(sections[activeSection]?.key, qIndex)}
                      onClick={() => openQuestionFromPalette(activeSection, qIndex)}
                    >
                      {qIndex + 1}
                    </button>
                  ))}
                </div>
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
            {currentSection.key === 'numerical' && '🔢'}
            {currentSection.key === 'verbal' && '📝'}
            {currentSection.key === 'reasoning' && '🧠'}
          </div>
          <h2 className="modal-title">{currentSection.title}</h2>
          <p className="modal-description">
            {currentSection.key === 'numerical' && 'Mathematical problems, calculations, and numerical reasoning'}
            {currentSection.key === 'verbal' && 'Language comprehension, vocabulary, and verbal reasoning'}
            {currentSection.key === 'reasoning' && 'Logical patterns, analytical reasoning, and problem-solving'}
          </p>
          <div className="modal-info">
            <div className="info-item">
              <FaClock className="info-icon" />
              <span>Duration: 20 minutes</span>
            </div>
            <div className="info-item">
              <FaQuestionCircle className="info-icon" />
              <span>Questions: 20</span>
            </div>
          </div>
          <Button
            variant="success"
            size="lg"
            className="start-btn"
            onClick={startSection}
          >
            <FaPlay className="me-2" />
            Start {currentSection.title}
          </Button>
        </Modal.Body>
      </Modal>

      {/* Submit Section Confirmation Modal */}
      <Modal
        show={showSubmitConfirmModal}
        centered
        backdrop="static"
        keyboard={false}
        className="submit-confirm-modal"
      >
        <Modal.Body className="text-center p-5">
          <div className="modal-icon mb-4">
            <FaCheckCircle className="warning-icon" />
          </div>
          <h2 className="modal-title">Submit Section?</h2>
          <p className="confirm-description">
            Are you sure you want to submit the {currentSection.title} section?
          </p>
          <div className="stats-summary">
            <div className="stats-item">
              <span className="stats-label">Questions Attended:</span>
              <span className="stats-value attended">
                {calculateSectionStats().attended}
              </span>
            </div>
            <div className="stats-item">
              <span className="stats-label">Questions Remaining:</span>
              <span className="stats-value remaining">
                {calculateSectionStats().remaining}
              </span>
            </div>
            <div className="stats-item">
              <span className="stats-label">Total Questions:</span>
              <span className="stats-value total">
                {calculateSectionStats().total}
              </span>
            </div>
          </div>
          <Alert variant="warning" className="mt-3">
            <strong>Warning:</strong> Once you submit this section, you cannot return to it.
          </Alert>
          <div className="confirm-buttons">
            <Button
              variant="outline-secondary"
              size="lg"
              className="cancel-btn"
              onClick={() => setShowSubmitConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="warning"
              size="lg"
              className="confirm-submit-btn"
              onClick={confirmSubmitSection}
            >
              <FaCheckCircle className="me-2" />
              Submit Section
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Submit Test Confirmation Modal */}
      <Modal
        show={showSubmitTestConfirmModal}
        centered
        backdrop="static"
        keyboard={false}
        className="submit-test-confirm-modal"
      >
        <Modal.Body className="text-center p-5">
          <div className="modal-icon mb-4">
            <FaCheckCircle className="danger-icon" />
          </div>
          <h2 className="modal-title">Submit Test?</h2>
          <p className="confirm-description">
            Are you sure you want to submit the entire test? This action cannot be undone.
          </p>
          <div className="stats-summary">
            <div className="stats-item">
              <span className="stats-label">Questions Attended:</span>
              <span className="stats-value attended">
                {calculateTotalTestStats().attended}
              </span>
            </div>
            <div className="stats-item">
              <span className="stats-label">Total Questions:</span>
              <span className="stats-value total">
                {calculateTotalTestStats().total}
              </span>
            </div>
          </div>
          
          <div className="section-breakdown mt-4">
            <h6 className="breakdown-title">Section-wise Progress:</h6>
            {calculateAllSectionStats().map((stat, index) => (
              <div key={index} className="section-breakdown-item">
                <span className="section-breakdown-name">{stat.name}:</span>
                <span className="section-breakdown-count">{stat.attended}/{stat.total}</span>
              </div>
            ))}
          </div>
          <Alert variant="danger" className="mt-3">
            <strong>Warning:</strong> Once you submit the test, you cannot make any changes. Your results will be finalized.
          </Alert>
          <div className="confirm-buttons">
            <Button
              variant="outline-secondary"
              size="lg"
              className="cancel-btn"
              onClick={() => setShowSubmitTestConfirmModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="lg"
              className="confirm-submit-test-btn"
              onClick={confirmSubmitTest}
            >
              <FaCheckCircle className="me-2" />
              Submit Test
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Time Warning Modal */}
      <Modal
        show={showTimeWarningModal}
        centered
        backdrop="static"
        keyboard={false}
        className="time-warning-modal"
      >
        <Modal.Body className="text-center p-5">
          <div className="modal-icon mb-4">
            <FaClock className="warning-pulse-icon" />
          </div>
          <h2 className="modal-title">Time Warning!</h2>
          <p className="warning-description">
            You have only <span className="red-timer">2 minutes</span> left in the {currentSection.title} section.
          </p>
          <div className="timer-display">
            <div className="red-timer-box">
              <span className="timer-number">{fmt(sectionTimers[activeSection])}</span>
            </div>
          </div>
          <Alert variant="warning" className="mt-3">
            <strong>Reminder:</strong> Please complete your answers quickly or submit the section if you're done.
          </Alert>
          <Button
            variant="primary"
            size="lg"
            className="dismiss-warning-btn"
            onClick={dismissTimeWarning}
          >
            I Understand
          </Button>
        </Modal.Body>
      </Modal>

      {/* Section End Modal */}
      <Modal
        show={showSectionEndModal}
        centered
        backdrop="static"
        keyboard={false}
        className="section-end-modal"
      >
        <Modal.Body className="text-center p-5">
          <div className="modal-icon mb-4">
            <FaCheckCircle className="success-icon" />
          </div>
          <h2 className="modal-title">Section Completed!</h2>
          <p className="completion-message">
            You have completed the {currentSection.title} section.
          </p>
          
          <div className="section-stats-summary">
            <h6 className="stats-title">Section Performance:</h6>
            <div className="stats-item">
              <span className="stats-label">Questions Answered:</span>
              <span className="stats-value answered">
                {calculateSectionStats().attended}
              </span>
            </div>
            <div className="stats-item">
              <span className="stats-label">Questions Remaining:</span>
              <span className="stats-value remaining">
                {calculateSectionStats().remaining}
              </span>
            </div>
            <div className="stats-item">
              <span className="stats-label">Total Questions:</span>
              <span className="stats-value total">
                {calculateSectionStats().total}
              </span>
            </div>
          </div>
          
          <div className="next-section-info">
            {activeSection < sections.length - 1 ? (
              <>
                <p className="next-text">Ready for the next section?</p>
                <h4 className="next-section-name">
                  {sections[activeSection + 1].key === 'numerical' && '🔢'}
                  {sections[activeSection + 1].key === 'verbal' && '📝'}
                  {sections[activeSection + 1].key === 'reasoning' && '🧠'}
                  {' '}{sections[activeSection + 1].title}
                </h4>
              </>
            ) : (
              <p className="next-text">You've completed all sections!</p>
            )}
          </div>
          
          <div className="section-end-buttons">
            <Button
              variant="outline-secondary"
              size="lg"
              className="back-to-test-btn"
              onClick={cancelSectionEnd}
            >
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
    </div>
  )
}

export default AptitudeTest
