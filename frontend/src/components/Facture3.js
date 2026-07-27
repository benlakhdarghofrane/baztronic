// Facture.jsx
import React, { useRef } from "react";
import html2pdf from "html2pdf.js";
import {
  FaPrint,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import "../scss/fact2.css";
import Barcode from "react-barcode";
import logo from "../assets/images/logoFact3.png";
import { useNavigate } from "react-router-dom";

export default function Facture(props) {
  const navigate = useNavigate();
  const printRef = useRef(null);

  const {
    setHid,
    factureid,
    enable_taxes,
    taxes,
    modepayment,
    garantie,
    paid,
    client,
    Product: Products = [],
    setProducts,
    somme_partielle = 0,
    mentant_total = 0,
  } = props;
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("fr-FR");

  const handlePrint = async () => {
    const element = printRef.current;
    if (!element) return;

const opt = {
  margin: 0,
  filename: `${factureid}.pdf`,

  image: {
    type: "jpeg",
    quality: 1,
  },

  html2canvas: {
    scale: 4,
    useCORS: true,
    letterRendering: true,
  },

  jsPDF: {
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  },

  pagebreak: {
    mode: ["css", "legacy"],
  },
};

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation error:", err);
    }

    navigate("/Sales Order", { replace: true });
  };

  const clientData = client.length ? client[0] : client;

  return (
    <div className="body">
      <div style={{ display: "flex", justifyContent: "flex-end", margin: "12px 0" }}>
        <button
          onClick={handlePrint}
          type="button"
          className="btn btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            cursor: "pointer",
          }}
        >
          <FaPrint />
          Print
        </button>
      </div>

      <div id="printdiv" ref={printRef} className="invoice-container">
        {/* HEADER */}
      <div className="invoice-header">

  {/* ROW 1 */}
  <div className="header-top">

    <img src={logo} alt="logo" className="logo" />

    <div className="facture-section">
      <h1 className="facture-title">FACTURE</h1>

      <div className="invoice-number">
        #{factureid}
      </div>
    </div>

  </div>

  {/* ROW 2 */}
  <div className="header-bottom">

    {/* COMPANY INFO */}
    <div className="company-info">

      <div className="info-row">
        <FaMapMarkerAlt className="icon-green" />

        <div>
          <div>139 Boulevard Henri-Bourassa Est</div>
          <div>Montréal, QC H3L 1B6, Canada</div>
        </div>
      </div>

      <div className="info-row">
        <FaPhoneAlt className="icon-green" />
        <span>+1 (514) 381-6368</span>
      </div>

      <div className="info-row">
        <FaEnvelope className="icon-green" />
        <span>info@baztronic.ca</span>
      </div>

    </div>

    {/* BARCODE */}
    <div className="barcode-section">

      <Barcode
        value={factureid || ""}
        width={1.5}
        height={50}
        displayValue={false}
      />

      <div className="barcode-text">
        {factureid}
      </div>

    </div>

    {/* META */}
    <div className="meta-section">

      <div className="meta-row">
        <span>Date :</span>
        <span>{formattedDate}</span>
      </div>

      <div className="meta-row">
        <span>Vendeur :</span>
        <span>Baztronic</span>
      </div>

      <div className="meta-row">
        <span>Mode paiement :</span>
        <span>{modepayment}</span>
      </div>

    </div>

  </div>

</div>

        {/* CLIENT */}
        <div className="client-section">
          <h2>CLIENT</h2>

          {clientData ? (
            <div className="client-grid">
              <div>ID Client :</div>
              <div>#{clientData.id}</div>

              <div>Nom :</div>
              <div>{clientData.fullname}</div>

              <div>Adresse :</div>
              <div>{clientData.adresse}</div>

              <div>Téléphone :</div>
              <div>{clientData.phone}</div>

              <div>Courriel :</div>
              <div>{clientData.email}</div>
            </div>
          ) : (
            <div style={{ fontSize: 14, color: "#666" }}>Aucun client renseigné</div>
          )}
        </div>

        {/* PRODUCTS */}
        <table className="product-table">
          <thead>
            <tr>
              <th>#</th>
              <th>PRODUIT</th>
              <th>IMEI/Serial Number</th>
              <th>QTÉ</th>
              <th>PRIX UNITAIRE</th>
              <th>TOTAL</th>
            </tr>
          </thead>

          <tbody>
            {Products && Products.length ? (
              Products.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td style={{ textAlign: "left", paddingLeft: 14 }}>
                    {product?.product ? product.product.designationEN : product.designationEN}
                  </td>
                 {product?.product ?
                 <td>{Number(product?.product?.idcategory===1 ? product.product.serial_number : product.product.imei)}</td>:
                 <td>{Number(product?.category?.id===1 ? product.serial_number : product.imei)}</td>}

                  <td>{product.quantity? product.quantity : product.qnt}</td>

                  <td>{Number(product.priceU || 0).toFixed(2)} $</td>

                  <td>{Number(product.price || 0).toFixed(2)} $</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: 16, textAlign: "center", color: "#666" }}>
                  Aucun produit
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* WARRANTY + TOTALS */}
        <div className="bottom-section">
         <div className="warranty-card">

  <div className="warranty-header">

    <IoShieldCheckmarkOutline className="shield-icon" />

    <div>

      <h3>GARANTIE</h3>

      <h2>{garantie} JOURS</h2>

      <p>
        À compter de la date de facturation
      </p>

    </div>

  </div>

  <hr />

  <div className="warranty-date">

    <strong>Date de début :</strong>

    <div className="warranty-value">
      {formattedDate}
    </div>

  </div>

  <hr />

  <div className="warranty-date">

    <strong>Date d'expiration :</strong>

    <div className="warranty-value">

      {new Date(
        Date.now() +
        Number(garantie || 0) *
        24 *
        60 *
        60 *
        1000
      ).toLocaleDateString("fr-FR")}

    </div>

  </div>

</div>

          <div className="totals-card">
            <div className="total-line">
              <span>SOUS-TOTAL</span>
              <span>{Number(somme_partielle || 0).toFixed(2)} $</span>
            </div>
            {enable_taxes===1 || enable_taxes===true? (<div className="total-line">
              <span>Taxes (14.975%)</span>
              <span>{Number(taxes || 0).toFixed(2)} $</span>
            </div>):('')}

            <div className="total-line">
              <span>MONTANT PAYÉ</span>
              <span>{Number(paid || 0).toFixed(2)} $</span>
            </div>

            <div className="total-line">
              <span>MONTANT RETOURNÉ</span>
              <span> {Math.max(0, Number(paid || 0) - Number(mentant_total || 0)).toFixed(2)} $</span>
            </div>

            <div className="grand-total">
              <span>TOTAL</span>
              <span>{Number(mentant_total || 0).toFixed(2)} $</span>
            </div>
          </div>
        </div>

        {/* CONDITIONS */}
        <div className="conditions">
          <h3>CONDITIONS</h3>

          <ul>
            <li>Aucun remboursement.</li>
            <li>Les retours sont soumis à une inspection.</li>
            <li>L'inspection peut prendre jusqu'à 48 heures.</li>
            <li>Garantie batterie : période d'essai de 7 jours.</li>
            <li>Les dommages physiques et liquides ne sont pas couverts.</li>
            <li>La garantie est valide avec la facture originale.</li>
            <li>Le numéro de série doit correspondre au produit vendu.</li>
          </ul>
        </div>

        <div className="footer">
          <h3>Merci pour votre achat !</h3>
          <p>Conservez cette facture pour toute réclamation de garantie.</p>
        </div>
      </div>
    </div>
  );
}
