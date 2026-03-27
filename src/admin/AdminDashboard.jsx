import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Table, Nav, Tab, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { FiUsers, FiFileText, FiCamera, FiBarChart2, FiLogOut, FiRefreshCw, FiEye } from 'react-icons/fi'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import StudentRegistration from './StudentRegistration'
import StudentDetailsModal from './StudentDetailsModal'
import AdminResult from './AdminResult'
import AdminTechnicalResult from './AdminTechnicalResult'
import AdminAptitudeQuestions from './AdminAptitudeQuestions'
import AdminTechnicalQuestions from './AdminTechnicalQuestions'
import '../frontend/App.css'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()
  const parseResponseData = (responseText) => {
    if (!responseText) return {}
    try {
      return JSON.parse(responseText)
    } catch {
      return {}
    }
  }

  const normalizeStudentRecord = (student) => {
    if (!student || typeof student !== 'object') return null

    return {
      ...student,
      id: student.id ?? student.studentId ?? student.student_id ?? null,
      firstName: student.firstName ?? student.first_name ?? '',
      lastName: student.lastName ?? student.last_name ?? '',
      email: student.email ?? student.mail ?? ''
    }
  }

  const normalizeStudentsResponse = (payload) => {
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.students)
        ? payload.students
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.content)
            ? payload.content
            : []

    return list.map(normalizeStudentRecord).filter(Boolean)
  }

  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTests: 0,
    activeTests: 0
  })
  const [users, setUsers] = useState([])
  const [students, setStudents] = useState([])
  const [snapshots, setSnapshots] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const studentsPerPage = 10

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(students.length / studentsPerPage))
  const indexOfLastStudent = currentPage * studentsPerPage
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent)
  const pageStart = students.length === 0 ? 0 : indexOfFirstStudent + 1
  const pageEnd = students.length === 0 ? 0 : Math.min(indexOfLastStudent, students.length)

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return
    setCurrentPage(pageNumber)
  }

  // Mock data for graphs
  const [testResultsData] = useState([
    { month: 'Jan', passed: 45, failed: 12 },
    { month: 'Feb', passed: 52, failed: 18 },
    { month: 'Mar', passed: 38, failed: 8 },
    { month: 'Apr', passed: 65, failed: 22 },
    { month: 'May', passed: 48, failed: 15 },
    { month: 'Jun', passed: 72, failed: 25 }
  ])

  const [testDistributionData] = useState([
    { name: 'Aptitude', value: 33.33, color: '#F4780A' },
    { name: 'Technical', value: 33.33, color: '#28a745' },
    { name: 'Coding', value: 33.34, color: '#17a2b8' }
  ])

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardStats()
    fetchUsers()
    fetchSnapshots()
    fetchStudents()
  }, [])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const statsData = {
        totalUsers: 0,
        totalTests: 0,
        activeTests: 0
      }

      // Set total test types to 3 (aptitude, technical, coding)
      try {
        const testTypeCount = 3
        console.log('Total test types:', testTypeCount)
        statsData.totalTests = testTypeCount
      } catch (error) {
        console.error('Error setting test types:', error)
        statsData.totalTests = 3
      }

      // Fetch total users (students)
      try {
        let studentCount = 0
        
        // Try multiple possible endpoints
        const endpoints = [
          'http://localhost:8080/api/students/all',
          'http://localhost:8080/api/students',
          'http://localhost:8080/api/users/all',
          'http://localhost:8080/api/users'
        ]
        
        for (const endpoint of endpoints) {
          try {
            const usersResponse = await fetch(endpoint)
            if (usersResponse.ok) {
              const usersData = await usersResponse.json()
              console.log(`Raw students data from ${endpoint}:`, usersData)
              
              // Handle different response formats
              if (Array.isArray(usersData)) {
                studentCount = usersData.length
                console.log(`Found ${studentCount} students from ${endpoint}`)
                break
              } else if (usersData?.students && Array.isArray(usersData.students)) {
                studentCount = usersData.students.length
                console.log(`Found ${studentCount} students from ${endpoint} (students property)`)
                break
              } else if (usersData?.data && Array.isArray(usersData.data)) {
                studentCount = usersData.data.length
                console.log(`Found ${studentCount} students from ${endpoint} (data property)`)
                break
              } else if (usersData?.content && Array.isArray(usersData.content)) {
                studentCount = usersData.content.length
                console.log(`Found ${studentCount} students from ${endpoint} (content property)`)
                break
              } else if (typeof usersData === 'object' && usersData !== null) {
                // Try to find any array property in the response
                const arrayKeys = Object.keys(usersData).filter(key => Array.isArray(usersData[key]))
                if (arrayKeys.length > 0) {
                  studentCount = usersData[arrayKeys[0]].length
                  console.log(`Found ${studentCount} students from ${endpoint} (${arrayKeys[0]} property)`)
                  break
                }
              }
            }
          } catch (endpointError) {
            console.log(`Endpoint ${endpoint} failed, trying next...`)
            continue
          }
        }
        
        console.log('Final student count:', studentCount)
        statsData.totalUsers = studentCount
      } catch (error) {
        console.error('Error fetching users:', error)
      }

      // Set active tests to 3 (aptitude, technical, coding test types)
      try {
        const activeTestCount = 3
        console.log('Active test types:', activeTestCount)
        statsData.activeTests = activeTestCount
      } catch (error) {
        console.error('Error setting active tests:', error)
        statsData.activeTests = 3
      }

      setStats(statsData)
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      // Fetch real users from backend
      const response = await fetch('http://localhost:8080/api/students/all')
      if (response.ok) {
        const usersData = await response.json()
        const usersList = Array.isArray(usersData) ? usersData : 
                        Array.isArray(usersData?.students) ? usersData.students : []
        const formattedUsers = usersList.slice(0, 10).map(user => ({
          id: user.id || user.studentId || user.student_id || Math.random(),
          name: `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim() || 'Unknown',
          email: user.email || user.mail || 'unknown@example.com',
          testsTaken: user.testsTaken || user.tests_taken || 0,
          lastActive: user.lastActive || user.last_active || new Date().toISOString().split('T')[0]
        }))
        setUsers(formattedUsers)
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    }
  }

  const fetchSnapshots = async () => {
    try {
      // Fetch real camera snapshots from backend
      const response = await fetch('http://localhost:8080/api/camera-snapshots/all')
      if (response.ok) {
        const snapshotsData = await response.json()
        const formattedSnapshots = Array.isArray(snapshotsData) ? snapshotsData.slice(0, 10).map(snapshot => ({
          id: snapshot.id || Math.random(),
          candidateName: snapshot.candidateName || snapshot.candidate_name || 'Unknown',
          candidateEmail: snapshot.candidateEmail || snapshot.candidate_email || 'unknown@example.com',
          captureTime: snapshot.captureTime || snapshot.capture_time || new Date().toISOString(),
          testResult: snapshot.testResult || snapshot.test_result || 'N/A',
          testType: snapshot.testType || snapshot.test_type || 'unknown'
        })) : []
        setSnapshots(formattedSnapshots)
      } else {
        // Fallback to empty array if API fails
        setSnapshots([])
      }
    } catch (error) {
      console.error('Error fetching snapshots:', error)
      setSnapshots([])
    }
  }

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/students')
      if (response.ok) {
        const responseText = await response.text()
        const data = parseResponseData(responseText)
        const normalizedStudents = normalizeStudentsResponse(data)
        setStudents(normalizedStudents)
        setCurrentPage(1)
      } else {
        console.error('Failed to fetch students')
        // Show error message
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      // Show error message
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // Handle logout logic
    localStorage.removeItem('adminToken')
    window.location.href = '/admin/login'
  }

  const handleOpenCodingQuestions = () => {
    navigate('/admin/coding-questions')
  }

  const handleSaveStudent = async (studentData) => {
    try {
      setLoading(true)
      const isEditMode = Boolean(editingStudent?.id)
      const endpoint = isEditMode ? `/api/students/${editingStudent.id}` : '/api/students/register'
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData)
      })

      const responseText = await response.text()
      const data = parseResponseData(responseText)
      const savedStudent = normalizeStudentRecord(data.student || data)
      if (response.ok) {
        if (savedStudent) {
          if (isEditMode) {
            setStudents(prev => prev.map(student => (
              student.id === savedStudent.id ? savedStudent : student
            )))
            if (selectedStudent?.id === savedStudent.id) {
              setSelectedStudent(savedStudent)
            }
          } else {
            setStudents(prev => [savedStudent, ...prev])
          }
        }

        await fetchStudents()
        setEditingStudent(null)
        setShowAddForm(false)
      } else {
        alert(data.message || (isEditMode ? 'Failed to update student' : 'Failed to register student'))
      }
    } catch (error) {
      console.error('Error saving student:', error)
      alert('Error saving student')
    } finally {
      setLoading(false)
    }
  }

  const handleViewStudent = (student) => {
    setSelectedStudent(student)
    setShowDetailsModal(true)
  }

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedStudent(null)
  }

  const handleStartAddStudent = () => {
    setEditingStudent(null)
    setShowAddForm(true)
  }

  const handleEditStudent = (student) => {
    setActiveTab('aptitude-register')
    setShowDetailsModal(false)
    setSelectedStudent(null)
    setEditingStudent(student)
    setShowAddForm(true)
  }

  const handleDeleteStudent = async (student) => {
    if (!student?.id) return

    const isConfirmed = window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)
    if (!isConfirmed) return

    try {
      setLoading(true)
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'DELETE'
      })
      const responseText = await response.text()
      const data = parseResponseData(responseText)

      if (response.ok) {
        await fetchStudents()
        setShowDetailsModal(false)
        setSelectedStudent(null)
      } else {
        alert(data.message || 'Failed to delete student')
      }
    } catch (error) {
      console.error('Error deleting student:', error)
      alert('Error deleting student')
    } finally {
      setLoading(false)
    }
  }

  const handleSendEmail = async (student) => {
    if (!student?.id) {
      alert('Invalid student record')
      return
    }

    // Immediate click feedback to confirm handler is triggered
    if (!window.confirm(`Are you sure you want to send email to ${student.firstName} ${student.lastName}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/students/${student.id}/send-invitation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const responseText = await response.text()
      const data = parseResponseData(responseText)

      if (response.ok) {
        alert('Mail sent successfully')
      } else {
        alert(data.message || 'Failed to send invitation email')
      }
    } catch (error) {
      console.error('Error sending invitation email:', error)
      alert('Error sending invitation email')
    }
  }

  return (
    <div className="admin-dashboard-wrapper">
      <Container fluid className="admin-dashboard-container">
        <Row className="mb-4">
          <Col>
            <div className="text-center">
              <h1 className="admin-dashboard-title">Admin Dashboard</h1>
            </div>
          </Col>
        </Row>

        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <Row className="admin-dashboard-layout">
            <Col md={3} className="admin-sidebar">
              <Nav variant="pills" className="flex-column admin-nav">
                <Nav.Item>
                  <Nav.Link eventKey="overview">
                    <FiBarChart2 className="me-2" />
                    Overview
                  </Nav.Link>
                </Nav.Item>
                
                {/* Aptitude Test Section */}
                <Nav.Item>
                  <Nav.Link eventKey="aptitude-register">
                    <FiUsers className="me-2" />
                    Register Student
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="aptitude-questions">
                    <FiFileText className="me-2" />
                    Aptitude Questions
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="aptitude-results">
                    <FiBarChart2 className="me-2" />
                    Aptitude Test Results
                  </Nav.Link>
                </Nav.Item>
                
                {/* Technical MCQ Section */}
                <Nav.Item>
                  <Nav.Link eventKey="technical-questions">
                    <FiFileText className="me-2" />
                    Technical MCQ
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="technical-results">
                    <FiBarChart2 className="me-2" />
                    Technical Results
                  </Nav.Link>
                </Nav.Item>
                
                {/* Coding Section */}
                <Nav.Item>
                  <Nav.Link
                    eventKey="coding-questions"
                    onClick={(e) => {
                      e.preventDefault()
                      handleOpenCodingQuestions()
                    }}
                  >
                    <FiFileText className="me-2" />
                    Coding Questions
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    onClick={(e) => {
                      e.preventDefault()
                      navigate('/admin/coding-results')
                    }}
                  >
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
            <Col md={9} className="admin-content">
              <div className="admin-content-scrollable">
                <Tab.Content>
                <Tab.Pane eventKey="overview">
                  <div className="d-flex justify-content-center mb-4">
                    <h4 className="mb-0">Dashboard Overview</h4>
                  </div>
                  <Row className="justify-content-center">
                    <Col md={4} className="mb-4">
                      <Card className="admin-stat-card text-center">
                        <Card.Body>
                          <FiUsers size={40} className="text-primary mb-2" />
                          <h3>{stats.totalUsers}</h3>
                          <p className="text-muted">Total Users</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Card className="admin-stat-card text-center">
                        <Card.Body>
                          <FiFileText size={40} className="text-success mb-2" />
                          <h3>{stats.totalTests}</h3>
                          <p className="text-muted">Total Tests</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Card className="admin-stat-card text-center">
                        <Card.Body>
                          <FiBarChart2 size={40} className="text-info mb-2" />
                          <h3>{stats.activeTests}</h3>
                          <p className="text-muted">Active Tests</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Graphs Section */}
                  <Row className="mt-4">
                    <Col md={8} className="mb-4">
                      <Card className="admin-content-card">
                        <Card.Header>
                          <h5 className="mb-0">Test Results Trend</h5>
                        </Card.Header>
                        <Card.Body>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={testResultsData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey="month" stroke="#e2e8f0" />
                              <YAxis stroke="#e2e8f0" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(0,0,0,0.8)', 
                                  border: '1px solid rgba(255,255,255,0.2)',
                                  borderRadius: '8px'
                                }} 
                              />
                              <Legend />
                              <Bar dataKey="passed" fill="#28a745" name="Passed" />
                              <Bar dataKey="failed" fill="#dc3545" name="Failed" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-4">
                      <Card className="admin-content-card">
                        <Card.Header>
                          <h5 className="mb-0">Test Distribution</h5>
                        </Card.Header>
                        <Card.Body>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={testDistributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {testDistributionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  {/* Additional Distribution Charts */}
                  <Row className="mt-4">
                    <Col md={6} className="mb-4">
                      <Card className="admin-content-card">
                        <Card.Header>
                          <h5 className="mb-0">Result Distribution</h5>
                        </Card.Header>
                        <Card.Body>
                          <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Passed', value: 65, color: '#28a745' },
                                  { name: 'Failed', value: 35, color: '#dc3545' }
                                ]}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {[
                                  { name: 'Passed', value: 65, color: '#28a745' },
                                  { name: 'Failed', value: 35, color: '#dc3545' }
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-4">
                      <Card className="admin-content-card">
                        <Card.Header>
                          <h5 className="mb-0">Score Range Distribution</h5>
                        </Card.Header>
                        <Card.Body>
                          <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={[
                              { range: '0-20', count: 5 },
                              { range: '21-40', count: 12 },
                              { range: '41-60', count: 25 },
                              { range: '61-80', count: 30 },
                              { range: '81-100', count: 18 }
                            ]}>
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
                              <Bar dataKey="count" fill="#F4780A" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                </Tab.Pane>

                <Tab.Pane eventKey="users">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">User Management</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Tests Taken</th>
                            <th>Last Active</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.id}>
                              <td>{user.id}</td>
                              <td>{user.name}</td>
                              <td>{user.email}</td>
                              <td>{user.testsTaken}</td>
                              <td>{user.lastActive}</td>
                              <td>
                                <Button variant="primary" size="sm" className="me-2">View</Button>
                                <Button variant="danger" size="sm">Delete</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Aptitude Test Sections */}
                <Tab.Pane eventKey="aptitude-register">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">All Registered Students</h5>
                    </Card.Header>
                    <Card.Body>
                      {showAddForm ? (
                        editingStudent ? (
                          <StudentRegistration
                            key={`edit-${editingStudent.id}`}
                            onSubmit={handleSaveStudent}
                            initialData={editingStudent}
                            title="Edit Student"
                            submitLabel="Update Student"
                            onCancel={() => {
                              setShowAddForm(false)
                              setEditingStudent(null)
                            }}
                            loading={loading}
                          />
                        ) : (
                          <StudentRegistration
                            onStudentAdded={handleSaveStudent}
                            onCancel={() => setShowAddForm(false)}
                            loading={loading}
                          />
                        )
                      ) : (
                        <>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6>Total Students: {students.length} | 10 Students Per Page</h6>
                            <div>
                              <Button variant="outline-secondary" className="me-2" onClick={fetchStudents} disabled={loading}>
                                <FiRefreshCw className={`me-1 ${loading ? 'spin' : ''}`} />
                                Refresh
                              </Button>
                              <Button variant="primary" className="me-2" onClick={handleStartAddStudent}>
                                Add New Student
                              </Button>
                            </div>
                          </div>
                          
                          {students.length === 0 ? (
                            <div className="text-center py-5">
                              <p className="text-muted">No students found in the database.</p>
                              <Button variant="primary" onClick={handleStartAddStudent}>Register First Student</Button>
                            </div>
                          ) : (
                            <>
                              <Table striped bordered hover responsive className="student-table">
                                <thead>
                                  <tr>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {currentStudents.map(student => (
                                    <tr key={student.id}>
                                      <td>{student.id}</td>
                                      <td>{student.firstName} {student.lastName}</td>
                                      <td>{student.email}</td>
                                      <td>
                                        <div className="student-actions">
                                        <Button 
                                          variant="primary" 
                                          size="sm" 
                                          className="eye-button student-action-btn"
                                          onClick={() => handleViewStudent(student)}
                                          title="View Student Details"
                                        >
                                          <FiEye />
                                        </Button>
                                        <Button
                                          variant="outline-primary"
                                          size="sm"
                                          className="student-action-btn"
                                        onClick={() => handleEditStudent(student)}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        className="student-action-btn"
                                        onClick={() => handleDeleteStudent(student)}
                                      >
                                        Delete
                                      </Button>
                                      <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm student-action-btn send-email-button"
                                        onClick={(e) => {
                                          e.preventDefault()
                                          e.stopPropagation()
                                          handleSendEmail(student)
                                        }}
                                      >
                                        Send Email
                                      </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                              
                              {/* Pagination Controls */}
                              {students.length > 0 && (
                                <div className="student-pagination-controls d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                                  <div className="pagination-info">
                                    <span>
                                      Showing {pageStart}-{pageEnd} of {students.length} students, page {currentPage} of {totalPages}
                                    </span>
                                  </div>
                                  <nav aria-label="Student pagination">
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
                                      
                                      {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1
                                          return (
                                            <li key={pageNumber} className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}>
                                              <button 
                                                className="page-link" 
                                                onClick={() => handlePageChange(pageNumber)}
                                                aria-label={`Go to page ${pageNumber}`}
                                                aria-current={currentPage === pageNumber ? 'page' : undefined}
                                              >
                                                {pageNumber}
                                              </button>
                                          </li>
                                        )
                                      })}
                                      
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
                            </>
                          )}
                        </>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="aptitude-results">
                  <AdminResult />
                </Tab.Pane>

                <Tab.Pane eventKey="aptitude-questions">
                  <AdminAptitudeQuestions />
                </Tab.Pane>

                {/* Technical MCQ Section */}
                <Tab.Pane eventKey="technical-questions">
                  <AdminTechnicalQuestions />
                </Tab.Pane>

                <Tab.Pane eventKey="technical-results">
                  <AdminTechnicalResult />
                </Tab.Pane>

                <Tab.Pane eventKey="technical-snapshots">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">Technical MCQ Test Snapshots</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Capture Time</th>
                            <th>Test Result</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {snapshots.filter(s => s.testType === 'technical').map(snapshot => (
                            <tr key={snapshot.id}>
                              <td>{snapshot.id}</td>
                              <td>{snapshot.candidateName}</td>
                              <td>{snapshot.candidateEmail}</td>
                              <td>{snapshot.captureTime}</td>
                              <td>
                                <span className={`badge ${snapshot.testResult === 'PASS' ? 'bg-success' : 'bg-danger'}`}>
                                  {snapshot.testResult}
                                </span>
                              </td>
                              <td>
                                <Button variant="primary" size="sm" className="me-2">View</Button>
                                <Button variant="danger" size="sm">Delete</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                {/* Coding Sections */}
                <Tab.Pane eventKey="coding-questions">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">Coding Questions Management</h5>
                    </Card.Header>
                    <Card.Body>
                      <p className="text-muted mb-3">
                        Coding questions are managed on a dedicated page.
                      </p>
                      <Button variant="primary" onClick={handleOpenCodingQuestions}>
                        Open Coding Questions
                      </Button>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                
                <Tab.Pane eventKey="coding-snapshots">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">Coding Test Snapshots</h5>
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Capture Time</th>
                            <th>Test Result</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {snapshots.filter(s => s.testType === 'coding').map(snapshot => (
                            <tr key={snapshot.id}>
                              <td>{snapshot.id}</td>
                              <td>{snapshot.candidateName}</td>
                              <td>{snapshot.candidateEmail}</td>
                              <td>{snapshot.captureTime}</td>
                              <td>
                                <span className={`badge ${snapshot.testResult === 'PASS' ? 'bg-success' : 'bg-danger'}`}>
                                  {snapshot.testResult}
                                </span>
                              </td>
                              <td>
                                <Button variant="primary" size="sm" className="me-2">View</Button>
                                <Button variant="danger" size="sm">Delete</Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Tab.Pane>

                <Tab.Pane eventKey="settings">
                  <Card className="admin-content-card">
                    <Card.Header>
                      <h5 className="mb-0">Admin Settings</h5>
                    </Card.Header>
                    <Card.Body>
                      <p>Settings configuration coming soon...</p>
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              </Tab.Content>
              </div>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      <StudentDetailsModal
        student={selectedStudent}
        show={showDetailsModal}
        onHide={handleCloseDetailsModal}
      />
    </div>
  )
}

export default AdminDashboard
