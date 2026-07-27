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
import { BsSearch } from 'react-icons/bs';
import "../../../scss/user.css";
import React, { useState,useEffect } from "react";
import '../../../scss/loading.css'
import Select from 'react-select';
import { FaPencilAlt,  FaTrashAlt,FaPlus } from "react-icons/fa";
import axiosClient from '../../../axios-client';
import { useNavigate } from 'react-router-dom';
import Alertform from '../../../components/Alert'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
export default function DepotsManager  (props) {
  
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false);
  const [refresh,setrefresh]=useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchvalue, setsearchvalue] = useState('');
  
 const [showAlert, setShowAlert] = useState(false);

  const getProducts=(page,searchvalue)=>{
    setLoading(true);
    searchvalue=='' ? (
      axiosClient.get(`/product/all?page=${page}`).then(({data})=>{  
   
        if (data.data){
        setProducts(data.data);
        setTotalPages(data.meta.last_page)
        setLoading(false);
         }
      }).catch(()=>{
       setLoading(false);
     })
    ):(
      axiosClient.get(`/product/barcode/${searchvalue}?page=${page}`).then(({data})=>{  
   
        if (data.data){
        setProducts(data.data);
        setTotalPages(data.meta.last_page)
        setLoading(false);
         }
      }).catch(()=>{
       setLoading(false);
     })
    );
    
  }
  useEffect(()=>{
    getProducts(currentPage,searchvalue);
  },[refresh,currentPage,searchvalue])
 
  
  const [Products, setProducts] = useState([]);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
 
  
 

 

 
 
  
  
  return (
      <Row>
      <Alertform setShowAlert={setShowAlert} showAlert={showAlert}/>
        <Col>
          <Card className="customCard" style={{borderRadius: '15px'}}>
            <Card.Body style={{backgroundColor: 'white',overflow: 'auto', borderRadius: '15px'}}>
              <div className="d-flex justify-content-between customCardBody">
                <div className="d-flex justify-itels-center">
                <div style={{marginLeft:'10px'}}>
                  <Card.Title>Deposits</Card.Title>
                  
                </div>
                <div>
                
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
                </div>
                </div>
                
              </div>
              <Table   bordered hover variant="Default" style={{direction:'ltr'}}>
                <thead className="table-info">
                  <tr> 
                    <th>ID Product</th>
                    <th>Supplier</th>
                    <th>Category</th>
                    <th>Product name</th>
                    <th>Unit Price </th>
                    <th>quantity </th>
                    <th>Salles</th>                    
                    <th>Rest</th>
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
                        <td>{Product.purchasePrice }</td>
                        <td>{Product.salePrice}</td>
                        <td>{Product.salePrice}</td>
                        <td>{Product.quantity}</td>
                       
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center">
                      {loading ? (
                        <div className="spinner-container" >
                        <div className="spinner"></div>
                        </div>
                      ):('No Products found.' )  }
                        
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
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
            
          </Card>
        
          
        </Col>
      </Row>
  );
};