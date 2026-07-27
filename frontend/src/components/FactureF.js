import React, { useRef, useState,useEffect } from "react";
import html2pdf from "html2pdf.js";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { faPrint } from "react-icons/fa";
import '../scss/fact.css'
import logo from "../assets/images/logoFact.png";
export default function Facture  (props) {
    const bodyRef = useRef();
    const setHid=props.setHid;
    const factureid=props.factureid;
    const modepayment=props.modepayment;
    const garantie=props.garantie;
    const paid=props.paid;
    const client=props.client;
    const Products=props.Product;
    const setProducts=props.setProducts;
    const somme_partielle=props.somme_partielle;
    //const [taxes,settaxes]=useState(0);
    const mentant_total=props.mentant_total;
    //const [Products,setProducts]=useState([]);
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('fr-FR');
    
    
      const handlePrint = () => {
        const element = document.getElementById('printdiv');
        const pdfOptions = {
          margin: 10, // Adjust margins if needed
          filename: 'myfile.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', putOnlyUsedFonts: true },
         
        };
    
        // Use html2pdf to generate a PDF from the div with the specified options
        html2pdf(element, pdfOptions);
        setHid(false);
        setProducts([]);
      };
      
    return(
        <div className="body">
        <div hidden style={{display:'flex',justifyContent:'end'}}>
                                    <button onClick={handlePrint} type="button" class="btn btn-primary">
                                     Print</button>
                                     
                                        
                                    </div>
        
<div  id='printdiv' className="bodyF" ref={bodyRef}>
    <div className="clearfix">
      <div  className="titleF">
        <img  src={logo}/>
        
      <h3>Facture # {factureid}</h3>
      </div>
      <div id="companyF" className="clearfix">
      
        <div><span>Enterprise:</span>Baztronic</div>
        <div><span>Adresse:</span><a>139 Boulevard Henri-Bourassa Est,</a><br/>
        <a style={{marginLeft:'60px'}}>Montréal, QC H3L 1B6, Canada</a></div>
        
        <div><span>Téléphone:</span>+1 (438)699-9074</div>
        <div><span>Email:</span>info@baztronic.ca</div>
      </div>
      {client? (
      <div id="projectF">
      
        <div><span>Fournisseur:</span> #{client.id}</div>
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
            <th className="service">Produit</th>
            <th className="desc">Déscription</th>
            <th>Prix Unitaire</th>
            <th>Qantité</th>
            <th>Taxes</th>
            <th>Extra Expenes</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
        {Products ? (
          Products.length > 0 ? (
            Products.map((product, index) => (

          <tr key={index}>
           
            <td className="service">{product.product.designationEN}</td>
            <td className="desc">{product.description}</td>
            <td className="unit">{product.priceU}$</td>
            <td className="qty">{product.quantity}</td>
            <td className="qty">{product.taxes}</td>
            <td className="qty">{product.extraExpenes}</td>
            <td className="total">{product.priceT}$</td>
           </tr>))):('')
          ):('')
        }
        
          
          <tr>
            <td colspan="6" className="grand total">Montant Total</td>
            <td className="grand total">{mentant_total}$</td>
          </tr>
         
        </tbody>
      </table>
      <div id="notices">
      
        <div id="fin">
          <a>Merci pour votre service!</a><br/>
          <a>[Baztronic,+1 (438)699-9074,info@baztronic.ca]</a>
          
         </div>
      </div>
    </div>
    
  </div>
  
    </div>
    );};
  