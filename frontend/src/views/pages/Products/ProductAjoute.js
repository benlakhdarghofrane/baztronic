import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,Alert,
} from "react-bootstrap";
import html2pdf from "html2pdf.js";
import Alertform from '../../../components/Alert'
import Select from 'react-select';
import "../../../scss/user.css";
import React, { useState,useEffect } from "react";
import Barcode from 'react-barcode';
import { FaPencilAlt,  FaTrashAlt,FaPlus } from "react-icons/fa";
import axiosClient from '../../../axios-client';
import { Category, Key } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
export default function ProductsManager  (props) {
 const navigate = useNavigate();
 const [hide,setHid]=useState(true);
 const [selectCat, setselectCat] = useState(null);
 const [selectmarq, setselectmarq] = useState(null);
 const [showAlert, setShowAlert] = useState(false);
 const setErr=props.setErr;
 const setshowerr=props.setshowerr;
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
      setErr(err);
      setshowerr(true);
    }
  }
  useEffect(()=>{
    getCats();
  },[])
  const getMarques=()=>{
    setLoading(true)
axiosClient.get('/mareques/marequesbycategory/'+selectCat).then(({data})=>{  

 if (data.data){
  const options = data.data.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));
 setMarques(options);
    setLoading(false)
  }
}).catch((err)=>{
setLoading(false);
setErr(err);
setshowerr(true);
})
}
useEffect(()=>{
getMarques();
},[selectCat])
const getModel=()=>{
  setLoading(true)
axiosClient.get('/models/modelsbymareques/'+selectmarq).then(({data})=>{  

if (data.data){
const options = data.data.map((cat) => ({
  value: cat.id,
  label: cat.name,
}));
setModels(options);
  setLoading(false)
}
}).catch((err)=>{
setLoading(false)
setErr(err);
setshowerr(true);
})
}
useEffect(()=>{
getModel();
},[selectmarq])
  const initCurrent = {
            
    id:null,
    idcategory:'',
    mareque:null,
    model:null,
    barcode:'',
    refernce:'',
    quantity:0,
    designationEN:'',
    //processeur:'',
    //ram:'',
    //stokage:'',
    //screen:'',
    //battery:'',
    //carteGraphique:'',
    purchase_price:0,
    sale_price:0,
    max_quantity:0,
    min_quantity:0,
  };
  const [Cats, setCats] = useState([]);
  const [selectedcat, setselectedcat] = useState('');
  const [Codebars, setCodebars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [newProduct, setNewProduct] = useState(initCurrent);
  const [editing, setEdit] = useState(false);
  const [errors, setErrors] = useState({});
  const [Models, setModels] = useState([]);
  const [Marques, setMarques] = useState([]);
  const validateForm = () => {
    const errors = {};
    if (!newProduct.ram) {
      errors.ram = 'ram is required';
    }
    // Add more validation rules for other fields as needed
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  //const [showbarcode, setShowbarcode] = useState(false);
  const handleCategoryChange = (selectedOption) => {
    setNewProduct({ ...newProduct, idcategory: selectedOption.value });
    setselectCat( selectedOption.value );
  };
  const generatecodebar = (codebar) => {
    
    return <Barcode width={1} height={60} value={codebar} />;
};

  const handleSave = () => {
    
    setLoading(true);
    const updatedProducts = Products.map((product) => {
        
       
        const currentDate = new Date();
        const year = currentDate.getFullYear().toString().substring(2,4);
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        
        const barcode =`${handelgetmarque(product.mareque).substring(0, 2)}-${handelgetmodel(product.model).substring(0, 5)}-${day}${month}${year}`;
          if(!product.barcode){
        const codebarval = {
          codebar: barcode, 
        };
        Codebars.push(codebarval);
        //setCodebars((Codebars) => [...Codebars, codebarval]);
       // console.log(codebarval)
        //console.log(Codebars)
      }     
          // Check if barcode and reference attributes exist, if not, add them
          const updatedProduct = {
            ...product,
            barcode: product.barcode || barcode,
            refernce: product.refernce || barcode,
          };
    
          // Remove the 'id' attribute
          delete updatedProduct.id;
           
          return updatedProduct;
        });
      
    updatedProducts.map((product) => (
    //console.log(product),
    axiosClient.post('/products',product).then(({data})=>{  
   
      if (data){
        setShowAlert(true);
       }
    }).catch((err)=>{
     // console.log(err.response.data.errors.barcode[0])
      setErr(err.response.data.errors.barcode[0]);
      setshowerr(true);
   })
    ))
    setLoading(false);
   // console.log(Codebars)
    if(Codebars.length > 0 )
    {
      setHid(false);
      setProducts([]);
    }
    else{

      setProducts([]);
      
    }
    
    
   // setShowbarcode(true);
    //navigate("/products", { replace: true })
    };  

    const findCategoryLabelById = (categoryId) => {
      const category = Cats.find((cat) => cat.value === categoryId);
      return category ? category.label : '';
    };
  const handleClose = () => {
    
    setShow(false); 
   
  };
  const handleShow = () => {
    setNewProduct(initCurrent)
    setShow(true);
    setEdit(false)
  };

  const onFormSubmit = (newProduct) => {
    //console.log(newProduct)
    const id = Products.length + 1;
    setProducts([...Products, { ...newProduct, id }]);
  };

  const onEdit = (newProduct) => {
    setEdit(true);
    if(editing === true) {
      setNewProduct({ ...newProduct, newProduct });
     
      setShow(true);
    
    }
    
  };
 
  const onSubmit = (newProduct) => {
    handleClose();
   // console.log(newProduct)
    if (editing === true) {
      onUpdateProduct(newProduct);
      setShow(false)
    } else {
      onFormSubmit(newProduct);
      setShow(false)
    }
  };

  const onUpdateProduct = (newProduct) => {
    setEdit(false);
    let id = newProduct.id;
    setProducts(Products.map((i) => (i.id === id ? newProduct : i)));
  };

  const onDeleteProduct = (currentProduct) => {
    setProducts(Products.filter((i) => i.id !== currentProduct.id));
  };
  const handelgetmarque = (id) => {

    const mar = Marques.filter(item => item.value === id);
     if (mar.length > 0) {
    return mar[0].label;}
    else {return ""}}
    const handelgetmodel = (id) => {

      const mod = Models.filter(item => item.value === id);
       if (mod.length > 0) {
      return mod[0].label;}
      else {return ""}}
  const handleMarqueChange = (selectedOption) => {
    setNewProduct({ ...newProduct, mareque: selectedOption.value,designationEN:selectedOption.label+' '+handelgetmodel(newProduct.model) });
    setselectmarq( selectedOption.value );
  };
  const handleModelChange = (selectedOption) => {
    setNewProduct({ ...newProduct, model: selectedOption.value,designationEN:handelgetmarque(newProduct.mareque)+' '+selectedOption.label });
  };
  const handlePrint = () => {
    const element = document.getElementById('printbarcode');
    const pdfOptions = {
      margin: 10, // Adjust margins if needed
      filename: 'barcodes.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', putOnlyUsedFonts: true },
     
    };

    // Use html2pdf to generate a PDF from the div with the specified options
    html2pdf(element, pdfOptions);
    
    navigate("/products", { replace: true })

    setHid(true);
  };

  return (
      <Row>
      <Alertform setShowAlert={setShowAlert} showAlert={showAlert} />
        <Col>
          <Card className="customCard" hidden={!hide} style={{borderRadius: '15px'}}>
            <Card.Body style={{backgroundColor: 'white',overflow: 'auto', borderRadius: '15px'}}>
               <div className="d-flex mx-10">
                  <Card.Title>Products</Card.Title>
                </div>
                <div className="d-flex justify-content-end">
                
                    <Button
                    
                    className="btnaction"
                      variant="info"
                      onClick={handleShow}
                      title="Add Product"
                    >
                      <FaPlus />
                    </Button>
                 
                </div>
                <div style={{maxWidth:'100%',overflow: 'auto',direction: 'ltr'}}>
         
              <Table   bordered hover variant="Default" className="mt-0">
                <thead className="table-info">
                  <tr>
                  <th>Barcode</th>
                    <th>Category</th>
                     <th>Product name</th>
                    <th>description</th>
                    <th>purchase price </th>
                    <th>sale price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Products.length > 0 ? (
                    Products.map((Product, index) => (

                      <tr key={index}>
                        <td>{Product.barcode}</td>
                        <td>{findCategoryLabelById(Product.idcategory)}</td>
                        <td>{Product.designationEN}</td>
                        <td>{Product.description}</td>
                        <td>{Product.purchase_price }</td>
                        <td>{Product.sale_price}</td>
                        <td style ={{display:'flex',justifyContent:'center'}}>
                        <div style={{display: 'flex'}}>
                        <Button
                          className="btnaction"
                            variant="info"
                            title="Edit Product details"
                            onClick={() => onEdit(Product)}
                          >
                            <FaPencilAlt />
                          </Button>
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
                </tbody>
              </Table>

              </div>
              <div style={{display:'flex',justifyContent:'end'}}>
                                    <button className="btn btn-danger mx-2"  
                                    onClick={() => {
                                      navigate("/products", { replace: true })
      }}
                                    >Cancel</button>
                                    <button className="btn btn-success mx-2" disabled={Products.length==0 || loading} type="submit" name="submit" value="submit" onClick={handleSave}>Save</button>
                                        
                                    </div>
            </Card.Body>
            
          </Card>
          <Card className="customCard" hidden={hide}>
         
            <Card.Body  style={{backgroundColor: 'white',overflow: 'auto',borderRadius:'15px'}}>
            <button onClick={() => {handlePrint()}}  type="button" class="btn btn-primary">
                                     Print</button>
            <div style={{display:'flex',justifyContent:'start'}}>
                                    
                                     
                                        
                                    </div>
            <div id='printbarcode'>
            <h3> barcode Liste </h3>
            {Codebars.length > 0 ? (
              
              Codebars.map((item,idx) => (
              
               generatecodebar(item.codebar)
               
                 ))
                
            ):('')}
            </div>
            </Card.Body>
            </Card>
          <Modal size="lg" show={show} onHide={handleClose}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(newProduct);
              }}
            >
              <Modal.Header closeButton>
                {
                  editing === true 
                  ? <Modal.Title>Edit Product</Modal.Title>
                  : <Modal.Title>Add Product</Modal.Title>
                }
              </Modal.Header>
              <Modal.Body >
              {Cats.length!==0 ? (
                <>
                <Form.Group className="mb-3">
                
        <Form.Label>Category</Form.Label>
        <Select
        
          options={Cats}
          onChange={handleCategoryChange}
          //value={Cats.find((option) => option.value === Product.category)}
          placeholder="Select"
          isSearchable // Enables search functionality
          required
        />
      </Form.Group>
      
                </>):('')}
                <Form.Group className="mb-3">
                
                <Form.Label>Marque</Form.Label>
                <Select
                  options={Marques}
                  onChange={handleMarqueChange}
                  //defaultInputValue={newModel.Mareque}
                 // value={Marques.find((option) => option.id === newModel.idmarque)}
                  placeholder="Select"
                  isSearchable // Enables search functionality
                  required
                />
              </Form.Group>
                <Form.Group className="mb-3">
                
                <Form.Label>Model</Form.Label>
                <Select
                
                  options={Models}
                  onChange={handleModelChange}
                  //value={Cats.find((option) => option.value === Product.category)}
                  placeholder="Select"
                  isSearchable // Enables search functionality
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Barcode</Form.Label>
                  <Form.Control

                    type="text"
                    value={newProduct.barcode}
                    
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, barcode: e.target.value,refernce:e.target.value,quantity:'0' })
                    }
                    placeholder="Enter Barcode"
                  />
                </Form.Group>
                 
               
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.description}
                   
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, description: e.target.value })
                    }
                    placeholder="Enter Description"
                  />
                </Form.Group>
                {Number(newProduct.idcategory) === 2 && (
                                                <Form.Group className="mb-3">
                                                <Form.Label>IMEI</Form.Label>
                                                <Form.Control type="text"
                                                  value={newProduct.imei}
                                                  onChange={(e) =>
                                                    setNewProduct({
                                                      ...newProduct,
                                                      imei: e.target.value,
                                                    })
                                                  }
                                                />
                                              </Form.Group>)}
                                              {Number(newProduct.idcategory) === 1 && (
                                                <Form.Group className="mb-3">
                                                <Form.Label>Serial Number</Form.Label>
                                
                                                <Form.Control type="text"
                                                  value={newProduct.serial_number}
                                                  onChange={(e) =>
                                                    setNewProduct({
                                                      ...newProduct,
                                                      serial_number: e.target.value,
                                                    })
                                                  }
                                                />
                                              </Form.Group>)}
                                  <Form.Group className="mb-3">
                                    <Form.Label>Color</Form.Label>
                                
                                    <Form.Control
                                      type="color"
                                      value={newProduct.color || "#000000"}
                                      onChange={(e) =>
                                        setNewProduct({
                                          ...newProduct,
                                          color: e.target.value.toUpperCase(), // stores #FF0000
                                        })
                                      }
                                      style={{ width: "80px", height: "40px" }}
                                    />
                                  </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Ram</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.ram}
                   
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, ram: e.target.value })
                    }
                    placeholder="Enter Ram"
                  />
                  {/* Display model error message 
            {errors.ram && (
              <Alert variant="danger" className="mt-2">
                {errors.ram}
              </Alert>
            )}*/}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Processeur</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.processeur}
                    
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, processeur: e.target.value })
                    }
                    placeholder="Enter Processeur"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Storage</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.stokage}
                    
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stokage: e.target.value })
                    }
                    placeholder="Enter Storage"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Screen</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.screen}
                    
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, screen: e.target.value })
                    }
                    placeholder="Enter Screen"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Battery</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.battery}
                    
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, battery: e.target.value })
                    }
                    placeholder="Enter Battery"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Graphique card</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.carteGraphique}
                    
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, carteGraphique: e.target.value })
                    }
                    placeholder="Enter Graphique card"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>purchase price</Form.Label>
                  <Form.Control
                     pattern="^\d+(\.\d{2})?$" title='Please write a number'
                    type="text"
                    min="0"
                    defaultValue={0}
                    value={newProduct.purchase_price}
                    
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, purchase_price: e.target.value })
                    }
                    placeholder="Enter purchase price"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>sale price</Form.Label>
                  <Form.Control
                    type="text"
                    pattern="^\d+(\.\d{2})?$" title='Please write a number'
                    min="0"
                    defaultValue={0}
                    value={newProduct.sale_price}
                    required
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, sale_price: e.target.value })
                    }
                    placeholder="Enter sale price"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>max quantity </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    defaultValue={0}
                    value={newProduct.max_quantity}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, max_quantity: e.target.value })
                    }
                    placeholder="Enter max quantity "
                  />
                </Form.Group>   
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>min quantity </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    defaultValue={0}
                    value={newProduct.min_quantity}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, min_quantity: e.target.value })
                    }
                    placeholder="Enter min quantity "
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