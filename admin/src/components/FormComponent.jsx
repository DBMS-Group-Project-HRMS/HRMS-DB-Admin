import { Badge, Card, Table } from "react-bootstrap";
import ReactCardFlip from "react-card-flip";
import React, { useEffect, useState } from 'react';
import { titleCase } from "title-case";
import { Button } from 'primereact/button';
import Form from 'react-bootstrap/Form';

const axios = require('axios').default;

export default function FormComp({ register, errors }) {

    const disableFutureDate = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        const yyyy = today.getFullYear();
        return yyyy + "-" + mm + "-" + dd;
    };

    // const getDateString = () => {
    //     var regDate = new Date(vehicle.registeredDate);
    //     const dd = String(regDate.getDate()).padStart(2, "0");
    //     const mm = String(regDate.getMonth() + 1).padStart(2, "0"); //January is 0!
    //     const yyyy = regDate.getFullYear();
    //     return yyyy + "-" + mm + "-" + dd;
    // };

    return (
        <div>
            <div className="row">
                <div className="col-sm">
                    <Form.Group>
                        <Form.Label htmlFor="firstname">FirstName: </Form.Label>
                        <Form.Control
                            type="text"
                            id="firstname"
                            name="firstname"
                            {...register("firstname", {
                                required: true
                            })}
                        />
                    </Form.Group>
                    {errors.firstname && <p className='text-danger'>FirstName is required!</p>}
                </div>
                <div className="col-sm">
                    <Form.Group>
                        <Form.Label htmlFor="lastname">Lastname: </Form.Label>
                        <Form.Control
                            type="text"
                            id="lastname"
                            name="lastname"
                            {...register("lastname", {
                                required: true
                            })}
                        />
                    </Form.Group>
                    {errors.firstname && <p className='text-danger'>Lastname is required!</p>}
                </div>
                {/* <div className="col-sm">
                    <Form.Group>
                        <Form.Label htmlFor="weight">Vehicle Weight</Form.Label>
                        <Form.Control
                            type="number"
                            id="weight"
                            name="weight"
                            defaultValue={''}
                            {...register("weight", {
                                required: true
                            })}
                        />
                    </Form.Group>
                    {errors.weight && <p className='text-danger'>Vehicle Weight is required!</p>}

                </div> */}
            </div>

            <div className="row">
                <div className="col-sm">
                    <Form.Group>
                        <Form.Label htmlFor="birthday">Birthday: </Form.Label>
                        <Form.Control
                            type="date"
                            id="birthday"
                            name="birthday"
                            max={disableFutureDate()}
                            defaultValue={''}
                            {...register("birthday", {
                                required: true,
                            })}
                        />
                        {errors.birthday && <p className='text-danger'>Valid Birthday is required!</p>}
                    </Form.Group>
                </div>
                <div className="col-sm">
                    <Form.Group>
                        <Form.Label htmlFor="email">email: </Form.Label>
                        <Form.Control
                            type="text"
                            id="email"
                            name="email"
                            {...register("email", {
                                required: true
                            })}
                        />
                    </Form.Group>
                    {errors.email && <p className='text-danger'>email is required!</p>}
                </div>
            </div>

            <div className="row">
                <div className="col-sm">
                    <Form.Group>
                        <Form.Label htmlFor="salary">Salary: </Form.Label>
                        <Form.Control
                            type="number"
                            id="salary"
                            name="salary"
                            {...register("salary", {
                                required: true,
                            })}
                        />
                        {errors.salary && <p className='text-danger'>Valid Salary is required!</p>}
                    </Form.Group>
                </div>
                <div className="col-sm">
                    <Form.Group>
                        <Form.Label htmlFor="Joined_date">Joined date: </Form.Label>
                        <Form.Control
                            type="date"
                            id="Joined_date"
                            name="Joined_date"
                            max={disableFutureDate()}
                            defaultValue={''}
                            {...register("Joined_date", {
                                required: true,
                            })}
                        />
                        {errors.Joined_date && <p className='text-danger'>Valid Joined date is required!</p>}
                    </Form.Group>
                </div>
            </div>

        </div>
    );
}