import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import AlertErr from '../../../components/AlertErr'
import { BsSearch } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import {  FaPencilAlt, FaTrashAlt, FaPlus } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import Barcode from 'react-barcode';
import "../../../scss/user.css";
import "../../../scss/loading.css";
import '../../../scss/print.css';
import { useLocation } from "react-router-dom";
import axiosClient from "../../../axios-client";
import Alertform from "../../../components/Alert";

export default function ProductsManager() {
  const location = useLocation();
const [showFilters, setShowFilters] = useState(false);

const navigate = useNavigate();
const [selectedMarqueFilter, setSelectedMarqueFilter] = useState(null);
const [selectedModelFilter, setSelectedModelFilter] = useState(null);
const [selectedStatusFilter, setSelectedStatusFilter] = useState(null);
const [selectedscreenFilter, setSelectedscreenFilter] = useState(null);
const [selectedhousingFilter, setSelectedhousingFilter] = useState(null);
const [selectedchargeFilter, setSelectedchargeFilter] = useState(null);
const [selectedbatteryFilter, setSelectedbatteryFilter] = useState(null);
const [selectedlockFilter, setSelectedlockFilter] = useState(null);
  const [showerr,setshowerr]=useState(false);
  const [Err,setErr]=useState("");
  const [Lot, setLot] = useState(location.state?.lot || null);
  const [device_count, setdevice_count] = useState(location.state?.lot?.device_count || null);
   const [category, setcategory] = useState(location.state?.lot?.device_type?.id || null);
  const [loading, setLoading] = useState(false);
  const [refresh, setrefresh] = useState(false);

 const [selectmarq, setselectmarq] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [show, setShow] = useState(false);

  const [Models, setModels] = useState([]);
  const [Modelsfilter, setModelsfilter] = useState([]);
  const [Marques, setMarques] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteitem, setDeleteitem] = useState(null);

  const [showAlert, setShowAlert] = useState(false);

  const [searchvalue, setsearchvalue] = useState("");

  const [Products, setProducts] = useState([]);
  const [Cats, setCats] = useState([]);
const statusOptions = [
  { value: "On stock", label: "On stock" },
  { value: "On repair", label: "On repair" },
  { value: "Total loss", label: "Total loss / Perte totale" },
  { value: "Ready For sell", label: "Ready For sell" },
];
const lockOptions = [
  { value: "locked", label: "locked" },
  { value: "unlocked", label: "unlocked" },
];
const chargeOptions = [
  { value: "Charge", label: "Charge" },
  { value: "No charge", label: "No charge" },
];

const batteryOptions = [
  { value: "Good", label: "Good" },
  { value: "Bad", label: "Bad" },
  { value: "Unknown", label: "Unknown" },
];

const screenStateOptions = [
  { value: "a changer", label: "a changer" },
  { value: "bon", label: "bon" },
  { value: "Fissuré", label: "Fissuré" },
  { value: "rayé", label: "rayé" },
];

