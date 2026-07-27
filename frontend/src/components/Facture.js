import React, { useRef, useState,useEffect } from "react";
import html2pdf from "html2pdf.js";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { faPrint } from "react-icons/fa";
import '../scss/fact.css'
import Barcode from 'react-barcode';
import logo from "../assets/images/logoFact.png";
import { useNavigate } from 'react-router-dom';
export default function Facture  (props) {
  const navigate = useNavigate();
    const bodyRef = useRef();
    const setHid=props.setHid;
    const factureid=props.factureid;
    const modepayment=props.modepayment;
    const garantie=props.garantie;
    const paid=props.paid;
    const client=props.client[0];
    const Products=props.Product;
   // console.log(Products)
    const setProducts=props.setProducts;
    const somme_partielle=props.somme_partielle;
    //const [taxes,settaxes]=useState(0);
    const mentant_total=props.mentant_total;
    //const [Products,setProducts]=useState([]);
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR');
    
    const generatecodebar = (codebar) => {
    
      return <Barcode width={2} height={70} displayValue={false} value={codebar} />;
  };
      const handlePrint = () => {
        const element = document.getElementById('printdiv');
        const pdfOptions = {
          margin: 10, // Adjust margins if needed
          filename: `${factureid}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', putOnlyUsedFonts: true },
         
        };
    
        // Use html2pdf to generate a PDF from the div with the specified options
        html2pdf(element, pdfOptions);
        
        
        navigate("/Sales Order", { replace: true })
        
      };
      
    return(
        <div className="body">
        <div style={{display:'flex',justifyContent:'end'}}>
                                    <button onClick={handlePrint} type="button" class="btn btn-primary">
                                     Print</button>
                                     
                                        
                                    </div>
        
<div  id='printdiv' className="bodyF" ref={bodyRef}>
    <div className="clearfix">
      <div  className="titleF">
        <img  src={logo}/>
        
      <h3>Facture # {factureid}</h3>
      </div>
      <div style={{display:'flex',justifyContent:'center'}}>{factureid ? (generatecodebar(factureid)):('')}</div>
      <div id="companyF" className="clearfix">
      
        <div><span>Enterprise:</span>Baztronic</div>
        <div><span>Adresse:</span><a>139 Boulevard Henri-Bourassa Est,</a><br/>
        <a style={{marginLeft:'60px'}}>Montréal, QC H3L 1B6, Canada</a></div>
        
        <div><span>Téléphone:</span>+1 (438)699-9074</div>
        <div><span>Email:</span>info@baztronic.ca</div>
      </div>
      {client? (
      <div id="projectF">
      
        <div><span>Client:</span> #{client.id}</div>
        <div><span>Nom:</span> {client.fullname}</div>
        <div><span>Adresse</span> {client.adresse}</div>
        <div><span>Email</span> {client.email}</div>
        <div><span>Téléphone</span> {client.phone}</div>
        <div><span>DATE</span> {formattedDate}</div>
      
        
      </div>
      ):('')}
    </div>
    <div>
      <table>
        <thead>
          <tr>
            <th colspan="3" className="grand total">Produit</th>
            <th>Prix Unitaire</th>
            <th>Qantité</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
        {Products ? (
          Products.length > 0 ? (
            Products.map((product, index) => (

          <tr key={index}>
            <td colspan="3" className="service">{product.designationEN} {product.processeur} {product.ram} {product.stokage} {product.screen} {product.battery} {product.carteGraphique}</td>
            <td className="unit">{modepayment=='Cash' ? (product.priceU/1.14975).toFixed(3):product.priceU}$</td>
            <td className="qty">{product.qnt}</td>
            <td className="total">{modepayment=='Cash' ? (product.price/1.14975).toFixed(3):product.price}$</td>
           </tr>))):('')
          ):('')
        }
          
          <tr>
          <td colspan="3"></td>
            <td colspan="2">Somme partielle</td>
            <td className="total">{modepayment=='Cash' ? (somme_partielle/1.14975).toFixed(3):somme_partielle}$</td>
          </tr>
          <tr>
          <td className="service" colspan="1">
            <div>TPS</div>
            <div>TVQ</div>
          </td>
          <td colspan="1">
            <div>5%</div>
            <div>9.975%</div>
          </td>
          <td colspan="1">
            <div>{modepayment=='Cash' ? (0.05 * somme_partielle/1.14975).toFixed(3):(0.05 * somme_partielle).toFixed(3)}$</div>
            <div>{modepayment=='Cash' ? (0.09975 * somme_partielle/1.14975).toFixed(3):(0.09975 * somme_partielle).toFixed(3)}$</div>
          </td>
            <td colspan="2">Taxes</td>
            <td className="total">{modepayment=='Cash' ? (0.14975 * somme_partielle/1.14975).toFixed(3):(0.14975 * somme_partielle).toFixed(3)}$</td>
          </tr>
          <tr>
            <td colspan="5" className="grand total">Montant Total</td>
            <td className="grand total">{mentant_total}$</td>
          </tr>
          <tr>
            <td colspan="5" className="grand total">Montant payé</td>
            <td className="grand total">{paid}$</td>
          </tr>
          <tr>
            <td colspan="5" className="grand total">montant retour</td>
            <td className="grand total">{paid-mentant_total}$</td>
          </tr>
        </tbody>
      </table>
      <div id="notices">
      {garantie !==0 ? (
        <div>
        <div>Remarque:</div>
        <div className="notice">
        Ce product est sous une garantie de {garantie} jours. Si in problème survient, vous pouvez contacter le vendeur afin de régler le problème ou d'échanger le produit pour un autre de la même valeur.
        </div>
        <div className="notice">
Nous ne faisons pas de remboursement, seulement la réparation du produit ou l'échange pour un autre de la même valeur.
        </div>
        </div>
        ):('')}
        <div id="fin">
          <a>Merci pour votre achat!</a><br/>
          <a>[Baztronic,+1 (438)699-9074,info@baztronic.ca]</a>
          
         </div>
      </div>
    </div>
    
  </div>
  
    </div>
    );};
  