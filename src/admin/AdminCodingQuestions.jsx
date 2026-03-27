import React, { useState, useEffect } from 'react'
import { Button, Card, Col, Container, Form, Modal, Row, Table, Badge, Alert, Spinner, Nav } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FiUsers, FiFileText, FiBarChart2, FiLogOut } from 'react-icons/fi'
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaFilter,
  FaClock,
  FaChartBar,
  FaSave,
  FaTimes,
  FaQuestionCircle
} from 'react-icons/fa'
import './AdminDashboard.css'
import './AdminCodingQuestions.css'

const AdminCodingQuestions = () => {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])
  const [filteredQuestions, setFilteredQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'ALGORITHM',
    difficultyLevel: 'EASY',
    programmingLanguage: 'JAVASCRIPT',
    timeLimitMinutes: 30,
    sampleInput: '',
    expectedOutput: '',
    constraints: '',
    hints: '',
    solutionCode: '',
    testCases: '[{"input": "", "output": ""}]',
    points: 10,
    isActive: true
  })
  const [filters, setFilters] = useState({
    difficulty: '',
    language: '',
    type: '',
    search: ''
  })
  const [stats, setStats] = useState({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0
  })

  const toText = (value) => (value ?? '').toString()

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/coding-questions/all')
      if (response.ok) {
        const data = await response.json()
        setQuestions(data)
        setFilteredQuestions(data)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/coding-questions/stats')
      if (response.ok) {
        const data = await response.json()
        setStats({
          total: data.totalQuestions || 0,
          easy: data.easyQuestions || 0,
          medium: data.mediumQuestions || 0,
          hard: data.hardQuestions || 0
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const applyFilters = () => {
    let filtered = questions

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter((q) => {
        const questionText = toText(q.questionText).toLowerCase()
        const constraints = toText(q.constraints).toLowerCase()
        const hints = toText(q.hints).toLowerCase()
        return (
          questionText.includes(searchLower) ||
          constraints.includes(searchLower) ||
          hints.includes(searchLower)
        )
      })
    }

    if (filters.difficulty) {
      filtered = filtered.filter((q) => q.difficultyLevel === filters.difficulty)
    }

    if (filters.language) {
      filtered = filtered.filter((q) => q.programmingLanguage === filters.language)
    }

    if (filters.type) {
      filtered = filtered.filter((q) => q.questionType === filters.type)
    }

    setFilteredQuestions(filtered)
  }

  const resetFilters = () => {
    setFilters({
      difficulty: '',
      language: '',
      type: '',
      search: ''
    })
    setFilteredQuestions(questions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingQuestion
        ? `http://localhost:8080/api/coding-questions/update/${editingQuestion.id}`
        : 'http://localhost:8080/api/coding-questions/create'

      const method = editingQuestion ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        if (editingQuestion) {
          setQuestions(questions.map((q) => (q.id === editingQuestion.id ? data : q)))
          setFilteredQuestions(
            filteredQuestions.map((q) => (q.id === editingQuestion.id ? data : q))
          )
        } else {
          setQuestions([...questions, data])
          setFilteredQuestions([...filteredQuestions, data])
        }

        handleCloseModal()
        fetchQuestions()
        fetchStats()
      } else {
        alert('Error saving question. Please try again.')
      }
    } catch (error) {
      console.error('Error saving question:', error)
      alert('Error saving question. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question? This action cannot be undone.')) {
      try {
        const response = await fetch(`http://localhost:8080/api/coding-questions/delete/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setQuestions(questions.filter((q) => q.id !== id))
          setFilteredQuestions(filteredQuestions.filter((q) => q.id !== id))
          fetchStats()
        } else {
          alert('Error deleting question. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting question:', error)
        alert('Error deleting question. Please try again.')
      }
    }
  }

  const handleEdit = (question) => {
    setEditingQuestion(question)
    setFormData({
      questionText: question.questionText,
      questionType: question.questionType,
      difficultyLevel: question.difficultyLevel,
      programmingLanguage: question.programmingLanguage,
      timeLimitMinutes: question.timeLimitMinutes,
      sampleInput: question.sampleInput,
      expectedOutput: question.expectedOutput,
      constraints: question.constraints,
      hints: question.hints,
      solutionCode: question.solutionCode,
      testCases: question.testCases,
      points: question.points,
      isActive: question.isActive
    })
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingQuestion(null)
    setFormData({
      questionText: '',
      questionType: 'ALGORITHM',
      difficultyLevel: 'EASY',
      programmingLanguage: 'JAVASCRIPT',
      timeLimitMinutes: 30,
      sampleInput: '',
      expectedOutput: '',
      constraints: '',
      hints: '',
      solutionCode: '',
      testCases: '[{"input": "", "output": ""}]',
      points: 10,
      isActive: true
    })
  }

  const handleOpenAddModal = () => {
    setEditingQuestion(null)
    setFormData({
      questionText: '',
      questionType: 'ALGORITHM',
      difficultyLevel: 'EASY',
      programmingLanguage: 'JAVASCRIPT',
      timeLimitMinutes: 30,
      sampleInput: '',
      expectedOutput: '',
      constraints: '',
      hints: '',
      solutionCode: '',
      testCases: '[{"input": "", "output": ""}]',
      points: 10,
      isActive: true
    })
    setShowModal(true)
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
        return '??'
      case 'PYTHON':
        return '??'
      case 'JAVA':
        return '?'
      case 'CPP':
        return '?'
      case 'C':
        return '?'
      case 'CSHARP':
        return '??'
      default:
        return '??'
    }
  }

  useEffect(() => {
    fetchQuestions()
    fetchStats()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filters, questions])

  return (
    <div className="admin-dashboard-wrapper">
      <Container fluid className="admin-dashboard-container admin-coding-questions">
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h1 className="admin-dashboard-title">Coding Questions</h1>
            </div>
          </Col>
        </Row>

        <Row className="align-items-start">
          <Col md={3} className="mb-4">
            <Nav variant="pills" className="flex-column admin-nav">
              <Nav.Item>
                <Nav.Link onClick={() => navigate('/admin/dashboard')}>
                  <FiBarChart2 className="me-2" />
                  Overview
                </Nav.Link>
              </Nav.Item>
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
              <Nav.Item>
                <Nav.Link active>
                  <FiFileText className="me-2" />
                  Coding Questions
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => navigate('/admin/dashboard')}>
                  <FiBarChart2 className="me-2" />
                  Coding Results
                </Nav.Link>
              </Nav.Item>
                            <div className="mt-3 pt-3 border-top border-secondary">
                <Nav.Item>
                  <Button
                    variant="outline-danger"
                    className="w-100"
                    onClick={() => navigate('/admin/login')}
                  >
                    <FiLogOut className="me-2" />
                    Logout
                  </Button>
                </Nav.Item>
              </div>
            </Nav>
          </Col>

          <Col md={9}>
            <Row className="mb-4">
              <Col md={3} className="mb-3">
                <Card className="admin-stat-card text-center">
                  <Card.Body>
                    <FaQuestionCircle className="stat-icon text-primary mb-2" />
                    <h3 className="stat-number">{stats.total}</h3>
                    <p className="stat-label">Total Questions</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="admin-stat-card text-center">
                  <Card.Body>
                    <FaChartBar className="stat-icon text-success mb-2" />
                    <h3 className="stat-number">{stats.easy}</h3>
                    <p className="stat-label">Easy</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="admin-stat-card text-center">
                  <Card.Body>
                    <FaChartBar className="stat-icon text-warning mb-2" />
                    <h3 className="stat-number">{stats.medium}</h3>
                    <p className="stat-label">Medium</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} className="mb-3">
                <Card className="admin-stat-card text-center">
                  <Card.Body>
                    <FaChartBar className="stat-icon text-danger mb-2" />
                    <h3 className="stat-number">{stats.hard}</h3>
                    <p className="stat-label">Hard</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Card className="admin-content-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Coding Questions Management</h5>
                <Button variant="primary" onClick={handleOpenAddModal}>
                  <FaPlus className="me-2" />
                  Add Question
                </Button>
              </Card.Header>
              <Card.Body>
                <div className="mb-4">
                  <h6 className="mb-3">
                    <FaFilter className="me-2" />
                    Filters
                  </h6>
                  <Row className="g-3">
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Search</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Search questions..."
                          value={filters.search}
                          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Difficulty</Form.Label>
                        <Form.Select
                          value={filters.difficulty}
                          onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                        >
                          <option value="">All Difficulties</option>
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Language</Form.Label>
                        <Form.Select
                          value={filters.language}
                          onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                        >
                          <option value="">All Languages</option>
                          <option value="JAVASCRIPT">JavaScript</option>
                          <option value="PYTHON">Python</option>
                          <option value="JAVA">Java</option>
                          <option value="CPP">C++</option>
                          <option value="C">C</option>
                          <option value="CSHARP">C#</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <Form.Select
                          value={filters.type}
                          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        >
                          <option value="">All Types</option>
                          <option value="ALGORITHM">Algorithm</option>
                          <option value="DATA_STRUCTURE">Data Structure</option>
                          <option value="PROBLEM_SOLVING">Problem Solving</option>
                          <option value="CODING_CHALLENGE">Coding Challenge</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Button variant="outline-secondary" onClick={resetFilters}>
                        <FaTimes className="me-2" />
                        Reset Filters
                      </Button>
                    </Col>
                  </Row>
                </div>

                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" role="status" />
                    <p className="mt-2">Loading questions...</p>
                  </div>
                ) : filteredQuestions.length === 0 ? (
                  <Alert variant="info" className="mb-0">
                    <h6>No coding questions found</h6>
                    <p className="mb-0">
                      Add your first coding question using the "Add Question" button above.
                    </p>
                  </Alert>
                ) : (
                  <div className="table-responsive">
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Question</th>
                          <th>Type</th>
                          <th>Difficulty</th>
                          <th>Language</th>
                          <th>Time Limit</th>
                          <th>Points</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredQuestions.map((question) => (
                          <tr key={question.id}>
                            <td className="id-text">{question.id}</td>
                            <td className="question-text">
                              <div className="question-content">
                                {toText(question.questionText).length > 100
                                  ? `${toText(question.questionText).substring(0, 100)}...`
                                  : toText(question.questionText)
                                }
                              </div>
                            </td>
                            <td>
                              <Badge bg="info">{question.questionType}</Badge>
                            </td>
                            <td>
                              <Badge bg={getDifficultyColor(question.difficultyLevel)}>
                                {question.difficultyLevel}
                              </Badge>
                            </td>
                            <td>
                              <span className="language-badge">
                                {question.programmingLanguage}
                              </span>
                            </td>
                            <td>
                              <FaClock className="me-1" />
                              {question.timeLimitMinutes}m
                            </td>
                            <td>{question.points}</td>
                            <td className="text-center">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleEdit(question)}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(question.id)}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {editingQuestion ? 'Edit Coding Question' : 'Add Coding Question'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Question Text *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={formData.questionText}
                      onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Question Type</Form.Label>
                    <Form.Select
                      value={formData.questionType}
                      onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
                    >
                      <option value="ALGORITHM">Algorithm</option>
                      <option value="DATA_STRUCTURE">Data Structure</option>
                      <option value="PROBLEM_SOLVING">Problem Solving</option>
                      <option value="CODING_CHALLENGE">Coding Challenge</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Difficulty Level</Form.Label>
                    <Form.Select
                      value={formData.difficultyLevel}
                      onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Programming Language</Form.Label>
                    <Form.Select
                      value={formData.programmingLanguage}
                      onChange={(e) => setFormData({ ...formData, programmingLanguage: e.target.value })}
                    >
                      <option value="JAVASCRIPT">JavaScript</option>
                      <option value="PYTHON">Python</option>
                      <option value="JAVA">Java</option>
                      <option value="CPP">C++</option>
                      <option value="C">C</option>
                      <option value="CSHARP">C#</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Time Limit (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      min="5"
                      max="180"
                      value={formData.timeLimitMinutes}
                      onChange={(e) => setFormData({ ...formData, timeLimitMinutes: parseInt(e.target.value) })}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Points</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="100"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Active</Form.Label>
                    <Form.Check
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Sample Input</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.sampleInput}
                      onChange={(e) => setFormData({ ...formData, sampleInput: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Expected Output</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.expectedOutput}
                      onChange={(e) => setFormData({ ...formData, expectedOutput: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Constraints</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={formData.constraints}
                      onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hints</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={formData.hints}
                      onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Solution Code</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      value={formData.solutionCode}
                      onChange={(e) => setFormData({ ...formData, solutionCode: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Test Cases (JSON)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={formData.testCases}
                      onChange={(e) => setFormData({ ...formData, testCases: e.target.value })}
                      placeholder='[{"input": "test", "output": "expected"}]'
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center mt-4">
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      {editingQuestion ? 'Updating...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <FaSave className="me-2" />
                      {editingQuestion ? 'Update Question' : 'Save Question'}
                    </>
                  )}
                </Button>
                <Button variant="secondary" onClick={handleCloseModal} className="ms-2">
                  Cancel
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  )
}

export default AdminCodingQuestions
