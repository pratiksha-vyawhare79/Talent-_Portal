import React, { useState } from 'react'
import { Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap'
import './StudentRegistration.css'

const getStudentFormData = (student = {}) => ({
  firstName: student.firstName || '',
  lastName: student.lastName || '',
  email: student.email || '',
  phone: student.phone || '',
  education: student.education || '',
  college: student.college || '',
  year: student.year || '',
  skills: student.skills || ''
})

const StudentRegistration = ({
  onStudentAdded,
  onSubmit,
  onCancel,
  loading,
  initialData,
  title = 'Add New Student',
  submitLabel = 'Add Student'
}) => {
  const [newStudent, setNewStudent] = useState(() => getStudentFormData(initialData))
  const isEditMode = Boolean(initialData)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const submitHandler = onSubmit || onStudentAdded
    await submitHandler(newStudent)
  }

  return (
    <Card className="student-registration-form">
      <Card.Header>
        <h6 className="mb-0">{title}</h6>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={newStudent.firstName}
                onChange={handleInputChange}
                placeholder="Enter first name"
                required
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={newStudent.lastName}
                onChange={handleInputChange}
                placeholder="Enter last name"
                required
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newStudent.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newStudent.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Education</Form.Label>
              <Form.Select
                name="education"
                value={newStudent.education}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Education Level</option>
                <option value="High School">High School</option>
                <optgroup label="Bachelor's Degrees">
                  <option value="B.Sc. Computer Science">B.Sc. Computer Science</option>
                  <option value="B.Sc. Mathematics">B.Sc. Mathematics</option>
                  <option value="B.Sc. Physics">B.Sc. Physics</option>
                  <option value="B.Sc. Chemistry">B.Sc. Chemistry</option>
                  <option value="B.Com.">B.Com. (Bachelor of Commerce)</option>
                  <option value="B.Tech.">B.Tech. (Bachelor of Technology)</option>
                  <option value="B.E.">B.E. (Bachelor of Engineering)</option>
                  <option value="BBA">BBA (Bachelor of Business Administration)</option>
                </optgroup>
                <optgroup label="Master's Degrees">
                  <option value="M.Sc. Computer Science">M.Sc. Computer Science</option>
                  <option value="M.Sc. Mathematics">M.Sc. Mathematics</option>
                  <option value="M.Sc. Physics">M.Sc. Physics</option>
                  <option value="M.Sc. Chemistry">M.Sc. Chemistry</option>
                  <option value="M.Com.">M.Com. (Master of Commerce)</option>
                  <option value="M.Tech.">M.Tech. (Master of Technology)</option>
                  <option value="M.E.">M.E. (Master of Engineering)</option>
                  <option value="MBA">MBA (Master of Business Administration)</option>
                  <option value="MCA">MCA (Master of Computer Applications)</option>
                </optgroup>
                <option value="PhD">PhD</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>College</Form.Label>
              <Form.Control
                type="text"
                name="college"
                value={newStudent.college}
                onChange={handleInputChange}
                placeholder="Enter college name"
                required
              />
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Year of Study</Form.Label>
              <Form.Select
                name="year"
                value={newStudent.year}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Completed">Completed</option>
              </Form.Select>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Skills</Form.Label>
              <Form.Control
                as="textarea"
                name="skills"
                value={newStudent.skills}
                onChange={handleInputChange}
                placeholder="Enter skills"
                rows={3}
              />
            </Col>
          </Row>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" className="me-2" />
                  {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default StudentRegistration
