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
import { useNavigate } from 'react-router-dom';
import Alertform from '../../../components/Alert'
export default function ProductsManager  (props) {
  const navigate = useNavigate();  
  const setErr=props.setErr;
  const setshowerr=props.setshowerr;
  const [showAlert, setShowAlert] = useState(false);
  const [searchsupplier, setsearchsupplier] = useState('');
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
      let res = await axiosClient.get("/product/barcode/"+barcode)
      .then((res)=>res)
      
      if(res.status===200) {
        if(res.data.data.length!=0 ){
        setProduct(res.data.data[0])
        
          setNewProduct({ ...newProduct, priceU:res.data.data[0].purchasePrice,idProduct:res.data.data[0].id,barcode:res.data.data[0].barcode,designationEN: res.data.data[0].designationEN })
        
      } else{setProduct([])}
        
        setLoading(false) 
        }else {setProduct([])}
      }
    catch (err) {
      setLoading(false);
      setProduct([])
    }
    
  }

  async function getSuppliers(searchsupplier) {
    
    setLoading(true);
    try{
      let res = await axiosClient.get(searchsupplier =="" ? `/fournisseurs` : `/fournisseursFilter/${searchsupplier}`)
      .then((res)=>res)
      
      if(res.status===200) {
        const options = res.data.data.map((item) => ({
          ...item,
          value: item.id,
          label: item.fullname,
        }));
        setSuppliers(options)
        setLoading(false) 
        }
        
      }
    catch (err) {
      setLoading(false);
      
    }
  }
  useEffect(()=>{ getSuppliers(searchsupplier); },[searchsupplier])
  const initCurrent = {
    idProduct:'',
    priceU:0,
    qnt:1,
    priceHT:0,
    taxes:0,
    extraExpenes:0,
    priceT:0,
    description:'',
    status:'Complited',
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

  const handleSave = () => {
const payloadS={
  depot:depot,
  idFournisseur:idSupplier,
  priceT:totalPrice,
  rest:totalPrice-paid,
  payment:paid,
  status:'complited',
}
      axiosClient.post('/recieptOrders',payloadS).then(({data})=>{  
     
        if (data){
          Products.map(product => {
          const updatedPyload = {
            ...product,
            idreceipt:data.id,
          };
    
          // Remove the 'id' attribute
          delete updatedPyload.barcode;
          delete updatedPyload.designationEN;
          //return updatedPyload;
          axiosClient.post('/detailsreceipt',updatedPyload).then(({data})=>{  
         
            if (data){
             // console.log(data)
            setShowAlert(true);
            setProducts([]);
            setPaid(0);
             }
          }).catch(()=>{
       
         })
        });
         }
      }).catch(()=>{
   
     })
  };  

  const onFormSubmit = (newProduct) => {
    const id = newProduct.idProduct;
    // Check if the product with the same id already exists
    const existingProduct = Products.find(product => product.idProduct === id);
  
    if (!existingProduct) {
      // Product with the same id doesn't exist, so update the state
      const totalht = parseFloat(newProduct.qnt) * parseFloat(newProduct.priceU);
      const taxe = parseFloat(newProduct.taxes || 0) + parseFloat(newProduct.extraExpenes || 0);
      const totalhtc = totalht + taxe;
      setProducts([...Products, { ...newProduct,priceHT:totalht, priceT: totalhtc }]);
    }
  
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
 

  const calculateSum = (newProduct) => {
    if (!newProduct || !newProduct.qnt || !newProduct.priceU  ) {
      return 0;
    }
  
    const totalht = parseFloat(newProduct.qnt) * parseFloat(newProduct.priceU);
    const taxe = parseFloat(newProduct.taxes || 0) + parseFloat(newProduct.extraExpenes || 0);
    const totalhtc = totalht + taxe;
     
    return totalhtc;
  };
  const handleSupplierChange = (selectedOption) => {
    setIdSupplier( selectedOption.value );
  };
  const handleCheckboxChange = (event) => {
    //console.log(event.target.checked)
    setdepot(event.target.checked)
  }
  // fetch products for Select (adjust endpoints if needed)
async function getAllProducts(searchprod) {
    
    setLoading(true);
   
    try{
      
      let res = await axiosClient.get( searchprod=="" ? `/productSearch/${null}/${null}/${null}/${null}`:
        `/productSearch/${null}/${null}/${null}/${null}/${searchprod}`)
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
      priceU: selectedOption.purchasePrice || selectedOption.price || 0,
      idProduct: selectedOption.id || selectedOption.value,
      barcode: selectedOption.barcode || '',
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
                  <Card.Title>Receipt Order</Card.Title>
                </div>
<div className="row my-2" style={{display:'flex',justifyContent: 'flex-end'}}>
                <div className="row col-lg-6 col-xl-6 d-flex justify-content-between" style={{ display:'flex', alignItems: 'center',direction:'rtl'}}>
                <div className="px-0 col col-md-4 col-lg-4 form-check form-switch" 
                      style={{display: 'flex',alignItems: 'center',justifyContent: 'space-between',flexDirection: 'row',width:'150px'}}>
                      <input className="form-check-input " 
                      style={{width: '50px',height: '20px',}} type="checkbox" id='deposit' disabled={Products.length > 0 ? false:false} defaultChecked={false} onChange={(event) => handleCheckboxChange(event)} />
  
                      <label className="form-check-label" htmlFor='deposit'>:Deposit</label>

</div>
                
                <div className=" px-0 col col-md-4 col-lg-4 d-flex justify-content-between" style={{display:'flex', alignItems: 'center',direction:'ltr'}}>
               
                  <Form.Label className="mx-0">Supplier:  </Form.Label>
                  <Select
                  styles={customStyles}
          options={Suppliers.slice(0, 6)}
          onChange={handleSupplierChange}
         
          placeholder="Select"
          isSearchable 
          required
          onInputChange={(newValue) => {
        setsearchsupplier(newValue);
    }}
        />
                 
                </div>
                </div>
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
                            designationEN: Product.designationEN
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

                    <Form.Group className="mb-2">
                      <Form.Label>Taxes</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        value={newProduct.taxes}
                        onChange={(e) => setNewProduct({ ...newProduct, taxes: Number(e.target.value) })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Extra expenses</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        value={newProduct.extraExpenes}
                        onChange={(e) => setNewProduct({ ...newProduct, extraExpenes: Number(e.target.value) })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        type="text"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      />
                    </Form.Group>

                    <Form.Group className="mb-2">
                      <Form.Label>Total preview</Form.Label>
                      <Form.Control type="number" value={calculateSum(newProduct)} disabled />
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
                    disabled={!newProduct.idProduct || !newProduct.qnt || !newProduct.priceU}
                  >
                    OK
                  </Button>
                </Modal.Footer>
              </Modal>

              <Table   bordered hover variant="Default" className="mt-0" style={{direction:'ltr',minWidth:'300px'}}>
                <thead className="table-info" >
                  <tr>
                    <th>ID</th>
                    <th>Barcode</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Unit price </th>
                    <th>Taxes</th>
                    <th>Extra expenses</th>
                    <th>Description</th>
                    <th>Price</th>
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
                        <td>{Product.qnt }</td>
                        <td>{Product.priceU}</td>
                        <td>{Product.taxes}</td>
                        <td>{Product.extraExpenes}</td>
                        <td>{Product.description}</td>
                        <td>{Product.priceT}</td>
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
              <div className="row my-2">
                                    <div className="row col col-md-10 col-lg-6 d-flex justify-content-between" style={{display:'flex', alignItems: 'center',direction:'ltr'}}>
                                    <div className="col col-md-4 col-lg-4 d-flex justify-content-between">
                                    <Form.Label className="mx-2">Total_Price:  </Form.Label>
                  <Form.Control style={{width:'80px'}}
                    type="number"
                    min="0"
                    value={totalPrice}
                    disabled
                  /></div>
                  {depot ? (''):(<>
                    <div className="col col-md-4 col-lg-4 d-flex justify-content-between">
                  <Form.Label className="mx-2">paid:  </Form.Label>
                  <Form.Control style={{width:'80px'}}
                    type="number"
                    min="0"
                    disabled={depot}
                    value={paid}
                    required
                    onChange={(e) =>
                      setPaid( e.target.value )
                    }
                  />
                  </div>
                  <div className="col col-md-4 col-lg-4 d-flex justify-content-between">
                   <Form.Label className="mx-2">Rest:  </Form.Label>
                  <Form.Control style={{width:'80px'}}
                    type="number"
                    min="0"
                    value={totalPrice-paid}
                    disabled
                  />
                  </div>
                  </>)}
                  </div>
                  </div>
                
              <div style={{display:'flex',justifyContent:'end',flexDirection: 'row-reverse'}}>
                                    
                                    <button className="btn btn-success mx-2" disabled={idSupplier==null || Products.length==0} type="submit" name="submit" value="submit" onClick={() => handleSave()}>Save</button>
                                    <button className="btn btn-danger mx-2"
                                    onClick={() => {
                                      navigate("/Receipt order", { replace: true })
      }}>Cancel</button>  
                                    </div>
           
            </Card.Body>
            
          </Card>
              
        </Col>
      </Row>
  );
};