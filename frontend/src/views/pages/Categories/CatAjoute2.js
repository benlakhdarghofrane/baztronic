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

import { FaPencilAlt,  FaTrashAlt,FaUserPlus } from "react-icons/fa";
import axiosClient from '../../../axios-client';

export default function CatsManager  (props) {
  const Catid=props.Catid;
  const acces=props.acces;
  const getCats=()=>{
    axiosClient.get('/Categorie').then(({data})=>{  
   
     if (data.data){
     setCats(data.data);
     //console.log(data.data)
      }
   }).catch(()=>{

  })
  }
  useEffect(()=>{
    getCats();
  },[])
  
  const [Cats, setCats] = useState([]);
  const [show, setShow] = useState(false);
  const [newCat, setNewCat] = useState([]);
  const [editing, setEdit] = useState(false);
  
  
  const handleClose = () => {
    
    setShow(false); 
   
  };
  const handleShow = () => {
    setShow(true);
    setEdit(false)
  };

  const onFormSubmit = (newCat) => {
   
  };

  const onEdit = (newCat) => {
    setEdit(true);
    if(editing === true) {
     
      setShow(true);
    
    }
    
  };

  const onSubmit = (newCat) => {
    if (editing === true) {
      onUpdateCat(newCat);
    } else {
      onFormSubmit(newCat);
    }
  };

  const onUpdateCat = (newCat) => {
    setEdit(false);
    let id = newCat.id;

  };

  const onDeleteCat = (currentCat) => {
    let id = newCat.id;

  };

  return (
      <Row>
        <Col>
          <Card className="customCard">
            <Card.Body style={{backgroundColor: 'white',overflow: 'auto'}}>
              <div className="d-flex justify-content-between customCardBody">
                <div>
                  <Card.Title>Categories</Card.Title>
                </div>
                <div className="d-flex">
                 
                    <Button
                    className="btnaction"
                      variant="info"
                      onClick={handleShow}
                      title="Add Cat"
                    >
                      <FaUserPlus />
                    </Button>
                 
                </div>
              </div>
              <Table   bordered hover variant="Default">
                <thead className="table-info">
                  <tr>
                  <th>ID</th>
                    <th>Catname</th>
                    <th>Catdescription</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Cats.length > 0 ? (
                    Cats.map((Cat, index) => (

                      <tr key={index}>
                        <td>{Cat.id}</td>
                        <td>{Cat.Name}</td>
                        <td>{Cat.Description}</td>
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
                            onClick={() => onDeleteUser(Cat)}
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
                        No Categorie found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <div style={{display:'flex',justifyContent:'end'}}>
                                    <button className="btn btn-danger mx-2">Annuler</button>
                                    <button className="btn btn-success mx-2" type="submit" name="submit" value="submit">Enregistrer</button>
                                        
                                    </div>
            </Card.Body>
            
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
                  <Form.Label>categorie Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCat.Name}
                    required
                    onChange={(e) =>
                      setNewCat({ ...newCat, Name: e.target.value })
                    }
                    placeholder="Enter Categorie Name"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Categorie Discription</Form.Label>
                  <Form.Control
                    type="text"
                    value={newCat.Discription}
                    required
                    onChange={(e) =>
                      setNewCat({ ...newCat, Discription: e.target.value })
                    }
                    placeholder="Enter Categorie Discription"
                  />
                </Form.Group>
                    
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Annuler
                </Button>
                {editing === true ? (
                  <Button variant="primary" type="submit" onClick={handleClose}>
                    Update
                  </Button>
                ) : (
                  <Button variant="primary" disabled={!newCat.Name} type="submit" onClick={handleClose}>
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