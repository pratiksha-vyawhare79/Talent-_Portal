import React, { useEffect, useRef } from 'react';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import lottie from 'lottie-web';
import programmingComputerAnimation from './assets/Programming Computer2.json';
import { useNavigate } from 'react-router-dom'
import { FaBrain, FaLaptopCode, FaCode, FaRocket, FaChartLine, FaUsers, FaAward, FaLightbulb, FaGraduationCap, FaBriefcase, FaTrophy, FaCube, FaLayerGroup, FaProjectDiagram } from 'react-icons/fa'
import Header from './components/Header'
import Footer from './components/Footer'
import './Welcome.css'

const Welcome = () => {
  const navigate = useNavigate()
  const lottieRef = useRef(null);

  useEffect(() => {
    if (!lottieRef.current) {
      return;
    }

    const animation = lottie.loadAnimation({
      container: lottieRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: programmingComputerAnimation,
    });

    return () => {
      animation.destroy();
    };
  }, []);

  const handleGetStarted = () => {
    navigate('/login')
  }

  const features = [
    {
      icon: <img src="/assets/Goal.png" alt="Goal" style={{ width: '120px', height: '80px' }} />,
      title: 'Aptitude Testing',
      description: 'Comprehensive MCQ-based assessments to evaluate your problem-solving skills'
    },
    {
      icon: <img src="/assets/laptop.png" alt="Laptop" style={{ width: '120px', height: '80px' }} />,
      title: 'Technical Evaluation',
      description: 'In-depth technical MCQ tests to assess your programming knowledge'
    },
    {
      icon: <img src="/assets/star.png" alt="Star" style={{ width: '120px', height: '80px' }} />,
      title: 'Coding Challenges',
      description: 'Two hands-on programming problems to test your coding abilities'
    },
    {
      icon: <img src="/assets/rocket.png" alt="Rocket" style={{ width: '120px', height: '80px' }} />,
      title: 'Project Round',
      description: 'Final evaluation phase to showcase your practical skills'
    }
  ]

  const stats = [
    { number: '450+', label: 'Happy Clients' },
    { number: '15+', label: 'Years of Experience' },
    { number: '20+', label: 'Technologies Used' },
    { number: '600+', label: 'Projects Completed' }
  ]

  return (
    <div className="welcome-wrapper">
      {/* Hero Section */}
      <section className="welcome-hero">
        {/* Modern SaaS Hero Background */}
        <div className="saas-hero-background">
          {/* Grid Pattern */}
          <div className="grid-pattern"></div>
          
          {/* White Curve */}
          <div className="white-curve">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M 0,20 Q 30,5 60,15 T 100,10" 
                    stroke="rgba(255, 255, 255, 0.4)" 
                    stroke-width="2" 
                    fill="none" />
              <path d="M 0,25 Q 35,10 65,20 T 100,15" 
                    stroke="rgba(255, 255, 255, 0.3)" 
                    stroke-width="1.5" 
                    fill="none" />
              <path d="M 0,30 Q 25,15 55,25 T 100,20" 
                    stroke="rgba(255, 255, 255, 0.2)" 
                    stroke-width="1" 
                    fill="none" />
            </svg>
          </div>
          
          {/* Layered Curved Shapes with Soft Light Gradients */}
          <div className="layered-curves">
            <div className="curve-shape curve-1"></div>
            <div className="curve-shape curve-2"></div>
            <div className="curve-shape curve-3"></div>
          </div>
          
          {/* Soft Shadows Overlay */}
          <div className="soft-shadows"></div>
        </div>
        
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="hero-content">
              <div className="hero-text text-center">
                {/* Small Logo Above Welcome Text */}
                <div className="mb-3">
                  <img 
                    src="/codeverge.svg" 
                    alt="Codeverge Logo" 
                    style={{ 
                      width: '150px', 
                      height: 'auto',
                      maxWidth: '100%'
                    }}
                  />
                </div>
                <h1 className="hero-title">
                  <span style={{ color: '#F4780A' }}>Welcome to</span> <span className="brand-highlight">Codeverge Talent Portal</span>
                </h1>
                <p className="hero-subtitle">
                  Your gateway to a successful tech career. Join our comprehensive recruitment process 
                  designed to identify and nurture top talent in the industry.
                </p>
                <div className="hero-buttons d-flex justify-content-center gap-3 flex-wrap">
                  <Button 
                    variant="custom" 
                    className="btn-get-started"
                    onClick={handleGetStarted}
                  >
                    Get Started
                    <span className="btn-arrow">→</span>
                  </Button>
                  <Button variant="custom" className="btn-learn-more" href="https://codevergeit.com/" target="_blank" rel="noopener noreferrer">
                    Learn More
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6} className="hero-visual">
              {/* Programming Computer Lottie Animation */}
              <div className="programming-computer-container">
                <div ref={lottieRef} className="programming-computer-lottie"></div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* About Section */}
      <section className="about-section">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={6} className="mx-auto">
              <h2 className="section-title animated-title" style={{ color: '#000000', lineHeight: '1.4' }}>Why Choose Codeverge?</h2>
              <p className="section-subtitle animated-subtitle" style={{ color: '#000000', lineHeight: '1.8', paddingTop: '0.5rem' }}>
                Empowering Brands Through Digital Excellence
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={6} className="mb-4">
              <div className="about-content">
                <h3 className="about-title">Our Mission</h3>
                <p className="about-text">
                 At Codeverge IT Solutions, we're not just a tech company — we're your digital growth partner. With a passionate team of developers, designers, and strategists, 
                 we craft high-performing websites, scalable applications, and smart digital solutions tailored for startups, SMEs, and nonprofits. We blend creativity with technology to turn your ideas into powerful digital experiences.
                 From modern websites and custom software development to UI/UX design, cloud integration, and digital transformation solutions, our goal is simple: to help your business stand out in the digital world.
                </p>
                <p className="about-text">
              
                </p>
              </div>
            </Col>
            <Col lg={6} className="mb-4">
              <div className="about-stats">
                <Row>
                  {stats.map((stat, index) => (
                    <Col md={6} className="mb-3" key={index}>
                      <div className="stat-card">
                        <div className="stat-number">{stat.number}</div>
                        <div className="stat-label">{stat.label}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title" style={{ color: '#000000' }}>Our Recruitment Process</h2>
              <p className="section-subtitle" style={{ color: '#000000' }}>
                A 4-stage evaluation to find top talent
              </p>
            </Col>
          </Row>
          <Row>
            {features.map((feature, index) => (
              <Col md={6} lg={3} className="mb-4" key={index}>
                <Card className="process-card">
                  <Card.Body className="text-center">
                    <div className="process-icon">{feature.icon}</div>
                    <h4 className="process-title">{feature.title}</h4>
                    <p className="process-description">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <Row className="text-center">
            <Col>
              <div className="cta-content">
                <h2 className="cta-title">Ready to Start Your Journey?</h2>
                <p className="cta-subtitle">
                  Join thousands of successful candidates who found their dream jobs through Codeverge
                </p>
                <Button 
                  variant="custom" 
                  className="btn-cta"
                  onClick={handleGetStarted}
                >
                  Get Started Now
                  <span className="btn-arrow">→</span>
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </div>
  )
}

export default Welcome