const housingStateOptions = [
  { value: "bon", label: "bon" },
  { value: "cassé", label: "cassé" },
];
const screentauchOptions = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
];
const systemOptions = [
  { value: "Windows", label: "Windows" },
  { value: "Linux", label: "Linux" },
  { value: "Mac", label: "Mac" },
];
  const emptyProduct = {
    refernce: "",
    barcode: "",
    imei: "",
    serial_number: "",
    designationEN: "",
    quantity: 1,
    purchase_price: "",
    sale_price: "",
    id_lot: Lot?.id || "",
    marque: "",
    model: "",
    idUser: "",
    description: "",
    ram: "",
    color:"",
    tauchscreen:"",
    operatingsystem:"",
    conditions:"",
    keyboard:"",
    processeur: "",
    stokage: "",
    screen: "",
    battery: "",
    carteGraphique: "",
    min_quantity: 0,
    max_quantity: 0,
    status: 'On stock',
  lock_status: "",
  screen_state: "",
  housing_state: "",
  charge_state:"",
  battrystate:""
  };

  const [newProduct, setNewProduct] = useState(emptyProduct);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "180px",
    }),
  };

    const getMarques=()=>{
    setLoading(true)
axiosClient.get('/mareques/marequesbycategory/'+Lot?.device_type?.id).then(({data})=>{  

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
},[Lot?.device_type?.id])
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
const getModelfilter=()=>{
  setLoading(true)
axiosClient.get('/models/modelsbymareques/'+selectedMarqueFilter?.value).then(({data})=>{  

if (data.data){
const options = data.data.map((cat) => ({
  value: cat.id,
  label: cat.name,
}));
setModelsfilter(options);
  setLoading(false)
}
}).catch((err)=>{
setLoading(false)
setErr(err);
setshowerr(true);
})
}
useEffect(()=>{
getModelfilter();
},[selectedMarqueFilter])

  const getProducts = (page, search = "") => {
    setLoading(true);
const marque = selectedMarqueFilter?.value || 0;
const model = selectedModelFilter?.value || 0;
const status = selectedStatusFilter?.value || "all";
const lock = selectedlockFilter?.value || "all";
const screen = selectedscreenFilter?.value || "all";
const housing = selectedhousingFilter?.value || "all";
const charge = selectedchargeFilter?.value || "all";
const battery = selectedbatteryFilter?.value || "all";

let url = `/productlot/${Lot?.id}/${marque}/${model}/${status}/${lock}/${screen}/${housing}/${charge}/${battery}?page=${page}`;

if (search!=="") {
    url = `/productlot/${Lot?.id}/${marque}/${model}/${status}/${lock}/${screen}/${housing}/${charge}/${battery}/${search}?page=${page}`;
}
   

    axiosClient
      .get(url)
      .then(({ data }) => {
        if (data.data) {
          setProducts(data.data);
          setTotalPages(data.meta.last_page);
        }

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getProducts(currentPage, searchvalue);
  }, [refresh, currentPage, searchvalue,selectedMarqueFilter,selectedModelFilter,selectedStatusFilter,selectedlockFilter,selectedscreenFilter,selectedhousingFilter,selectedchargeFilter,selectedbatteryFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
const getPageNumbers = () => {
  const pages = new Set();

  // First 3 pages
  pages.add(1);
  pages.add(2);
  pages.add(3);

  // Current page and neighbors
  pages.add(currentPage - 1);
  pages.add(currentPage);
  pages.add(currentPage + 1);

  // Last 3 pages
  pages.add(totalPages);
  pages.add(totalPages - 1);
  pages.add(totalPages - 2);

  // Keep valid pages only
  const sortedPages = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result = [];

  for (let i = 0; i < sortedPages.length; i++) {
    if (
      i > 0 &&
      sortedPages[i] - sortedPages[i - 1] > 1
    ) {
      result.push("...");
    }
    result.push(sortedPages[i]);
  }

  return result;
};
  const handleClose = () => {
    setShow(false);
  };

  const onAddProduct = () => {
    setNewProduct(emptyProduct);
    setShow(true);
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
    setNewProduct({ ...newProduct, marque: selectedOption.value,designationEN:selectedOption.label+' '+handelgetmodel(newProduct.model) });
    setselectmarq( selectedOption.value );
  };
  const handleModelChange = (selectedOption) => {
    setNewProduct({ ...newProduct, model: selectedOption.value,designationEN:handelgetmarque(newProduct.marque)+' '+selectedOption.label });
  };
  const onEdit = (product) => {
    setselectmarq(product.marque);
    setNewProduct({
      ...product,
      purchase_price: product.purchase_price || product.purchasePrice,
      sale_price: product.sale_price || product.salePrice,
    });

    setShow(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (newProduct.id) {
      onUpdateProduct();
    } else {
      onCreateProduct();
    }
  };

  const onCreateProduct = () => {
    setLoading(true);

    axiosClient
      .post("/productsLot", newProduct)
      .then((response) => {
        setLoading(false);
        setShow(false);
        setdevice_count(response.data.lot.device_count);
        setcategory(response.data.lot.device_type);
        setShowAlert(true);
        setrefresh(!refresh);
      })
      .catch((err) => {
       // console.log(err);
        setLoading(false);
      });
  };

  const onUpdateProduct = () => {
    setLoading(true);

    axiosClient
      .put(`/productsLot/${newProduct.id}`, newProduct)
      .then(() => {
        setLoading(false);
        setShow(false);
        setShowAlert(true);
        setrefresh(!refresh);
      })
      .catch((err) => {
       // console.log(err);
        setLoading(false);        
      setErr(err.response.data.message);
      setshowerr(true);
      });
  };

  const handeldeleteitem = (product) => {
    setDeleteitem(product);
    setOpenModal(true);
  };

  const onDeleteProduct = () => {
    setLoading(true);
    //console.log(deleteitem);
    axiosClient
      .delete(`/productsLot/${deleteitem.id}`)
      .then(() => {
        setLoading(false);
        setOpenModal(false);
        setShowAlert(true);        
        setdevice_count(device_count-1);
        setrefresh(!refresh);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  if (!Lot) {
    return <div>No Lot Selected</div>;
  }
  return (
    <Row>
      <AlertErr setShowAlert={setshowerr} showAlert={showerr} err={Err}/>
      <Alertform
        setShowAlert={setShowAlert}
        showAlert={showAlert}
      />

      <Col>
       <Card className="mb-3">
        <Card.Body>
          <h4>Lot Informations</h4>

          <Table bordered>
            <thead className="table-info">
              <tr>
                <th>Lot</th>
                <th>Category</th>
                <th>Supplier</th>
                <th>Date</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Devices Count</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>{Lot.reference}</td>
                <td>{Lot.device_type?.designationEN ?? ""}</td>
                <td>{Lot.supplier?.fullname ?? ""}</td>
                <td>{Lot.entry_date ?? ""}</td>
                <td>{Lot.price ?? ""}</td>
                <td>{Lot.quantity ?? ""}</td>
                <td>{device_count ?? ""}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
        <Card
          className="customCard"
          style={{ borderRadius: "15px" }}
        >
          <Card.Body
            style={{
              backgroundColor: "white",
              overflow: "auto",
              borderRadius: "15px",
              minHeight:"600px"
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <Card.Title>Products</Card.Title>

             
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
              
              <Form.Group>
                <div className="position-relative">
                  <div className="position-absolute top-50 start-0 translate-middle-y mx-2">
                    <BsSearch />
                  </div>

                  <Form.Control
                    type="text"
                    placeholder="Search"
                    style={{
                      paddingLeft: "2.5rem",
                    }}
                    onChange={(e) =>
                      setsearchvalue(e.target.value)
                    }
                  />
                </div>
              </Form.Group>
              <Button
  variant="secondary"
  className="btnaction"
  onClick={() => window.print()}
>
  Print A4
</Button>
 
<div className="d-flex justify-content-between align-items-center mb-3">
  
                <div className="position-relative">
  <Button
    variant="outline-primary"
    onClick={() => setShowFilters(!showFilters)}
  >
    Filters
  </Button>

  {showFilters && (
    <Card
      className="p-3 position-absolute"
      style={{
        top: "45px",
        left: 0,
        width: "280px",
        zIndex: 1000000,
      }}
    >
      <Form.Group className="mb-3">
        <Form.Label>Marque</Form.Label>
        <Select
          options={Marques}
          value={selectedMarqueFilter}
          onChange={(option) => {
            setSelectedMarqueFilter(option);
            setSelectedModelFilter(null);
          }}
          isClearable
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Model</Form.Label>
        <Select
          options={Modelsfilter}
          value={selectedModelFilter}
          onChange={setSelectedModelFilter}
          isClearable
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Select
          options={statusOptions}
          value={selectedStatusFilter}
          onChange={setSelectedStatusFilter}
          isClearable
        />
      </Form.Group>
         <Form.Group className="mb-3">
        <Form.Label>Screen state</Form.Label>
        <Select
          options={screenStateOptions}
          value={selectedscreenFilter}
          onChange={setSelectedscreenFilter}
          isClearable
        />
      </Form.Group>
         <Form.Group className="mb-3">
        <Form.Label>Housing state</Form.Label>
        <Select
          options={housingStateOptions}
          value={selectedhousingFilter}
          onChange={setSelectedhousingFilter}
          isClearable
        />
      </Form.Group>
         <Form.Group className="mb-3">
        <Form.Label>Charge state</Form.Label>
        <Select
          options={chargeOptions}
          value={selectedchargeFilter}
          onChange={setSelectedchargeFilter}
          isClearable
        />
      </Form.Group>
   <Form.Group className="mb-3">
        <Form.Label>Battery state</Form.Label>
        <Select
          options={batteryOptions}
          value={selectedbatteryFilter}
          onChange={setSelectedbatteryFilter}
          isClearable
        />
      </Form.Group>
         <Form.Group className="mb-3">
        <Form.Label>Lock/Unlock</Form.Label>
        <Select
          options={lockOptions}
          value={selectedlockFilter}
          onChange={setSelectedlockFilter}
          isClearable
        />
      </Form.Group>
      <Button
        variant="light"
        onClick={() => {
          setSelectedMarqueFilter(null);
          setSelectedModelFilter(null);
          setSelectedStatusFilter(null);
          setSelectedscreenFilter(null);
          setSelectedhousingFilter(null);
          setSelectedchargeFilter(null);
          setSelectedbatteryFilter(null);
          setSelectedlockFilter(null);
          setShowFilters(false);
        }}
      >
        Clear
      </Button>
    </Card>
  )}
</div>
<Button
                              className="btnaction"
                              variant="info"
                              title="Edit Lot details"
                              onClick={() => {
                                navigate("/Product Lot print", { state: { lot: Lot }, replace: true })
                              }}
                            >print by product</Button>
               <Button
                className="btnaction"
                variant="info"
                onClick={onAddProduct}
              >
                <FaPlus />
              </Button>
              </div>
              </div>

            <div
              style={{
                maxWidth: "100%",
                overflow: "auto",
              }}
            >
              <div id="print-section" className="print-a4">
  {Products.slice(0, 16).map((p, i) => (
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
              <Table bordered hover dir="ltr">
                <thead className="table-info">
                  <tr>
                    <th>Barcode</th>
                    <th>Designation</th>
                     {(Number(category) === 2 || Number(category) === 12) && (
                          <th>Color</th>
                        )} 
                         {(Number(category) === 2 ||Number(category) === 12) && (
                          <th>IMEI</th>
                        )} 
                      {Number(category) === 1 && (
                          <th>Serial Number</th>
                        )}
                    <th>Description</th>
                    <th>Status</th>
                    <th>Lock / Unlock</th>
                    <th>Screen state</th>
                    <th>Housing state</th>
                    <th>charge state</th>
                    <th>battry state</th>
                    <th>Purchase Price</th>
                    <th>Sale Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {Products.length > 0 ? (
                    Products.map((Product, index) => (
                      <tr key={index}>


                        <td>{Product.barcode}</td>
                        
                        <td>
                          {Product.designationEN}
                        </td>
                       {(Number(category) === 2 || Number(category) === 12) && (
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
                         )}
                         {(Number(category) === 2 || Number(category) === 12) &&  (
                          <td>{Product.imei}</td>
                        )}
                        {Number(category) === 1 && (
                          <td>{Product.serial_number}</td>
                        )}
                        <td>
                          {Product.description}
                        </td>

                        <td>
                          {Product.status}
                        </td>

                        <td>
                          {Product.lock_status}
                        </td>
                        <td>
                          {Product.screen_state}
                        </td>
                        <td>
                          {Product.housing_state}
                        </td>
                         <td>
                          {Product.charge_state}
                        </td>
                         <td>
                          {Product.battrystate}
                        </td>
                        <td>
                          {Product.purchase_price ||
                            Product.purchasePrice}
                        </td>

                        <td>
                          {Product.sale_price ||
                            Product.salePrice}
                        </td>


                        <td
                          style={{
                            display: "flex",
                            gap: "10px",
                            justifyContent: "center",
                          }}
                        >
                          <Button
                            variant="info"
                            className="btnaction"
                            onClick={() =>
                              onEdit(Product)
                            }
                          >
                            <FaPencilAlt />
                          </Button>

                          <Button
                            variant="danger"
                            className="btnaction"
                            onClick={() =>
                              handeldeleteitem(Product)
                            }
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={14}
                        className="text-center"
                      >
                        {loading ? (
                          <div className="spinner-container">
                            <div className="spinner"></div>
                          </div>
                        ) : (
                          "No Products found."
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {/* PAGINATION */}

            {totalPages > 1 && (
              <div className="d-flex justify-content-center">
                <ul
                  className="pagination"
                  style={{
                    listStyle: "none",
                    display: "flex",
                    gap: "5px",
                    direction:"ltr"
                  }}
                >
                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() =>
                        handlePageChange(
                          Math.max(
                            1,
                            currentPage - 1
                          )
                        )
                      }
                    >
                      «
                    </button>
                  </li>

                 {getPageNumbers().map((page, index) => (
  <li
    key={index}
    className={`page-item ${
      page === currentPage ? "active" : ""
    }`}
  >
    {page === "..." ? (
      <span className="page-link">...</span>
    ) : (
      <button
        className="page-link"
        onClick={() => handlePageChange(page)}
      >
        {page}
      </button>
    )}
  </li>
))}

                  <li className="page-item">
                    <button
                      className="page-link"
                      onClick={() =>
                        handlePageChange(
                          Math.min(
                            totalPages,
                            currentPage + 1
                          )
                        )
                      }
                    >
                      »
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* DELETE MODAL */}

        <Modal
          show={openModal}
          onHide={() => setOpenModal(false)}
          centered
        >
          <Modal.Header closeButton />

          <Modal.Body>
            <div className="text-center">
              <h4>
                Are you sure you want to delete this
                product?
              </h4>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <Button
                  variant="danger"
                  onClick={onDeleteProduct}
                >
                  Yes
                </Button>

                <Button
                  variant="secondary"
                  onClick={() =>
                    setOpenModal(false)
                  }
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        {/* ADD / EDIT MODAL */}

        <Modal
          size="lg"
          show={show}
          onHide={handleClose}
        >
          <Form onSubmit={onSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>
                {newProduct.id
                  ? "Edit Product"
                  : "Add Product"}
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>

              {/* DESIGNATION 

              <Form.Group className="mb-3">
                <Form.Label>
                  Designation
                </Form.Label>

                <Form.Control
                  type="text"
                  value={
                    newProduct.designationEN
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      designationEN:
                        e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>*/}
<Form.Group className="mb-3">
  <Form.Label>Marque</Form.Label>

  <Select
    options={Marques}
    onChange={handleMarqueChange}
    value={Marques.find(
      (option) => option.value === Number(newProduct.marque)
    )}
    placeholder="Select"
    isSearchable
    required
  />
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Model</Form.Label>

  <Select
    options={Models}
    onChange={handleModelChange}
    value={Models.find(
      (option) => option.value === Number(newProduct.model)
    )}
    placeholder="Select"
    isSearchable
    required
  />
</Form.Group>
              {/* DESCRIPTION */}

              <Form.Group className="mb-3">
                <Form.Label>
                  Description
                </Form.Label>

                <Form.Control
                  type="text"
                  value={
                    newProduct.description
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description:
                        e.target.value,
                    })
                  }
                />
              </Form.Group>
<Form.Group className="mb-3">
  <Form.Label>Status</Form.Label>

  <Select
    options={statusOptions}
    placeholder="Select status"
    value={statusOptions.find(
      (option) => option.value === newProduct.status
    )}
    onChange={(selectedOption) =>
      setNewProduct({
        ...newProduct,
        status: selectedOption.value,
      })
    }
    required={true}
  />
</Form.Group>
              {/* RAM */}
            {newProduct.status === "Ready For sell" && (
              <>
              {(Number(newProduct.lot?.device_type) === 2 || Number(newProduct.lot?.device_type) === 12)&& (
                <Form.Group className="mb-3">
                <Form.Label>IMEI</Form.Label>
                <Form.Control
                  required={newProduct.status === "Ready For sell" && (Number(newProduct.lot?.device_type) === 2 || Number(newProduct.lot?.device_type) === 12)}
                  type="text"
                  value={newProduct.imei}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      imei: e.target.value,
                    })
                  }
                />
              </Form.Group>)}
              {Number(newProduct.lot?.device_type) === 1 && (
                <Form.Group className="mb-3">
                <Form.Label>Serial Number</Form.Label>

                <Form.Control
                required={newProduct.status === "Ready For sell" && Number(newProduct.lot?.device_type) === 1}
                  type="text"
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
                <Form.Label>Ram</Form.Label>

                <Form.Control
                required={newProduct.status === "Ready For sell"}
                  type="text"
                  value={newProduct.ram}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      ram: e.target.value,
                    })
                  }
                />
              </Form.Group>
              {Number(newProduct.lot?.device_type) === 1 && (
              <Form.Group className="mb-3">
                <Form.Label>
                  Processeur
                </Form.Label>

                <Form.Control
                required={newProduct.status === "Ready For sell" && Number(newProduct.lot?.device_type) === 1}
                  type="text"
                  value={
                    newProduct.processeur
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      processeur:
                        e.target.value,
                    })
                  }
                />
              </Form.Group>
)}
              <Form.Group className="mb-3">
                <Form.Label>
                  Storage
                </Form.Label>

                <Form.Control
                required={newProduct.status === "Ready For sell"}
                  type="text"
                  value={
                    newProduct.stokage
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      stokage:
                        e.target.value,
                    })
                  }
                />
              </Form.Group>
              {Number(newProduct.lot?.device_type) === 1 && (
              <Form.Group className="mb-3">
                <Form.Label>
                  Screen
                </Form.Label>

                <Form.Control
                required={newProduct.status === "Ready For sell" && Number(newProduct.lot?.device_type) === 1}
                  type="text"
                  value={newProduct.screen}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      screen:
                        e.target.value,
                    })
                  }
                />
              </Form.Group>
)}
              <Form.Group className="mb-3">
                <Form.Label>
                  Battery Health (%)
                </Form.Label>

                <Form.Control
                required={newProduct.status === "Ready For sell"}
                  type="text"
                  value={
                    newProduct.battery
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      battery:
                        e.target.value,
                    })
                  }
                />
              </Form.Group>
  {Number(newProduct.lot?.device_type) === 1 &&(
              <Form.Group className="mb-3">
                <Form.Label>
                  Graphique Card
                </Form.Label>

                <Form.Control
                required={newProduct.status === "Ready For sell"&&  Number(newProduct.lot?.device_type) === 1}
                  type="text"
                  value={
                    newProduct.carteGraphique
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      carteGraphique:
                        e.target.value,
                    })
                  }
                />
              </Form.Group>
                )}
                {(Number(newProduct.lot?.device_type) === 2 || Number(newProduct.lot?.device_type) === 12) && (
              <Form.Group className="mb-3">
                <Form.Label>
                  Condition (A/B/C)
                </Form.Label>

                <Form.Control
                required={newProduct.status === "Ready For sell"&& (Number(newProduct.lot?.device_type) === 2 || Number(newProduct.lot?.device_type) === 12)}
                  type="text"
                  value={
                    newProduct.conditions
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      conditions:
                        e.target.value,
                    })
                  }
                />
              </Form.Group>
                )}
{(Number(newProduct.lot?.device_type) === 2 || Number(newProduct.lot?.device_type) === 12) && (
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
)}
{newProduct.lot?.device_type === 1 &&(
  <>
              <Form.Group className="mb-3">
                <Form.Label>
                  Keyboard Layout
                </Form.Label>

                <Form.Control
                required={false}
                  type="text"
                  value={
                    newProduct.keyboard
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      keyboard:
                        e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Tauch Screen
                </Form.Label>

      <Select
    options={screentauchOptions}
    placeholder="Select"
    value={screentauchOptions.find(
      (option) => option.value === newProduct.tauchscreen
    )}
    onChange={(selectedOption) =>
      setNewProduct({
        ...newProduct,
        tauchscreen: selectedOption.value,
      })
    }
  />
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label>
                  Operating System
                </Form.Label>

                  <Select
    options={systemOptions}
    placeholder="Select"
    value={systemOptions.find(
      (option) => option.value === newProduct.operatingsystem
    )}
    onChange={(selectedOption) =>
      setNewProduct({
        ...newProduct,
        operatingsystem: selectedOption.value,
      })
    }
  />
              </Form.Group>
              </>
                )}
              <Form.Group className="mb-3">
                <Form.Label>
                  Purchase Price
                </Form.Label>

                <Form.Control
                required={newProduct.status === "Ready For sell"}
                  type="number"
                  value={
                    newProduct.purchase_price
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      purchase_price:
                        e.target.value,
                    })
                  }
                />
              </Form.Group>


              <Form.Group className="mb-3">
                <Form.Label>
                  Sale Price
                </Form.Label>

                <Form.Control
                required={newProduct.status === "Ready For sell"}
                  type="number"
                  value={
                    newProduct.sale_price
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      sale_price:
                        e.target.value,
                    })
                  }
                />
              </Form.Group>
                </>
            )}
              
