import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Label} from 'reactstrap';
import Axios from 'axios';

//const required = (val) => val && val.length;

// async function loginAdmin(data) {

//     return fetch('http://localhost:5000/admin/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(data)
//     })
//       .then(data => data.json())
// }

// function LoginSignup(props){

//     let navigate = useNavigate();

//     const [loginError, setLoginError] = useState('');
//     const [value, setValue] = useState('');
//     const toast = useRef(null);

//     const handleLogin = async (event) => {

//         sessionStorage.clear();

//         let response = await loginAdmin({
//             username: event.username,
//             password: event.password
//         });

//         if(response){
//             if(response.status === 'error'){
//                 setLoginError(response.error );
//                 toast.current.show({severity:'error', summary: `${response.error}`, detail: "Invalid login details!", life: 5000});
//             }
//             else{

//                 // sessionStorage.setItem('userType', JSON.stringify(response.userType));
//                 // sessionStorage.setItem('userData', JSON.stringify(response.data));

//                 // props.setAuthState(response);

//                 sessionStorage.setItem('token', JSON.stringify(response.token));
//                 navigate('/adminDashboard', { replace: true });
//             }
//         }
//         else{
//             let error = 'Authentication error!';
//             setLoginError(error );
//             toast.current.show({severity:'error', summary: `${error}`, detail: "Invalid login details!", life: 5000});
//         }
//     }
export function LoginSignup() {
    let navigate = useNavigate();

    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const initialValues = { username: "", password: "" };
    const [formValues, setformValues] = useState(initialValues);
    const [isSubmit, setIsSubmit] = useState(false);
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [show, setShow] = useState(false);

    useEffect(() => {
        setUserName(formValues.username);
        setPassword(formValues.password);
    }, [isSubmit, formValues]);

    useEffect(() => {
        if (isSubmit){
            Axios.post('http://localhost:8087/admin/login', formValues)
          .then((response) => {
            sessionStorage.clear();

                // sessionStorage.setItem('userType', JSON.stringify(response.userType));
                // sessionStorage.setItem('userData', JSON.stringify(response.data));

                // props.setAuthState(response);
                sessionStorage.setItem('token', JSON.stringify(response.data.token));
                navigate('/adminDashboard', { replace: true });
        }).catch((err)=>{
            setAlertType("alert alert-danger");
            setAlertMessage("");
            switch (err.response.request.status) {
              case 400:
                setAlertMessage(err.response.data.message);
                setShow(true);
                break;
              case 500:
                setAlertMessage("Server Error!");
                setShow(true);
                break;
              case 501:
                setAlertMessage("Server Error!");
                setShow(true);
                break;
              case 502:
                setAlertMessage("Server Error!");
                setShow(true);
                break;
              default:
                break;
        }});
        }
        setIsSubmit(false);
        }, [isSubmit, username, password]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setformValues({ ...formValues, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmit(true);
    };

    return (
        <div className="container w-25 shadow mt-5">
        <div style={{ visibility: show ? "visible" : "hidden" }} className={alertType} role="alert">
            {alertMessage}
         </div>
        <div className="col-6">
        </div>
          <div className="loginBody"> 
            <div className='login'>
                <h2 > Human Resource Management System </h2>
                <div className="row">
                  <div>
                    <Form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <Label className="form-label">Username</Label>
                            <Input id="username" type="text"  value={formValues.username} onChange={handleChange} className="form-group" name="username" required/>
                        </div>
                        
                        <div className="mb-3">
                            <Label className="form-label">Password</Label>
                            <Input type="password" value={formValues.password} onChange={handleChange} className="form-group" name="password" required/>
                        </div>
                        
                        <button className="btn btn-primary mb-3">
                            Sign In
                        </button>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
    );
}

export default LoginSignup;