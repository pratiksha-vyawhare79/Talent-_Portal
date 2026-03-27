import React, { useState, useEffect, useRef } from 'react'
import { Container, Row, Col, Card, Button, Table, Spinner, Form, Modal, Badge, Alert, Nav } from 'react-bootstrap'
import { FiEye, FiRefreshCw, FiFilter, FiSearch, FiStar, FiMail, FiCheck, FiX, FiBarChart2, FiUsers, FiFileText, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import './CodingResultPage.css'

function CodingResultPage() {
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [resultFilter, setResultFilter] = useState('all')
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [showEmailSuccess, setShowEmailSuccess] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const isSendingRef = useRef(false)
  
  // Load sent emails from localStorage on component mount
  const [sentEmails, setSentEmails] = useState(() => {
    const saved = localStorage.getItem('sentEmails')
    return saved ? new Set(JSON.parse(saved)) : new Set()
  })
  
  // Save sent emails to localStorage whenever it changes
  const updateSentEmails = (newSentEmails) => {
    setSentEmails(newSentEmails)
    localStorage.setItem('sentEmails', JSON.stringify([...newSentEmails]))
  }
  
  const [reviewData, setReviewData] = useState({
    rating: 5,
    feedback: '',
    reviewerId: ''
  })
  const [emailData, setEmailData] = useState({
    to: '',
    subject: 'Congratulations on Coding Test Success!',
    body: ''
  })
  const [marksData, setMarksData] = useState({})
  const [stats, setStats] = useState({
    totalResults: 0,
    passedCount: 0,
    failedCount: 0,
    averageScore: 0
  })
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 1

  // Navigation handlers
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/admin/login'
  }

  const handleOpenCodingQuestions = () => {
    navigate('/admin/coding-questions')
  }

  const handleOpenDashboard = () => {
    navigate('/admin/dashboard')
  }

  const handleDelete = async (result) => {
    if (!window.confirm(`Are you sure you want to delete this coding result for User ${result.name || result.userId}?`)) {
      return
    }

    try {
      console.log('🔍 DEBUG: handleDelete called for resultId:', result.id)
      const response = await fetch(`http://localhost:8080/api/coding-results/${result.id}`, {
        method: 'DELETE'
      })
      console.log('🔍 DEBUG: Delete API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('🔍 DEBUG: Delete API response data:', data)
        alert('Coding result deleted successfully!')
        fetchResults() // Refresh results
      } else {
        console.error('Failed to delete coding result')
        alert('Failed to delete coding result')
      }
    } catch (error) {
      console.error('Error deleting coding result:', error)
      alert('Error deleting coding result')
    }
  }

  const handleMarksUpdate = async (resultId) => {
    try {
      const marks = marksData[resultId] || 0
      console.log('🔍 DEBUG: handleMarksUpdate called for resultId:', resultId, 'with marks:', marks)
      const response = await fetch(`http://localhost:8080/api/coding-results/${resultId}/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score: marks })
      })
      console.log('🔍 DEBUG: API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('🔍 DEBUG: API response data:', data)
        alert('Score updated successfully!')
        fetchResults() // Refresh results
      } else {
        console.error('Failed to update score')
        alert('Failed to update score')
      }
    } catch (error) {
      console.error('Error updating score:', error)
      alert('Error updating score')
    }
  }

  useEffect(() => {
    fetchResults()
  }, [])

  useEffect(() => {
    filterResults()
  }, [results, searchTerm, resultFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [results, searchTerm, resultFilter])

  const fetchResults = async () => {
    console.log('fetchResults called')
    try {
      setLoading(true)
      console.log('Making request to http://localhost:8080/api/coding-results/all')
      const response = await fetch('http://localhost:8080/api/coding-results/all')
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Data received:', data)
        setResults(data || [])
        calculateStats(data || [])
      } else {
        console.error('Failed to fetch coding results')
      }
    } catch (error) {
      console.error('Error fetching coding results:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const calculateStats = (data) => {
    const total = data.length
    const passed = data.filter(result => {
      const totalScore = result.totalScore || result.score || 0
      return totalScore >= 10
    }).length
    const failed = total - passed
    const avgScore = total > 0 ? data.reduce((sum, result) => sum + (result.totalScore || result.score || 0), 0) / total : 0

    setStats({
      totalResults: total,
      passedCount: passed,
      failedCount: failed,
      averageScore: avgScore.toFixed(2)
    })
  }

  const filterResults = () => {
    let filtered = results

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(result =>
        (result.name && result.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (result.email && result.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (result.userId && result.userId.toString().includes(searchTerm))
      )
    }

    // Filter by result status
    if (resultFilter !== 'all') {
      filtered = filtered.filter(result => {
        const totalScore = result.totalScore || result.score || 0
        if (resultFilter === 'passed') return totalScore >= 10
        if (resultFilter === 'failed') return totalScore < 10
        return true
      })
    }

    setFilteredResults(filtered)
  }

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / resultsPerPage))
  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult)
  const pageStart = filteredResults.length === 0 ? 0 : indexOfFirstResult + 1
  const pageEnd = filteredResults.length === 0 ? 0 : Math.min(indexOfLastResult, filteredResults.length)

  const handleViewCode = async (result) => {
    try {
      console.log('🔍 DEBUG: handleViewCode called with result:', result)
      const response = await fetch(`http://localhost:8080/api/coding-results/${result.id}`)
      console.log('🔍 DEBUG: API response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('🔍 DEBUG: API response data:', data)
        setSelectedResult({ ...result, ...data })
        setShowCodeModal(true)
      }
    } catch (error) {
      console.error('Error fetching submission details:', error)
    }
  }

  const handleReview = (result) => {
    setSelectedResult(result)
    
    // Check if review already exists
    if (result.admin_feedback || result.admin_rating) {
      // Show existing review mode
      setReviewData({
        rating: result.admin_rating || 0,
        feedback: result.admin_feedback || '',
        reviewerId: result.admin_reviewer_id || '',
        reviewedAt: result.admin_reviewed_at || '',
        isExistingReview: true
      })
    } else {
      // Show add new review mode
      setReviewData({
        rating: 5,
        feedback: '',
        reviewerId: '',
        isExistingReview: false
      })
    }
    
    setShowReviewModal(true)
  }

  const submitReview = async () => {
    try {
      console.log('🔍 DEBUG: submitReview called with reviewData:', reviewData)
      const response = await fetch(`http://localhost:8080/api/coding-results/${selectedResult.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData)
      })
      console.log('🔍 DEBUG: Review API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('🔍 DEBUG: Review API response data:', data)
        alert('Review submitted successfully!')
        setShowReviewModal(false)
        fetchResults() // Refresh results
      } else {
        console.error('Failed to submit review')
        alert('Failed to submit review')
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      alert('Error submitting review')
    }
  }

  const handleSendEmail = (result) => {
    setSelectedResult(result)
    
    // Check if result is pass or fail
    const isPass = (result.totalScore || result.score || 0) >= 10
    const studentName = result.first_name && result.last_name ? `${result.first_name} ${result.last_name}` : 'Candidate'
    
    if (isPass) {
      // Pass message
      setEmailData({
        to: result.user_email || '',
        subject: 'Congratulations! You Passed the Coding Test',
        body: `Dear ${studentName},\n\nYou have passed the coding test.\n\nYour next round is Project and Interview. We will contact you soon.\n\nPlease check your email regularly for updates.\n\nBest regards,\nCodeverge Team`
      })
    } else {
      // Fail message
      setEmailData({
        to: result.user_email || '',
        subject: 'Coding Test Result - Next Steps',
        body: `Dear ${studentName},\n\nWe regret to inform you that you have not qualified for the next round.\n\nThank you for your effort and participation in the coding test.\n\nBest regards,\nCodeverge Team`
      })
    }
    
    setShowEmailModal(true)
  }

  const sendEmail = async () => {
    // Prevent multiple clicks using both state and ref
    if (isSendingRef.current || isSendingEmail || sentEmails.has(selectedResult.id)) {
      console.log('🔍 DEBUG: Email send blocked - already sending or already sent')
      return
    }
    
    console.log('🔍 DEBUG: Starting email send for result:', selectedResult.id)
    
    // Set both state and ref to true
    isSendingRef.current = true
    setIsSendingEmail(true)
    
    try {
      const response = await fetch(`http://localhost:8080/api/coding-results/${selectedResult.id}/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailData.to,
          subject: emailData.subject,
          body: emailData.body
        })
      })

      console.log('🔍 DEBUG: Email API response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('🔍 DEBUG: Email sent successfully:', result)
        
        // Track that email was sent for this result
        updateSentEmails(new Set([...sentEmails, selectedResult.id]))
        
        // Show success popup
        setShowEmailSuccess(true)
        
        // Hide success popup after 3 seconds
        setTimeout(() => {
          setShowEmailSuccess(false)
        }, 3000)
        
        setShowEmailModal(false)
      } else {
        console.error('🔍 DEBUG: Email send failed')
        alert('Failed to send email')
      }
    } catch (error) {
      console.error('🔍 DEBUG: Email send error:', error)
      alert('Error sending email')
    } finally {
      // Reset both state and ref
      setIsSendingEmail(false)
      isSendingRef.current = false
      console.log('🔍 DEBUG: Email sending completed, ref reset to false')
    }
  }

  const getScoreColor = (score) => {
    const totalScore = score || 0
    if (totalScore >= 10) return 'success'
    return 'danger'
  }

  const getScoreBadge = (score) => {
    const totalScore = score || 0
    if (totalScore >= 10) return 'Pass'
    return 'Fail'
  }

  if (loading) {
    return (
      <Container fluid className="coding-result-page">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    )
  }

  return (
    <div className="admin-dashboard-wrapper">
      <Container fluid className="admin-dashboard-container">
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h1 className="admin-dashboard-title">Coding Test Results</h1>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={3}>
            <Nav variant="pills" className="flex-column admin-nav">
              <Nav.Item>
                <Nav.Link onClick={handleOpenDashboard}>
                  <FiBarChart2 className="me-2" />
                  Overview
                </Nav.Link>
              </Nav.Item>
              
              {/* Aptitude Test Section */}
              <Nav.Item>
                <Nav.Link onClick={() => navigate('/admin/dashboard')}>
                  <FiUsers className="me-2" />
                  Register Student
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => navigate('/admin/dashboard')}>
                  <FiFileText className="me-2" />
                  Aptitude Questions
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => navigate('/admin/dashboard')}>
                  <FiBarChart2 className="me-2" />
                  Aptitude Test Results
                </Nav.Link>
              </Nav.Item>
              
              {/* Technical MCQ Section */}
              <Nav.Item>
                <Nav.Link onClick={() => navigate('/admin/dashboard')}>
                  <FiFileText className="me-2" />
                  Technical MCQ
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => navigate('/admin/dashboard')}>
                  <FiBarChart2 className="me-2" />
                  Technical Results
                </Nav.Link>
              </Nav.Item>
              
              {/* Coding Section */}
              <Nav.Item>
                <Nav.Link onClick={handleOpenCodingQuestions}>
                  <FiFileText className="me-2" />
                  Coding Questions
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link active>
                  <FiBarChart2 className="me-2" />
                  Coding Results
                </Nav.Link>
              </Nav.Item>
              
              <div className="mt-3 pt-3 border-top border-secondary">
                <Nav.Item>
                  <Button variant="outline-danger" className="w-100" onClick={handleLogout}>
                    <FiLogOut className="me-2" />
                    Logout
                  </Button>
                </Nav.Item>
              </div>
            </Nav>
          </Col>
          <Col md={9}>
            {/* Page Content */}
            <div className="page-header">
              <p className="page-subtitle">View and manage coding test results</p>
            </div>

            {/* Stats Cards */}
            <Row className="mb-4">
              <Col md={3} className="mb-4">
                <Card className="admin-stat-card text-center">
                  <Card.Body>
                    <h3>{stats.totalResults}</h3>
                    <p className="text-muted">Total Results</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-4">
                <Card className="admin-stat-card text-center">
                  <Card.Body>
                    <h3 className="text-success">{stats.passedCount}</h3>
                    <p className="text-muted">Passed</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-4">
                <Card className="admin-stat-card text-center">
                  <Card.Body>
                    <h3 className="text-danger">{stats.failedCount}</h3>
                    <p className="text-muted">Failed</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-4">
                <Card className="admin-stat-card text-center">
                  <Card.Body>
                    <h3>{stats.averageScore}</h3>
                    <p className="text-muted">Average Score</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Controls */}
            <Row className="mb-4">
              <Col md={12}>
                <Card className="admin-content-card">
                  <Card.Body>
                    <div className="admin-result-controls">
                      <div className="d-flex gap-2 align-items-center">
                        <FiSearch className="text-muted" />
                        <Form.Control
                          type="text"
                          placeholder="Search by name, email or user ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ width: '300px' }}
                        />
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <FiFilter className="text-muted" />
                        <Form.Select
                          value={resultFilter}
                          onChange={(e) => setResultFilter(e.target.value)}
                          style={{ width: '150px' }}
                        >
                          <option value="all">All Results</option>
                          <option value="passed">Passed Only</option>
                          <option value="failed">Failed Only</option>
                        </Form.Select>
                      </div>
                      <Button variant="outline-secondary" onClick={fetchResults} disabled={loading}>
                        <FiRefreshCw className={loading ? 'spin' : ''} />
                        Refresh
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Results Table */}
            <Row>
              <Col md={12}>
                <Card className="admin-content-card">
                  <Card.Header>
                    <h5 className="mb-0">Coding Test Results</h5>
                  </Card.Header>
                  <Card.Body>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>User Name</th>
                          <th>Email</th>
                          <th>Score</th>
                          <th>Total Marks</th>
                          <th>Status</th>
                          <th>Submitted At</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentResults.map((result) => (
                          <tr key={result.id}>
                            <td>{result.userId}</td>
                            <td>{result.first_name && result.last_name ? `${result.first_name} ${result.last_name}` : 'N/A'}</td>
                            <td>{result.user_email || 'N/A'}</td>
                            <td>
                              <div className="mb-2">
                                <Form.Control
                                  type="number"
                                  min="0"
                                  max="20"
                                  placeholder="Enter marks"
                                  value={marksData[result.id] || result.score || 0}
                                  onChange={(e) => setMarksData({...marksData, [result.id]: parseInt(e.target.value) || 0})}
                                  style={{ width: '100px', color: '#000000' }}
                                />
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  className="ms-2"
                                  onClick={() => handleMarksUpdate(result.id)}
                                >
                                  Update
                                </Button>
                              </div>
                              <Badge bg={getScoreColor(marksData[result.id] || result.score || 0)}>
                                {marksData[result.id] || result.score || 0}/20
                              </Badge>
                            </td>
                            <td>20</td>
                            <td>
                              <Badge bg={getScoreColor(marksData[result.id] || result.score || 0)}>
                                {getScoreBadge(marksData[result.id] || result.score || 0)}
                              </Badge>
                            </td>
                            <td>{result.submitted_at ? new Date(result.submitted_at).toLocaleString() : 'N/A'}</td>
                            <td>
                              <div className="action-buttons">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleViewCode(result)}
                                  title="View Code"
                                >
                                  <FiEye />
                                </Button>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleReview(result)}
                                  title="Add Review"
                                >
                                  <FiStar />
                                </Button>
                                <Button
                                  variant={sentEmails.has(result.id) ? "outline-success" : "outline-info"}
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleSendEmail(result)}
                                  title={sentEmails.has(result.id) ? "Email Already Sent" : "Send Email"}
                                  disabled={sentEmails.has(result.id) || isSendingEmail || (isSendingRef.current && selectedResult?.id === result.id)}
                                >
                                  {(isSendingRef.current && selectedResult?.id === result.id) ? (
                                    <Spinner animation="border" size="sm" />
                                  ) : sentEmails.has(result.id) ? (
                                    <FiCheck />
                                  ) : (
                                    <FiMail />
                                  )}
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(result)}
                                  title="Delete"
                                >
                                  <FiX />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    
                    {/* Pagination Controls */}
                    {filteredResults.length > 0 && (
                      <div className="results-pagination-controls d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mt-3">
                        <div className="pagination-info">
                          <span>
                            Showing {pageStart}-{pageEnd} of {filteredResults.length} results, page {currentPage} of {totalPages}
                          </span>
                        </div>
                        <nav aria-label="Coding result pagination">
                          <ul className="pagination mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                aria-label="Go to previous page"
                              >
                                Previous
                              </button>
                            </li>
                            <li className="page-item active">
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage)}
                                aria-label={`Current page ${currentPage}`}
                                aria-current="page"
                              >
                                {currentPage}
                              </button>
                            </li>
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                aria-label="Go to next page"
                              >
                                Next
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                    
                    {filteredResults.length === 0 && (
                      <div className="text-center py-4">
                        <p className="text-muted">No results found matching your criteria.</p>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>

      {/* View Code Modal */}
      <Modal show={showCodeModal} onHide={() => setShowCodeModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Coding Solution - User {selectedResult?.userId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult && (
            <div>
              <Row className="mb-4">
                <Col md={12}>
                  <h5 className="text-center mb-3">Question 1</h5>
                  <Card className="code-card">
                    <Card.Header>
                      <strong>Question:</strong> {selectedResult.question_text || 'N/A'}
                    </Card.Header>
                    <Card.Body>
                      <div className="code-display">
                        <pre>{selectedResult.question_text || 'No question available'}</pre>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="mb-4">
                <Col md={12}>
                  <h5 className="text-center mb-3">Answer 1</h5>
                  <Card className="code-card">
                    <Card.Header>
                      <strong>Language:</strong> {selectedResult.language || 'N/A'}
                    </Card.Header>
                    <Card.Body>
                      <div className="code-display">
                        <pre>{selectedResult.user_code || 'No code available'}</pre>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCodeModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {reviewData.isExistingReview ? 'View Review' : 'Add Review'} - User {selectedResult?.userId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {reviewData.isExistingReview ? (
            // Show existing review
            <div>
              <h5>Existing Review</h5>
              <hr />
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Reviewer ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={reviewData.reviewerId}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa', color: '#000000' }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control
                    type="number"
                    value={reviewData.rating}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa', color: '#000000' }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={reviewData.feedback}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa', color: '#000000' }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Reviewed At</Form.Label>
                  <Form.Control
                    type="text"
                    value={reviewData.reviewedAt ? new Date(reviewData.reviewedAt).toLocaleString() : 'N/A'}
                    readOnly
                    style={{ backgroundColor: '#f8f9fa', color: '#000000' }}
                  />
                </Form.Group>
              </Form>
            </div>
          ) : (
            // Show add new review form
            <div>
              <h5>Add New Review</h5>
              <hr />
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Reviewer ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={reviewData.reviewerId}
                    onChange={(e) => setReviewData({...reviewData, reviewerId: e.target.value})}
                    placeholder="Enter reviewer ID..."
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rating (1-10)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="10"
                    value={reviewData.rating}
                    onChange={(e) => setReviewData({...reviewData, rating: parseInt(e.target.value)})}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Feedback</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={reviewData.feedback}
                    onChange={(e) => setReviewData({...reviewData, feedback: e.target.value})}
                    placeholder="Enter your feedback..."
                  />
                </Form.Group>
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Close
          </Button>
          {!reviewData.isExistingReview && (
            <Button variant="primary" onClick={submitReview}>
              Add Review
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Email Modal */}
      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {emailData.subject.includes('Congratulations') ? 'Send Congratulations Email' : 'Send Result Email'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>To</Form.Label>
              <Form.Control
                type="email"
                value={emailData.to}
                onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                placeholder="recipient@example.com"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                value={emailData.subject}
                onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                value={emailData.body}
                onChange={(e) => setEmailData({...emailData, body: e.target.value})}
                placeholder="Enter your message..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={sendEmail} disabled={isSendingEmail}>
            {isSendingEmail ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Sending...
              </>
            ) : (
              'Send Email'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Email Success Popup */}
      {showEmailSuccess && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#28a745',
          color: 'white',
          padding: '20px 30px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          zIndex: '9999',
          fontSize: '16px',
          fontWeight: '600'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FiCheck style={{ fontSize: '20px' }} />
            <span>Email sent successfully!</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default CodingResultPage