{newProduct.status !== "Ready For sell" && (
              <>
<Form.Group className="mb-3">
  <Form.Label>Lock / Unlock</Form.Label>

  <Select
    options={lockOptions}
    placeholder="Select"
    value={lockOptions.find(
      (option) => option.value === newProduct.lock_status
    )}
    onChange={(selectedOption) =>
      setNewProduct({
        ...newProduct,
        lock_status: selectedOption.value,
      })
    }
     required={true}
  />
</Form.Group>
<Form.Group className="mb-3">
  <Form.Label>Screen state</Form.Label>

  <Select
    options={screenStateOptions}
    placeholder="Select"
    value={screenStateOptions.find(
      (option) => option.value === newProduct.screen_state
    )}
    onChange={(selectedOption) =>
      setNewProduct({
        ...newProduct,
        screen_state: selectedOption.value,
      })
    }
     required={true}
  />
</Form.Group>
<Form.Group className="mb-3">
  <Form.Label>Housing state</Form.Label>

  <Select
    options={housingStateOptions}
    placeholder="Select"
    value={housingStateOptions.find(
      (option) => option.value === newProduct.housing_state
    )}
    onChange={(selectedOption) =>
      setNewProduct({
        ...newProduct,
        housing_state: selectedOption.value,
      })
    }
     required={true}
  />
</Form.Group>
<Form.Group className="mb-3">
  <Form.Label>Charge state</Form.Label>

  <Select
    options={chargeOptions}
    placeholder="Select"
    value={chargeOptions.find(
      (option) => option.value === newProduct.charge_state
    )}
    onChange={(selectedOption) =>
      setNewProduct({
        ...newProduct,
        charge_state: selectedOption.value,
      })
    }
     required={true}
  />
</Form.Group>
<Form.Group className="mb-3">
  <Form.Label>Battry state</Form.Label>

  <Select
    options={batteryOptions}
    placeholder="Select"
    value={batteryOptions.find(
      (option) => option.value === newProduct.battrystate
    )}
    onChange={(selectedOption) =>
      setNewProduct({
        ...newProduct,
        battrystate: selectedOption.value,
      })
    }
     required={true}
  />
</Form.Group>
</>
            )}
            </Modal.Body>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                type="submit"
              >
                {newProduct.id
                  ? "Update"
                  : "Save"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
}