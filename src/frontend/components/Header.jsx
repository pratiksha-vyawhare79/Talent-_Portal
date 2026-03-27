import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import './Header.css'

const Header = () => {
  return (
    <Navbar expand="lg" className="navbar-custom">
      <Container>
        <Navbar.Brand href="#" className="navbar-brand">
          <img 
            src="/codeverge.svg" 
            alt="Codeverge Logo" 
            className="logo-custom"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#">Home</Nav.Link>
            <Nav.Link href="#">About</Nav.Link>
            <Nav.Link href="#">Services</Nav.Link>
            <Nav.Link href="#">Contact</Nav.Link>
            <Button variant="primary" className="btn-enquire">Enquire Now</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
