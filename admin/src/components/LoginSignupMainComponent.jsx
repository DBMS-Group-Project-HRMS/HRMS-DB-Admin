import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalBody, Label, Col, Row } from 'reactstrap';
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Control, Errors, LocalForm } from 'react-redux-form';
import { Toast } from 'primereact/toast';

const required = (val) => val && val.length;

async function loginAdmin(data) {

    return fetch('http://localhost:5000/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(data => data.json())
}

function LoginSignup(props){

    let navigate = useNavigate();

    const [loginError, setLoginError] = useState('');
    const [value, setValue] = useState('');
    const toast = useRef(null);

    const handleLogin = async (event) => {

        sessionStorage.clear();

        let response = await loginAdmin({
            username: event.username,
            password: event.password
        });

        if(response){
            if(response.status === 'error'){
                setLoginError(response.error );
                toast.current.show({severity:'error', summary: `${response.error}`, detail: "Invalid login details!", life: 5000});
            }
            else{

                // sessionStorage.setItem('userType', JSON.stringify(response.userType));
                // sessionStorage.setItem('userData', JSON.stringify(response.data));

                // props.setAuthState(response);

                sessionStorage.setItem('token', JSON.stringify(response.token));
                navigate('/adminDashboard', { replace: true });
            }
        }
        else{
            let error = 'Authentication error!';
            setLoginError(error );
            toast.current.show({severity:'error', summary: `${error}`, detail: "Invalid login details!", life: 5000});
        }
    }

    return (
        <div>
            <Toast ref={toast} position="top-right" />
            <LocalForm onSubmit={(values) => handleLogin(values)}>
                <Row className="form-group">
                    <Label htmlFor="username" md={3}>Username</Label>
                    <Col md={9}>
                        <Control.text model=".username" id="username" name="username"
                            placeholder="Username"
                            className="form-control"
                            validators={{
                                required
                            }}
                        />
                        <Errors
                            className="text-danger"
                            model=".username"
                            show="touched"
                            messages={{
                                required: 'Required'
                            }}
                            wrapper="ul"
                            component="li"
                        />
                    </Col>
                </Row>
                <Row className="form-group">
                    <Label htmlFor="password" md={3}>Password</Label>
                    <Col md={9}>
                        <Control.password model=".password" id="password" name="password"
                            placeholder="Password"
                            className="form-control"
                            validators={{
                                required
                            }}
                        />
                        <Errors
                            className="text-danger"
                            model=".password"
                            show="touched"
                            messages={{
                                required: 'Required'

                            }}
                            wrapper="ul"
                            component="li"
                        />
                    </Col>
                </Row>
                <Row className="form-group">
                    <Col md={{ size: 9, offset: 3 }}>
                        <Button type="submit" color="primary">
                            Login
                        </Button>
                    </Col>
                </Row>
            </LocalForm>
        </div>
    );
}

export default LoginSignup;