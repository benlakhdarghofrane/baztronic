import React, { useRef,useEffect, useState } from 'react';

const DatePicker = (props) => {
  const currentDate = new Date();
        const year = currentDate.getFullYear().toString().substring(0,4);
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

  const  setDate=props.setdate;
  const  date=props.date;
  const start=props.start;
  const setrefresh=props.setrefresh;
  const refresh=props.refresh;
const dateInputRef = useRef(null);
useEffect(()=>{
  //console.log(formattedDate)
 
  start ? setDate('2024-01-01'):setDate(formattedDate)
  setrefresh(!refresh)
  },[])
const handleChange = (e) => {
setDate(e.target.value);
};

return (
<div>
<input
width='200px'
type="date"
value={date}
onChange={handleChange}
ref={dateInputRef}
/>

</div>
);
};

export default DatePicker;