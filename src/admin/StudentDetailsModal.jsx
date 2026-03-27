import React from 'react'
import { Modal, Button, Row, Col, Card } from 'react-bootstrap'
import './StudentDetailsModal.css'

const StudentDetailsModal = ({ student, show, onHide }) => {
  if (!student) return null

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="student-details-modal"
    >
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title className="d-flex align-items-center">
          <span className="me-2">👤</span>
          Student Details - {student.firstName} {student.lastName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="student-modal-body">
        <Card className="student-info-card">
          <Card.Body>
            <Row className="mb-3">
              <Col md={6}>
                <div className="detail-item">
                  <label className="detail-label">Student ID:</label>
                  <span className="detail-value">#{student.id}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="detail-item">
                  <label className="detail-label">Full Name:</label>
                  <span className="detail-value">{student.firstName} {student.lastName}</span>
                </div>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <div className="detail-item">
                  <label className="detail-label">Email Address:</label>
                  <span className="detail-value">{student.email}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="detail-item">
                  <label className="detail-label">Phone Number:</label>
                  <span className="detail-value">{student.phone}</span>
                </div>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <div className="detail-item">
                  <label className="detail-label">Education Level:</label>
                  <span className="detail-value">{student.education}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="detail-item">
                  <label className="detail-label">College/Institution:</label>
                  <span className="detail-value">{student.college}</span>
                </div>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <div className="detail-item">
                  <label className="detail-label">Year of Study:</label>
                  <span className="detail-value">{student.year}</span>
                </div>
              </Col>
              <Col md={6}>
                <div className="detail-item">
                  <label className="detail-label">Registration Date:</label>
                  <span className="detail-value">
                    {new Date(student.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </Col>
            </Row>
            
            {student.skills && (
              <Row className="mb-3">
                <Col md={12}>
                  <div className="detail-item">
                    <label className="detail-label">Skills & Expertise:</label>
                    <div className="detail-value skills-text">
                      {student.skills}
                    </div>
                  </div>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default StudentDetailsModal
