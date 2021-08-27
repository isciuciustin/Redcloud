import React, { useState, useEffect } from 'react';
import Axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, Form, Nav, Navbar, Row, Col, Image, Card, ProgressBar, Modal, Carousel } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useRouteMatch,
    useParams
} from "react-router-dom";
function Gallery() {
    let { user } = useParams();
    const [nowuser, setnowuser] = useState(user);
    const [v, setv] = useState([]);
    const [it, setit] = useState(1);
    const [usage, setusage] = useState(0);
    const [mem, setmem] = useState(555);
    const [show, setshow] = useState(false);
    const [file, setfile] = useState('');
    const [ext, setext] = useState('');
    const [path, setpath] = useState('');
    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get(`http://localhost:3001/api/data/{${user}}`).then((res) => {
            console.log(res.data[0].size)
            if (res.data[0].size == 0.555)
                setmem(res.data[0].size * 1000)
            else
                setmem(res.data[0].size)
            Axios.get(`http://localhost:3001/api/img/{${user}}`)
                .then((response) => {
                    setv(response.data);
                    let div = 1000000000;
                    if (res.data[0].size == 0.555)
                        div /= 1000;
                    setusage((response.data.reduce((a, b) => a + b.size, 0) / div).toFixed(3));
                });
        });

    }, []);

    const upload = (files) => {
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('file', files[i]);
        }
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        Axios.post(`http://localhost:3001/{${user}}`, data, config)
            .then((response) => {
            })
    }
    const submit = () => {
        window.location.reload();
    }
    const remove = (path) => {
        Axios.post(`http://localhost:3001/remove/{${path}}`).then((response) => {
            window.location.reload();
        })
    }
    const handleClose = () => setshow(false);
    const handleShow = () => setshow(true);
    return (
        <>
            <Container className="mt-5 mb-5">
                <Row className="mb-5">
                    <Col className="ml-5" md={8}>
                        <h6>Upload an image:</h6>
                        <input name="file" type="file" onChange={(e) => { upload(e.target.files) }} multiple />
                        <Button variant="outline-dark" onClick={() => { submit() }}>Upload</Button>
                    </Col>
                    <Col >
                        <h5>Usage: {usage} {mem / 1000 != 0.555 ? 'GB' : 'Mb'} of {mem} {mem / 1000 != 0.555 ? 'GB' : 'Mb'}</h5>
                        <Col md={8}>
                            <ProgressBar>
                                <ProgressBar variant="warning" now={usage / mem * 100} key={1} />
                                <ProgressBar variant="success" now={100 - (usage / mem * 100)} key={2} />
                            </ProgressBar>
                        </Col>
                    </Col>
                </Row>

                <Row lg={3} sm={12} className="mt-2">
                    {
                        v.map((val) => {
                            var td = "seconds"; // type of date
                            var str = val.namefile.slice(4, -4);
                            var date = ((Date.now() - str) | 0);
                            date /= 1000;
                            if (date > 31104000) {
                                date /= 31104000;
                                td = "years"
                            }
                            else
                                if (date > 259200) {
                                    date /= 2592000;
                                    td = "mounths"
                                }
                                else
                                    if (date > 86400) {
                                        date /= 86400;
                                        td = "days"
                                    }
                                    else
                                        if (date > 3600) {
                                            date /= 3600;
                                            td = "hours"
                                        }
                                        else
                                            if (date > 60) {
                                                date /= 60;
                                                td = "minutes"
                                            }
                            date = (date | 0)
                            return (
                                <>
                                    <Col key={val.namefile} xs={12} md={4}>
                                        <Card style={{ borderRadius: "15px" }}
                                            className="mt-1 mb-4 ml-lg-5 me-lg-5"
                                        >
                                            <Card.Link onClick={() => {
                                                setfile(val.namefile)
                                                setext(val.ext)
                                                handleShow()
                                            }}
                                                style={{ textDecoration: 'none' }}>
                                                {
                                                    val.ext == 'mp4' ?
                                                    <Card.Img variant="top"
                                                    src={process.env.PUBLIC_URL + "/" + 'play.jpg'}
                                                    style={{
                                                        background: '50% 50% no-repeat',
                                                        objectFit: 'cover',
                                                        height: '300px',
                                                        borderTopLeftRadius: "15px",
                                                        borderTopRightRadius: "15px",
                                                        cursor: 'pointer'
                                                    }}
                                                    fluid />
                                                        :
                                                        <Card.Img variant="top"
                                                            src={process.env.PUBLIC_URL + "/images" + "/" + val.namefile}
                                                            style={{
                                                                background: '50% 50% no-repeat',
                                                                objectFit: 'cover',
                                                                height: '300px',
                                                                borderTopLeftRadius: "15px",
                                                                borderTopRightRadius: "15px",
                                                                cursor: 'pointer'
                                                            }}
                                                            fluid />
                                                }


                                            </Card.Link>
                                            <Card.Footer>
                                                <Row>
                                                    <Col xs={8}>
                                                        <small className="text-muted">{"Uploaded " + date + " " + td + " ago"}</small>
                                                    </Col>
                                                    <Col>
                                                        <span onClick={() => {
                                                            remove(val.namefile)
                                                        }}
                                                            style={{
                                                                color: 'tomato',
                                                                fontSize: "18px",
                                                                cursor: 'pointer'
                                                            }}>
                                                            <i class="fas fa-trash-alt"></i>
                                                        </span>
                                                    </Col>
                                                    <Col>
                                                        <Link to={process.env.PUBLIC_URL + "/images/" + val.namefile} target="_blank" download>
                                                            <span style={{
                                                                color: 'black',
                                                                fontSize: "18px"
                                                            }}>
                                                                <i class="fas fa-arrow-circle-down"></i>
                                                            </span>
                                                        </Link>
                                                    </Col>
                                                </Row>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                </>
                            )
                        })
                    }
                </Row>
            </Container>
            <Modal
                size="lg"
                show={show}
                onHide={handleClose}
                centered
            >
                {
                    ext == 'mp4' ?
                        <video controls autoplay >
                            <source src={process.env.PUBLIC_URL + "/images" + "/" + file} ></source>
                        </video>
                        :
                        <Image src={process.env.PUBLIC_URL + "/images" + "/" + file}
                            style={{
                                background: ' 50% 50% no-repeat',
                                objectFit: 'cover',
                            }}
                            fluid
                        />
                }

            </Modal>
        </>
    )
}
export default Gallery;