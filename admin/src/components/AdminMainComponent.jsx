import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from "react-router-dom";

function AdminMain () {

    const navigate = useNavigate();
    const [errmsg, setErr] = useState("");
  
    const [alertType, setAlertType] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [show, setShow] = useState(false);
    
    const [formValues, setformValues] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    //const [data, setData] = useState(null);
  
    const [depSelect, setDepSelect] = useState([]);
    const [MsSelect, setMsSelect] = useState([]);
    const [EsSelect, setEsSelect] = useState([]);
  
    useEffect( ()=> {
        let token = sessionStorage.getItem("token");
      Axios.get("http://localhost:8087/admin/getDetails", { headers:{token : token}}).then((response)=>{
        //setUserslist(response.data);
        const selectDetails = response.data;
        setDepSelect([...selectDetails[0]]);
        setMsSelect([...selectDetails[1]]);
        setEsSelect([...selectDetails[4]]);
      });
    },[]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setformValues({ ...formValues, [name]:value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setIsSubmit(true);
    }
    
    useEffect(() => {
      if (isSubmit) {
        console.log(formValues);
        console.log("registering a user");
        let token = sessionStorage.getItem("token");
        Axios.post('http://localhost:8087/admin/addHR', formValues, { headers:{token : token}}).then( (response)=>{
            setAlertType("alert alert-success");
            setAlertMessage(response.data.message);
            setShow(true);
          })
          .catch((err) => {
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
            }
          });
          setIsSubmit(false);
      }
    },[isSubmit,formValues]);
  
    return (
  
  <div className="container w-25">
    <div style={{ visibility: show ? "visible" : "hidden" }} className={alertType} role="alert">
      {alertMessage}
    </div>
                  <div className="d-flex">
                    <div className="w-100"><h3 className="mb-4 center">Registration</h3> </div>
                  </div>
                    <form method="post" className="signin-form" onSubmit={handleSubmit}>
                      <div className="error">
                        <p className="text-danger">{errmsg}</p>
                      </div>
  
  
                      <div className="form-group mb-3">
                        <label className="label" >Firstname</label>
                        <input type="text" className="form-control" name="firstname" id="firstname" value={formValues.firstname} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >Lastname</label>
                        <input type="text" className="form-control" name="lastname" id="lastname" value={formValues.lastname} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >Birthday</label>
                        <input type="date" className="form-control"  name="birthday" id="birthday" value={formValues.birthday} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                          <label className="label" >Email</label>
                          <input type="email" className="form-control"  name="email" id="email" value={formValues.email} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >Salary</label>
                        <input type="text" className="form-control"  name="salary" id="salary" value={formValues.salary} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >Joined_date</label>
                        <input type="date" className="form-control"  name="Joined_date" id="Joined_date" value={formValues.Joined_date} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >nic_number</label>
                        <input type="text" className="form-control"  name="nic_number" id="nic_number" value={formValues.nic_number} onChange={handleChange} required/>
                      </div>
  
                      <div className="form-row">
                          <div className="form-group col-6">
                          <label className="label" >phone_number1</label>
                          <input type="text" className="form-control"  name="phonenumber1" id="phonenumber1" value={formValues.phonenumber1} onChange={handleChange} required/>
                          </div>
                          <div className="form-group col-6">
                          <label className="label" >phone_number2</label>
                          <input type="text" className="form-control"  name="phonenumber2" id="phonenumber2" value={formValues.phonenumber2} onChange={handleChange} required/>
                          </div>
                      </div>
  
                      <div className="form-group mb-3">
                      <label className="label" >Department</label>
                      <select className="form-control mb-3" name="department" id="department" value={formValues.department} onChange={handleChange} >
                      <option >Open this select menu</option>
                      {depSelect.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                      </select>
                      </div>
  
                      <div className="form-group mb-3">
                      <label className="label" >Marital Status</label>
                      <select className="form-control mb-3" name="maritalStatus" id="maritalStatus" value={formValues.maritalStatus} onChange={handleChange} >
                      <option >Open this select menu</option>
                      {MsSelect.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                      </select>
                      </div>
  
                      <div className="form-group mb-3">
                      <label className="label" >Employee status</label>
                      <select className="form-control mb-3" name="empStatus" id="empStatus" value={formValues.empStatus} onChange={handleChange} >
                      <option >Open this select menu</option>
                      {EsSelect.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                      </select>
                      </div>
  
                      <br></br><br></br><br></br>
  
                      <h3>Address</h3>
  
                      <div className="form-group mb-3">
                        <label className="label" >Line 1</label>
                        <input type="text" className="form-control"  name="Line1" id="Line1" value={formValues.Line1} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >Line 2</label>
                        <input type="text" className="form-control"  name="Line2" id="Line2" value={formValues.Line2} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >city</label>
                        <input type="text" className="form-control"  name="City" id="City" value={formValues.City} onChange={handleChange}/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >District</label>
                        <input type="text" className="form-control"  name="District" id="District" value={formValues.District} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >Postal code</label>
                        <input type="text" className="form-control"  name="Postal_Code" id="Postal_Code" value={formValues.Postal_Code} onChange={handleChange} required/>
                      </div>
  
                      <br></br><br></br><br></br>
  
                      <h3>Emergency Contact Number Details</h3>
  
                      <div className="form-group mb-3">
                        <label className="label" >Name</label>
                        <input type="text" className="form-control"  name="Name" id="Name" value={formValues.Name} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >Phone Number</label>
                        <input type="text" className="form-control"  name="phone_number" id="phone_number" value={formValues.phone_number} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >Relation</label>
                        <input type="text" className="form-control"  name="Relationship" id="Relationship" value={formValues.Relationship} onChange={handleChange}  required/>
                      </div>
  
                      <br></br><br></br><br></br>
  
                      <div className="form-group mb-3">
                        <label className="label" >username</label>
                        <input type="text" className="form-control"  name="username" id="username" value={formValues.username} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >password</label>
                        <input type="password" className="form-control"  name="password1" id="password1" value={formValues.password1} onChange={handleChange} required/>
                      </div>
                      <div className="form-group mb-3">
                        <label className="label" >confimation password</label>
                        <input type="password" className="form-control"  name="password2" id="password2" value={formValues.password2} onChange={handleChange} required/>
                      </div>
  
  
  
                      <div className="form-group">
                        <button type="submit" className="form-control btn btn-info rounded submit px-3" >
                        Register
                        </button>
                      </div>
                  </form>
               </div>
           
    );
}

export default AdminMain;