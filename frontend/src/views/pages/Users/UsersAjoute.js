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
import "../../../scss/user.css";
import Alertform from '../../../components/Alert'
import React, { useState,useEffect } from "react";
import { FaPencilAlt,  FaTrashAlt,FaUserPlus } from "react-icons/fa";
import axiosClient from '../../../axios-client';
import '../../../scss/loading.css'
import Select from 'react-select';
import { BsSearch } from 'react-icons/bs';
export default function UsersManager  (props) {
  const userid=props.userid;
  const add=props.add;
  const setErr=props.setErr;
  const setshowerr=props.setshowerr;
  const [loading, setLoading] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [searchvalue, setsearchvalue] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [deleteitem, setDeleteitem] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedSupplier, setselectedSupplier] = useState(null);
  const [searchsupplier, setsearchsupplier] = useState('');
  const getUsers=()=>{
    setLoading(true);
    axiosClient.get('/users').then(({data})=>{  
   
     if (data.data){
     setUsers(data.data);
     setLoading(false)
     //console.log(data.data)
      }
   }).catch(()=>{
    setLoading(false)
  })
  
  }
  useEffect(()=>{
    getUsers();
  },[refresh])
  async function getSuppliers(searchsupplier) {
    
    setLoading(true);
    try{
      let res = await axiosClient.get(searchsupplier =="" ? `/fournisseurs` : `/fournisseursFilter/${searchsupplier}`)
      .then((res)=>res)
      
      if(res.status===200) {
        const options = res.data.data.map((item) => ({
          ...item,
          value: item.id,
          label: item.fullname,
        }));
        setSuppliers(options)
        setLoading(false) 
        }
        
      }
    catch (err) {
      setLoading(false);
      
    }
  }
  useEffect(()=>{
    getSuppliers(searchsupplier);
  },[searchsupplier])
  const initCurrent = {
    id:null,
    fullname:'',
      username:'',
      password:'',
      passIschanged:false,
      phone:'',
      email:'',
      role:'',
  };
  const [users, setUsers] = useState([]);
  const [Suppliers, setSuppliers] = useState([]);
  const [show, setShow] = useState(false);
  const [newUser, setNewUser] = useState(initCurrent);
  const [editing, setEdit] = useState(false);
  const [Role, setRole] = useState(
    [
      { id: 1, label: 'Admin',value:'Admin' },
      { id: 2, label: 'Saller',value:'Vondeur' },
      { id: 3, label: 'Supplier',value:'Fornisseur' }
    ]);
  
  const handleClose = () => {
    
    setShow(false); 
    setselectedSupplier(null);
    setNewUser(initCurrent);
   
  };
  const handeldeleteitem = (product) => {
    setDeleteitem(product);
    setOpenModal(true);
  };
  const handleShow = () => {
    setShow(true);
    setNewUser(initCurrent)
    setEdit(false);
  };

  const onFormSubmit = (newUser) => {
    setLoading(true);
    let payload={
      idFournisseur:newUser.idFournisseur,
      fullname:newUser.fullname,
      username:newUser.username,
      password:newUser.password,
      password_confirmation:newUser.password,
      passIschanged:!newUser.passIschanged,
      phone:newUser.phone,
      email:newUser.email,
      role:newUser.role,

    }
    //console.log(payload)
    axiosClient.post('/users',payload).then(({data})=>{  
   
      if (data){
      setShowAlert(true);
      setLoading(false)
      setrefresh(!refresh);
       }
    }).catch((err)=>{
      setLoading(false)
      setrefresh(!refresh);
     // console.log(err)
      setErr(err.response.data.message);
      setshowerr(true);
   })
   
   
  };

  const onEdit = (User) => {
    
    setEdit(true);
    if(editing === true) {
      
      setNewUser(User);
      setShow(true);
    
    }
    
    
  };

  const onSubmit = (newUser) => {
    setShow(false);
    if (editing === true) {
      onUpdateUser(newUser);
    } else {
      onFormSubmit(newUser);
    }
  };

  const onUpdateUser = (newUser) => {
    setLoading(true);
    setEdit(false);
    //console.log(newUser)
    let payload={
      idFournisseur:newUser.idFournisseur,
      fullname:newUser.fullname,
      username:newUser.username,
      password:newUser.password,
      password_confirmation:newUser.password,
      passIschanged:!newUser.passIschanged,
      phone:newUser.phone,
      email:newUser.email,
      role:newUser.role,

    }
    axiosClient.put('/users/'+newUser.id,payload).then(({data})=>{  
   
      if (data){

      setShowAlert(true);
      setrefresh(!refresh);
      setLoading(false);
      setShow(false); 
       }
    }).catch(()=>{
      setrefresh(!refresh);
      setLoading(false);
      setShow(false); 
   })
    
    
  };

  const onDeleteUser = (currentUser) => {
    setLoading(true)
    setOpenModal(false);
    let id = currentUser.id;
    
    axiosClient.delete('/users/'+id).then(({data})=>{  
   
      if (data){
      setShowAlert(true);
      setrefresh(!refresh);
      setLoading(false);
      setDeleteitem(null);
       }
    }).catch(()=>{
      setrefresh(!refresh);
      setLoading(false);
      setDeleteitem(null);
   })
  };
  const handleSupplierChange = (selectedOption) => {
  //  console.log(selectedOption)
    setNewUser({ ...newUser, idFournisseur: selectedOption.value,username:selectedOption.fullname,fullname:selectedOption.fullname,phone:selectedOption.phone,email:selectedOption.email })   
    setselectedSupplier(selectedOption)
  };
  return (
   
      <Row>
     <Alertform setShowAlert={setShowAlert} showAlert={showAlert}/>
        <Col>
          <Card className="customCard" style={{borderRadius: '15px'}}>
          
            <Card.Body style={{backgroundColor: 'white',overflow: 'auto', borderRadius: '15px'}}>
            
              <div className="d-flex mx-10">
                  <Card.Title>Users</Card.Title>
                  
                </div>
                <div className="d-flex justify-content-between align-items-center">
               
                
                <Form.Group>
      <div className="position-relative">
        <div className="position-absolute top-50 start-0 translate-middle-y mx-2">
          <BsSearch /> {/* Adding the search icon */}
        </div>
        <Form.Control
          type="text"
          required
          onChange={(e) =>
                      setsearchvalue( e.target.value)
                    }
          placeholder="Search"
          className="form-control pl-5" // Add left padding to accommodate the icon
          style={{ direction:"ltr",paddingLeft: '2.5rem' }} // Additional left padding to ensure text doesn't overlap with the icon
        />
      </div>
    </Form.Group>
                {add ? (
                <div className="d-flex">
                 
                    <Button
                    className="btnaction"
                      variant="info"
                      onClick={handleShow}
                      title="Add User"
                    >
                      <FaUserPlus />
                    </Button>
                 
                </div>
                ):('')}
              </div>
              <div style={{maxWidth:'100%',overflow: 'auto',direction: 'ltr'}}>
         
              <Table   bordered hover variant="Default" className="mt-0">
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
                        <td>{user.fullname}</td>
                        <td>{user.email}</td>
                        <td>{user.passIschanged ? ('Yes'):('No')}</td>
                        <td>{user.phone }</td>
                        <td>{user.role =='Vondeur' ? ('Saller'):(user.role =='Fornisseur' ? ('Supplier'):(user.role)) }</td>
                        <td style ={{display:'flex',justifyContent:'center'}}>
                        <div style={{display: 'flex'}}>
                        <Button
                          className="btnaction"
                            variant="info"
                            title="Edit user details"
                            onClick={() => onEdit(user)}
                          >
                            <FaPencilAlt />
                          </Button>
                          
                            {user.id!=userid ? (<Button
                          className="btnaction"
                            variant="danger"
                            title="Delete user"
                            onClick={() => handeldeleteitem(user)}
                          >
                            <FaTrashAlt />
                          </Button>):('')}
                          
                          
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                    
                      <td colSpan={8} className="text-center" >
                      {loading ? (
                        <div className="spinner-container" >
                        <div className="spinner"></div>
                        </div>
                      ):('No users found.' )  }
                       
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              </div>
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

          <Modal size="lg" show={show} onHide={handleClose}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(newUser);
              }}
            >
              <Modal.Header closeButton>
                {
                  editing === true 
                  ? <Modal.Title>Edit User</Modal.Title>
                  : <Modal.Title>Add User</Modal.Title>
                }
              </Modal.Header>
              <Modal.Body >
              <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    value={newUser.role}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                  <option value="">Select</option>
  {Role.map((option) => (
    <option key={option.id} value={option.value}>
      {option.label}

    </option>
  ))}
                    
                  </Form.Select>
                 
                </Form.Group>
                {newUser.role==='Fornisseur' && editing !== true ? (
                  <>
              <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label className="mx-2">Supplier</Form.Label>
                  <Select
                 // styles={customStyles}
          options={Suppliers.slice(0, 6)}
          onChange={handleSupplierChange}
         
          placeholder="Select"
          isSearchable 
          required
          onInputChange={(newValue) => {
        setsearchsupplier(newValue);
        // You can do whatever you want with the search input value here
    }}
        />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>FullName</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedSupplier ? selectedSupplier.fullname:newUser.fullname}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, fullname: e.target.value })
                    }
                    placeholder="Enter FullName"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedSupplier ? selectedSupplier.fullname:newUser.username}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    placeholder="Enter Username"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedSupplier ? selectedSupplier.phone:newUser.phone}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    placeholder="Enter Phone Number"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAddress">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={selectedSupplier ? selectedSupplier.email:newUser.email}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="Enter Email"
                  />
                </Form.Group>
              </> ):(
                <>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>FullName</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.fullname}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, fullname: e.target.value })
                    }
                    placeholder="Enter FullName"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.username}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    placeholder="Enter Username"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.phone}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    placeholder="Enter Phone Number"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAddress">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newUser.email}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="Enter Email"
                  />
                </Form.Group>
                </>
              )}
              
                <Form.Group className="mb-3" controlId="formBasicAge">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    defaultValue={''}
                    value={newUser.password}
                    required={editing === true ? false:true}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    placeholder="Enter Password"
                  />
                </Form.Group>
                {/* 
                <Form.Group className="mb-3">
                  <Form.Label>User must change the password</Form.Label>
                  <Form.Check
    type="checkbox" // Specify the type as checkbox
    //checked={newUser.passIschanged}
    defaultChecked={!newUser.passIschanged}
    onChange={(e) =>
      setNewUser({ ...newUser, passIschanged: e.target.checked })
    }/>
                    </Form.Group>
                    */}
                
                
               
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                {editing === true ? (
                  <Button variant="primary" type="submit" >
                    Update
                  </Button>
                ) : (
                  <Button variant="primary"  type="submit" >
                    Add
                  </Button>
                )}
              </Modal.Footer>
            </Form>
          </Modal>
        </Col>
      </Row>
      
  );
};