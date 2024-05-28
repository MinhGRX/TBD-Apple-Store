
import React from "react";
import '../CSS/NavBar.css';
import AppleLogo from '../Asset/Apple-Logo.png';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function NavBar(){
    return(
        <Navbar>
            <Container className="container">
                <Navbar.Brand href="/">
                        <img className="logo" src={AppleLogo} alt="logo" width="64" height="36"/>
                </Navbar.Brand>
                        <Nav className="me-auto">
                            
                            <Nav.Link className="link" href="/">Home</Nav.Link>

                            <Nav.Link className="link" href="/sign-in">Sign In</Nav.Link>
                        
                            <Nav.Link className="link" href="/sign-up">Sign Up</Nav.Link>

                            <Form className="d-flex" role="search">
                                <Form.Control className="me-2" type="search" placeholder="Search" aria-label="Search"/>
                                    <Button class="btn btn-outline-success" type="submit">Search</Button>
                            </Form>
                        </Nav>
            </Container>
        </Navbar>
    );
}

export default NavBar;