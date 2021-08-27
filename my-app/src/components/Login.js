import React, { useState, useEffect } from 'react';
import {
    Navbar, Nav, NavLink, Container, NavDropdown, Modal, Button,
    Form
} from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useRouteMatch,
    useParams
} from "react-router-dom";
import Axios from 'axios'

function Login({ show, showreg, Hide, Change }) {
    const [user, setuser] = useState('');
    const [paswd, setpaswd] = useState('');
    const [paswd2, setpaswd2] = useState('');
    const [email, setemail] = useState('');
    const [log, setlog] = useState(false);
    const [check, setcheck] = useState(false);
    const [code, setcode] = useState('');
    const [err, seterr] = useState('');

    Axios.defaults.withCredentials = true;

    const login = () => {
        Axios.post("http://localhost:3001/api/login", { user: user, paswd: paswd }).then((response) => {
            setlog(true);
        })
        
    }

    const post = () => {
        Axios.post("http://localhost:3001/api/register", { user: user, email: email, paswd: paswd , paswd2 : paswd2}).then((response) => {
            seterr(response.data);
            console.log(response.data + " " + check)
            if (response.data == '') {
                setcheck(true);
            }
        })


    }

    const verify = () => {
        Axios.post("http://localhost:3001/api/verify", { code: code, user: user }).then((response) => {
            seterr(response.data);
            if (response.data == '') {
                setcode('');
                setlog(true);
            }
        })
    }
    if (log) {
        console.log(user)
        window.location.reload()
    }
    else
        if (show)
            return (
                <Modal
                    show={show}
                    onHide={Hide}
                >
                    <Modal.Header>
                        <Modal.Title>Login</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text"
                                    value={user}
                                    placeholder="Enter username"
                                    onChange={(e) => {
                                        setuser(e.target.value)
                                    }} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password"
                                    placeholder="Password"
                                    value={paswd}
                                    onChange={(e) => {
                                        setpaswd(e.target.value)
                                    }} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="outline-dark" className="me-auto" onClick={login}>Login</Button>
                        <Link style={{ textDecoration: 'none', color: "black" }}
                            className="mx-auto"
                            onClick={Change}
                        >You don't have an account?
                        </Link>
                    </Modal.Footer>
                </Modal>
            )
        else
            return (
                <Modal
                    show={showreg}
                    onHide={Hide}
                >
                    <Modal.Header>
                        <Modal.Title>{check ? 'Verify email' : 'Register'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p
                            style = {{
                                color  : 'red'
                            }} 
                        >{err}</p>
                        
                        {check ?
                            <>
                                <Form>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Code</Form.Label>
                                        <Form.Control type="text" placeholder="Enter code from email"
                                            value={code}
                                            onChange={(e) => {
                                                setcode(e.target.value)
                                            }} />
                                    </Form.Group>
                                </Form>
                            </>
                            :
                            <>
                                <Form>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" placeholder="Enter username"
                                            value={user}
                                            onChange={(e) => {
                                                setuser(e.target.value)
                                            }} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="text" placeholder="Enter email"
                                            value={email}
                                            onChange={(e) => {
                                                setemail(e.target.value)
                                            }} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password"
                                            value={paswd}
                                            onChange={(e) => {
                                                setpaswd(e.target.value)
                                            }} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Verify password</Form.Label>
                                        <Form.Control type="password" placeholder="Verify password"
                                            value={paswd2}
                                            onChange={(e) => {
                                                setpaswd2(e.target.value)
                                            }} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                                    </Form.Group>
                                </Form>
                            </>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        {
                            check ?
                                <>
                                    <Button variant="outline-dark" className="mx-auto" onClick={verify}>Verify</Button>
                                </>
                                :
                                <>
                                    <Button variant="outline-dark" className="mx-auto" onClick={post}>Register</Button>
                                </>
                        }

                    </Modal.Footer>
                </Modal>
            )
}
export default Login;