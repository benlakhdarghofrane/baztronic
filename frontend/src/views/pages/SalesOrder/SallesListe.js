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
  import Facture from "../../../components/Facture3";
  export default function SallesManager  (props) {
    
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
    
    const getSalles=(page,searchvalue)=>{
      setLoading(true);
       
        axiosClient.get(searchvalue=='' ? `/saleOrders?page=${page}`:`/saleOrdersFilter/${searchvalue}?page=${page}`).then(({data})=>{  
     
          if (data.data){
          setSalles(data.data);
          setTotalPages(data.meta.last_page)
          setLoading(false);
           }
        }).catch(()=>{
         setLoading(false);
       })
      
      
    }
    useEffect(()=>{
      getSalles(currentPage,searchvalue);
    },[currentPage,searchvalue])
   
    
    const [Salles, setSalles] = useState([]);
    const [Fact, setFact] = useState([]);
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
   
   
    const detailes = (facture) => {
     
      setFact(facture)
        setShow(true);
     // console.log(Fact)
      
    };
    const isunderwarranty = (startDate,warranty) => {
      // Create a date object from the start date
      const startDateObject = new Date(startDate);
      const warrantyNumber = parseInt(warranty, 10);
      const endDate = new Date(startDateObject);
      endDate.setDate(startDateObject.getDate() + warrantyNumber);
    
      const today = new Date();
       // Calculate the difference in milliseconds between endDate and today
  const differenceInMilliseconds = endDate.getTime() - today.getTime();

  // Convert milliseconds to days
  const rest = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

      return today <= endDate ? rest:0;
    }
    return (
        <Row>
          <Col>
            <Card className="customCard" style={{borderRadius: '15px'}}>
              <Card.Body style={{backgroundColor: 'white',overflow: 'auto', borderRadius: '15px'}}>
                <div className="d-flex mx-10">
                  <Card.Title>Salles Orders</Card.Title>
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
     
                  navigate("/Sales order/Add", { replace: true })
     }}
                     title="Add Cat"
                   >
                     <FaPlus />
                     
                   </Button>
                
               </div>
               </div>
                <div style={{maxWidth:'100%',overflow: 'auto',direction: 'ltr'}}>
         
                <Table   bordered hover variant="Default" className="mt-0" >
                  <thead className="table-info">
                    <tr> 
                      <th>ID</th>
                      <th>Reference</th>
                      <th>Date Salles</th>
                      <th>Price</th>
                      <th>Payment Mode</th>
                      <th>Taxes</th>
                      <th>Price Total </th>
                      <th>warranty </th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Salles.length > 0 ? (
                      Salles.map((Product, index) => (
  
                        <tr key={index}>
                          <td>{Product.id}</td>
                          <td>{Product.reference}</td>
                          <td>{ Product.dateOrder!='0000-00-00' ? Product.dateOrder:Product.created_at.substring(0, 10)}</td>
                          <td>{Product.priceHT}</td>
                          <td>{Product.typePaiment}</td>
                          <td>{Product.taxes }</td>
                          <td>{Product.priceTTC }</td>
                          <td style ={{color:isunderwarranty(Product.dateOrder,Product.guarantee)!=0 ? 'green':'red'}}>
                          {isunderwarranty(Product.dateOrder,Product.guarantee)!=0 ? (
                            isunderwarranty(Product.dateOrder,Product.guarantee)+' (under warranty)'
                          ):(isunderwarranty(Product.dateOrder,Product.guarantee)+' (Out of warranty)') }
                          </td>
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
                        <td colSpan={9} className="text-center">
                        {loading ? (
                          <div className="spinner-container" >
                          <div className="spinner"></div>
                          </div>
                        ):('No Salles found.' )  }
                          
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
           
         <Facture  paid={Fact.paid} garantie={Fact.guarantee}  factureid={Fact.reference}  Product={Fact.DetailsOrder} client={Fact.Client}  
                somme_partielle={Fact.priceHT} mentant_total={Fact.priceTTC}
                modepayment={Fact.typePaiment} enable_taxes={Fact.enable_taxes} taxes={Fact.taxes}
                />    
        </div>
              </Modal.Body>
              
           
          </Modal>
          </Col>
        </Row>
    );
  };