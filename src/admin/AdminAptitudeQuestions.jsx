import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Modal, Form, Badge, Spinner } from 'react-bootstrap'
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiBook, FiRefreshCw } from 'react-icons/fi'
import './AdminAptitudeQuestions.css'

function AdminAptitudeQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [formData, setFormData] = useState({
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: '',
    category: 'numerical',
    difficulty: 'medium'
  })

  const categories = ['numerical', 'verbal', 'reasoning']
  const difficulties = ['easy', 'medium', 'hard']

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      console.log('Fetching questions...')
      setLoading(true)
      const response = await fetch('/api/aptitude-questions')
      console.log('Fetch response status:', response.status)
      console.log('Fetch response ok:', response.ok)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched data:', data)
        setQuestions(data.questions || [])
      } else {
        console.error('Failed to fetch questions, status:', response.status)
        const errorText = await response.text()
        console.error('Error response:', errorText)
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = () => {
    setEditingQuestion(null)
    setFormData({
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      category: 'numerical',
      difficulty: 'medium'
    })
    setShowModal(true)
  }

  const handleEditQuestion = (question) => {
    setEditingQuestion(question)
    setFormData({
      question: question.question || '',
      optionA: question.optionA || '',
      optionB: question.optionB || '',
      optionC: question.optionC || '',
      optionD: question.optionD || '',
      correctAnswer: question.correctAnswer || '',
      category: question.category || 'numerical',
      difficulty: question.difficulty || 'medium'
    })
    setShowModal(true)
  }

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return
    }

    try {
      const response = await fetch(`/api/aptitude-questions/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setQuestions(questions.filter(q => q.id !== id))
      } else {
        alert('Failed to delete question')
      }
    } catch (error) {
      console.error('Error deleting question:', error)
      alert('Error deleting question')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('Form data being submitted:', formData)
    
    if (!formData.question || !formData.optionA || !formData.optionB || 
        !formData.optionC || !formData.optionD || !formData.correctAnswer) {
      console.error('Validation failed - missing fields:', {
        question: !!formData.question,
        optionA: !!formData.optionA,
        optionB: !!formData.optionB,
        optionC: !!formData.optionC,
        optionD: !!formData.optionD,
        correctAnswer: !!formData.correctAnswer
      })
      alert('Please fill in all fields')
      return
    }

    try {
      const isEdit = editingQuestion !== null
      const url = isEdit ? `/api/aptitude-questions/${editingQuestion.id}` : '/api/aptitude-questions'
      const method = isEdit ? 'PUT' : 'POST'

      console.log('Making API call:', { url, method, formData })

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      console.log('API Response status:', response.status)
      console.log('API Response ok:', response.ok)

      if (response.ok) {
        const payload = await response.json()
        const savedQuestion = payload.question || payload
        console.log('Successfully saved question:', savedQuestion)
        
        if (isEdit) {
          setQuestions(questions.map(q => q.id === savedQuestion.id ? savedQuestion : q))
        } else {
          setQuestions([...questions, savedQuestion])
        }
        
        setShowModal(false)
        setEditingQuestion(null)
      } else {
        const errorData = await response.json()
        console.error('API Error Response:', errorData)
        alert(errorData.message || 'Failed to save question')
      }
    } catch (error) {
      console.error('Network error:', error)
      alert('Error saving question: ' + error.message)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getDifficultyBadgeVariant = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success'
      case 'medium': return 'warning'
      case 'hard': return 'danger'
      default: return 'secondary'
    }
  }

  const getCategoryBadgeVariant = (category) => {
    switch (category) {
      case 'numerical': return 'primary'
      case 'verbal': return 'info'
      case 'reasoning': return 'secondary'
      default: return 'light'
    }
  }

  return (
    <Container fluid className="admin-questions-container">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">
              <FiBook className="me-2" />
              Aptitude Questions Management
            </h4>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={fetchQuestions} disabled={loading}>
                <FiRefreshCw className={`me-1 ${loading ? 'spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="primary" onClick={handleAddQuestion}>
                <FiPlus className="me-1" />
                Add Question
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      <Card className="admin-content-card">
        <Card.Header>
          <h5 className="mb-0">All Questions ({questions.length})</h5>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-2">Loading questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FiBook size={48} className="mb-3" />
              <h5>No questions found</h5>
              <p>Click "Add Question" to create your first aptitude question.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th width="5%">#</th>
                    <th width="40%">Question</th>
                    <th width="15%">Category</th>
                    <th width="10%">Difficulty</th>
                    <th width="15%">Correct Answer</th>
                    <th width="15%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => (
                    <tr key={question.id}>
                      <td className="id-text">{index + 1}</td>
                      <td className="question-text">
                        <div className="question-content">
                          {question.question}
                        </div>
                      </td>
                      <td>
                        <Badge bg={getCategoryBadgeVariant(question.category)}>
                          {question.category?.toUpperCase()}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={getDifficultyBadgeVariant(question.difficulty)}>
                          {question.difficulty?.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="text-center correct-answer-text">
                        <strong>{question.correctAnswer?.toUpperCase()}</strong>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditQuestion(question)}
                          title="Edit Question"
                        >
                          <FiEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
                          title="Delete Question"
                        >
                          <FiTrash2 />
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

      {/* Add/Edit Question Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingQuestion ? 'Edit Question' : 'Add New Question'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                placeholder="Enter the question here..."
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Option A</Form.Label>
                  <Form.Control
                    type="text"
                    name="optionA"
                    value={formData.optionA}
                    onChange={handleInputChange}
                    placeholder="Option A"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Option B</Form.Label>
                  <Form.Control
                    type="text"
                    name="optionB"
                    value={formData.optionB}
                    onChange={handleInputChange}
                    placeholder="Option B"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Option C</Form.Label>
                  <Form.Control
                    type="text"
                    name="optionC"
                    value={formData.optionC}
                    onChange={handleInputChange}
                    placeholder="Option C"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Option D</Form.Label>
                  <Form.Control
                    type="text"
                    name="optionD"
                    value={formData.optionD}
                    onChange={handleInputChange}
                    placeholder="Option D"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Correct Answer</Form.Label>
              <Form.Select
                name="correctAnswer"
                value={formData.correctAnswer}
                onChange={handleInputChange}
                required
              >
                <option value="">Select correct answer</option>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            <FiX className="me-1" />
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            <FiSave className="me-1" />
            {editingQuestion ? 'Update' : 'Save'} Question
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}

export default AdminAptitudeQuestions
