import { useEffect, useRef, useState } from "react";
//import Cookie from "cookie-universal";
import {
  IconButton,
  InputAdornment,TextField,
} from "@mui/material";
import { Icon } from "@iconify/react";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";
import "../scss/Auth.css";
import '../scss/style.scss';
import Loading from "./Loading";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  const  setpwchange=props.setpwchange;
  const  setNav=props.setNav;
  
  const setuserid=props.setuserid;
 const setusername=props.setusername;
 const setRole=props.setRole;
 const setAuth =props.setAuth;
 const { setToken }=useStateContext();
  
 const [showPassword, setShowPassword] = useState(false);
  //  States
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();
  // Err
  const [err, setErr] = useState("");

  // Ref
  const focus = useRef("");

  // Loading

  const [loading, setLoading] = useState(false);

  // Cookies
  //const cookie = Cookie();

  //   Handle Form Change
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Handle Focus
  useEffect(() => {
    focus.current.focus();
  }, []);

  //   Handle Submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try{
      let res = await axiosClient.post("/login",form)
      .then((res)=>res)
      
      if(res.status===200) {
        setLoading(false)
      //console.log(res.data)
      window.localStorage.setItem('ACESS_TOKEN',res.data.token);
       setusername(res.data.user.username);
       setRole(res.data.user.role);
       setpwchange(res.data.user.passIschanged);
       setToken(res.data.token); 
       setuserid(res.data.user.id);
       setNav(res.data.user.items);
       setAuth(true);
       
        navigate("/", { replace: true });
  
        }}
    catch (err) {
      setLoading(false);
      console.log(err)
      if (err.response.status === 422 ) {
        setErr("Wrong Username Or Password");
      } else {
        setErr("Internal Server ERR");
      }
    }
  }

  return (
    <>
      {loading && <Loading />}
      <div className="container">
        <div className="row" style={{ height: "100vh" }}>
          <Form onSubmit={handleSubmit} className="form">
            <div className="custom-form">
              <h1 className="mb-5">Login Now</h1>

              <Form.Group className="form-custom">
                <Form.Control
                  ref={focus}
                  type="text"
                  name="username"
                  onChange={handleChange}
                  value={form.username}
                  placeholder="Enter Your Username"
                  required
                />
                <Form.Label>Username:</Form.Label>
              </Form.Group>
              <Form.Group className="form-custom" style={{display:'flex',alignItems:'center'}}>
              
  <Form.Control
    type={showPassword ? "text" : "password"}
    name="password"
    onChange={handleChange}
    value={form.password}
    placeholder="Enter Your Password"
    required
    minLength="6"
   
  />
  
  <Form.Label>Password:</Form.Label>
    <InputAdornment position="end" className="password-toggle-btn" >
        <IconButton onClick={() => setShowPassword((prev) => !prev)}>
          {!showPassword ? (
            <Icon icon="mdi:eye-off" />
          ) : (
            <Icon icon="ic:round-remove-red-eye" />
          )}
        </IconButton>
      </InputAdornment>
  
</Form.Group>
<Form.Group>
              <button className="btn btn-primary" style={{ width: '50%',fontWeight: 'bold', background: 'linear-gradient(to right, green,rgb(243, 255, 135))',borderColor: '#f29c5f' }}>Login</button>
              
              </Form.Group>                
              {err !== "" && <span className="error">{err}</span>}
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
