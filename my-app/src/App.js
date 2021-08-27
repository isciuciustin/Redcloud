import React, { useState, useEffect } from 'react';
import Axios from 'axios'

import { Button, Container, Form, Nav, Navbar, Row, Col } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useParams
} from "react-router-dom";
import Navigation from './components/Navbar';
import About from './components/About';
import Main from './components/Main'
import Gallery from './components/Gallery';
function App() {
  const [user, setuser] = useState('');
  const [text, settext] = useState('');
  const [nowuser, setnowuser] = useState('guest')
  const [v, setv] = useState([]);
  Axios.defaults.withCredentials = true;
  useEffect(() => {
    Axios.get("http://localhost:3001/api/login")
      .then((response) => {
        if (response.data.loggedIn === true) {
          setnowuser(response.data.user[0].user);
        }
      });
  }, []);
  const login = () => {
    Axios.post("http://localhost:3001/api/login", { user: user, text: text });
  }

  const post = () => {
    Axios.post("http://localhost:3001/api/insert", { user: user, text: text });
    setv([...v, { user: user, message: text }]);
    setuser('');
    settext('');
  }
  return (
    <>
      <Router>
        <Navigation />
        <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/about">
            <About />
          </Route>

          <Route path="/:user">
            <Gallery />
          </Route>

        </Switch>
      </Router>
    </>
  );
}

export default App;