import React from 'react'
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { 
  FaCheckCircle, 
  FaEnvelope, 
  FaBell, 
  FaTrophy, 
  FaClock, 
  FaUserGraduate,
  FaBriefcase,
  FaChartLine,
  FaUsers,
  FaHandshake,
  FaStar,
  FaRocket,
  FaAward,
  FaClipboardCheck,
  FaCode
} from 'react-icons/fa'
import codevergeLogo from './codeverge.svg'
import './AllTestsCompleted.css'

const AllTestsCompleted = () => {
  const navigate = useNavigate()

  const handleGoToDashboard = () => {
    window.location.href = 'http://localhost:5175/'
  }

  const handleLogout = () => {
    localStorage.clear()
    window.location.href = 'http://localhost:5175/login'
  }

  return (
    <div className="all-tests-completed-wrapper">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <Card className="completion-card">
              <Card.Body className="text-center p-5">
                {/* Main Title */}
                <h1 className="completion-title mb-3">
                  Congratulations!
                </h1>

                {/* Professional Icons Row */}
                <div className="professional-icons mb-4">
                  <Row className="justify-content-center">
                    <Col xs={4} className="text-center">
                      <div className="icon-wrapper">
                        <FaClipboardCheck className="professional-icon" />
                        <small className="icon-label">Aptitude</small>
                      </div>
                    </Col>
                    <Col xs={4} className="text-center">
                      <div className="icon-wrapper">
                        <FaBriefcase className="professional-icon" />
                        <small className="icon-label">Technical</small>
                      </div>
                    </Col>
                    <Col xs={4} className="text-center">
                      <div className="icon-wrapper">
                        <FaCode className="professional-icon" />
                        <small className="icon-label">Coding</small>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Main Title */}
                <h1 className="completion-title mb-3">
                  Congratulations!
                </h1>

                {/* Completion Message */}
                <div className="completion-message mb-4">
                  <h3 className="mb-3">You have completed Aptitude, Technical, and Coding rounds.</h3>
                  <p className="lead text-muted">Your results are under review.</p>
                </div>

                {/* Next Steps Info */}
                <Alert variant="info" className="next-steps-alert mb-4">
                  <div className="alert-content">
                    <FaUserGraduate className="alert-icon me-2" />
                    <div>
                      <strong>Shortlisted candidates will be invited for the next round</strong>
                      <div className="mt-2">
                        <small>Updates will be shared via email or portal notification.</small>
                      </div>
                    </div>
                  </div>
                </Alert>

                {/* Contact Information */}
                <div className="contact-info mb-4">
                  <Row className="justify-content-center">
                    <Col md={6}>
                      <div className="info-item">
                        <FaEnvelope className="info-icon" />
                        <div>
                          <strong>Email Notifications</strong>
                          <p className="small text-muted mb-0">Check your email for updates</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="info-item">
                        <FaBell className="info-icon" />
                        <div>
                          <strong>Portal Notifications</strong>
                          <p className="small text-muted mb-0">Monitor your dashboard</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Timeline Info */}
                <div className="timeline-info mb-4">
                  <div className="timeline-item">
                    <FaChartLine className="timeline-icon" />
                    <div>
                      <strong>Review Process</strong>
                      <p className="small text-muted mb-0">Our team will carefully review your performance</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <FaUsers className="timeline-icon" />
                    <div>
                      <strong>Selection Process</strong>
                      <p className="small text-muted mb-0">Shortlisted candidates will be notified</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <FaHandshake className="timeline-icon" />
                    <div>
                      <strong>Next Steps</strong>
                      <p className="small text-muted mb-0">Interview rounds for selected candidates</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <FaAward className="timeline-icon" />
                    <div>
                      <strong>Final Selection</strong>
                      <p className="small text-muted mb-0">Join our team if successful</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={handleGoToDashboard}
                    className="me-3"
                  >
                    <FaUserGraduate className="me-2" />
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={handleLogout}
                  >
                    <FaRocket className="me-2" />
                    Logout
                  </Button>
                </div>

                {/* Footer Message */}
                <div className="footer-message mt-4">
                  <div className="footer-icons mb-3">
                    <FaStar className="footer-icon" />
                    <FaStar className="footer-icon" />
                    <FaStar className="footer-icon" />
                    <FaStar className="footer-icon" />
                    <FaStar className="footer-icon" />
                  </div>
                  <p className="small text-muted mb-0">
                    Thank you for participating in the CodeVerge assessment process.
                  </p>
                  <p className="small text-muted">
                    We appreciate your time and effort. Best of luck! 🚀
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default AllTestsCompleted
