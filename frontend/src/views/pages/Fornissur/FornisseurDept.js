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
import './styles.css';
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
  const [filtrevalue, setfiltrevalue] = useState('All')
  const [filtre, setfiltre] = useState(
    [
      { id: 1, label: 'All',value:'all' },
      { id: 2, label: 'Debt',value:'payment' },
      { id: 3, label: 'Payment',value:'debt' }
    ]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const getUsers=(page,searchvalue)=>{
    setLoading(true);
    axiosClient.get(searchvalue=="" ? `/fournisseurs` :`/fournisseursFilter/${searchvalue}`).then(({data})=>{  
   //console.log(data)
     if (data.data){
     setUsers(data.data);
     if(selectedSupplier===null || searchvalue!==""){
      setSelectedSupplier(data.data[0].id)
     }
     
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
  const getdetails=(page,searchvalue,selectedSupplier)=>{
    
    setLoading(true);
    axiosClient.get(searchvalue=="" ? `/detailsPaymentsbyfour/${selectedSupplier}?page=${page}` :`/detailsPaymentsbyfour/${selectedSupplier}?page=${page}`).then(({data})=>{  
   
     if (data.data){
     setTransactions(data.data);
     //console.log(data.meta.last_page)
      setTotalPages(data.meta.last_page)
        setLoading(false);
        
      }
   }).catch(()=>{
    setLoading(false);
  })
  }
  useEffect(()=>{
    getdetails(currentPage,searchvalue,selectedSupplier);
  },[refresh,currentPage,searchvalue,selectedSupplier])
  
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [verment, setverment] = useState(0);
  const [editing, setEdit] = useState(false);
  
  const [loading, setLoading] = useState(false);
  
  const [openModal, setOpenModal] = useState(false);
  const [deleteitem, setDeleteitem] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const handleSelectSupplier = (supplierId) => {
    setSelectedSupplier(supplierId);}
  

    const onSubmit = (verment) => {
    // console.log(verment);
      
      setLoading(true);
      let payload={
        type:'payment',
        amount: parseFloat(verment),
        idFournisseur:selectedSupplier
      }
      //console.log(payload)
      axiosClient.post('/detailsPayments',payload).then(({data})=>{  
     
        if (data){
        //console.log(data.data)
        setShowAlert(true);
        setverment(0);
        setLoading(false);
          setrefresh(!refresh);
         }
      }).catch(()=>{
        setLoading(false);
        setrefresh(!refresh);
     })
    }

  

  

 
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const currentIndex = users.findIndex(supplier => supplier.id === selectedSupplier);
        let newIndex = currentIndex;
        if (event.key === 'ArrowDown') {
          newIndex = (currentIndex + 1) % users.length;
        } else {
          newIndex = currentIndex <= 0 ? users.length - 1 : currentIndex - 1;
        }
        setSelectedSupplier(users[newIndex].id);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSupplier]);
  
  return (
      <Row>
      <Alertform setShowAlert={setShowAlert} showAlert={showAlert}/>
        <Col>
          
    <Card className="customCard" style={{ borderRadius: '15px' }}>
      <Card.Body style={{ backgroundColor: 'white', borderRadius: '15px' }}>
       <div className="d-flex mx-10">
                  <Card.Title>Debts</Card.Title>
                  
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
                </div>
                
        <div className="supplier-container" style={{overflow: 'auto'}}>
        <div className="supplier-list" style={{minWidth:'250px'}}>
        <h2>Suppliers</h2>
        {users.map(supplier => (
          <div
            key={supplier.id}
            className={`supplier-item ${selectedSupplier === supplier.id ? 'selected' : ''}`}
            onClick={() => handleSelectSupplier(supplier.id)}
          >
            {supplier.fullname}
          </div>
        ))}
      </div>
      <div className="supplier-info" style={{minWidth:'700px'}}>
        {selectedSupplier ? (
          <>
            <div className="supplier-infodetail">
            <div className="verment">
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(verment);
              }}
            >
             <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label><h3>Payment</h3></Form.Label>
                  <Form.Control
                    type="text"
                    pattern="^\d+(\.\d{2})?$" title='Please write a number'
                    min="0"
                    defaultValue={0}
                    value={verment}
                    required
                    onChange={(e) =>
                      setverment(e.target.value)
                    }
                    placeholder="Enter Payment"
                  />
                </Form.Group>
                  <Button variant="success"  type="submit" >
                    save
                  </Button>
            </Form>
             </div>
             <div>
            {users.length===0 ? (''):(
            <div className="info">
            <h2>Total Debt :{transactions.length===0 ? (0):(transactions[0].rest)}</h2>
             
              <p><strong>Fullname:</strong> {users.find(supplier => supplier.id === selectedSupplier).fullname}</p>
              <p><strong>Phone:</strong> {users.find(supplier => supplier.id === selectedSupplier).phone}</p>
              <p><strong>Email:</strong> {users.find(supplier => supplier.id === selectedSupplier).email}</p>
              <p><strong>Address:</strong> {users.find(supplier => supplier.id === selectedSupplier).adresse}</p>
              
            </div>)}
            </div>
            </div>
            <div className="transaction-list" style={{minWidth:'700px'}}>
            <div className="filtre">
              <h3>Transactions</h3>
              <Form.Group className="mb-3">
                  <Form.Select
                    value={filtrevalue}
                    required
                    onChange={(e) =>
                      setfiltrevalue( e.target.value )
                    }
                  >
                  <option value="">Select</option>
  {filtre.map((option) => (
    <option key={option.id} value={option.value}>
      {option.label}

    </option>
  ))}
                    
                  </Form.Select>
                 
                </Form.Group>
                </div>
              {transactions.length===0 ? ('No transactions'):(
                
              <Table bordered hover variant="Default" style={{ direction: 'ltr' }}>
          {/* Table headers */}
          <thead className="table-info">
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>value</th>
              <th>Debts</th>
              <th>Facture</th>
              <th>Date</th>
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
              
              transactions.filter((trans)=>trans.type!==filtrevalue).map(transaction => (
                  
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.rest}</td>
                  <td>
                  {transaction.reference}
                  </td>
                  <td>{transaction.created_at.substring(0, 10)}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        )}
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
              
            </div>
          </>
        ) : ('')}
      </div>
    </div>
      </Card.Body>
</Card>
        </Col>
      </Row>
  );
};