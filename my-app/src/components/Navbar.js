import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavLink, Container, NavDropdown, Modal, Button } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";
import Login from './Login';
import Axios from 'axios';
function Navigation() {
    const [showmodal, setshowmd] = useState(false);
    const [showreg, setshowreg] = useState(false);
    const [nowuser, setnowuser] = useState('guest');
    Axios.defaults.withCredentials = true;
    useEffect(() => {
        Axios.get("http://localhost:3001/api/login")
            .then((response) => {
                if (response.data.loggedIn === true) {
                    setnowuser(response.data.user[0].user);
                }
            });
    }, []);

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container >
                    <Navbar.Brand>
                        <Link to="/" style={{ textDecoration: 'none', color: 'rgba(255, 0, 0, 0.89)' }}>Redcloud</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Link>
                                <Link to="/about" style={{ textDecoration: 'none', color: "black" }}>About</Link>
                            </Nav.Link>

                            {
                                nowuser == 'guest' ?
                                    <Nav.Link onClick={() => {
                                        setshowmd(!showmodal)
                                    }}>
                                        Login
                                    </Nav.Link>
                                    :
                                    <>
                                        <NavLink>
                                            <Link
                                                style={{
                                                    textDecoration: 'none',
                                                    color: 'black'
                                                }}
                                                to={`/${nowuser}`}> Gallery</Link>
                                        </NavLink>
                                        <NavLink>
                                            Sign as  {nowuser}
                                        </NavLink>
                                    </>
                            }

                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Login show={showmodal}
                showreg={showreg}
                Hide={() => {
                    setshowmd(false)
                    setshowreg(false)
                }} Change={() => {
                    setshowmd(false)
                    setshowreg(true)
                }} />
        </>
    );
}

export default Navigation;