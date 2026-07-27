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
import Select from 'react-select';
import Barcode from 'react-barcode';
import '../../../scss/print.css';
import { useLocation } from "react-router-dom";
import { FaPencilAlt,  FaTrashAlt,FaPlus } from "react-icons/fa";
import axiosClient from '../../../axios-client';
import { useNavigate } from 'react-router-dom';
import Alertform from '../../../components/Alert'
import { number } from "prop-types";
export default function ProductsManager  (props) {
  const navigate = useNavigate();  
   const location = useLocation();
  const setErr=props.setErr;
  const setshowerr=props.setshowerr;
  const [showAlert, setShowAlert] = useState(false);
  const [Lot, setLot] = useState(location.state?.lot || null);
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '200px', // set your desired width here
    }),
  };
 const handlebarcodechange=(e) =>{
  setBarcode(e.target.value);
  getproduct(e.target.value);
 }
  async function getproduct(barcode) {
    setNewProduct(initCurrent);
    setLoading(true);
    try{
      let res = await axiosClient.get(`/productlot/${Lot?.id}/0/0/all/all/all/all/all/all/${barcode}`)
      .then((res)=>res)
      
      if(res.status===200) {
        if(res.data.data.length!=0 ){
        setProduct(res.data.data[0])
        
          setNewProduct({ ...newProduct, idProduct:res.data.data[0].id,idcat:res.data.data[0].category.id,
            status:res.data.data[0].status,lock_status:res.data.data[0].lock_status,housing_state:res.data.data[0].housing_state,
            barcode:res.data.data[0].barcode,designationEN: res.data.data[0].designationEN,
            charge_state: res.data.data[0].charge_state,
            screen_state: res.data.data[0].screen_state,
            battrystate: res.data.data[0].battrystate,
           })
        
      } else{setProduct([])}
        
        setLoading(false) 
        }else {setProduct([])}
      }
    catch (err) {
      setLoading(false);
      setProduct([])
    }
    
  }

  const initCurrent = {
    idProduct:'',
    status:'',    
    lock_status:'',
    housing_state:'',
    charge_state:'',
    battrystate:'',
    screen_state:'',
    idcat:'',
  };
 
  const [paid, setPaid] = useState(0);
  const [Product, setProduct] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Getprod, setGetprod] = useState([]); // product options for Select
  const [searchprod, setsearchprod] = useState('');
  const [Products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(initCurrent);
  const [editing, setEdit] = useState(false);
  const [payload, setPayload] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [idSupplier, setIdSupplier] = useState(null);
  const [Suppliers, setSuppliers] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [idreciept, setidreciept] = useState(0);
  const [depot, setdepot] = useState(false);

  // NEW: modal state for Add Product
  const [showAddModal, setShowAddModal] = useState(false);
  const openAddModal = () => {
    setNewProduct(initCurrent);
    setBarcode('');
    setProduct([]);
    setShowAddModal(true);
  };
  const closeAddModal = () => setShowAddModal(false);
  

  useEffect(() => {
    // Calculate the sum of prices when the items array changes
    const sum = Products.reduce((acc, item) => acc + item.priceT, 0);
    setTotalPrice(sum);
    setPaid(depot ? 0:sum);
  }, [Products]);
  

  const onFormSubmit = (newProduct) => {
    const id = newProduct.idProduct;
    // Check if the product with the same id already exists
    const existingProduct = Products.find(product => product.idProduct === id);
    if (!existingProduct) {
      setProducts([...Products, { ...newProduct }]);
    }
  //console.log(Products);
    // Reset the form
    setNewProduct(initCurrent);
    setBarcode('');
    setProduct([])
    setShowAddModal(false);
  };

  const onSubmit = (newProduct) => {
    if (editing === true) {
      onUpdateProduct(newProduct);
    } else {
      onFormSubmit(newProduct);
    }
  };

  const onUpdateProduct = (newProduct) => {
    setEdit(false);
    let id = newProduct.id;
    setProducts(Products.map((i) => (i.id === id ? newProduct : i)));
  };

  const onDeleteProduct = (currentProduct) => {
    setProducts(Products.filter((i) => i.idProduct !== currentProduct.idProduct));
  };
 

  // fetch products for Select (adjust endpoints if needed)
async function getAllProducts(searchprod) {
    
    setLoading(true);
   
    try{
      
      let res = await axiosClient.get( searchprod==="" ? `/productlot/${Lot?.id}/0/0/all/all/all/all/all/all?page=1`:
        `/productlot/${Lot?.id}/0/0/all/all/all/all/all/all/${searchprod}?page=1`)
      .then((res)=>res)
      
      if(res.status===200) {
        const options = res.data.data.map((item) => ({
          ...item,
          value: item.barcode,
          label: item.designationEN,
        }));
        //console.log(res.data.data)
        setGetprod(options)
        setLoading(false) 
        }
        
      }
    catch (err) {
      setLoading(false);
      setErr(err);
      setshowerr(true);
      
    }
  }
  useEffect(() => {
    getAllProducts(searchprod);
  }, [searchprod]);
  
  const handleProdChange = (selectedOption) => {
    if (!selectedOption) return;
    // selectedOption contains full product fields (from options map)
    setProduct(selectedOption);
    setNewProduct({
      ...newProduct,
      idProduct: selectedOption.id || selectedOption.value,
      barcode: selectedOption.barcode || '',
      status: selectedOption.status || '',
      charge_state: selectedOption.charge_state || '',
      screen_state: selectedOption.screen_state || '',
      lock_status: selectedOption.lock_status || '',
      housing_state: selectedOption.housing_state || '',
      battrystate: selectedOption.battrystate || '',
      idcat: selectedOption.category?.id || '',
      designationEN: selectedOption.designationEN || selectedOption.label,
    });
  }
  return (
      <Row>
      <Alertform setShowAlert={setShowAlert} showAlert={showAlert} nav="/Receipt order"/>
        <Col>
          <Card className="customCard" style={{borderRadius: '15px'}}>
            <Card.Body style={{backgroundColor: 'white', borderRadius: '15px'}}>
              <div className="d-flex mx-10">
                  <Card.Title>Products Print</Card.Title>
                </div>

                            
                <Form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(newProduct);
              }}
            >
            <div style={{maxWidth:'100%',overflow: 'auto',direction: 'ltr'}}>
         
              {/* Add Product button placed at top-left of table */}
              <div className="d-flex justify-content-start mt-2">
                <Button className="btn btn-primary" onClick={openAddModal} title="Add Product">
                  <FaPlus style={{marginRight:6}} /> Add Product
                </Button>
              </div>

              {/* Add Product Modal */}
              <Modal show={showAddModal} onHide={closeAddModal} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                  <Form.Group className="mb-2">
                    <Form.Label>Product</Form.Label>
                  <Select
                    options={Getprod.slice(0, 6)}
                    onChange={handleProdChange}
                    placeholder="Select product"
                    isSearchable
                    onInputChange={(newValue) => setsearchprod(newValue)}
                  />
                  </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Barcode</Form.Label>
                        <Form.Control type="text" value={Product.barcode ? Product.barcode : ''} disabled />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Product Name</Form.Label>
                      <Form.Control type="text" value={Product.designationEN ? Product.designationEN : ''} disabled />
                    </Form.Group>
                    
                    
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeAddModal}>Cancel</Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      onFormSubmit({ ...newProduct });
                    }}
                    disabled={!newProduct.idProduct}
                  >
                    OK
                  </Button>
                </Modal.Footer>
              </Modal>
 <div id="print-section" className="print-a4">
  {Products.map((p, i) => (
    <div className="print-box" key={i}>
      
      <div className="barcode-container">
        <Barcode
          value={p.barcode || "N/A"}
          width={0.85}
          height={50}
          fontSize={12}
        />
      </div>
 <div className="print-title">
        {p.designationEN}
      </div>

      <div className="print-item">
        <strong>Status:</strong> {p.status}
      </div>

      <div className="print-item">
        <strong>Lock:</strong> {p.lock_status}
      </div>

      <div className="print-item">
        <strong>Screen:</strong> {p.screen_state}
      </div>

      <div className="print-item">
        <strong>Housing:</strong> {p.housing_state}
      </div>

      <div className="print-item">
        <strong>Charge:</strong> {p.charge_state}
      </div>

      <div className="print-item">
        <strong>Battery:</strong> {p.battrystate}
      </div>

    </div>
  ))}
