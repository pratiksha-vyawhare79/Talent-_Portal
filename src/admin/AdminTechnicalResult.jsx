import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Spinner, Form, Modal } from 'react-bootstrap'
import { FiBarChart2, FiRefreshCw, FiEye, FiFilter, FiSearch, FiCode, FiTrash2 } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import './AdminTechnicalResult.css'

function AdminTechnicalResult() {
  const [results, setResults] = useState([])
  const [filteredResults, setFilteredResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [resultFilter, setResultFilter] = useState('all')
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [stats, setStats] = useState({
    totalResults: 0,
    passedCount: 0,
    failedCount: 0,
    averageScore: 0
  })
  const resultsPerPage = 5

  // Colors for charts
  const COLORS = ['#007bff', '#dc3545', '#ffc107', '#17a2b8', '#6f42c1']

  useEffect(() => {
    fetchResults()
  }, [])

  useEffect(() => {
    filterResults()
  }, [results, searchTerm, resultFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, resultFilter, results])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/technical-test-results/all')
      if (response.ok) {
        const data = await response.json()
        setResults(data || [])
        calculateStats(data || [])
      } else {
        console.error('Failed to fetch technical results')
      }
    } catch (error) {
      console.error('Error fetching technical results:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (resultsData) => {
    const total = resultsData.length
    const passed = resultsData.filter(r => r.passed === true).length
    const failed = resultsData.filter(r => r.passed === false).length
    const avgScore = total > 0 
      ? Math.round(resultsData.reduce((sum, r) => sum + (r.percentageScore || 0), 0) / total)
      : 0

    setStats({
      totalResults: total,
      passedCount: passed,
      failedCount: failed,
      averageScore: avgScore
    })
  }

  const filterResults = () => {
    let filtered = [...results]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.candidateEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by result type
    if (resultFilter !== 'all') {
      filtered = filtered.filter(result => {
        if (resultFilter === 'pass') return result.passed === true
        if (resultFilter === 'fail') return result.passed === false
        return true
      })
    }

    setFilteredResults(filtered)
  }

  const handleViewDetails = (result) => {
    setSelectedResult(result)
    setShowDetailsModal(true)
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedResult(null)
  }

  const handleDeleteResult = async (result) => {
    if (window.confirm(`Are you sure you want to delete the technical test result for ${result.candidateName || 'this candidate'}?`)) {
      try {
        const response = await fetch(`/api/technical-test-results/${result.id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          // Remove from local state
          setResults(prevResults => prevResults.filter(r => r.id !== result.id))
          setFilteredResults(prevResults => prevResults.filter(r => r.id !== result.id))
          
          // Recalculate stats
          const newResults = results.filter(r => r.id !== result.id)
          calculateStats(newResults)
          
          alert('Technical test result deleted successfully')
        } else {
          alert('Failed to delete technical test result')
        }
      } catch (error) {
        console.error('Error deleting technical test result:', error)
        alert('Error deleting technical test result')
      }
    }
  }

  // Prepare data for charts
  const resultDistributionData = [
    { name: 'Passed', value: stats.passedCount, color: '#28a745' },
    { name: 'Failed', value: stats.failedCount, color: '#dc3545' }
  ]

  const scoreRangeData = [
    { range: '0-20', count: results.filter(r => r.percentageScore >= 0 && r.percentageScore <= 20).length },
    { range: '21-40', count: results.filter(r => r.percentageScore >= 21 && r.percentageScore <= 40).length },
    { range: '41-60', count: results.filter(r => r.percentageScore >= 41 && r.percentageScore <= 60).length },
    { range: '61-80', count: results.filter(r => r.percentageScore >= 61 && r.percentageScore <= 80).length },
    { range: '81-100', count: results.filter(r => r.percentageScore >= 81 && r.percentageScore <= 100).length }
  ]

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  const formatTime = (seconds) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / resultsPerPage))
  const indexOfLastResult = currentPage * resultsPerPage
  const indexOfFirstResult = indexOfLastResult - resultsPerPage
  const currentResults = filteredResults.slice(indexOfFirstResult, indexOfLastResult)
  const pageStart = filteredResults.length === 0 ? 0 : indexOfFirstResult + 1
  const pageEnd = filteredResults.length === 0 ? 0 : Math.min(indexOfLastResult, filteredResults.length)

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return
    setCurrentPage(pageNumber)
  }

  return (
    <Card className="admin-content-card">
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FiCode className="me-2" />
            Technical Test Results
          </h5>
          <div className="admin-result-controls">
            <Button variant="outline-secondary" className="me-2" onClick={fetchResults} disabled={loading}>
              <FiRefreshCw className={`me-1 ${loading ? 'spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Container fluid className="p-0">

          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="admin-stat-card text-center">
                <Card.Body>
                  <FiBarChart2 size={40} className="text-primary mb-2" />
                  <h3>{stats.totalResults}</h3>
                  <p className="text-muted">Total Results</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="admin-stat-card text-center">
                <Card.Body>
                  <div className="text-success mb-2" style={{ fontSize: '40px' }}>✓</div>
                  <h3>{stats.passedCount}</h3>
                  <p className="text-muted">Passed</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="admin-stat-card text-center">
                <Card.Body>
                  <div className="text-danger mb-2" style={{ fontSize: '40px' }}>✗</div>
                  <h3>{stats.failedCount}</h3>
                  <p className="text-muted">Failed</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="admin-stat-card text-center">
                <Card.Body>
                  <div className="text-info mb-2" style={{ fontSize: '40px' }}>Ø</div>
                  <h3>{stats.averageScore}%</h3>
                  <p className="text-muted">Average Score</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts Section */}
          <Row className="mb-4">
            <Col md={6} className="mb-3">
              <Card className="admin-content-card">
                <Card.Header>
                  <h5 className="mb-0">Result Distribution</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={resultDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {resultDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} className="mb-3">
              <Card className="admin-content-card">
                <Card.Header>
                  <h5 className="mb-0">Score Range Distribution</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={scoreRangeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="range" stroke="#e2e8f0" />
                      <YAxis stroke="#e2e8f0" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="count" fill="#007bff" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filters Section */}
          <Row className="mb-4">
            <Col md={12}>
              <Card className="admin-content-card">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <Form.Group className="mb-0">
                        <Form.Label className="d-flex align-items-center">
                          <FiSearch className="me-2" />
                          Search
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Search by name or email..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-0">
                        <Form.Label className="d-flex align-items-center">
                          <FiFilter className="me-2" />
                          Filter by Result
                        </Form.Label>
                        <Form.Select
                          value={resultFilter}
                          onChange={(e) => setResultFilter(e.target.value)}
                        >
                          <option value="all">All Results</option>
                          <option value="pass">Passed Only</option>
                          <option value="fail">Failed Only</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <div className="text-muted mt-4">
                        Showing {filteredResults.length} of {results.length} results
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Results Table */}
          <Row>
            <Col md={12}>
              <Card className="admin-content-card">
                <Card.Header>
                  <h5 className="mb-0">Technical Test Results</h5>
                </Card.Header>
                <Card.Body>
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : filteredResults.length === 0 ? (
                    <div className="text-center py-5">
                      <p className="text-muted">
                        {results.length === 0 ? 'No technical results found in database.' : 'No results match your filters.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Table striped bordered hover responsive className="results-table">
                        <thead>
                          <tr>
                            <th>Candidate Name</th>
                            <th>Email</th>
                            <th>Total Questions</th>
                            <th>Correct</th>
                            <th>Score %</th>
                            <th>Result</th>
                            <th>Test Date</th>
                            <th>Time Taken</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentResults.map((result, index) => (
                            <tr key={result.id || index}>
                              <td>{result.candidateName || 'N/A'}</td>
                              <td>{result.candidateEmail || 'N/A'}</td>
                              <td className="text-center">{result.totalQuestions || 0}</td>
                              <td className="text-center">{result.totalCorrect || 0}</td>
                              <td className="text-center fw-bold">{result.percentageScore || 0}%</td>
                              <td className="text-center">
                                <span className={`badge ${result.passed ? 'bg-success' : 'bg-danger'}`}>
                                  {result.passed ? 'PASS' : 'FAIL'}
                                </span>
                              </td>
                              <td>{formatDate(result.testDate)}</td>
                              <td className="text-center">{formatTime(result.timeTakenSeconds)}</td>
                              <td className="text-center">
                                <div className="btn-group" role="group">
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleViewDetails(result)}
                                    title="View Details"
                                    className="action-btn view-btn"
                                  >
                                    <FiEye />
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDeleteResult(result)}
                                    title="Delete Result"
                                    disabled={loading}
                                    className="action-btn delete-btn"
                                  >
                                    <FiTrash2 />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                      <div className="results-pagination-controls d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                        <div className="pagination-info">
                          <span>
                            Showing {pageStart}-{pageEnd} of {filteredResults.length} results, page {currentPage} of {totalPages}
                          </span>
                        </div>
                        <nav aria-label="Technical result pagination">
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
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Details Modal */}
          <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>Technical Test Result Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedResult && (
                <Row>
                  <Col md={6}>
                    <h5>Candidate Information</h5>
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td><strong>Name:</strong></td>
                          <td>{selectedResult.candidateName || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td><strong>Email:</strong></td>
                          <td>{selectedResult.candidateEmail || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td><strong>Test Date:</strong></td>
                          <td>{formatDate(selectedResult.testDate)}</td>
                        </tr>
                        <tr>
                          <td><strong>Submitted At:</strong></td>
                          <td>{formatDate(selectedResult.submittedAt)}</td>
                        </tr>
                        <tr>
                          <td><strong>IP Address:</strong></td>
                          <td>{selectedResult.ipAddress || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={6}>
                    <h5>Score Breakdown</h5>
                    <Table borderless>
                      <tbody>
                        <tr>
                          <td><strong>Total Questions:</strong></td>
                          <td>{selectedResult.totalQuestions || 0}</td>
                        </tr>
                        <tr>
                          <td><strong>Total Correct:</strong></td>
                          <td className="text-success fw-bold">{selectedResult.totalCorrect || 0}</td>
                        </tr>
                        <tr>
                          <td><strong>Total Answered:</strong></td>
                          <td>{selectedResult.totalAnswered || 0}</td>
                        </tr>
                        <tr>
                          <td><strong>Percentage Score:</strong></td>
                          <td className="fw-bold">{selectedResult.percentageScore || 0}%</td>
                        </tr>
                        <tr>
                          <td><strong>Final Result:</strong></td>
                          <td>
                            <span className={`badge ${selectedResult.passed ? 'bg-success' : 'bg-danger'}`}>
                              {selectedResult.passed ? 'PASS' : 'FAIL'}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Time Taken:</strong></td>
                          <td>{formatTime(selectedResult.timeTakenSeconds)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseDetailsModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </Card.Body>
    </Card>
  )
}

export default AdminTechnicalResult
