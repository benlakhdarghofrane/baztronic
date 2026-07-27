import React, { useState } from "react";
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
import { Toggle } from "rsuite";
import "../../scss/user.css";
import { FaPencilAlt,  FaTrashAlt,FaPlus } from "react-icons/fa";
import MultiSelect from '../../components/MultSelectUser'

export default function GoodsManager  () {
  const defaultGood   = [
    {
        id: 1,
        good:'المادة الاولى',
        Unite: "كلغ",
        Quantite: "20",
        Unite_Price: "2000",
        Somme: 40000,
        Remarque: "لاشىء",
    },
    {
      id: 2,
      good:'المادة الثانية',
      Unite: "لتر",
      Quantite: "500",
      Unite_Price: "10",
      Somme: 5000,
      Remarque: "لاشىء",
    },
  ];

  const initCurrentGood = {
    id: null,
    good:'',
    Unite: "",
    Quantite: "",
    Unite_Price: "",
    Somme: null,
    Remarque: null,
  };

  const [goods, setGoods] = useState(defaultGood);
  const [show, setShow] = useState(false);
  const [New, setNew] = useState(initCurrentGood);
  const [showCreateBtn, setShowCreateBtn] = useState(true);
  const [editing, setEdit] = useState(false);
  const [good, setgood] = useState(['المادة الاولى','المادة الثانية', 'المادة الثالثة']);
  const [Remarque, setRemarque] = useState([1,2,3]);
  const [SelectedRemarque, setselectedRemarque] = useState([]);
  const handleClose = () => {
    setShow(false); 
    setEdit(!editing)  ;
  };
  const handleShow = () => {
    setShow(true);
    if(editing === false) {
      setNew(initCurrentGood);
    }
  };

  const onFormSubmit = (New) => {
    const id = goods.length + 1;
    setGoods([...goods, { ...New, id }]);
  };

  const onEdit = (New) => {
    setEdit(true);
    if(editing === true) {
      setNew({ ...New, New });
      handleShow();
    }
    
  };

  const onSubmit = (New) => {
    if (editing === true) {
      onUpdateUser(New);
    } else {
      onFormSubmit(New);
    }
  };

  const onUpdateUser = (New) => {
    setEdit(false);
    let id = New.id;
    setGoods(goods.map((i) => (i.id === id ? New : i)));
  };

  const onDeleteUser = (currentUser) => {
    setGoods(goods.filter((i) => i.id !== currentUser.id));
  };

  return (
      <Row>
        <Col>
          <Card className="customCard">
            <Card.Body style={{backgroundColor: 'white',overflow: 'auto'}}>
              <div className="d-flex justify-content-between customCardBody">
                <div>
                  <Card.Title>تخزين السلع</Card.Title>
                </div>
                <div className="d-flex">
                  <Toggle
                    className="userToggleBtn btnaction"
                    checked={showCreateBtn}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowCreateBtn(!showCreateBtn);
                    }}
                  />
                  {showCreateBtn ? (
                    <Button
                    className="btnaction"
                      variant="info"
                      onClick={handleShow}
                      title="Add"
                    >
                      <FaPlus />
                    </Button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <Table striped bordered hover variant="light">
                <thead className="table-info">
                  <tr>
                    <th>رقم.ت</th>
                    <th>تعيين المواد</th>
                    <th>الوحدة</th>
                    <th>الكمية</th>
                    <th>ثمن الوحدة</th>
                    <th>المجموع</th>
                    <th>ملاحظة</th>
                    <th>العملية</th>
                  </tr>
                </thead>
                <tbody>
                  {goods.length > 0 ? (
                    goods.map((user, index) => (

                      <tr key={index}>
                        <td>{user.id}</td>
                        <td>{user.good}</td>
                        <td>{user.Unite}</td>
                        <td>{user.Quantite}</td>
                        <td>{user.Unite_Price}</td>
                        <td>{user.Somme}</td>
                        <td>{user.Remarque}</td>
                        <td style ={{display:'flex',justifyContent:'center'}}>
                        <div style={{display: 'flex'}}>
                          <Button
                          className="btnaction"
                            variant="info"
                            title="Edit details"
                            onClick={() => onEdit(user)}
                          >
                            <FaPencilAlt />
                          </Button>
                          <Button
                          className="btnaction"
                            variant="danger"
                            title="Delete"
                            onClick={() => onDeleteUser(user)}
                          >
                            <FaTrashAlt />
                          </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        No Goods found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <Modal size="lg" show={show} onHide={handleClose}>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit(New);
              }}
            >
              <Modal.Header closeButton>
                {
                  editing === true 
                  ? <Modal.Title>تعديل سلعة</Modal.Title>
                  : <Modal.Title>إضافة سلعة</Modal.Title>
                }
              </Modal.Header>
              <Modal.Body style={{direction:'rtl'}}>
              <Form.Group className="mb-3">
                  <Form.Label>تعيين المادة</Form.Label>
                  <Form.Select
                    value={New.good}
                    onChange={(e) =>
                      setNew({ ...New, good: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    {good.length
                      ? good.map((val, index) => (
                          <option key={index} value={val}>
                            {val}
                          </option>
                        ))
                      : null}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicName">
                  <Form.Label>الوحدة</Form.Label>
                  <Form.Control
                    type="text"
                    value={New.Unite}
                    required
                    onChange={(e) =>
                      setNew({ ...New, Unite: e.target.value })
                    }
                    placeholder=""
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAddress">
                  <Form.Label>الكمية</Form.Label>
                  <Form.Control
                    type="number"
                    value={New.Quantite}
                    onChange={(e) =>
                      setNew({ ...New, Quantite: e.target.value })
                    }
                    placeholder=""
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAge">
                  <Form.Label>ثمن الوحدة</Form.Label>
                  <Form.Control
                    type="number"
                    value={New.Unite_Price}
                    onChange={(e) =>
                      setNew({ ...New, Unite_Price: e.target.value })
                    }
                    placeholder=""
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>المجموع</Form.Label>
                  <Form.Control
                    type="number"
                    value={New.Somme}
                    onChange={(e) =>
                      setNew({ ...New, Somme: e.target.value })
                    }
                    placeholder=""
                  />
                                     
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>ملاحظة</Form.Label>
                  <Form.Control
                    type="text"
                    value={New.Remarque}
                    onChange={(e) =>
                      setNew({ ...New, Remarque: e.target.value })
                    }
                    placeholder=""
                  />
                  
                </Form.Group>
              </Modal.Body>
              <Modal.Footer style={{direction:'rtl'}}>
                <Button variant="secondary" onClick={handleClose}>
                  رجوع
                </Button>
                {editing === true ? (
                  <Button variant="primary" type="submit" onClick={handleClose}>
                    حفظ
                  </Button>
                ) : (
                  <Button variant="primary" disabled={!New.Unite} type="submit" onClick={handleClose}>
                  حفظ
                  </Button>
                )}
              </Modal.Footer>
            </Form>
          </Modal>
        </Col>
      </Row>
  );
};