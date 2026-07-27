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

import { BsSearch } from 'react-icons/bs';
import { FaPencilAlt,  FaTrashAlt,FaUserPlus } from "react-icons/fa";
import axiosClient from '../../../axios-client';
import '../../../scss/loading.css'
import Alertform from '../../../components/Alert'
export default function UsersManager  (props) {
  
  const add=props.add;
  const [showAlert, setShowAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [refresh, setrefresh] = useState(false);
  const [searchvalue, setsearchvalue] = useState('');
  const getUsers=(page,searchvalue)=>{
    setLoading(true);
    axiosClient.get(searchvalue=="" ? `/fournisseurs?page=${page}` :`/fournisseursFilter/${searchvalue}?page=${page}`).then(({data})=>{  
   
     if (data.data){
     setUsers(data.data);
     //console.log(data.meta.last_page)
      setTotalPages(data.meta.last_page)
        setLoading(false);
        
      }
   }).catch(()=>{
    setLoading(false);
  })
  }
  useEffect(()=>{
    getUsers(currentPage,searchvalue);
  },[refresh,currentPage,searchvalue])
  
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [newUser, setNewUser] = useState([]);
  const [editing, setEdit] = useState(false);
  
  const [loading, setLoading] = useState(false);
  
  const [openModal, setOpenModal] = useState(false);
  const [deleteitem, setDeleteitem] = useState(null);
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
      username:newUser.username,
      phone:newUser.phone,
      email:newUser.email,
      adresse:newUser.adresse,

    }
    //console.log(payload)
    axiosClient.post('/fournisseurs',payload).then(({data})=>{  
   
      if (data){
      //console.log(data.data)
      setShowAlert(true);
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
    setShow(false); 
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
      username:newUser.username,
      phone:newUser.phone,
      email:newUser.email,
      adresse:newUser.adresse,

    }
    
    axiosClient.put('/fournisseurs/'+newUser.id,payload).then(({data})=>{  
   
      if (data){
      //console.log(data.data)
      setShowAlert(true);
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
    
    axiosClient.delete('/fournisseurs/'+id).then(({data})=>{  
   
      if (data){
        setShowAlert(true);
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
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
      <Row>
      <Alertform setShowAlert={setShowAlert} showAlert={showAlert}/>
        <Col>
          
    <Card className="customCard" style={{ borderRadius: '15px' }}>
      <Card.Body style={{ backgroundColor: 'white', overflow: 'auto', borderRadius: '15px' }}>
       <div className="d-flex mx-10">
                  <Card.Title>Suppliers</Card.Title>
                  
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
        <div style={{maxWidth:'100%',overflow: 'auto',direction: 'ltr'}}>
         
        <Table bordered hover variant="Default" className="mt-0">
          {/* Table headers */}
          <thead className="table-info">
            <tr>
              <th>ID</th>
              <th>Fullname</th>
              <th>Email</th>
              <th>Phone number</th>
              <th>Adresse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Render loading spinner or message
              <tr>
                <td colSpan={6} className="text-center">
                  <div className="spinner-container">
                    <div className="spinner"></div>
                  </div>
                </td>
              </tr>
            ) : (
              // Render user data
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.fullname}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.adresse}</td>
                  <td style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex' }}>
                      <Button
                        className="btnaction"
                        variant="info"
                        title="Edit user details"
                        onClick={() => onEdit(user)}
                      >
                        <FaPencilAlt />
                      </Button>
                      <Button
                        className="btnaction"
                        variant="danger"
                        title="Delete user"
                        onClick={() => handeldeleteitem(user)}
                      >
                        <FaTrashAlt />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <ul className="pagination" style={{ direction: 'ltr', display: 'flex', justifyContent: 'start', listStyle: 'none', padding: 0 }}>
      <li className="page-item">
        <button className="page-link" onClick={() => handlePageChange(Math.max(1, currentPage - 1))}>«</button>
      </li>

      {totalPages > 9 && (
        <>
          
          
         
            <>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1)
                .map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                  </li>
                ))}
            </>
            {currentPage >= 3 && currentPage <= 4 && <li className={`page-item ${currentPage === 4 ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(4)}>4</button>
          </li>}
          {currentPage === 4 && <li className="page-item ">
          <button className="page-link" onClick={() => handlePageChange(5)}> 5</button>
                  
          </li>}
          {currentPage > 4 && <li className="page-item disabled"><span className="page-link">...</span></li>}
          

          {currentPage > 4 && currentPage < totalPages - 3 && (
            <>
              {Array.from({ length: 3 }, (_, i) => i + currentPage - 1)
                .map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                  </li>
                ))}
            </>
          )}
          {currentPage < totalPages - 3 && <li className="page-item disabled"><span className="page-link">...</span></li>}
          {currentPage === totalPages - 3 && <li className="page-item ">
          <button className="page-link" onClick={() => handlePageChange(totalPages - 4)}>{totalPages - 4}</button>
                  
          </li>}
          {currentPage >= totalPages - 3 && currentPage <= totalPages - 2 && <li className={`page-item ${currentPage === totalPages - 3 ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(totalPages - 3)}>{totalPages - 3}</button>
          </li>}
           <>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + totalPages - 2)
                .map(page => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                  </li>
                ))}
            </>
          

          
        </>
      )}

      {totalPages <= 9 && (
        <>
          {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => i + 1)
            .map(page => (
              <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
              </li>
            ))}
        </>
      )}

      <li className="page-item">
        <button className="page-link" onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}>»</button>
      </li>
    </ul>
  </div>
)}
      </Card.Body>
      <Modal show={openModal} size="md" onHide={() => setOpenModal(false)} centered>
        <Modal.Header closeButton />
        <Modal.Body>
          <div className="text-center">
           <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Supplier?
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
                  ? <Modal.Title>Edit Supplier</Modal.Title>
                  : <Modal.Title>Add Supplier</Modal.Title>
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
                    required
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
                    placeholder="Enter Supplier Adresse"
                  />
                </Form.Group>
                    
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