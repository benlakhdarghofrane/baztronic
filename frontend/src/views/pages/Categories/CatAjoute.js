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
import { FaPencilAlt,  FaTrashAlt,FaUserPlus,FaPlus } from "react-icons/fa";
import axiosClient from '../../../axios-client';
import '../../../scss/loading.css'

import { BsSearch } from 'react-icons/bs';
import { ConstructionOutlined } from "@mui/icons-material";
import Alertform from '../../../components/Alert'
export default function CatsManager  (props) {
  //const Catid=props.Catid;
  const add=props.add;
  const [showAlert, setShowAlert] = useState(false);
  const [searchvalue, setsearchvalue] = useState('');
  const [refresh, setrefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getCats=(page)=>{
        setLoading(true)
    axiosClient.get(`/catigories?page=${page}`).then(({data})=>{  
   
     if (data.data){
     setCats(data.data);
     setTotalPages(data.meta.last_page)
        setLoading(false)
      }
   }).catch(()=>{
    setLoading(false)
  })
  }
  useEffect(()=>{
    getCats(currentPage);
  },[refresh,currentPage])
  
  const [Cats, setCats] = useState([]);
  const [show, setShow] = useState(false);
  const [newCat, setNewCat] = useState([]);
  const [editing, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [openModal, setOpenModal] = useState(false);
  const [deleteitem, setDeleteitem] = useState(null);
  const handleClose = () => {
    //setNewCat([])
    setShow(false); 
   
  };
  const handeldeleteitem = (product) => {
    setDeleteitem(product);
    setOpenModal(true);
  };
  const handleShow = () => {
    setShow(true);
    setEdit(false);
    setNewCat([]);
  };

  const onFormSubmit = (newCat) => {
    setLoading(true);
    let payload={
      designationEN:newCat.designationEN,
      

    }
    //console.log(payload)
    axiosClient.post('/catigories',payload).then(({data})=>{  
   
      if (data){
        setShowAlert(true);
        setrefresh(!refresh);
        setLoading(false)
       }
    }).catch(()=>{
      setrefresh(!refresh);
      setLoading(false)
   })
  };

  const onEdit = (newCat) => {
    setEdit(true);
    if(editing === true) {
     setNewCat(newCat)
      setShow(true);
    
    }
  };

  const onSubmit = (newCat) => {
   // console.log(newCat)
   setShow(false); 
    if (editing === true) {
      onUpdateCat(newCat);
    } else {
      onFormSubmit(newCat);
    }
  };

  const onUpdateCat = (newCat) => {
    setEdit(false);
        setLoading(true);
    let payload={
      designationEN:newCat.designationEN,
    }
    //console.log(payload)
    axiosClient.put('/catigories/'+newCat.id,payload).then(({data})=>{  
   
      if (data){
        setShowAlert(true);
        setrefresh(!refresh);
        setLoading(false)
       }
    }).catch(()=>{
      setrefresh(!refresh);
      setLoading(false)
   })

  };

  const onDeleteCat = (currentCat) => {
    let id = currentCat.id;
    setOpenModal(false);
        setLoading(true)
    axiosClient.delete('/catigories/'+id).then(({data})=>{  
   
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
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
      <Row>
      <Alertform setShowAlert={setShowAlert} showAlert={showAlert}/>
        <Col>
          <Card className="customCard" style={{borderRadius: '15px'}}>
            <Card.Body style={{backgroundColor: 'white',overflow: 'auto', borderRadius: '15px'}}>
               <div className="d-flex mx-10">
                  <Card.Title>Categories</Card.Title>
                  
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
                      onChange={(e) => setsearchvalue(e.target.value)}
                      placeholder="Search"
                      className="form-control pl-5" // Add left padding to accommodate the icon
                      style={{ direction:"ltr", paddingLeft: '2.5rem' }} // Additional left padding to ensure text doesn't overlap with the icon
                    />
                  </div>
                </Form.Group>
              
            {add ? (
              <div className="d-flex">
                <Button
                  className="btnaction"
                  variant="info"
                  onClick={handleShow}
                  title="Add cat"
                >
                  <FaPlus />
                </Button>
              </div>
            ) : ('')}
          </div>
              <div style={{maxWidth:'100%',overflow: 'auto',direction: 'ltr'}}>
         
              <Table   bordered hover variant="Default" className="mt-0">
                <thead className="table-info">
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Available</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Cats.length > 0 ? (
                    Cats.map((Cat, index) => (

                      <tr key={index}>
                        <td>{Cat.id}</td>
                        <td>{Cat.designationEN}</td>
                        <td>{Cat.Available}</td>
                        <td style ={{display:'flex',justifyContent:'center'}}>
                        <div style={{display: 'flex'}}>
                        <Button
                          className="btnaction"
                            variant="info"
                            title="Edit Categorie details"
                            onClick={() => onEdit(Cat)}
                          >
                            <FaPencilAlt />
                          </Button>
                          <Button
                          className="btnaction"
                            variant="danger"
                            title="Delete user"
                            onClick={() => handeldeleteitem(Cat)}
                          >
                            <FaTrashAlt />
                          </Button>
                          
                          
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="text-center">
                      {loading ? (
                        <div className="spinner-container" >
                        <div className="spinner"></div>
                        </div>
                      ):('No Categorie found.' )  }
                        
                      </td>
                    </tr>
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
              Are you sure you want to delete this category?
            </h3>
            <div className="d-flex justify-content-start gap-4">
              <Button variant="danger" onClick={() => onDeleteCat(deleteitem)}>
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
                onSubmit(newCat);
              }}
            >
              <Modal.Header closeButton>
                {
                  editing === true 
                  ? <Modal.Title>Edit Categorie</Modal.Title>
                  : <Modal.Title>Add Categorie</Modal.Title>
                }
              </Modal.Header>
              <Modal.Body >
              <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>category</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCat.designationEN}
                    required
                    onChange={(e) =>
                      setNewCat({ ...newCat, designationEN: e.target.value })
                    }
                    placeholder="Enter Category Name"
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