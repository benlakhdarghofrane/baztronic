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
export default function ProductsManager  (props) {
  
  const navigate = useNavigate();
  const [loading,setLoading]=useState(false);
  const [refresh,setrefresh]=useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [deleteitem, setDeleteitem] = useState(null);
  const [searchvalue, setsearchvalue] = useState('');
  const [Models, setModels] = useState([]);
  const [Marques, setMarques] = useState([]);
 const [selectCat, setselectCat] = useState(null);
 const [selectmarq, setselectmarq] = useState(null);
 const [showAlert, setShowAlert] = useState(false);
 const [Disponible, setDisponible] = useState('All');
 const [CategorySelect, setSelectedCategory] = useState(null);
 const [MarqueSelect, setSelectedMarque] = useState(null);
 const [ModelSelect, setSelectedModel] = useState(null);
 const [Disponiblelist, setDisponiblelist] = useState(
     [
       { id: 1, value:'All', label:'All' },
       { id: 2, value:'Available', label:'Available' },
       { id: 3, value:'Unavailable',label:'Unavailable' }
     ]);
    const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: '100px', // set your desired width here
  }),
};
  async function getCats() {
    
    setLoading(true);
    try{
      let res = await axiosClient.get("/catigories")
      .then((res)=>res)
      
      if(res.status===200) {
        const options = res.data.data.map((cat) => ({
          value: cat.id,
          label: cat.designationEN,
        }));
          setCats([
    { value: null, label: "All" }, 
    ...options
  ]);
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
  const getMarques=(CategorySelect)=>{
    setLoading(true)
axiosClient.get('/mareques/marequesbycategory/'+CategorySelect).then(({data})=>{  

 if (data.data){
  const options = data.data.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));
   setMarques([
    { value: null, label: "All" }, 
    ...options
  ]);
    setLoading(false)
  }
}).catch(()=>{
setLoading(false)
})
}
useEffect(()=>{
getMarques(CategorySelect);
},[CategorySelect])
const getModel=(MarqueSelect)=>{
  setLoading(true)
axiosClient.get('/models/modelsbymareques/'+MarqueSelect).then(({data})=>{

if (data.data){
const options = data.data.map((cat) => ({
  value: cat.id,
  label: cat.name,
}));
  setModels([
    { value: null, label: "All" }, 
    ...options
  ]);
  setLoading(false)
}
}).catch(()=>{
setLoading(false)
})
}
useEffect(()=>{
getModel(MarqueSelect);
},[MarqueSelect])
  const [Cats, setCats] = useState([]);
  const getProducts=(page,CategorySelect,MarqueSelect,ModelSelect,Disponible,searchvalue)=>{
    setLoading(true);
    searchvalue==''  ? (
      axiosClient.get(`/productSearch/${CategorySelect}/${MarqueSelect}/${ModelSelect}/${Disponible}?page=${page}`).then(({data})=>{  

        if (data.data){
        setProducts(data.data);
        setTotalPages(data.meta.last_page)
        setLoading(false);
         }
      }).catch(()=>{
       setLoading(false);
     })
    ):(
      axiosClient.get(`/productSearch/${CategorySelect}/${MarqueSelect}/${ModelSelect}/${Disponible}/${searchvalue}?page=${page}`).then(({data})=>{

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
    getProducts(currentPage,CategorySelect,MarqueSelect,ModelSelect,Disponible,searchvalue);
  },[refresh,currentPage,CategorySelect,MarqueSelect,ModelSelect,Disponible,searchvalue])
 
  
  const [Products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [newProduct, setNewProduct] = useState([]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handeldeleteitem = (product) => {
    setDeleteitem(product);
    setOpenModal(true);
  };
  const handleClose = () => {
    
    setShow(false); 
   
  };
  
  const handleCategoryChange = (selectedOption) => {
    setNewProduct({ ...newProduct, idcategory: selectedOption.value });
  };
  const handledispChange = (selectedOption) => {
       setDisponible(selectedOption.value);
  };
  const onEdit = (newProduct) => {
    
      setNewProduct(newProduct);
     setShow(true);
    
      
      
  
    
  };

  const onSubmit = (newProduct) => {
    setShow(false);
      onUpdateProduct(newProduct);
    
      
    
  };

  const onUpdateProduct = (newProduct) => {
    setLoading(true);
    let id = newProduct.id;
    const updatedProduct = {
      ...newProduct,
      idcategory: newProduct.category.id,
      mareque: newProduct.mareque.id,
      model:newProduct.model.id,
    };
    delete updatedProduct.category;
    axiosClient.put('/products/'+id,updatedProduct).then(({data})=>{  
   
      if (data){
        setShowAlert(true);
        setLoading(false);
        setrefresh(!refresh);
       }
    }).catch(()=>{
      setLoading(false);
      setrefresh(!refresh);
   })

  };

  const onDeleteProduct = (currentProduct) => {
    setLoading(true);
    setOpenModal(false);
    let id = currentProduct.id;
    axiosClient.delete('/products/'+id).then(({data})=>{  
   
      if (data){
        setLoading(false);
        setShowAlert(true);
        setrefresh(!refresh);
        setDeleteitem(null);
       }
    }).catch(()=>{
      setLoading(false);
      setrefresh(!refresh);
      setDeleteitem(null);
   })

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
    setNewProduct({ ...newProduct, mareque: selectedOption.value,designationEN:selectedOption.label+' '+newProduct.model.name });
    setselectmarq( selectedOption.value );
  };
  const handleModelChange = (selectedOption) => {
    setNewProduct({ ...newProduct, model: selectedOption.value,designationEN:newProduct.mareque.name+' '+selectedOption.label });
  };
   const handleCategorySelect = (selectedOption) => {
    setSelectedCategory(selectedOption.value);
  };
   const handleModelSelect = (selectedOption) => {
    setSelectedModel(selectedOption.value);
  };
   const handleMarqueSelect = (selectedOption) => {
    setSelectedMarque(selectedOption.value);
  };
  return (
      <Row>
      <Alertform setShowAlert={setShowAlert} showAlert={showAlert}/>
        <Col>
          <Card className="customCard" style={{borderRadius: '15px'}}>
            <Card.Body style={{backgroundColor: 'white',overflow: 'auto', borderRadius: '15px'}}>
              <div className="d-flex mx-10">
                  <Card.Title>Products</Card.Title>
                  
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
                  <div style={{direction:'ltr'}} className="d-flex  justify-content-between align-items-center col col-lg-2 col-xl-2 px-0">
                  <Form.Label className="mx-2">Availability:</Form.Label>
                  <Select
                  styles={customStyles}
          options={Disponiblelist}
          onChange={handledispChange}
          placeholder="Select"
        />
                 
                  </div>
                  {MarqueSelect&& 
                  <div style={{direction:'ltr'}} className="d-flex  justify-content-between align-items-center col col-lg-2 col-xl-2 px-0">
                  <Form.Label className="mx-2">Model:</Form.Label>
                  <Select
                  styles={customStyles}
          options={Models}
          onChange={handleModelSelect}
          placeholder="Select"
        />
                 
                  </div>}{CategorySelect &&
                  <div style={{direction:'ltr'}} className="d-flex  justify-content-between align-items-center col col-lg-2 col-xl-2 px-0">
                  <Form.Label className="mx-2">marque:</Form.Label>
                  <Select
                  styles={customStyles}
          options={Marques}
          onChange={handleMarqueSelect}
          placeholder="Select"
        />
                 
                  </div>}
                  <div style={{direction:'ltr'}} className="d-flex  justify-content-between align-items-center col col-lg-2 col-xl-2 px-0">
                  <Form.Label className="mx-2">Category:</Form.Label>
                  <Select
                  styles={customStyles}
          options={Cats}
          onChange={handleCategorySelect}
          placeholder="Select"
        />
                 
                  </div>
                   <div className="d-flex">
                 <Button
                    className="btnaction"
                      variant="info"
                      onClick={() => {
      
                   navigate("/products/print", { replace: true })
      }}
                      title="product print"
                    >
                     Print
                      
                    </Button>
                 
                </div>
                <div className="d-flex">
                  
                  <Button
                    className="btnaction"
                      variant="info"
                      onClick={() => {
      
                   navigate("/products/Add", { replace: true })
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
                    <th>Category</th>
                    <th>Barcode</th>
                    <th>Product name</th>
                    <th>Color</th>
                    <th>IMEI/Serial Number</th>
                    <th>description</th>
                    <th>purchase price </th>
                    <th>sale price</th>
                    <th>quantity </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Products.length > 0 ? (
                    Products.map((Product, index) => (

                      <tr key={index}>
                        <td>{Product.id}</td>
                        <td>{Product.category.name}</td>
                        <td>{Product.barcode}</td>
                        <td>{Product.designationEN}</td>
                         <td>
                         {Product.color ? (
                          <div
                           title={Product.color}
                           style={{
                           width: "40px",
                           height: "24px",
                           backgroundColor: Product.color,
                           border: "1px solid #ccc",
                           borderRadius: "4px",
                           margin: "0px",
                          }}
                         />
                         ) : null}
                        </td>
                          <td>
                          {Number(Product.category?.id) === 1
                          ? Product.serial_number
                         : [2, 12].includes(Number(Product.category?.id))
                         ? Product.imei
                         : ""}
                         </td>
                       
                        <td>{Product.description}</td>
                        <td>{Product.purchasePrice }</td>
                        <td>{Product.salePrice}</td>
                        <td>{Product.quantity}</td>
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
                            onClick={() => handeldeleteitem(Product)}
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
              Are you sure you want to delete this product?
            </h3>
            <div className="d-flex justify-content-start gap-4">
              <Button variant="danger" onClick={() => onDeleteProduct(deleteitem)}>
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
                onSubmit(newProduct);
              }}
            >
              <Modal.Header closeButton>
                 <Modal.Title>Edit Product</Modal.Title>
                  
              </Modal.Header>
              <Modal.Body >
              {newProduct.id ? (
                <>
              {Cats.length!==0 ? (
                <>
                <Form.Group className="mb-3">
                
        <Form.Label>Category</Form.Label>
        
        <Select
          options={Cats}
          onChange={handleCategoryChange}
          //defaultValue={newProduct.category}
          defaultInputValue={newProduct.category.name}
          value={Cats.find((option) => option.value === newProduct.category.id)}
         // value={newProduct.category}
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
                  defaultInputValue={newProduct.mareque.name}
                  value={{value:newProduct.mareque.id,label:newProduct.mareque.name}}
                  //value={Marques.find((option) => option.value === newProduct.mareque.id)}
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
                  defaultInputValue={newProduct.model.name}
                  value={{value:newProduct.model.id,label:newProduct.model.name}}
                  placeholder="Select"
                  isSearchable // Enables search functionality
                  required
                />
              </Form.Group>
              </>
              ):('')}
              <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Barcode</Form.Label>
                  <Form.Control
                    type="text"
                    value={newProduct.barcode}
                    required
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
                 {Number(newProduct.category?.id) === 2 && (
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
                              {Number(newProduct.category?.id) === 1 && (
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
                    type="text"
                    pattern="^\d+(\.\d{2})?$" title='Please write a number'
                    defaultValue={newProduct.purchasePrice}
                  //  value={newProduct.purchasePrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, purchase_price: e.target.value })
                    }
                    placeholder="Enter purchase price"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>sale price</Form.Label>
                  <Form.Control
                    type="text"
                    pattern="^\d+(\.\d{2})?$" title='Please write a number'
                    defaultValue={newProduct.salePrice}
                    //value={newProduct.salePrice}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, sale_price: e.target.value })
                    }
                    required
                    placeholder="Enter sale price"
                  />
                </Form.Group>
                {/*
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    value={newProduct.quantity}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, quantity: e.target.value })
                    }
                    placeholder="Enter Quantity "
                  />
                </Form.Group>*/}
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>max quantity </Form.Label>
                  <Form.Control
                    type="number"
                    value={newProduct.max_quantity}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, max_quantity: e.target.value })
                    }
                    placeholder="Enter max quantity "
                    required
                  />
                </Form.Group>   
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>min quantity </Form.Label>
                  <Form.Control
                    type="number"
                    value={newProduct.min_quantity}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, min_quantity: e.target.value })
                    }
                    required
                    placeholder="Enter min quantity "
                  />
                </Form.Group> 
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                  <Button variant="primary" type="submit" >
                    Update
                  </Button>
                
              </Modal.Footer>
            </Form>
          </Modal>
        </Col>
      </Row>
  );
};