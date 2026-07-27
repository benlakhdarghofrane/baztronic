//import { faker } from '@faker-js/faker';
import React, { useState,useEffect } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Date from "../../../components/Date";
import Iconify from '../../../components/iconify';

import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';
import axiosClient from '../../../axios-client';
// ----------------------------------------------------------------------

export default function AppView() {
  const [refresh, setrefresh] = useState(false);
  const [receiptstats, setreceiptstats] = useState([]);
  const [sallenbr, setsallesnbr] = useState([]);
  const [alldebts, setalldebts] = useState([]);
  const [sallestats, setsallestats] = useState([]);
  const [datedebut, setdatedebut] = useState(null);
  const [datefin, setdatefin] = useState(null);
  const [show, setShow] = useState(false);
  const [purchasebymonth, setpurchasebymonth] = useState([]);
  const [salebymonth, setsalebymonth] = useState([]);
  const [sallenbrbymonth, setsallenbrbymonth] = useState([]);
  const [payment, setpayment] = useState([]);
  const [product, setproduct] = useState([]);
  const [editing, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
 
  const getCats=()=>{
        setLoading(true)
    axiosClient.get('/stats').then(({data})=>{  
   
     if (data){
     // console.log(data)
      setpayment(data.StatBytype);
      
      const options = data.TopProduct.map((pro) => ({
        value: parseFloat(pro.QntT),
        label: pro.designationEN,
      }));
      setproduct(options)
      let RecieptPricemonth = [0];
      let SalePricemonth = [0];
      let sallenbrmonth = [0];
      
      data.StatByMonth.forEach(month => {
        const statRecieptPrice = month.stat.StatReciept[0].price !== null ? month.stat.StatReciept[0].price : 0;
        const statSalePrice = month.stat.StatSale[0].price !== null ? month.stat.StatSale[0].price : 0;
        const sallebnrm = month.stat.StatSale[0].countS !== null ? month.stat.StatSale[0].countS : 0;
       RecieptPricemonth.push(statRecieptPrice);
        SalePricemonth.push(statSalePrice);
        sallenbrmonth.push(sallebnrm);
      });
      setpurchasebymonth(RecieptPricemonth);
      setsalebymonth(SalePricemonth);
      setsallenbrbymonth(sallenbrmonth);
     
        setLoading(false)
      }
   }).catch(()=>{
    setLoading(false)
  })
  }
  useEffect(()=>{
    getCats();
  },[refresh])
  const getstats=(datedebut,datefin)=>{


//console.log(datefin)

    setLoading(true)
axiosClient.get(datefin===null ? '/statsbydate':'/statsbydate/'+datedebut+'/'+datefin).then(({data})=>{  

 if (data){
  setreceiptstats(data.StatReciept[0].price);
  setalldebts(data.StatReciept[0].rst);
  setsallestats(data.StatSale[0].price);
  setsallesnbr(data.StatSale[0].countS);
 //console.log(data)
    setLoading(false)
  }
}).catch(()=>{
setLoading(false)
})
}
useEffect(()=>{
getstats(datedebut,datefin);
},[datedebut,datefin,refresh])

  return (
    <Container maxWidth="xl">
      <Typography  sx={{ mb: 5 }}>
      <div className="row" style={{direction:'rtl', display:'flex',justifyContent:'space-between'}}  >
<div className="mt-2 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">  
<div className="mt-2 px-2 py-2" style={{backgroundColor:'white', borderRadius:5, display:'flex', justifyContent:'space-between'}}>

<Date  setdate={setdatefin} date={datefin} setrefresh={setrefresh} refresh={refresh}/>
End Date
</div>

</div>
<div className="mt-2 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">  
<div className="mt-2 px-2 py-2" style={{backgroundColor:'white', borderRadius:5, display:'flex', justifyContent:'space-between'}}>

<Date setdate={setdatedebut} date={datedebut} setrefresh={setrefresh} refresh={refresh} start={true}/>
Start date
</div>
</div>


</div>
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="All Purchases"
            total={receiptstats}
            color="success"
            //icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="All Salles"
            total={sallestats}
            color="info"
           // icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="All Debts"
            total={alldebts}
            color="warning"
            //icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Salles nombre"
            total={sallenbr}
            color="error"
            //icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={12} lg={12}>
          <AppWebsiteVisits
            title="General Statistics"
            subheader="this is first year"
            chart={{
              labels: [
                '01/01/2024',
                '02/01/2024',
                '03/01/2024',
                '04/01/2024',
                '05/01/2024',
                '06/01/2024',
                '07/01/2024',
                '08/01/2024',
                '09/01/2024',
                '10/01/2024',
                '11/01/2024',
                '12/01/2024',
              ],
              series: [
                {
                  name: 'Salles Nbr',
                  type: 'column',
                  fill: 'solid',
                  data: sallenbrbymonth,
                },
                {
                  name: 'Salles',
                  type: 'area',
                  fill: 'gradient',
                  data: salebymonth,
                },
                {
                  name: 'Purchases',
                  type: 'line',
                  fill: 'solid',
                  data: purchasebymonth,
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
        {payment.length>1 &&
          <AppCurrentVisits
            title="Payment Mode"
            chart={{
              series: [
                { label: payment[0]? payment[0].typePaiment:"", value: payment[0] ?parseFloat(payment[0].price):0 },
                { label: payment[1]? payment[1].typePaiment:"", value:payment[1] ? parseFloat(payment[1].price):0 },
                { label: payment[2]? payment[2].typePaiment:"",  value: payment[2] ? parseFloat(payment[2].price):0 },
              ],
            }}
          />}
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="10 best-selling products"
            //subheader="(+43%) than last year"
            chart={{
              series: product.slice(0, 10),
            }}
          />
        </Grid>
{/* 
        <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        

        <Grid xs={12} md={6} lg={8}>
          <AppTasks
            title="Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid>
        */}
      </Grid>
    </Container>
  );
}
