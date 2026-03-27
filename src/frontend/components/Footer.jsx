import { Container, Row, Col } from 'react-bootstrap'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer-custom">
      <Container>
        <Row className="py-4">
          <Col md={4} className="mb-4 mb-md-0">
            <div className="footer-brand">
              <img 
                src="/codeverge.svg" 
                alt="Codeverge Logo" 
                className="footer-logo"
              />
            </div>
            <p className="footer-description">
              Codeverge IT Solutions is a results-driven digital marketing agency that helps businesses grow through tailored SEO, PPC, and social media strategies. We focus on delivering measurable success by driving targeted traffic and boosting brand visibility.


            </p>
          </Col>
          
          <Col md={4}>
            <h6 className="footer-heading">Contact Info</h6>
            <ul className="footer-contact">
              <li>
                <strong>Email:</strong> hr@applauseitsolutions.com
              </li>
              <li>
                <strong>Phone:</strong>+91 9860133100

              </li>
              <li>
                <strong>Address:</strong> Office No 1, 1st Floor,
Chandrashila Complex,
NDA Road, Shivane,
Pune - 411 023 ( MH, India )
              </li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h6 className="footer-heading">Office Location</h6>
            <div className="footer-map-container">
              <iframe
                src="https://maps.google.com/maps?q=Office+No+1,+1st+Floor,+Chandrashila+Complex,+NDA+Road,+Shivane,+Pune+411+023,+India&output=embed"
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Col>
        </Row>
        
        <hr className="footer-divider" />
        
        <Row className="py-3">
          <Col md={6}>
            <p className="footer-copyright mb-0">
              © 2024 Codeverge. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="footer-social">
              <a href="https://www.linkedin.com/company/applauseitsolutions/" className="social-link">LinkedIn</a>
              <a href="https://www.instagram.com/applauseitsolutions/" className="social-link">Instagram</a>
              <a href="#" className="social-link">GitHub</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
