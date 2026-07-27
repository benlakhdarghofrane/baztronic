import React, { Suspense } from 'react'
import {  Route, Routes } from 'react-router-dom'
import { CContainer } from '@coreui/react'
import Dashboard from '../views/dashboard/Dashboard';

// routes config
const UsersAjoute = React.lazy(() => import('../views/pages/Users/UsersAjoute'))
const UsersListe = React.lazy(() => import('../views/pages/Users/UsersListe'))
const Categories = React.lazy(() => import('../views/pages/Categories/CatAjoute'))
const Marques = React.lazy(() => import('../views/pages/Marque/MarqueAjoute'))
const Lots = React.lazy(() => import('../views/pages/Lots/LotAjoute'))
const ProductLot = React.lazy(() => import('../views/pages/Lots/ProductListe'))
const Models = React.lazy(() => import('../views/pages/Model/ModelAjoute'))
const ProductsAjoute = React.lazy(() => import('../views/pages/Products/ProductAjoute'))
const ProductsPrint = React.lazy(() => import('../views/pages/Products/ProductPrint'))
const ProductsLotPrint = React.lazy(() => import('../views/pages/Lots/ProductPrint'))
const ProductsListe = React.lazy(() => import('../views/pages/Products/ProductListe'))
const DepotsListe = React.lazy(() => import('../views/pages/Depot/DepotListe'))
const Customers = React.lazy(() => import('../views/pages/Customers/CustomerAjoute'))
const Fornisseurs = React.lazy(() => import('../views/pages/Fornissur/FornisseurAjoute'))
const FornisseurDepts = React.lazy(() => import('../views/pages/Fornissur/FornisseurDept'))
const Receiptodrder = React.lazy(() => import('../views/pages/ReceiptOrder/ReceiptAjoute'))
const Receiptodrderliste = React.lazy(() => import('../views/pages/ReceiptOrder/ReceiptListe'))
const Salesodrder = React.lazy(() => import('../views/pages/SalesOrder/SallesAjoute'))
const Salesodrderliste = React.lazy(() => import('../views/pages/SalesOrder/SallesListe'))
const AppView = React.lazy(() => import('../views/overview/view/app-view'))
const Page404 = React.lazy(() => import('../views/pages/page404/Page404'))
const Fact = React.lazy(() => import('./Facture'))
const AppContent = (props) => {
 const userid=props.userid;
 const setLoading=props.setLoading;
  const routeNav=props.Nav;
  const setErr=props.setErr;
  const setshowerr=props.setshowerr;
 // console.log(routeNav)
 return (
    <CContainer lg>
      <Suspense >
      <Routes >
              
               <Route   path='/*'  name='profile' element={<Page404/>}
               />
               <Route   path='/' name='dashboard' element={<Dashboard/>}
               />

               {routeNav.map((route, idx) => {
          return (
            
              <>
             
              {route.to=='dashboard' &&
              <Route   path='/dashboard' name='dashboard' element={<AppView setErr={setErr} setshowerr={setshowerr}/>}
               />
               }
               {route.to=='Users' &&
               <Route  key={idx }  path='/Users' name='/Users' element={<UsersAjoute add={true} setErr={setErr} setshowerr={setshowerr} userid={userid} setLoading={setLoading}/>}
               />}
               {route.to=='Category' &&
               <Route key={idx } path='/Category' name='/Products category' element={<Categories setErr={setErr} setshowerr={setshowerr} add={true}/>}
               />}
               {route.to=='Marque' &&
               <Route key={idx } path='/Marque' name='/Products marque' element={<Marques setErr={setErr} setshowerr={setshowerr} add={true}/>}
               />}
               {route.to=='Model' &&
               <Route key={idx } path='/Model' name='/Products model' element={<Models setErr={setErr} setshowerr={setshowerr} add={true}/>}
               />}
               {route.to=='products' &&
               <Route key={idx } path='/products/Add' name='/products/Add' element={<ProductsAjoute setErr={setErr} setshowerr={setshowerr} />}
               />}
                {route.to=='products' &&
               <Route key={idx } path='/products/print' name='/products/print' element={<ProductsPrint setErr={setErr} setshowerr={setshowerr} />}
               />}
               {route.to=='products' &&
               <Route key={idx } path='/products' name='/products' element={<ProductsListe setErr={setErr} setshowerr={setshowerr} />}
               />}
               {route.to=='Clients' &&
               <Route key={idx } path='/Clients' name='/Clients' element={<Customers setErr={setErr} setshowerr={setshowerr} add={true}/>}
               />}
               {route.to=='Suppliers' &&
               <Route key={idx } path='/Suppliers' name='/Suppliers' element={<Fornisseurs setErr={setErr} setshowerr={setshowerr} add={true}/>}
               />}
               {route.to=='Receipt order' &&
               <Route key={idx } path='/Receipt order' name='/Receipt order' element={<Receiptodrderliste setErr={setErr} setshowerr={setshowerr}/>}
               />}
               {route.to=='Receipt order' &&
               <Route key={idx } path='/Receipt order/Add' name='/Receipt order add' element={<Receiptodrder setErr={setErr} setshowerr={setshowerr}/>}
               />}
               {route.to=='Sales Order' &&
                <Route key={idx } path='/Sales Order' name='/Sales Order' element={<Salesodrderliste setErr={setErr} setshowerr={setshowerr}/>}
               />}
               {route.to=='Sales Order' &&
               <Route key={idx } path='/Sales Order/Add' name='/Sales Order add' element={<Salesodrder setErr={setErr} setshowerr={setshowerr}/>}
               />}
               {route.to=='Debts' &&
                <Route key={idx } path='/Debts' name='/Debts' element={<FornisseurDepts setErr={setErr} setshowerr={setshowerr}/>}
               />}
               {/*route.to=='Deposits' &&
               <Route key={idx } path='/Deposits' name='/Deposits' element={<DepotsListe setErr={setErr} setshowerr={setshowerr}/>}
               />*/}
                {route.to=='Lots' &&
               <Route key={idx } path='/Lots' name='/Lots' element={<Lots setErr={setErr} setshowerr={setshowerr} add={true}/>}
               />}
                {route.to=='Lots' &&
               <Route key={idx } path='/Product Lot' name='/Product Lot' element={<ProductLot setErr={setErr} setshowerr={setshowerr} add={true}/>}
               />}
               {route.to=='Lots' &&
               <Route key={idx } path='/Product Lot print' name='/Product Lotprint' element={<ProductsLotPrint setErr={setErr} setshowerr={setshowerr} />}
               />}
               {/*route.to=='Product Lot' &&
               <Route key={idx } path='/Product Lot/add' name='/Product Lot' element={<ProductLotAdd setErr={setErr} setshowerr={setshowerr} add={true}/>}
               />*/}
               </>
               
          )
          })}
          </Routes>   
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
