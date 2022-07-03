import { Badge, Card, Table } from "react-bootstrap";
import ReactCardFlip from "react-card-flip";
import React, { useEffect, useState } from 'react';
import { titleCase } from "title-case";
import { Button } from 'primereact/button';

const axios = require('axios').default;

export default function Body(props) {

    const token = sessionStorage.getItem('token');

    if(!token){
        sessionStorage.clear();
        document.location = '/';
    }

    const [newFlipped, setNewFlipped] = useState(false);
    const flipNew = () => setNewFlipped(!newFlipped);

    useEffect(() => {

        axios.get(`http://localhost:5000/admin/getHRM`, {
            headers: {
                'Content-Type': 'application/json',
                token: token,
            }
        })
            .then(response => {

                let status = response.data.status;

                if (status === 'ok') {
                    const hrm = response.data.result;
                    props.setHRM(hrm)
                }
                else if (status === 'auth-error') {
                    sessionStorage.clear();
                    document.location = '/';
                }
                else {
                    console.log(response.error);
                }
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    return (
        <div className="container">

            {/* <div className="row align-items-center">
                <RenderCard cond={newFlipped} meth={flipNew} img={"/assets/images/new.jpg"} col={"primary"} state={"pending"} />
            </div> */}

        </div>
    );
}