import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavLink, Container, NavDropdown } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
} from "react-router-dom";

function About() {
    return(
        <h1>About Pagination!</h1>
    )
}
export default About;