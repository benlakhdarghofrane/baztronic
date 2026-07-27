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
  import { BsSearch } from 'react-icons/bs';
  import { FaAlignJustify ,  FaTrashAlt,FaPlus } from "react-icons/fa";
  import axiosClient from '../../../axios-client';
  import { useNavigate } from 'react-router-dom';
  import Facture from "../../../components/FactureF";
  export default function ReceiptsManager  (props) {
    
    const navigate = useNavigate();
    const [loading,setLoading]=useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [show, setShow] = useState(false);
    const [searchvalue, setsearchvalue] = useState('');
    const handleClose = () => {
      //setNewCat([])
      setShow(false); 
     
    };
    
    const getReceipts=(page,searchvalue)=>{
      setLoading(true);
      
        axiosClient.get(searchvalue=='' ? `/recieptOrders?page=${page}`:`/recieptOrdersFilter/${searchvalue}?page=${page}`).then(({data})=>{  
     
          if (data.data){
          setReceipts(data.data);
          setTotalPages(data.meta.last_page)
          setLoading(false);
           }
        }).catch(()=>{
         setLoading(false);
       })
     
     
    }
    useEffect(()=>{
      getReceipts(currentPage,searchvalue);
    },[currentPage,searchvalue])
   
    
    const [Receipts, setReceipts] = useState([]);
    const [Fact, setFact] = useState([]);
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
   
   
    const detailes = (facture) => {
     
      setFact(facture)
        setShow(true);
      //console.log(Fact)
      
    };
    
    return (
        <Row>
          <Col>
            <Card className="customCard" style={{borderRadius: '15px'}}>
              <Card.Body style={{backgroundColor: 'white',overflow: 'auto', borderRadius: '15px'}}>
                 <div className="d-flex mx-10">
                  <Card.Title>Receipt Orders</Card.Title>
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
                     onClick={() => {
     
                  navigate("/Receipt order/Add", { replace: true })
     }}
                     title="Add Cat"
                   >
                     <FaPlus />
                     
                   </Button>
                
               </div>
                </div>
                <div style={{maxWidth:'100%',overflow: 'auto',direction: 'ltr'}}>
         
                <Table   bordered hover variant="Default" className="mt-0">
                  <thead className="table-info">
                    <tr> 
                      <th>ID</th>
                      <th>Reference</th>
                      <th>date Receipt</th>
                      <th>price Total</th>
                      <th>Payment</th>
                      <th>Dept </th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Receipts.length > 0 ? (
                      Receipts.map((Product, index) => (
  
                        <tr key={index}>
                          <td>{Product.id}</td>
                          <td>{Product.reference}</td>
                          <td>{Product.dateReceipt}</td>
                          <td>{Product.priceT}</td>
                          <td>{Product.payment}</td>
                          <td>{Product.rest }</td>
                          <td style ={{display:'flex',justifyContent:'center'}}>
                          <div style={{display: 'flex'}}>
                          <Button
                            className="btnaction"
                              variant="info"
                              title="Edit Product details"
                              onClick={() => detailes(Product)}
                            >
                              <FaAlignJustify  />
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
                        ):('No Receipts found.' )  }
                          
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
              
            </Card>
            <Modal size="lg" show={show} onHide={handleClose}>
           
              <Modal.Header closeButton>
                
              </Modal.Header>
              <Modal.Body >
                <div style={{overflow: 'auto'}}>
              <Facture dept={Fact.rest} date={Fact.dateReceipt}  factureid={Fact.reference}  Product={Fact.DetailsOrder} client={Fact.Fournisseur} 
               mentant_total={Fact.priceT}
        />          </div>
              </Modal.Body>
              
           
          </Modal>
          </Col>
        </Row>
    );
  };