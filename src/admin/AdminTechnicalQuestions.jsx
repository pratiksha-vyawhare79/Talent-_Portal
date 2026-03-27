import React, { useState, useEffect } from 'react'
import { Button, Card, Container, Form, Modal, Table, Badge, Spinner, Alert } from 'react-bootstrap'
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa'
import './AdminTechnicalQuestions.css'

function AdminTechnicalQuestions() {
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
    category: '',
    difficulty: ''
  })

  const categories = ['java', 'python', 'javascript', 'react', 'nodejs', 'sql', 'html', 'css', 'general']
  const difficulties = ['easy', 'medium', 'hard']

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      console.log('Fetching technical questions...')
      setLoading(true)
      const response = await fetch('/api/technical-questions')
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
      category: '',
      difficulty: ''
    })
    setShowModal(true)
  }

  const handleEditQuestion = (question) => {
    setEditingQuestion(question)
    setFormData({
      question: question.question,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      category: question.category,
      difficulty: question.difficulty
    })
    setShowModal(true)
  }

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const response = await fetch(`/api/technical-questions/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setQuestions(questions.filter(q => q.id !== id))
          alert('Question deleted successfully')
        } else {
          alert('Failed to delete question')
        }
      } catch (error) {
        console.error('Error deleting question:', error)
        alert('Error deleting question')
      }
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
      const url = isEdit ? `/api/technical-questions/${editingQuestion.id}` : '/api/technical-questions'
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

  const getCategoryBadgeVariant = (category) => {
    const variants = {
      'java': 'danger',
      'python': 'primary', 
      'javascript': 'warning',
      'react': 'info',
      'nodejs': 'success',
      'sql': 'dark',
      'html': 'secondary',
      'css': 'secondary',
      'general': 'light'
    }
    return variants[category] || 'secondary'
  }

  const getDifficultyBadgeVariant = (difficulty) => {
    const variants = {
      'easy': 'success',
      'medium': 'warning',
      'hard': 'danger'
    }
    return variants[difficulty] || 'secondary'
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading technical questions...</p>
      </div>
    )
  }

  return (
    <Container fluid className="admin-technical-questions">
      <Card className="admin-content-card">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Technical Questions Management</h5>
          <Button variant="primary" onClick={handleAddQuestion}>
            <FaPlus className="me-2" />
            Add Question
          </Button>
        </Card.Header>
        <Card.Body>
          {questions.length === 0 ? (
            <Alert variant="info">
              <h6>No technical questions found</h6>
              <p>Start by adding your first technical question using the "Add Question" button above.</p>
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Question</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Correct Answer</th>
                    <th className="text-center">Actions</th>
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
                        >
                          <FaEdit />
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteQuestion(question.id)}
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

      {/* Add/Edit Question Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingQuestion ? 'Edit Technical Question' : 'Add Technical Question'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Question *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                placeholder="Enter the technical question"
                required
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Option A *</Form.Label>
                  <Form.Control
                    type="text"
                    name="optionA"
                    value={formData.optionA}
                    onChange={handleInputChange}
                    placeholder="Option A"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Option B *</Form.Label>
                  <Form.Control
                    type="text"
                    name="optionB"
                    value={formData.optionB}
                    onChange={handleInputChange}
                    placeholder="Option B"
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Option C *</Form.Label>
                  <Form.Control
                    type="text"
                    name="optionC"
                    value={formData.optionC}
                    onChange={handleInputChange}
                    placeholder="Option C"
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Option D *</Form.Label>
                  <Form.Control
                    type="text"
                    name="optionD"
                    value={formData.optionD}
                    onChange={handleInputChange}
                    placeholder="Option D"
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Correct Answer *</Form.Label>
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
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Difficulty *</Form.Label>
                  <Form.Select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select difficulty</option>
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff.toUpperCase()}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="text-end mt-4">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                <FaTimes className="me-2" />
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                <FaSave className="me-2" />
                {editingQuestion ? 'Update Question' : 'Save Question'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default AdminTechnicalQuestions
