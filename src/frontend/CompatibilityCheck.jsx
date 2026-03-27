import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaCamera, FaCheckCircle, FaDesktop, FaMicrophone, FaTimesCircle, FaVideo } from 'react-icons/fa'
import { getProctoringStream, isProctoringActive, startProctoring } from './proctoringSession'
import codevergeLogo from './codeverge.svg'
import './CompatibilityCheck.css'

const CompatibilityCheck = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const videoRef = useRef(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [micReady, setMicReady] = useState(false)
  const [tabReady, setTabReady] = useState(true)
  const [recordingReady, setRecordingReady] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState('')
  
  const searchParams = new URLSearchParams(location.search)
  const nextRoute = location.state?.nextRoute || searchParams.get('next') || '/test'
  const backRoute = location.state?.backRoute || searchParams.get('back') || '/test-instructions'

  useEffect(() => {
    const existingStream = getProctoringStream()
    if (existingStream && videoRef.current) {
      videoRef.current.srcObject = existingStream
      setCameraReady(true)
      setMicReady(true)
      setRecordingReady(isProctoringActive())
      setTabReady(!document.hidden && document.hasFocus())
    }
  }, [])

  const attachPreview = (stream) => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream
    }
  }

  const handleStartRoute = () => {
    navigate(nextRoute)
  }

  const runCompatibilityCheck = async () => {
    setError('')
    setIsChecking(true)
    setTabReady(true)

    try {
      const { stream } = await startProctoring({
        onViolation: (message) => {
          setTabReady(false)
          setError(message)
        },
        onError: (message) => setError(message)
      })

      attachPreview(stream)
      setCameraReady(stream.getVideoTracks().length > 0)
      setMicReady(stream.getAudioTracks().length > 0)
      setRecordingReady(isProctoringActive())
      setTabReady(!document.hidden && document.hasFocus())
    } catch (e) {
      setCameraReady(false)
      setMicReady(false)
      setRecordingReady(false)
      setError('Please allow camera and microphone permissions, then try again.')
    } finally {
      setIsChecking(false)
    }
  }

  const canStartTest = cameraReady && micReady && tabReady && recordingReady

  return (
    <div className="compat-wrapper">
      <Container className="compat-container">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="compat-card shadow-lg">
              <Card.Body className="p-4 p-md-5">
                {/* Logo */}
                <div className="text-center mb-4">
                  <img 
                    src={codevergeLogo} 
                    alt="Codeverge Logo" 
                    className="compat-logo"
                  />
                </div>
                
                <h2 className="compat-title">System Compatibility Check</h2>
                <p className="compat-subtitle">
                  Camera and microphone must be active. Recording starts before test begins.
                </p>

                {error && (
                  <Alert variant="danger" className="mt-3">
                    {error}
                  </Alert>
                )}

                <div className="preview-wrap mt-4">
                  <video ref={videoRef} autoPlay muted playsInline className="preview-video" />
                </div>

                <div className="status-grid mt-4">
                  <div className="status-item">
                    <FaCamera className="status-icon" />
                    <span>Camera</span>
                    {cameraReady ? <FaCheckCircle className="ok" /> : <FaTimesCircle className="bad" />}
                  </div>
                  <div className="status-item">
                    <FaMicrophone className="status-icon" />
                    <span>Microphone</span>
                    {micReady ? <FaCheckCircle className="ok" /> : <FaTimesCircle className="bad" />}
                  </div>
                  <div className="status-item">
                    <FaDesktop className="status-icon" />
                    <span>Tab Focus</span>
                    {tabReady ? <FaCheckCircle className="ok" /> : <FaTimesCircle className="bad" />}
                  </div>
                  <div className="status-item">
                    <FaVideo className="status-icon" />
                    <span>Recording</span>
                    {recordingReady ? <FaCheckCircle className="ok" /> : <FaTimesCircle className="bad" />}
                  </div>
                </div>

                <div className="actions mt-4">
                  <Button variant="outline-secondary" onClick={() => navigate(backRoute)}>
                    Back
                  </Button>
                  <Button variant="primary" onClick={runCompatibilityCheck} disabled={isChecking}>
                    {isChecking ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Checking...
                      </>
                    ) : (
                      'Run Compatibility Check'
                    )}
                  </Button>
                  <Button variant="success" onClick={handleStartRoute} disabled={!canStartTest}>
                    Start Test
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

export default CompatibilityCheck
