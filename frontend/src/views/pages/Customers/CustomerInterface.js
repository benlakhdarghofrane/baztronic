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
import React, { useState,useEffect } from "react";
import '../../../scss/loading.css'

import { FaPencilAlt,  FaTrashAlt,FaUserPlus } from "react-icons/fa";
import axiosClient from '../../../axios-client';
import {

  cilLockLocked,

} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

export default function UsersManager  (props) {
  const  setAuth =props.setAuth;
  const acces=props.acces;
  const add=props.add;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [Products, setProducts] = useState([]);
  const [refresh, setrefresh] = useState(false);
  
  const onLogout =(ev)=>{
    ev.preventDefault();
    axiosClient.post('/logout').then((res)=>{
       //console.log(res);
       if(res.data.message==="LOGOUT"){

        
        setAuth(false);
        localStorage.removeItem('ACESS_TOKEN')
       }
        //window.location.reload(true);

    })
    //setAuth(false);
    //setUser({});
    //setToken(null);
  }
  const getProducts=(page)=>{
    setLoading(true);
    axiosClient.get(`/product/all?page=${page}`).then(({data})=>{  
   
     if (data.data){
      setProducts(data.data);
     setTotalPages(data.meta.last_page)
     setLoading(false);
      }
   }).catch(()=>{
    setLoading(false);
  })
  }
  useEffect(()=>{
    getProducts(currentPage);
  },[refresh,currentPage])
 
  const [show, setShow] = useState(false);
  const [newUser, setNewUser] = useState([]);
  const [editing, setEdit] = useState(false);
  const [Client, setClient] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteitem, setDeleteitem] = useState(null);
  const [loading, setLoading] = useState(false);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleClose = () => {
    
    setShow(false); 
   
  };
  const handeldeleteitem = (product) => {
    setDeleteitem(product);
    setOpenModal(true);
  };
  const handleShow = () => {
    setShow(true);
    setEdit(false);
    setNewUser([]);
  };

  const onFormSubmit = (newUser) => {
    setLoading(true);
    let payload={
      fullname:newUser.fullname,
      phone:newUser.phone,
      email:newUser.email,
      adresse:newUser.adresse,

    }
    //console.log(payload)
    axiosClient.post('/clients',payload).then(({data})=>{  
   
      if (data){
      //console.log(data.data)
      setClient(payload);
      setLoading(false);
        setrefresh(!refresh);
       }
    }).catch(()=>{
      setLoading(false);
      setrefresh(!refresh);
   })
  };

  const onEdit = (newUser) => {
    setEdit(true);
    if(editing === true) {
      setNewUser({ ...newUser, newUser });
     
      setShow(true);
    
    }
    
  };

  const onSubmit = (newUser) => {
    if (editing === true) {
      onUpdateUser(newUser);
    } else {
      onFormSubmit(newUser);
    }
  };

  const onUpdateUser = (newUser) => {
    setEdit(false);
    setLoading(true);
    let payload={
      fullname:newUser.fullname,
      phone:newUser.phone,
      email:newUser.email,
      adresse:newUser.adresse,
      

    }
    //console.log(payload)
    axiosClient.put('/clients/'+newUser.id,payload).then(({data})=>{  
   
      if (data){
      //console.log(data.data)
      setLoading(false);
        setrefresh(!refresh);
       }
    }).catch(()=>{
      setLoading(false);
      setrefresh(!refresh);
   })
  };

  const onDeleteUser = (currentUser) => {
    setLoading(true);
    setOpenModal(false);
    let id = currentUser.id;
    
    axiosClient.delete('/clients/'+id).then(({data})=>{  
   
      if (data){
      //console.log(data.data)
      setLoading(false);
        setrefresh(!refresh);
        setDeleteitem(null);
       }
    }).catch(()=>{
      setLoading(false);
      setrefresh(!refresh);
      setDeleteitem(null);
   })
  };

  return (
      <Row>
        <Col >
          <Card className="customCard " style={{borderRadius: '15px',maxWidth:'90%',marginInline:'5dvw'}}>
            <Card.Body style={{backgroundColor: 'white',overflow: 'auto', borderRadius: '15px'}}>
              <div className="d-flex justify-content-between customCardBody">
                <div>
                  <Card.Title>Costumer Interface</Card.Title>
                  <button style={{border:"0", backgroundColor:"transparent"}} onClick={onLogout}>
          Logout
          <CIcon icon={cilLockLocked} className="mx-2" />
          </button>
                </div>
                <div style={{fontSize:'40px'}}>
                  {Client.length!==0 &&(
                    'Welcome:' + Client.fullname
                  )
              }
                </div>
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
               
              </div>
              <Table   bordered hover variant="Default" style={{direction:'ltr'}}>
                <thead className="table-info">
                  <tr>
                    <th>ID</th>
                    <th>Barcode</th>
                    <th>Category</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Unit price </th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {Products.length > 0 ? (
                    
                    Products.map((Product, index) => (
                    
                      <tr key={index}>
                        <td>{Product.id}</td>
                        <td>{Product.barcode}</td>
                        <td>{Product.category.name}</td>
                        <td>{Product.designationEN}</td>
                        <td>{Product.quantity }</td>
                        <td>{Product.salePrice}</td>
                        <td>{Product.salePrice*Product.quantity}</td>
                        
                      </tr>
                    ))
                    
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center">
                        No Products found.
                      </td>
                    </tr>
                  )}
                  <tr style={{fontSize:'80px'}}>
                    <td colSpan={3} className="text-center" >
                        Total
                      </td>
                      <td colSpan={4} className="text-center">
                        0
                      </td>
                    </tr>
                </tbody>
              </Table> 
             
            </Card.Body>
            <Modal show={openModal} size="md" onHide={() => setOpenModal(false)} centered>
        <Modal.Header closeButton />
        <Modal.Body>
          <div className="text-center">
           <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this costumer?
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
                  ? <Modal.Title>Edit Costumer</Modal.Title>
                  : <Modal.Title>Add Costumer</Modal.Title>
                }
              </Modal.Header>
              <Modal.Body >
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
                
                <Form.Group className="mb-3" controlId="formBasicAddress">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="Enter Email"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Phone number</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.phone}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Adresse</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.adresse}
                    required
                    onChange={(e) =>
                      setNewUser({ ...newUser, adresse: e.target.value })
                    }
                    placeholder="Enter Costumer Adresse"
                  />
                </Form.Group>
                    
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                {editing === true ? (
                  <Button variant="primary" type="submit" onClick={handleClose}>
                    Update
                  </Button>
                ) : (
                  <Button variant="primary" disabled={!newUser.fullname} type="submit" onClick={handleClose}>
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