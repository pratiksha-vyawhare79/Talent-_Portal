import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, Modal, Form, Table, Alert } from 'react-bootstrap'
import { FaStar, FaClock, FaUser, FaCheckCircle, FaTimesCircle, FaEnvelope, FaEye, FaEdit, FaTrash } from 'react-icons/fa'

const CodingReviewDashboard = () => {
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [statistics, setStatistics] = useState({})
  const [loading, setLoading] = useState(true)
  const [reviewData, setReviewData] = useState({
    admin_rating: '',
    admin_feedback: '',
    status: ''
  })

  useEffect(() => {
    fetchSubmissions()
    fetchStatistics()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/coding-review/all')
      const data = await response.json()
      setSubmissions(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching submissions:', error)
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/coding-review/statistics')
      const data = await response.json()
      setStatistics(data)
    } catch (error) {
      console.error('Error fetching statistics:', error)
    }
  }

  const handleViewSubmission = async (testSessionId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/coding-review/submission/${testSessionId}`)
      const data = await response.json()
      setSelectedSubmission(data)
      setShowReviewModal(true)
    } catch (error) {
      console.error('Error fetching submission details:', error)
    }
  }

  const handleReviewQuestion = async (resultId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/coding-review/question/${resultId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_rating: reviewData.admin_rating,
          admin_feedback: reviewData.admin_feedback,
          admin_id: 1 // Get from auth context
        })
      })
      
      if (response.ok) {
        alert('Question review saved successfully')
        // Refresh submission details
        handleViewSubmission(selectedSubmission.test_session_id)
      }
    } catch (error) {
      console.error('Error saving review:', error)
      alert('Error saving review')
    }
  }

  const handleUpdateStatus = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/coding-review/submission/${selectedSubmission.test_session_id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: reviewData.status,
          overall_admin_rating: reviewData.overall_admin_rating,
          admin_id: 1 // Get from auth context
        })
      })
      
      if (response.ok) {
        alert('Status updated successfully')
        setShowReviewModal(false)
        fetchSubmissions()
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Error updating status')
    }
  }

  const handleSendEmail = async (type) => {
    try {
      const endpoint = type === 'qualified' 
        ? 'send-qualification-email' 
        : 'send-rejection-email'
      
      const response = await fetch(`http://localhost:8080/api/coding-review/submission/${selectedSubmission.test_session_id}/${endpoint}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        alert(`${type === 'qualified' ? 'Qualification' : 'Rejection'} email sent successfully`)
        setShowEmailModal(false)
        fetchSubmissions()
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Error sending email')
    }
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      'PENDING_REVIEW': 'warning',
      'IN_REVIEW': 'info',
      'APPROVED': 'success',
      'REJECTED': 'danger',
      'QUALIFIED': 'primary',
      'NOT_QUALIFIED': 'secondary'
    }
    
    return <Badge bg={statusColors[status] || 'secondary'}>{status.replace('_', ' ')}</Badge>
  }

  const renderStars = (rating) => {
    if (!rating) return 'Not Rated'
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar 
        key={i} 
        color={i < Math.floor(rating / 2) ? '#F4780A' : '#ddd'} 
      />
    ))
  }

  if (loading) {
    return <div className="text-center py-5">Loading...</div>
  }

  return (
    <div className="coding-review-dashboard">
      <Container fluid className="py-4">
        <h2 className="mb-4">Coding Test Review Dashboard</h2>
        
        {/* Statistics Cards */}
        <Row className="mb-4">
          <Col md={2}>
            <Card className="text-center">
              <Card.Body>
                <h3>{statistics.total_submissions || 0}</h3>
                <p className="mb-0">Total Submissions</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning">{statistics.pending_review || 0}</h3>
                <p className="mb-0">Pending Review</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success">{statistics.qualified || 0}</h3>
                <p className="mb-0">Qualified</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-danger">{statistics.rejected || 0}</h3>
                <p className="mb-0">Rejected</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <Card.Body>
                <h3>{statistics.average_rating || 0}</h3>
                <p className="mb-0">Avg Rating</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={2}>
            <Card className="text-center">
              <Card.Body>
                <h3>{statistics.emails_sent_today || 0}</h3>
                <p className="mb-0">Emails Sent Today</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Submissions Table */}
        <Card>
          <Card.Header>
            <h5 className="mb-0">Coding Test Submissions</h5>
          </Card.Header>
          <Card.Body>
            <Table striped hover responsive>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Email</th>
                  <th>Questions</th>
                  <th>Time Taken</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.test_session_id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaUser className="me-2" />
                        {submission.user_name}
                      </div>
                    </td>
                    <td>{submission.user_email}</td>
                    <td>
                      {submission.questions_attempted}/{submission.total_questions}
                    </td>
                    <td>
                      <FaClock className="me-1" />
                      {Math.floor(submission.total_time_taken_seconds / 60)}m
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        {renderStars(submission.overall_admin_rating)}
                        <span className="ms-2">
                          {submission.overall_admin_rating || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td>{getStatusBadge(submission.status)}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleViewSubmission(submission.test_session_id)}
                      >
                        <FaEye /> Review
                      </Button>
                      {submission.status === 'QUALIFIED' && !submission.qualification_email_sent && (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => {
                            setSelectedSubmission(submission)
                            setShowEmailModal(true)
                          }}
                        >
                          <FaEnvelope /> Send Email
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* Review Modal */}
        <Modal show={showReviewModal} size="xl" onHide={() => setShowReviewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Review Coding Test - {selectedSubmission?.user_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedSubmission && (
              <div>
                {/* Test Summary */}
                <Row className="mb-4">
                  <Col md={6}>
                    <h5>Test Summary</h5>
                    <p><strong>Total Questions:</strong> {selectedSubmission.total_questions}</p>
                    <p><strong>Questions Attempted:</strong> {selectedSubmission.questions_attempted}</p>
                    <p><strong>Time Taken:</strong> {Math.floor(selectedSubmission.total_time_taken_seconds / 60)} minutes</p>
                  </Col>
                  <Col md={6}>
                    <h5>Update Status</h5>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={reviewData.status}
                        onChange={(e) => setReviewData({...reviewData, status: e.target.value})}
                      >
                        <option value="">Select Status</option>
                        <option value="QUALIFIED">Qualified for Project Round</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="IN_REVIEW">In Review</option>
                        <option value="APPROVED">Approved</option>
                      </Form.Select>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Overall Rating (1-10)</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="10"
                        value={reviewData.overall_admin_rating}
                        onChange={(e) => setReviewData({...reviewData, overall_admin_rating: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Question Reviews */}
                <h5>Question Reviews</h5>
                {selectedSubmission.question_results?.map((question, index) => (
                  <Card key={question.id} className="mb-3">
                    <Card.Header>
                      <h6 className="mb-0">Question {index + 1}</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Question:</strong> {question.question_text}</p>
                      <pre className="bg-light p-3 rounded">
                        <code>{question.user_code}</code>
                      </pre>
                      <Row className="mt-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Rating (1-10)</Form.Label>
                            <Form.Control
                              type="number"
                              min="1"
                              max="10"
                              placeholder={question.admin_rating || 'Not rated'}
                              onChange={(e) => {
                                const updatedQuestions = [...selectedSubmission.question_results]
                                updatedQuestions[index].admin_rating = e.target.value
                                setSelectedSubmission({...selectedSubmission, question_results: updatedQuestions})
                              }}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label>Feedback</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              placeholder={question.admin_feedback || 'Add feedback...'}
                              onChange={(e) => {
                                const updatedQuestions = [...selectedSubmission.question_results]
                                updatedQuestions[index].admin_feedback = e.target.value
                                setSelectedSubmission({...selectedSubmission, question_results: updatedQuestions})
                              }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleReviewQuestion(question.id)}
                      >
                        <FaCheckCircle /> Save Review
                      </Button>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleUpdateStatus}>
              Update Status
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Email Modal */}
        <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Send Email to {selectedSubmission?.user_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Alert variant="info">
              <h6>Email Preview</h6>
              <p><strong>To:</strong> {selectedSubmission?.user_email}</p>
              <p><strong>Subject:</strong> {selectedSubmission?.status === 'QUALIFIED' 
                ? 'Congratulations! You Have Qualified for the Project Round'
                : 'Update on Your Coding Test Results'
              }</p>
              <hr />
              <p>Dear {selectedSubmission?.user_name},</p>
              <p>
                {selectedSubmission?.status === 'QUALIFIED'
                  ? 'We are pleased to inform you that you have successfully passed the coding test and have been selected for the next round - the Project Round.'
                  : 'Thank you for participating in our coding test. After thorough evaluation, we regret to inform you that your performance did not meet the criteria for advancing to the next round.'
                }
              </p>
              <p>Best regards,<br />The Talent Portal Team</p>
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
              Cancel
            </Button>
            <Button 
              variant={selectedSubmission?.status === 'QUALIFIED' ? 'success' : 'danger'}
              onClick={() => handleSendEmail(selectedSubmission?.status === 'QUALIFIED' ? 'qualified' : 'rejected')}
            >
              <FaEnvelope /> Send Email
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  )
}

export default CodingReviewDashboard
