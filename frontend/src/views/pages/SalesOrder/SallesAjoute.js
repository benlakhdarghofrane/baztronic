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
import { FaPencilAlt,  FaTrashAlt,FaPlus } from "react-icons/fa";
import axiosClient from '../../../axios-client';
import Facture from "../../../components/Facture3";
import { useNavigate } from 'react-router-dom';
import Alertform from '../../../components/Alert'
import zIndex from "@mui/material/styles/zIndex";
export default function ProductsManager  (props) {
  const setErr=props.setErr;
  const setshowerr=props.setshowerr;
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const DEBOUNCE_DELAY = 500;
  const initCurrent = {
    qnt:1,
    priceU:0,

  };
  const [Product, setProduct] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [Products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState(initCurrent);
  const [editing, setEdit] = useState(false);
  const [payload, setPayload] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [idCostumer, setIdCostumer] = useState(null);
  const [Costumers, setCostumers] = useState([]);
  const [Getprod, setGetprod] = useState([]);
  const [searchcostumer, setsearchcostumer] = useState('');
  const [searchprod, setsearchprod] = useState('');
  const [taxes, setTaxes] = useState(0);
  const [mode, setMode] = useState(null);
  const [partial_sum, setPartial_sum] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [hid, setHid] = useState(false);
  const [factureid, setfactureid] = useState('');
  const [warranty, setWarranty] = useState(0);
  const [paid, setPaid] = useState(0);
  const [back, setBack] = useState(0);
  const [visible, setVisible] = useState(false);
  const [message, setmessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false); // added state for Add Product modal
          const [modepayment, setModepayment] = useState(
    [
      { id: 1, value:'Credit_card', label:'Credit card' },
      { id: 2, value:'Debut_card',label:'Debut card' },
      { id: 4, value:'Interac',label:'Interac' },
      { id: 3, value:'Cash',label:'Cash' }
    ]);
 const handlebarcodechange=(e) =>{
  setBarcode(e.target.value);
 }
 const [enabletaxes, setenabletaxes] = useState(false);
 const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: '200px', // set your desired width here
  }),
    menuPortal: (base) => ({
    ...base,
    zIndex: 9999, // Set a high z-index value to ensure dropdown is above other elements
  }),
};


 useEffect(() => {
  const debounceTimer = setTimeout(() => {
    getproduct(barcode);
  }, DEBOUNCE_DELAY);

  return () => clearTimeout(debounceTimer);
}, [barcode]);
  async function getproduct(barcode) {
    setNewProduct(initCurrent);
    setLoading(true);
    try{
      let res = await axiosClient.get("/product/barcode/"+barcode)
      .then((res)=>res)
      
      if(res.status===200) {
        if(res.data.data.length!=0 ){
        setProduct(res.data.data[0]);
        setNewProduct({ ...newProduct,priceU:res.data.data[0].salePrice,idProduct:res.data.data[0].id,barcode:res.data.data[0].barcode,designationEN: res.data.data[0].designationEN,category:res.data.data[0].category,
          processeur:res.data.data[0].processeur,ram:res.data.data[0].ram,stokage:res.data.data[0].stokage,
        imei:res.data.data[0].imei,serial_number:res.data.data[0].serial_number,
        screen:res.data.data[0].screen,battery:res.data.data[0].battery,carteGraphique:res.data.data[0].carteGraphique  })
      
      } else{setProduct([])}
        
        setLoading(false) 
        }else {setProduct([])}
      }
    catch (err) {
      setLoading(false);
      setProduct([])
    }
    
  }

  async function getCostumers(searchcostumer) {
    
    setLoading(true);
   
    try{
      
      let res = await axiosClient.get( searchcostumer=="" ? `/clients`:`/clientsFilter/${searchcostumer}`)
      .then((res)=>res)
      
      if(res.status===200) {
        const options = res.data.data.map((item) => ({
          ...item,
          value: item.id,
          label: item.fullname,
        }));
        //console.log(res.data.data)
        setCostumers(options)
        setLoading(false) 
        }
        
      }
    catch (err) {
      setLoading(false);
      setErr(err);
      setshowerr(true);
      
    }
  }
  async function getallProduct(searchprod) {
    
    setLoading(true);
   
    try{
      
      let res = await axiosClient.get( searchprod=="" ? `/productSearch/${null}/${null}/${null}/Available`:
        `/productSearch/${null}/${null}/${null}/Available/${searchprod}`)
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
  useEffect(()=>{
    getCostumers(searchcostumer);
  },[searchcostumer])
    useEffect(()=>{
    getallProduct(searchprod);
  },[searchprod])
  const handleClientChange = (selectedOption) => {
    setIdCostumer(selectedOption.value );
  };
    const handleProdChange = (selectedOption) => {
    setBarcode(selectedOption.value );
  };
  const handlepayChange = (selectedOption) => {
   
    setMode(selectedOption.value);
  };
    useEffect(() => {
      // Calculate the sum of prices when the items array changes
      const sum = Products.reduce((acc, item) => acc + item.priceU*item.qnt, 0);
      setPartial_sum(sum);
      if(enabletaxes===false){
        setTotalPrice(sum);
        setTaxes(0);
      }
      else{
      setTaxes(sum*0.14975);
      setTotalPrice(sum + sum*0.14975);
      
    }
    }, [mode,enabletaxes,Products]);

  const handleSave = () => {
const payloadS={
  idClient:idCostumer,
  typePaiment:mode,
  priceHT:partial_sum,
  taxes:taxes,
  enable_taxes:enabletaxes,
  paid:paid,
  priceTTC:totalPrice,
  guarantee:warranty,
  status:'complited',
}
//console.log(payloadS)
      axiosClient.post('/saleOrders',payloadS).then(({data})=>{  
     
        if (data){
        setfactureid(data.reference)
          Products.map(product => {
            const updatedPyload = {
              ...product,
              idsale:data.id,
            };
      
            // Remove the 'id' attribute
            delete updatedPyload.barcode;
            delete updatedPyload.designationEN;
            delete updatedPyload.category;
            delete updatedPyload.processeur;
            delete updatedPyload.ram;
            delete updatedPyload.stokage;
            delete updatedPyload.screen;
            delete updatedPyload.battery;
            //return updatedPyload;
            axiosClient.post('/detailssales',updatedPyload).then(({data})=>{  
           
              if (data){
              setHid(true);
              setShowAlert(true);
               }
            }).catch((err)=>{
              setErr(err);
              setshowerr(true);
           })
          });

         }
      }).catch((err)=>{
        //console.log(err.code)
        setErr(err.code);
        setshowerr(true);
     })
      
     
    };  
  
  const handleCheckboxChange = (event) => {
    //console.log(event.target.checked)
    setenabletaxes(event.target.checked)
  }
  const onFormSubmit = (newProduct) => {
    const id = newProduct.idProduct;

    // Check if the product with the same id already exists
    const existingProduct = Products.find(product => product.idProduct === id);
  
    if (!existingProduct) {
      // Product with the same id doesn't exist, so update the state
      const priceT = newProduct.qnt * newProduct.priceU;
      setProducts([...Products, { ...newProduct, price: priceT }]);
    }
  
    // Reset the form
    setNewProduct(initCurrent);
    setBarcode('');
    setProduct([])
  
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
    let id = newProduct.idProduct;
    setProducts(Products.map((i) => (i.idProduct === id ? newProduct : i)));
  };

  const onDeleteProduct = (currentProduct) => {
    setProducts(Products.filter((i) => i.idProduct !== currentProduct.idProduct));
  };

  const openAddModal = () => {
    setNewProduct(initCurrent);
    setBarcode('');
    setProduct([]);
    setShowAddModal(true);
  };
  const closeAddModal = () => {
    setShowAddModal(false);
  };

  return (
      <Row >
      <Alertform setShowAlert={setShowAlert} showAlert={showAlert}/>
        <Col>
        <Modal visible={visible} onClose={() => setVisible(false)}>
      <Modal.Header>
     </Modal.Header>
      <Modal.Body style={{direction:'rtl'}}>
      {message}
      </Modal.Body>
      <Modal.Footer style={{direction:'rtl', display:'flex',justifyContent:'centre'}}>
        
        <Button color="primary"  onClick={() => 
              window.location.reload(true)}>ok</Button>
      </Modal.Footer>
    </Modal>

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
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" value={Product.category ? Product.category.name : ''} disabled />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Product Name</Form.Label>
            <Form.Control type="text" value={Product.designationEN ? Product.designationEN : ''} disabled />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max={Product.quantity || 99999}
              value={newProduct.qnt}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  qnt: Number(e.target.value),
                  idProduct: Product.id,
                  barcode: Product.barcode,
                  designationEN: Product.designationEN,
                  category: Product.category,
                  processeur: Product.processeur,
                  ram: Product.ram,
                  stokage: Product.stokage,
                  screen: Product.screen,
                  battery: Product.battery,
                  carteGraphique: Product.carteGraphique
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Unit price</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={newProduct.priceU}
              onChange={(e) => setNewProduct({ ...newProduct, priceU: Number(e.target.value) })}
            />
          </Form.Group>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeAddModal}>Cancel</Button>
        <Button
          variant="primary"
          onClick={() => {
            // ensure price computed and push to table
            const productToAdd = { ...newProduct, price: newProduct.qnt * newProduct.priceU };
            onFormSubmit(productToAdd);
            closeAddModal();
            setProduct([]);
            setBarcode('');
          }}
          disabled={!newProduct.idProduct || !newProduct.qnt || !newProduct.priceU}
        >
          OK
        </Button>
      </Modal.Footer>
    </Modal>

          <Card hidden={hid} className="customCard" style={{borderRadius: '15px'}}>
            <Card.Body  style={{backgroundColor: 'white',overflow: 'auto' , borderRadius: '15px'}}>
              
                <div className="d-flex mx-10">
                  <Card.Title>Salle Order</Card.Title>
                  <div>
                   {hid ? (
                    <button disabled={Products.length==0} className="btn btn-success mx-2"    onClick={() => setHid(!hid)}>
                 Hide invoice
                 </button>):('')}
                  
                  </div>
                </div>
               
                <div className="d-flex justify-content-between align-items-center" style={{display:'flex', alignItems: 'center',direction:'ltr'}}>
                  <div className="d-flex justify-content-between align-items-center col col-lg-3 col-xl-3 px-0">
                  <Form.Label className="mx-2">Costumer:</Form.Label>
                  <Select
                  styles={customStyles}
          options={Costumers.slice(0, 6)}
          onChange={handleClientChange}
         
          placeholder="Select"
          isSearchable 
          required
          onInputChange={(newValue) => {
        setsearchcostumer(newValue);
        // You can do whatever you want with the search input value here
    }}
        />
        </div>
        <div className="px-0 col col-lg-3 col-xl-3 form-check form-switch" 
                      style={{display: 'flex',alignItems: 'center',justifyContent: 'space-between',flexDirection: 'row',width:'150px'}}>
                      <label className="form-check-label" htmlFor='enabletaxes'>Enable Taxes:</label>
                      <input className="form-check-input " 
                      style={{width: '50px',height: '20px',}} type="checkbox" id='enabletaxes' defaultChecked={false} onChange={(event) => handleCheckboxChange(event)} />
  
                      

        </div>
        <div className="d-flex  justify-content-between align-items-center col col-lg-3 col-xl-3 px-0">
                  <Form.Label className="mx-2">Payment:</Form.Label>
                  <Select
                  styles={customStyles}
          options={modepayment}
          onChange={handlepayChange}
         
          placeholder="Select"
          isSearchable 
          required
        />
                 
        </div>

                  
        </div>        
                
                <Form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(newProduct);
              }}
            >
            <div style={{maxWidth:'100%',overflow: 'auto',direction: 'ltr'}}>
              {/* Add Product button now placed at the top-left of the table */}
              <div className="d-flex justify-content-start mt-2">
                <Button className="btn btn-primary" onClick={openAddModal} title="Add Product">
                  <FaPlus style={{marginRight:6}} /> Add Product
                </Button>
              </div>
               <Table   bordered hover variant="Default" className="mt-0">
                <thead className="table-info">
                  <tr>
                    <th>ID</th>
                    <th style={{width:'200px'}}>Barcode</th>
                    <th style={{width:'200px'}}>Category</th>
                    <th style={{width:'200px'}}>Product Name</th>
                    <th style={{width:'200px'}}>Quantity</th>
                    <th style={{width:'200px'}}>Unit price </th>
                    <th style={{width:'200px'}}>Total Price</th>
                    <th style={{width:'200px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Products.length > 0 ? (
                    Products.map((Product, index) => (
                      <tr key={index}>
                        <td>{Product.idProduct}</td>
                        <td>{Product.barcode}</td>
                        <td>{Product.category.name}</td>
                        <td>{Product.designationEN}</td>
                        <td>{Product.qnt }</td>
                        <td>{Product.priceU}</td>
                        <td>{Product.price}</td>
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
                      <td colSpan={8} className="text-center">
                        No Products found.
                      </td>
                    </tr>
                  )}
                  {/* removed inline add-row; use Add Product button at top which opens modal */}
                </tbody>
              </Table>
              </div>
              </Form>
              <div  className="row d-flex justify-content-between" style={{display:'flex',flexDirection: 'row-reverse', alignItems: 'center',direction:'ltr'}}>
                  
                  <div className="row  col-xl-10 d-flex justify-content-between" style={{display:'flex', alignItems: 'center',direction:'ltr'}}>
                  <div className="d-flex  justify-content-between align-items-center  col col-md-4 col-lg-3 col-xl-3">
                  <Form.Label className="mx-2">Partial_Sum:  </Form.Label>
                  <Form.Control style={{width:'100px'}}
                    type="number"
                    min="0"
                    value={partial_sum}
                    disabled
                  />
                  </div>
                  <div className="d-flex  justify-content-between align-items-center  col col-md-4 col-lg-3 col-xl-3">
                   <Form.Label className="mx-2">Taxes:  </Form.Label>
                  <Form.Control style={{width:'100px'}}
                    type="number"
                    min="0"
                    value={taxes}
                    disabled
                  />
                  </div>
                  <div className="d-flex  justify-content-between align-items-center  col col-md-4 col-lg-3 col-xl-3">
                   <Form.Label className="mx-2">Total_Price:  </Form.Label>
                  <Form.Control style={{width:'100px'}}
                    type="number"
                    min="0"
                    value={totalPrice}
                    disabled
                  />
                  </div>
                  </div>
                  <div className="row  col-xl-10 d-flex justify-content-between" style={{display:'flex', alignItems: 'center',direction:'ltr'}}>
                  <div className="d-flex  justify-content-between align-items-center  col col-md-4 col-lg-3 col-xl-3">
                           
                                    <Form.Label className="mx-2">warranty:  </Form.Label>
                  <Form.Control style={{width:'100px'}}
                    type="number"
                    min="0"
                    value={warranty}
                    onChange={(e) =>
                      setWarranty( e.target.value)
                    }
                  />
                  </div>
                  <div className="d-flex  justify-content-between align-items-center  col col-md-4 col-lg-3 col-xl-3">
                  
                   <Form.Label className="mx-2">paid:  </Form.Label>
                  <Form.Control style={{width:'100px'}}
                    pattern="^\d+(\.\d{2})?$" title='Please write a number'
                    min="0"
                    defaultValue={0}
                    value={paid}
                    onChange={(e) =>
                      setPaid( e.target.value)
                    }
                  />
                  </div>
                  <div className="d-flex  justify-content-between align-items-center  col col-md-4 col-lg-3 col-xl-3">
                  
                   <Form.Label className="mx-2">back :  </Form.Label>
                  <Form.Control style={{width:'100px'}}
                    type="number"
                    min="0"
                    value={paid-totalPrice}
                    disabled
                    onChange={(e) =>
                      setBack( e.target.value)
                    }
                  />
                  </div>
                  </div>
           </div>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                 handleSave();
              }}
            >
           <div  className="d-flex justify-content-between" style={{marginTop:'5px',display:'flex', alignItems: 'center',direction:'ltr'}}>
                  
                
              <div style={{display:'flex',justifyContent:'end'}}>
              <button className="btn btn-success mx-2" type="submit" disabled={mode==null || idCostumer==null || Products.length==0} name="submit" value="submit" 
              >Save</button>
                                     
                                    <button className="btn btn-danger mx-2"
                                    onClick={() => {
      
      navigate("/Sales%20Order", { replace: true })
      }}>Cancel</button>
                                       
                                    </div>
                                 
                 
           </div>
           </Form>
            </Card.Body>
            
          </Card>
          <Card hidden={!hid} >
            <Card.Body  style={{backgroundColor: 'white',overflow: 'auto'}}>
              <div style={{direction:'rtl'}} className="d-flex justify-content-between customCardBody">
              <div className="d-flex justify-content-between">
                  <Card.Title>Salle Order</Card.Title>
                  
                </div>
                  </div>
                  <div >
        <Facture setHid={setHid} paid={paid} garantie={warranty}  factureid={factureid}  Product={Products} client={Costumers.filter((i) => i.id == idCostumer)} 
        somme_partielle={partial_sum} mentant_total={totalPrice}
        modepayment={mode}  enable_taxes={enabletaxes} taxes={taxes}
        />
        </div>
                  </Card.Body>
                  </Card>
  
        </Col>
        
        
          

      </Row>
  );
};