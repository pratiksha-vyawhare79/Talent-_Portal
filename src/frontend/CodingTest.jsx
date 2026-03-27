import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Form, Nav } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiClock, FiCode, FiPlay, FiSave, FiTerminal, FiHome, FiBarChart2, FiFileText, FiSettings, FiLogOut, FiUsers, FiUser } from 'react-icons/fi'
import CameraCornerPreview from './CameraCornerPreview'
import { setTestSubmitted as finishProctoringTest, startProctoring, stopProctoring } from './proctoringSession'
import { markTestCompleted } from './utils/testCompletion'
import { enterFullscreen, exitFullscreen, lockBackNavigation, unlockBackNavigation } from './utils/testSecurity'
import './CodingTest.css'

function CodingTest() {
  const navigate = useNavigate()
  const location = useLocation()
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(1200) // 20 minutes in seconds
  const [testStarted, setTestStarted] = useState(false)
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [userCode, setUserCode] = useState('')
  const [language, setLanguage] = useState('JAVASCRIPT')
  const [testResults, setTestResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState('')
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [showTabWarning, setShowTabWarning] = useState(false)
  const [questionsLoaded, setQuestionsLoaded] = useState(false)
  const intervalRef = useRef(null)

  // Get user email
  const getUserEmail = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const fallbackEmail = location?.state?.email || location?.state?.user?.email || ''
    const candidateEmail = (user.email || fallbackEmail || '').trim().toLowerCase()
    return candidateEmail || 'user@example.com'
  }

  const getUserName = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    const firstName = (user.firstName || user.first_name || location?.state?.firstName || '').trim()
    const lastName = (user.lastName || user.last_name || location?.state?.lastName || '').trim()
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()

    if (fullName) return fullName

    const email = getUserEmail()
    if (email && email.includes('@')) {
      return email.split('@')[0]
    }

    return 'Candidate'
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    if (!questionsLoaded) {
      fetchQuestions()
      checkEligibility()
    }
    
    // Tab switching detection - only use visibility change to prevent double counting
    const handleVisibilityChange = () => {
      console.log('Visibility changed, document.hidden:', document.hidden, 'testStarted:', testStarted, 'testSubmitted:', testSubmitted)
      if (document.hidden && testStarted && !testSubmitted) {
        const newTabSwitchCount = tabSwitchCount + 1
        console.log('Setting tab switch count to:', newTabSwitchCount)
        
        // Force immediate state update and submission
        setTabSwitchCount(newTabSwitchCount)
        setShowTabWarning(true)
        
        // Force immediate submission if at limit
        if (newTabSwitchCount >= 3) {
          console.log('AUTO-SUBMITTING due to tab switches!')
          setError('Test auto-submitted due to multiple tab switches. This violates exam rules.')
          
          // Force submission immediately
          setTimeout(() => {
            console.log('Calling handleSubmit from visibility change')
            handleSubmit()
          }, 100)
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
      // Prevent Alt+Tab, Ctrl+Tab, F11, etc.
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
      // Prevent Ctrl+C, Ctrl+V, Ctrl+X
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x')) {
        e.preventDefault()
        return false
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [testStarted, testSubmitted, tabSwitchCount])

  useEffect(() => {
    if (questions.length > 0 && questions[0]) {
      // Set initial time but don't start countdown
      const initialTime = questions[0].timeLimitMinutes * 60 || 1200
      setTimeLeft(initialTime)
    }
  }, [questions])

  useEffect(() => {
    if (testStarted && timeLeft > 0 && !testSubmitted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [testStarted, timeLeft, testSubmitted])

  useEffect(() => {
    if (testStarted && !testSubmitted) {
      lockBackNavigation()
      return () => unlockBackNavigation()
    }
  }, [testStarted, testSubmitted])

  const checkEligibility = () => {
    const eligibility = localStorage.getItem('codingRoundEligibility')
    if (!eligibility) {
      navigate('/technical-result')
      return
    }
    
    try {
      const eligibilityData = JSON.parse(eligibility)
      if (!eligibilityData.eligibleForCodingRound) {
        navigate('/technical-result')
        return
      }
    } catch (error) {
      // Fallback for string-based eligibility check
      if (eligibility !== 'true') {
        navigate('/technical-result')
        return
      }
    }
  }

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      // Use dummy questions if API fails or no questions available
      const dummyQuestions = [
        {
          id: 1,
          questionText: "Write a function that takes an array of numbers and returns the sum of all positive numbers in the array.",
          questionType: "ALGORITHM",
          difficultyLevel: "EASY",
          programmingLanguage: "JAVASCRIPT",
          timeLimitMinutes: 20,
          sampleInput: "[1, -2, 3, 4, -5]",
          expectedOutput: "8",
          constraints: "Array length will be between 1 and 100. Numbers will be integers between -1000 and 1000.",
          hints: "Use filter() method to select positive numbers, then use reduce() to sum them up.",
          solutionCode: "function sumPositiveNumbers(arr) {\n  return arr.filter(num => num > 0).reduce((sum, num) => sum + num, 0);\n}",
          testCases: '[{"input": "[1, -2, 3, 4, -5]", "output": "8"}]',
          points: 10,
          isActive: true
        },
        {
          id: 2,
          questionText: "Write a function that checks if a string is a palindrome. A palindrome reads the same forwards and backwards.",
          questionType: "ALGORITHM",
          difficultyLevel: "MEDIUM",
          programmingLanguage: "JAVASCRIPT",
          timeLimitMinutes: 20,
          sampleInput: "racecar",
          expectedOutput: "true",
          constraints: "String length will be between 1 and 50 characters. Only lowercase letters and numbers allowed.",
          hints: "Compare the string with its reverse version. Remove non-alphanumeric characters before checking.",
          solutionCode: "function isPalindrome(str) {\n  const cleanStr = str.toLowerCase().replace(/[^a-z0-9]/g, '');\n  return cleanStr === cleanStr.split('').reverse().join('');\n}",
          testCases: '[{"input": "racecar", "output": "true"}, {"input": "hello", "output": "false"}]',
          points: 20,
          isActive: true
        }
      ]
      
      // Try to fetch from API, but use dummy questions as fallback
      try {
        const response = await fetch('http://localhost:8080/api/coding-questions/all')
        if (response.ok) {
          const data = await response.json()
          const activeQuestions = data.filter(q => q.isActive)
          if (activeQuestions.length > 0) {
            // Shuffle and select only one random question
            const shuffledQuestions = [...activeQuestions].sort(() => Math.random() - 0.5)
            const singleRandomQuestion = shuffledQuestions[0]
            setQuestions([singleRandomQuestion])  // Set as array with one question
            setQuestionsLoaded(true)
            setUserCode('')  // Start with empty editor
          } else {
            // Use dummy questions if no real questions available
            const shuffledDummy = [...dummyQuestions].sort(() => Math.random() - 0.5)
            const singleDummyQuestion = shuffledDummy[0]
            setQuestions([singleDummyQuestion])  // Set as array with one question
            setQuestionsLoaded(true)
            setUserCode('')  // Start with empty editor
          }
        } else {
          // Use dummy questions if API fails
          const shuffledDummy = [...dummyQuestions].sort(() => Math.random() - 0.5)
          const singleDummyQuestion = shuffledDummy[0]
          setQuestions([singleDummyQuestion])  // Set as array with one question
          setQuestionsLoaded(true)
          setUserCode('')  // Start with empty editor
        }
      } catch (apiError) {
        console.log('API error, using dummy questions:', apiError)
        // Use dummy questions as final fallback
        const shuffledDummy = [...dummyQuestions].sort(() => Math.random() - 0.5)
        const singleDummyQuestion = shuffledDummy[0]
        setQuestions([singleDummyQuestion])  // Set as array with one question
        setQuestionsLoaded(true)
        setUserCode('')  // Start with empty editor
      }
    } catch (error) {
      console.error('Error in fetchQuestions:', error)
      // Use dummy questions as final fallback
      const shuffledDummy = [...dummyQuestions].sort(() => Math.random() - 0.5)
      const singleDummyQuestion = shuffledDummy[0]
      setQuestions([singleDummyQuestion])  // Set as array with one question
      setQuestionsLoaded(true)
      setUserCode('')  // Start with empty editor
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTest = async () => {
    await startProctoring({
      onError: (message) => setError(message || 'Unable to access camera and microphone.')
    })
    await enterFullscreen()
    setTestStarted(true)
    setTimeLeft(currentQuestion?.timeLimitMinutes * 60 || 1200)
  }

  const handleSubmit = async () => {
    if (testSubmitted) return

    setTestSubmitted(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Stop camera proctoring when test is submitted
    finishProctoringTest()
    unlockBackNavigation()
    exitFullscreen()

    const results = questions.map((question, index) => ({
      userId: JSON.parse(localStorage.getItem('user') || '{}').id || 1,
      candidate: getUserName(),
      questionId: question.id,
      questionText: question.questionText,
      userCode: index === currentQuestionIndex ? userCode : '',
      language: language,
      timeTakenSeconds: (currentQuestion?.timeLimitMinutes * 60 || 1800) - timeLeft,
      submittedAt: new Date().toISOString(),
      testSessionId: `session_${Date.now()}_${JSON.parse(localStorage.getItem('user') || '{}').id || 1}`
    }))

    setTestResults(results)

    const sendCodingCompletionEmail = async () => {
      try {
        const recipientEmail = getUserEmail().trim()
        if (!recipientEmail) return

        const emailData = {
          to: recipientEmail,
          subject: 'Thank You for Submitting the Coding Test',
          templateType: 'coding-completion',
          message: `Thank you for submitting the coding test.

Your aptitude, technical, and coding 3 rounds are completed.

We will review your performance and contact you soon.

Please check your email regularly for updates.`
        }

        const endpoints = ['/api/send-result-email', '/api/auth/send-result-email']
        for (const endpoint of endpoints) {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData)
          })

          if (response.ok) {
            console.log(`Coding completion email sent successfully via ${endpoint}`)
            return
          }
        }

        console.error('Failed to send coding completion email')
      } catch (error) {
        console.error('Error sending coding completion email:', error)
      }
    }

    // Save results to backend
    try {
      const response = await fetch('/api/coding-questions/submit-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(results),
      })
      
      const responseText = await response.text()

      if (response.ok) {
        console.log('Coding results saved successfully:', responseText)
        await sendCodingCompletionEmail()
      } else {
        const message = `Failed to save coding results: ${response.status} ${response.statusText} ${responseText}`
        console.error(message)
        setError(message)
        setTestSubmitted(false)
        return
      }
    } catch (error) {
      console.error('Error saving coding results:', error)
      setError('Error saving coding results. Please try again.')
      setTestSubmitted(false)
      return
    }

    // Mark coding test as completed
    markTestCompleted('coding')

    // Redirect to the final completion page after coding submission
    navigate('/all-tests-completed', {
      state: {
        testType: 'coding',
        results,
        submittedAt: new Date().toISOString()
      }
    })
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return 'success'
      case 'MEDIUM':
        return 'warning'
      case 'HARD':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  const getLanguageIcon = (language) => {
    switch (language) {
      case 'JAVASCRIPT':
        return '🟨'
      case 'PYTHON':
        return '🐍'
      case 'JAVA':
        return '☕'
      case 'CPP':
        return '⚙️'
      case 'C':
        return '⚡'
      case 'CSHARP':
        return '🔷'
      default:
        return '💻'
    }
  }

  const getLanguageLabel = (language) => {
    switch (language) {
      case 'JAVASCRIPT':
        return 'JavaScript'
      case 'PYTHON':
        return 'Python'
      case 'JAVA':
        return 'Java'
      case 'CPP':
        return 'C++'
      case 'C':
        return 'C'
      case 'CSHARP':
        return 'C#'
      default:
        return language || 'Unknown'
    }
  }
  if (loading) {
    return (
      <div className="coding-test-wrapper">
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3">Loading coding questions...</p>
        </Container>
      </div>
    )
  }

  if (error) {
    return (
      <div className="coding-test-wrapper">
        <Container className="py-5">
          <Alert variant="danger">{error}</Alert>
          <Button variant="primary" onClick={() => navigate('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </Container>
      </div>
    )
  }

  return (
    <div className="test-page-wrap">
      {/* Custom Test Header */}
      <div className="test-header">
        <div className="test-header-content">
          <div className="test-header-left">
            <img src="/codeverge.svg" alt="Codeverge" className="test-header-logo" />
          </div>
          <div className="test-header-center">
            <Badge bg={timeLeft < 300 ? 'danger' : 'success'}>
              Time Left: {formatTime(timeLeft)}
            </Badge>
            {tabSwitchCount > 0 && (
              <Badge bg={tabSwitchCount >= 2 ? 'danger' : 'warning'} className="tab-switch-badge">
                Tab Switches: {tabSwitchCount}/3
              </Badge>
            )}
          </div>
          <div className="test-header-right">
            <div className="user-email">
              {getUserEmail()}
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
          <div className="mt-2">
            <Button variant="outline-light" size="sm" onClick={() => setShowTabWarning(false)}>
              OK
            </Button>
          </div>
        </Alert>
      )}

      <Container fluid className="test-layout">

        {/* Main Content */}
        <Row>
          {/* Code Editor Section */}
          <Col lg={6}>
            <Card className="code-editor-card">
              <Card.Header>
                <div className="editor-header">
                  <h5>Code Editor</h5>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="code-editor-container">
                  <div className="editor-line-numbers">
                    {userCode.split('\n').map((_, index) => (
                      <div key={index} className="line-number">
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  <textarea
                    className="code-editor"
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="Write your code here..."
                    disabled={!testStarted || testSubmitted}
                    spellCheck={false}
                  />
                </div>
                
                <div className="editor-actions">
                  {!testStarted && (
                    <Button variant="success" size="lg" onClick={startTest}>
                      <FiPlay className="me-2" />
                      Start Coding Test
                    </Button>
                  )}
                  
                  {testStarted && !testSubmitted && (
                    <Button variant="primary" onClick={handleSubmit}>
                      <FiSave className="me-2" />
                      Submit Test
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Question Section */}
          <Col lg={6}>
            <Card className="question-card">
              <Card.Header>
                <div className="question-header">
                  <h5>Question {currentQuestionIndex + 1}</h5>
                  <div className="question-meta">
                    <span className="language-badge">
                      {getLanguageIcon(currentQuestion?.programmingLanguage)}
                      {getLanguageLabel(currentQuestion?.programmingLanguage)}
                    </span>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="question-content">
                  <h6>{currentQuestion?.questionText}</h6>
                  
                  {currentQuestion?.sampleInput && (
                    <div className="sample-section">
                      <h6>Sample Input:</h6>
                      <div className="sample-code">
                        {currentQuestion.sampleInput}
                      </div>
                    </div>
                  )}
                  
                  {currentQuestion?.expectedOutput && (
                    <div className="sample-section">
                      <h6>Expected Output:</h6>
                      <div className="sample-code">
                        {currentQuestion.expectedOutput}
                      </div>
                    </div>
                  )}
                  
                  {currentQuestion?.constraints && (
                    <div className="constraints-section">
                      <h6>Constraints:</h6>
                      <p>{currentQuestion.constraints}</p>
                    </div>
                  )}
                  
                  {currentQuestion?.hints && (
                    <div className="hints-section">
                      <h6>Hints:</h6>
                      <p>{currentQuestion.hints}</p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      
      {!testSubmitted && <CameraCornerPreview />}
    </div>
  )
}

export default CodingTest
