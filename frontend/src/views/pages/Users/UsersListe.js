import React, { useState,useEffect } from "react";

import axiosClient from '../../../axios-client';
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { Toggle } from "rsuite";
import "../../../scss/user.css";
import { FaPencilAlt,  FaTrashAlt,FaUserPlus } from "react-icons/fa";
import Alertform from '../../../components/Alert'
export default function UsersManager  (props) {
  const userid=props.userid;
  const [showAlert, setShowAlert] = useState(false);
  async function getUsers(){
    try{
      let res = await axiosClient.get("/users")
      .then((res)=>res)
      console.log(res)
      if(res.status===200) {
        setUsers(res.data);
        }}
    catch (err) {
    }
    }
  useEffect(()=>{
    getUsers();
  },[])
 
  const acces=props.acces;
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [newUser, setNewUser] = useState([]);
  
  const [openModal, setOpenModal] = useState(false);
  const [deleteitem, setDeleteitem] = useState(null);
  const [Role, setRole] = useState(
    [
      { id: 1, label: 'Admin',value:'Admin' },
      { id: 2, label: 'Saller',value:'Vendeur' }
    ]);
  const handleClose = () => {
    setShow(false); 
  };
  const handleShow = () => {
    setShow(true);
     };

     const handeldeleteitem = (product) => {
      setDeleteitem(product);
      setOpenModal(true);
    };

  const onEdit = (newUser) => {
    
      setNewUser({ ...newUser, newUser });
      handleShow();
    
    
  };

  const onSubmit = (newUser) => {
    
      onUpdateUser(newUser);
    
  };

  const onUpdateUser = (newUser) => {
    axiosClient.update('/Users/'+newUser.id).then(({data})=>{  
   
      if (data.data){
      setUsers(data.data);
      setShowAlert(true);
       }
    }).catch(()=>{
 
   })
  };

  const onDeleteUser = (currentUser) => {
    setOpenModal(false);
    axiosClient.delete('/user/'+currentUser.id).then(({data})=>{  
      
      if (data.data){
      setUsers(data.data);
      setShowAlert(true);
      setDeleteitem(null);
       }
    }).catch(()=>{
      setDeleteitem(null);
   })
  };

  return (
      <Row>
      <Alertform setShowAlert={setShowAlert} showAlert={showAlert}/>
        <Col>
          <Card className="customCard">
            <Card.Body style={{backgroundColor: 'white',overflow: 'auto'}}>
              <div className="d-flex justify-content-between customCardBody">
                <div>
                  <Card.Title>Users Liste</Card.Title>
                  
                </div>
              </div>
              <Table   bordered hover variant="Default" style={{direction:'ltr'}}>
                <thead className="table-info">
                  <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Fullname</th>
                    <th>Email</th>
                    <th>Password Changed</th>
                    <th>phone number</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (

                      <tr key={index}>
                        <td>{user.id}</td>
                        <td>{user.id==userid ? (user.username+' (you)'):(user.username)}</td>
                        <td>{user.FullName}</td>
                        <td>{user.email}</td>
                        <td>{user.passIschanged ? ('Yes'):('No')}</td>
                        <td>{user.phone }</td>
                        <td>{user.avatar}</td>
                        <td style ={{display:'flex',justifyContent:'center'}}>
                        <div style={{display: 'flex'}}>
                        {acces=='111'|| acces=='101'?
                        (<Button
                          className="btnaction"
                            variant="info"
                            title="Edit user details"
                            onClick={() => onEdit(user)}
                          >
                            <FaPencilAlt />
                          </Button>):('')}
                          {acces=='111'|| acces=='011' ?
                          (
                            user.id!=userid ? (<Button
                          className="btnaction"
                            variant="danger"
                            title="Delete user"
                            onClick={() => handeldeleteitem(user)}
                          >
                            <FaTrashAlt />
                          </Button>):('')):('')
                          }
                          
                          
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
                                   
            </Card.Body>
            <Modal show={openModal} size="md" onHide={() => setOpenModal(false)} centered>
        <Modal.Header closeButton />
        <Modal.Body>
          <div className="text-center">
           <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
            </h3>
            <div className="d-flex justify-content-start gap-4">
              <Button variant="danger" onClick={() => onDeleteUser(deleteitem)}>
                {"Yes, I'm sure"}
              </Button>
              <Button variant="secondary" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
          </Card>

          <Modal size="lg"  show={show} onHide={handleClose}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(newUser);
              }}
            >
              <Modal.Header closeButton>
                
                 <Modal.Title>Edit User</Modal.Title>
              </Modal.Header>
              <Modal.Body >
              <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>FullName</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.FullName}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, FullName: e.target.value })
                    }
                    placeholder="Enter FullName"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.Username}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, Username: e.target.value })
                    }
                    placeholder="Enter Username"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAddress">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newUser.Email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, Email: e.target.value })
                    }
                    placeholder="Enter Email"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAge">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newUser.Password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, Password: e.target.value })
                    }
                    placeholder="Enter Password"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>User must change the password</Form.Label>
                  <Form.Check
    type="checkbox" // Specify the type as checkbox
    checked={newUser.Password_change}
    onChange={(e) =>
      setNewUser({ ...newUser, Password_change: e.target.checked })
    }/>
                    </Form.Group>
                    
                
                
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={newUser.Role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, Role: e.target.value })
                    }
                  >
                  <option value="">Select</option>
  {Role.map((option) => (
    <option key={option.id} value={option.label}>
      {option.label}

    </option>
  ))}
                    
                  </Form.Select>
                 
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                  <Button variant="primary" type="submit" onClick={handleClose}>
                    Update
                  </Button>
              </Modal.Footer>
            </Form>
          </Modal>
        </Col>
      </Row>
  );
};