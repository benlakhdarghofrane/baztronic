import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import "../../../scss/user.css";
import '../../../scss/loading.css';
import { useNavigate } from 'react-router-dom';
import { BsSearch } from 'react-icons/bs';
import {  FaAlignJustify ,FaPencilAlt, FaTrashAlt, FaPlus } from "react-icons/fa";
import Select from 'react-select';
import axiosClient from '../../../axios-client';
import Alertform from '../../../components/Alert';

export default function LotsManager(props) {
  const add = props.add;
const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [searchvalue, setsearchvalue] = useState('');
  const [refresh, setrefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [Cats, setCats] = useState([]);
  const [Suppliers, setSuppliers] = useState([]);
  const [Lots, setLots] = useState([]);

  const [show, setShow] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deleteitem, setDeleteitem] = useState(null);
  const [editing, setEdit] = useState(false);

  const [newLot, setNewLot] = useState({ idcategory: '', name: '', supplierId: '', date: '', quantity: 1, note: '' });
  const [searchsupplier, setsearchsupplier] = useState('');

  async function getCats() {
    setLoading(true);
    try {
      const res = await axiosClient.get("/catigories");
      if (res.status === 200 && Array.isArray(res.data.data)) {
        const options = res.data.data.map((cat) => ({
          value: cat.id,
          label: cat.designationEN || cat.name || `#${cat.id}`,
        }));
        setCats(options);
      } else {
        setCats([]);
      }
    } catch (err) {
      setCats([]);
    } finally {
      setLoading(false);
    }
  }

  async function getSuppliers(search) {
    setLoading(true);
    try {
      const url = search === "" ? `/fournisseurs` : `/fournisseursFilter/${search}`;
      const res = await axiosClient.get(url);
      if (res.status === 200 && Array.isArray(res.data.data)) {
        const options = res.data.data.map((item) => ({
          value: item.id,
          label: item.fullname,
        }));
        setSuppliers(options);
      } else {
        setSuppliers([]);
      }
    } catch (err) {
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }

  const getLots = async (page = 1) => {
    setLoading(true);
    try {
      const url = searchvalue ? `/lots?search=${encodeURIComponent(searchvalue)}&page=${page}` : `/lots?page=${page}`;
      const res = await axiosClient.get(url);
      const data = res.data;
      if (data && Array.isArray(data.data)) {
        setLots(data.data);
        setTotalPages(data.meta ? data.meta.last_page : 1);
      } else {
        setLots([]);
        setTotalPages(1);
      }
    } catch (err) {
      setLots([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getCats(); }, []);
  useEffect(() => { getSuppliers(''); }, []);
  useEffect(() => { getLots(currentPage); }, [refresh, currentPage, searchvalue]);

  const handleClose = () => {
    setShow(false);
    setNewLot({ idcategory: '', name: '', supplierId: '', date: '', quantity: 1, note: '' });
    setEdit(false);
  };

  const handeldeleteitem = (lot) => {
    setDeleteitem(lot);
    setOpenModal(true);
  };

  const handleShow = () => {
    setShow(true);
    setEdit(false);
    setNewLot({ idcategory: '', name: '', supplierId: '', date: '', quantity: 1, note: '' });
  };

  const onFormSubmit = async (lot) => {
    setLoading(true);
    try {
      const payload = {
        device_type: lot.idcategory,
        name: lot.name,
        supplier: lot.supplierId || null,
        entry_date: lot.date || null,
        price: lot.price || 0,
        quantity: lot.quantity || 1,
        note: lot.note || '',
      };
      const res = await axiosClient.post('/lots', payload);
      if (res && res.data) {
        setShowAlert(true);
        setrefresh(!refresh);
        setShow(false);
      }
    } catch (err) {
      setrefresh(!refresh);
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (lot) => {
    setEdit(true);
    setNewLot({
      id: lot.id,
      idcategory: lot.device_type.id ?? lot.idcategory ?? '',
      name: lot.name ?? lot.Lot ?? lot.label ?? '',
      supplierId: lot.supplier.id ?? lot.supplierId ?? '',
      date: lot.entry_date ?? '',
      quantity: lot.quantity ?? 1,
      price: lot.price ?? 0,
      note: lot.note ?? lot.description ?? '',
    });
    setShow(true);
  };

  const onSubmit = (lot) => {
    if (editing === true && lot.id) {
      onUpdateLot(lot);
    } else {
      onFormSubmit(lot);
    }
  };

  const onUpdateLot = async (lot) => {
    setLoading(true);
    try {
      const payload = {
        idcategory: lot.idcategory,
        name: lot.name,
        supplierId: lot.supplierId || null,
        date: lot.date || null,
        note: lot.note || '',
        price: lot.price || 0,
        quantity: lot.quantity || 1,
      };
      const res = await axiosClient.put('/lots/' + lot.id, payload);
      if (res && res.data) {
        setShowAlert(true);
        setrefresh(!refresh);
        setShow(false);
      }
    } catch (err) {
      setrefresh(!refresh);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteLot = async (currentLot) => {
    if (!currentLot || !currentLot.id) {
      setOpenModal(false);
      return;
    }
    setOpenModal(false);
    setLoading(true);
    try {
      const res = await axiosClient.delete('/lots/' + currentLot.id);
      if (res && res.data) {
        setShowAlert(true);
        setrefresh(!refresh);
      }
    } catch (err) {
      setrefresh(!refresh);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (selectedOption) => {
    if (!selectedOption) {
      setNewLot({ ...newLot, idcategory: '' });
      return;
    }
    setNewLot({ ...newLot, idcategory: selectedOption.value });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Row>
      <Alertform setShowAlert={setShowAlert} showAlert={showAlert} />
      <Col>
        <Card className="customCard" style={{ borderRadius: '15px' }}>
          <Card.Body style={{ backgroundColor: 'white', overflow: 'auto', borderRadius: '15px' }}>
            <div className="d-flex mx-10">
              <Card.Title>Lots</Card.Title>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <Form.Group>
                <div className="position-relative">
                  <div className="position-absolute top-50 start-0 translate-middle-y mx-2">
                    <BsSearch />
                  </div>
                  <Form.Control
                    type="text"
                    required
                    onChange={(e) => {
                      setsearchvalue(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search"
                    className="form-control pl-5"
                    style={{ direction: "ltr", paddingLeft: '2.5rem' }}
                  />
                </div>
              </Form.Group>

              {add ? (
                <div className="d-flex">
                  <Button className="btnaction" variant="info" onClick={handleShow} title="Add Lot">
                    <FaPlus />
                  </Button>
                </div>
              ) : ('')}
            </div>

            <div style={{ maxWidth: '100%', overflow: 'auto', direction: 'ltr' }}>
              <Table bordered hover variant="Default" className="mt-0">
                <thead className="table-info">
                  <tr>
                    <th>ID</th>
                    <th>Reference</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Supplier</th>
                    <th>Date</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Devices Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Lots.length > 0 ? (
                    Lots.map((Lot, index) => (
                      <tr key={index}>
                        <td>{Lot.id}</td>
                        <td>{Lot.reference ?? ''}</td>
                        <td>{Lot.name}</td>
                        <td>{Lot.device_type.designationEN ?? ''}</td>
                        <td>{Lot.supplier.fullname ?? ''}</td>
                        <td>{Lot.entry_date ?? ''}</td>
                        <td>{Lot.quantity ?? ''}</td>
                        <td>{Lot.price ?? ''}</td>
                        <td>{Lot.device_count ?? ''}</td>
                        <td style={{ display: 'flex', justifyContent: 'center' }}>
                          <div style={{ display: 'flex' }}>
                            <Button
                              className="btnaction"
                              variant="info"
                              title="Edit Lot details"
                              onClick={() => {
                                navigate("/Product Lot", { state: { lot: Lot }, replace: true })
                              }}
                            >
                              <FaAlignJustify />
                            </Button>
                          <Button className="btnaction" variant="info" title="Edit Lot" onClick={() => onEdit(Lot)}>
                            <FaPencilAlt />
                            </Button>
                            <Button className="btnaction" variant="danger" title="Delete Lot" onClick={() => handeldeleteitem(Lot)}>
                              <FaTrashAlt />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center">
                        {loading ? (
                          <div className="spinner-container">
                            <div className="spinner"></div>
                          </div>
                        ) : ('No Lot found.')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ul className="pagination" style={{ direction: 'ltr', display: 'flex', justifyContent: 'start', listStyle: 'none', padding: 0 }}>
                  <li className="page-item">
                    <button className="page-link" onClick={() => handlePageChange(Math.max(1, currentPage - 1))}>«</button>
                  </li>
                  {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>{page}</button>
                    </li>
                  ))}
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
                  Are you sure you want to delete this Lot?
                </h3>
                <div className="d-flex justify-content-start gap-4">
                  <Button variant="danger" onClick={() => onDeleteLot(deleteitem)}>{"Yes, I'm sure"}</Button>
                  <Button variant="secondary" onClick={() => setOpenModal(false)}>No, cancel</Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </Card>

        <Modal size="lg" show={show} onHide={handleClose}>
          <Form onSubmit={(e) => { e.preventDefault(); onSubmit(newLot); }}>
            <Modal.Header closeButton>
              {editing === true ? <Modal.Title>Edit Lot</Modal.Title> : <Modal.Title>Add Lot</Modal.Title>}
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Select
                  options={Cats}
                  onChange={(opt) => {
                    handleCategoryChange(opt);
                    setNewLot(prev => ({ ...prev, Category: opt ? opt.label : '' }));
                  }}
                  value={Cats.find(c => c.value === newLot.idcategory) || null}
                  placeholder="Select"
                  isSearchable
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Supplier</Form.Label>
                <Select
                  options={Suppliers}
                  onChange={(opt) => setNewLot(prev => ({ ...prev, supplierId: opt ? opt.value : '' }))}
                  value={Suppliers.find(s => s.value === newLot.supplierId) || null}
                  placeholder="Select supplier"
                  isSearchable
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Lot</Form.Label>
                <Form.Control
                  type="text"
                  value={newLot.name || ''}
                  required
                  onChange={(e) => setNewLot({ ...newLot, name: e.target.value })}
                  placeholder="Enter Lot Name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={newLot.date || ''}
                  onChange={(e) => setNewLot(prev => ({ ...prev, date: e.target.value }))}
                />
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={newLot.quantity || ''}
                  onChange={(e) => setNewLot(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </Form.Group>
             <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={newLot.price || ''}
                  onChange={(e) => setNewLot(prev => ({ ...prev, price: e.target.value }))}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newLot.note || ''}
                  onChange={(e) => setNewLot(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Optional note..."
                />
              </Form.Group>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              {editing === true ? (
                <Button variant="primary" type="submit">Update</Button>
              ) : (
                <Button variant="primary" type="submit">Add</Button>
              )}
            </Modal.Footer>
          </Form>
        </Modal>
      </Col>
    </Row>
  );
};