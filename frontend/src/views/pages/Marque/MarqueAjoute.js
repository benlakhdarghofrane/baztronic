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

import { BsSearch } from 'react-icons/bs';
import React, { useState,useEffect } from "react";
import { FaPencilAlt,  FaTrashAlt,FaUserPlus,FaPlus } from "react-icons/fa";
import axiosClient from '../../../axios-client';
import '../../../scss/loading.css'
import Select from 'react-select';
import Alertform from '../../../components/Alert'
import { ConstructionOutlined } from "@mui/icons-material";
export default function MarquesManager  (props) {
  //const Marqueid=props.Marqueid;
  const add=props.add;
  const [showAlert, setShowAlert] = useState(false);
  const [searchvalue, setsearchvalue] = useState('');
  const [refresh, setrefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function getCats() {
    
    setLoading(true);
    try{
      let res = await axiosClient.get("/catigories")
      .then((res)=>res)
      
      if(res.status===200) {
      //  setCats(res.data.data)
        const options = res.data.data.map((cat) => ({
          value: cat.id,
          label: cat.designationEN,
        }));
        setCats(options)
        setLoading(false) 
        }
        
      }
    catch (err) {
      setLoading(false);
      
    }
  }
  useEffect(()=>{
    getCats();
  },[])
  const getMarques=(page)=>{
        setLoading(true)
    axiosClient.get(`/mareques?page=${page}`).then(({data})=>{  
   
     if (data.data){

     setMarques(data.data);
     setTotalPages(data.meta.last_page)
        setLoading(false)
      }
   }).catch(()=>{
    setLoading(false)
  })
  }
  useEffect(()=>{
    getMarques(currentPage);
  },[refresh,currentPage])
  const [Cats, setCats] = useState([]);
  //const [selectedcat, setselectedcat] = useState('');
  const [Marques, setMarques] = useState([]);
  const [show, setShow] = useState(false);
  const [newMarque, setNewMarque] = useState([]);
  const [editing, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [openModal, setOpenModal] = useState(false);
  const [deleteitem, setDeleteitem] = useState(null);
  const handleClose = () => {
    //setNewMarque([])
    setShow(false); 
  
  };
  const handeldeleteitem = (product) => {
    setDeleteitem(product);
    setOpenModal(true);
  };
  const handleShow = () => {
    setShow(true);
    setEdit(false);
    setNewMarque([]);
  };

  const onFormSubmit = (newMarque) => {
    setLoading(true);
    let payload={
      idcategory:newMarque.idcategory,
      name:newMarque.name,
      

    }
    //console.log(payload)
    axiosClient.post('/mareques',payload).then(({data})=>{  
   
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

  const onEdit = (newMarque) => {
    setEdit(true);
    if(editing === true) {
     setNewMarque(newMarque)
      setShow(true);
    
    }
  };

  const onSubmit = (newMarque) => {
   // console.log(newMarque)
   handleClose();
    if (editing === true) {
      onUpdateMarque(newMarque);
    } else {
      onFormSubmit(newMarque);
    }
  };

  const onUpdateMarque = (newMarque) => {
    setEdit(false);
        setLoading(true);
    let payload={
      idcategory:newMarque.idcategory,
      name:newMarque.name,
    }
    //console.log(payload)
    axiosClient.put('/mareques/'+newMarque.id,payload).then(({data})=>{  
   
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

  const onDeleteMarque = (currentMarque) => {
    let id = currentMarque.id;
    setOpenModal(false);
        setLoading(true)
    axiosClient.delete('/mareques/'+id).then(({data})=>{  
   
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
  const handelselectcat = (name) => {

    const cat = Cats.filter(item => item.label === name);
     if (cat.length > 0) {
    return cat[0];}
    else {return ""}
    //setNewModel({ ...newModel, idmareque: selectedOption.value });
  };
  const handleCategoryChange = (selectedOption) => {
    setNewMarque({ ...newMarque, idcategory: selectedOption.value });
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
                  <Card.Title>Marques</Card.Title>
                  
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
                      title="Add Marque"
                    >
                      <FaPlus />
                    </Button>
                 
                </div>
                ):('')}
              </div>
              <div style={{maxWidth:'100%',overflow: 'auto',direction: 'ltr'}}>
         
              <Table   bordered hover variant="Default" className="mt-0">
                <thead className="table-info">
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Marque</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Marques.length > 0 ? (
                    Marques.map((Marque, index) => (

                      <tr key={index}>
                        <td>{Marque.id}</td>
                        <td>{Marque.Category}</td>
                        <td>{Marque.name}</td>
                        <td style ={{display:'flex',justifyContent:'center'}}>
                        <div style={{display: 'flex'}}>
                        <Button
                          className="btnaction"
                            variant="info"
                            title="Edit Categorie details"
                            onClick={() => onEdit(Marque)}
                          >
                            <FaPencilAlt />
                          </Button>
                          <Button
                          className="btnaction"
                            variant="danger"
                            title="Delete user"
                            onClick={() => handeldeleteitem(Marque)}
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
                      ):('No Marque found.' )  }
                        
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
              Are you sure you want to delete this Supplier?
            </h3>
            <div className="d-flex justify-content-start gap-4">
              <Button variant="danger" onClick={() => onDeleteMarque(deleteitem)}>
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
                onSubmit(newMarque);
              }}
            >
              <Modal.Header closeButton>
                {
                  editing === true 
                  ? <Modal.Title>Edit Marque</Modal.Title>
                  : <Modal.Title>Add Marque</Modal.Title>
                }
              </Modal.Header>
              <Modal.Body >
              <Form.Group className="mb-3">
                
        <Form.Label>Category</Form.Label>
       {editing ?( <Select
          options={Cats}
          onChange={handleCategoryChange}
          defaultInputValue={newMarque.Category}
          value={handelselectcat(newMarque.Category)}
          placeholder="Select"
          isSearchable // Enables search functionality
          required
        />):(
          <Select
          options={Cats}
          onChange={handleCategoryChange}
          defaultInputValue={newMarque.Category}
         // value={handelselectcat(newMarque.Category)}
          placeholder="Select"
          isSearchable // Enables search functionality
          required
        />
        ) }
      </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Marque</Form.Label>
                  <Form.Control
                    type="text"
                    value={newMarque.name}
                    required
                    onChange={(e) =>
                      setNewMarque({ ...newMarque, name: e.target.value })
                    }
                    placeholder="Enter Marque Name"
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