import React, { Component, useState, useRef } from "react";
import { Button, Container, Modal, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
import { Toast } from 'primereact/toast';
import FormComp from "./FormComponent";


async function addHR(data) {

    const token = sessionStorage.getItem('token');

    return fetch('http://localhost:5000/admin/addHR', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            token: token,
        },
        body: JSON.stringify(data)
    })
        .then(data => data.json())
}

function Header (props) {

    const token = sessionStorage.getItem('token');

    if(!token){
        sessionStorage.clear();
        document.location = '/';
    }

    const hrm = props.hrm;
    const toast = useRef(null);

    const [msgModalOpen, setMsgModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);


    const toggleModal = () => {

        if(hrm){
            setMsgModalOpen(!msgModalOpen);
        }
        else{
            setFormModalOpen(!formModalOpen);
        }
    }

    const handleClose = () => setShowConfirm(false);
    const handleShow = () => setShowConfirm(true);

    const confirmLogout = () => {
        sessionStorage.clear();
        setShowConfirm(false);
        document.location = '/';
    }

    const onSubmit = async (data) => {

        data['ownerID'] = props.ownerID;
        data['requestID'] = props.reqId;

        let response = await addHR(data);
        if (response.status === "ok") {
            console.log(response)
            toast.current.show({ severity: 'success', summary: "Vehicle Successfully Registered!", life: 5000 });
        }
        else {
            console.log(response.error);
            toast.current.show({ severity: 'error', summary: `${response.error}`, life: 5000 });
        }
    }

    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <div>

            <div className="">
                <Navbar bg="dark" variant="dark">
                    <Container>
                        <Navbar.Brand href="#home">Admin</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link href="##" onClick={() => toggleModal()}>Add HR Manager </Nav.Link>
                            <Nav.Link href="#" onClick={() => handleShow()}><span className="fa fa-sign-out fa-lg"></span> Logout</Nav.Link>
                        </Nav>
                    </Container>
                </Navbar>
            </div>

            <Modal show={msgModalOpen} onHide={toggleModal}>
                <Modal.Header closeButton>
                    <Modal.Title>HR Manager is already added to the system!</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={toggleModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={formModalOpen} onHide={toggleModal}>

                <Modal.Header closeButton>
                    <Modal.Title>Add HR Manager</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Toast ref={toast} position="top-center" />

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormComp register={register} errors={errors} />
                        <br></br>
                        <Button variant="primary" type="submit" value="submit">
                            Register HR Manager
                        </Button>
                    </Form>

                </Modal.Body>

            </Modal>

            <Modal show={showConfirm} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Sure you want to logout?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmLogout}>
                    Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Header;