</div>
              <Table   bordered hover variant="Default" className="mt-0" style={{direction:'ltr',minWidth:'300px'}}>
                <thead className="table-info" >
                  <tr>
                    <th>ID</th>
                    <th>Barcode</th>
                    <th>Product Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Products.length > 0 ? (
                    Products.map((Product, index) => (

                      <tr key={index}>
                        <td>{Product.idProduct}</td>
                        <td>{Product.barcode}</td>
                        <td>{Product.designationEN}</td>                           
                        <td>{Product.status}</td>
                        <td style ={{display:'flex',justifyContent:'center'}}>
                        <div style={{display: 'flex'}}>
                        
                          <Button
                          className="btnaction"
                            variant="danger"
                            title="Delete Product"
                            onClick={() => onDeleteProduct(Product)}
                          >
                            <FaTrashAlt />
                          </Button>
                          
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="text-center">
                        No Products found.
                      </td>
                    </tr>
                  )}
                  {/* inline add-row removed: use Add Product modal */}
                </tbody>
              </Table>
              </div>
              </Form>
                
              <div style={{display:'flex',justifyContent:'end',flexDirection: 'row-reverse'}}>
                                    
                                    <button className="btn btn-success mx-2" 
                                    disabled={ Products.length===0} 
                                     onClick={() => window.print()}>Print</button>
                                    <button className="btn btn-danger mx-2"
                                    onClick={() => {
                                      navigate("/Product Lot", { state: { lot: Lot }, replace: true })
                                    }}>Cancel</button>
                                    </div>
           
            </Card.Body>
            
          </Card>
              
        </Col>
      </Row>
  );
};