import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import { Button, Container, Form, Nav, Navbar, Row, Col, Image, CardGroup, Card } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import PayPal from './Paypal';

function Main() {
  const [user, setuser] = useState('guest');
  const [v, setv] = useState([]);
  const [checkout, setCheckOut] = useState(0);
  Axios.defaults.withCredentials = true;
  useEffect(() => {
    Axios.get("http://localhost:3001/api/login")
      .then((response) => {
        if (response.data.loggedIn == true) {
          setuser(response.data.user[0].user);
        }
      });
  }, []);


  return (
    <Container fluid
      style={{
        objectFit: 'cover',
        padding: '0',
        margin: '0'
      }}>
      <div
        className="mb-5"
        style={{
          background: ' 50% 50% no-repeat',
          objectFit: 'cover',
          width: '100%',
          padding: '0',
          margin: '0',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <Image src={process.env.PUBLIC_URL + '/server-2160321_960_720.webp'}

          style={{
            background: ' 50% 50% no-repeat',
            objectFit: 'cover',
            width: '100%',
            height: '500px',
            padding: '0',
            margin: '0',
            textAlign: 'center',
            position: 'relative'
          }}
        />
        <h5
          style={{
            left: "280px",
            position: 'absolute',
            textAlign: 'center',
            top: '220px',
            color: 'white',
            fontFamily: 'Consolas'
          }}
        >People who are really serious about software should make their own hardware</h5>
      </div>
      <Container className="mt-5 mb-5">
        <CardGroup className="mt-5">
          <Card>
            <Card.Body>
              <Card.Title>Free</Card.Title>
              <Card.Text>
                555 MB of secure storage
              </Card.Text>
              <Card.Text>
                Easy-to-use team management and collaboration tools
              </Card.Text>
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">For testing</small>
            </Card.Footer>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title>33.33$ life license</Card.Title>
              <Card.Text>
                100 GB of secure storage
              </Card.Text>
              <Card.Text>
                Premium productivity features and simple, secure file sharing
              </Card.Text>
              {checkout == 1 ? (
                <PayPal type={2} user={user} price = {33.33} />
              ) : (
                <Button
                  onClick={() => setCheckOut(1)}
                  variant="outline-danger">Buy</Button>
              )}
            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Premium</small>
            </Card.Footer>
          </Card>
          <Card>
            <Card.Body>
              <Card.Title className="mx-auto">66.66$ life license</Card.Title>
              <Card.Text>
                250 GB of secure storage
              </Card.Text>
              <Card.Text>
                Sophisticated admin, audit, security, and integration capabilities
              </Card.Text>
              {checkout == 2? (
                <PayPal type={3} user={user} price = {66.66} />
              ) : (
                <Button
                  onClick={() => setCheckOut(2)}
                  variant="outline-danger">Buy</Button>
              )}

            </Card.Body>
            <Card.Footer>
              <small className="text-muted">Recomanded</small>
            </Card.Footer>
          </Card>
        </CardGroup>
      </Container>
    </Container>
  )
}
export default Main;