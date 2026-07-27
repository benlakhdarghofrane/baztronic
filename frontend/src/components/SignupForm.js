import * as Yup from "yup";
import { useState,useEffect } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import {
  Stack,
  Box,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { CButton, CSpinner } from "@coreui/react";
/////////////////////////////////////////////////////////////
let easing = [0.6, -0.05, 0.01, 0.99];
const animate = {
  opacity: 1,
  y: 0,
  transition: {
    duration: 0.6,
    ease: easing,
    delay: 0.16,
  },
};

const SignupForm = (props) => {
  const userid=props.userid;
  const pwchange=props.pwchange;
  const username=props.username;
  
  const navigate = useNavigate();
  const [load,setload]=useState(false);
  const [log,setlog]=useState(false);
  

  const onLogout =(ev)=>{
    setlog(true);
    ev.preventDefault();
    axiosClient.post('/logout').then(({})=>{
       
        localStorage.removeItem('ACESS_TOKEN')
       window.location.reload(true);
        setlog(false);
    })}
  

async function submit(){
  setload(true);
  try{
   
    
  let res = await axiosClient.put("/users/"+userid,
  {
username: formik.values.Username,
oldpassword: formik.values.oldpassword,
password: formik.values.password,
password_confirmation:formik.values.Rpassword, 
  })
  .then((res)=>res)
  
  if(res.status===200) {
   //window.localStorage.setItem("user",res.data.data.username);
    setload(false);
      alert('تم تغيير كلمة السر بنجاح')
      window.location.reload(true)
    navigate("/", { replace: true });}
  }
  catch (err){
    setload(false);
   // console.log(err)
    }
  
}
  const [showoldPassword, setShowoldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRPassword, setShowRPassword] = useState(false);
  const SignupSchema = Yup.object().shape({
    
    oldpassword: Yup.string()
      .required("ادخل كلمة السر القديمة"),
      Username: Yup.string()
      .min(3, "اسم المستخدم قصير جدا")
      .max(50, "اسم المستخدم طويل جدا")
      .required("الرجاء ادخال اسم المستخدم"),
    password: Yup.string().required("كلمة السر مطلوبة")
    .min(8, 'كلمة المرور قصيرة جدًا - يجب ألا تقل عن 8 أحرف'),
    Rpassword: Yup.string()
    
     .oneOf([Yup.ref('password'), null], 'يجب أن تتطابق كلمات السر'),
  });

  const formik = useFormik({
    initialValues: {
      
      Username:username,
      oldpassword: "",
      password: "",
      Rpassword: "",
    },
    validationSchema: SignupSchema,
     onSubmit: () => {
        submit();
      
    },
  });

  const { errors, touched, handleSubmit,  getFieldProps } = formik;
         
  return (
    
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
          

          <Stack
            spacing={2}
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            animate={animate}
          >
          
            
           <TextField
              fullWidth
              autoComplete=""
              type="text"
              label="اسم المستخدم"
              {...getFieldProps("Username")}
              error={Boolean(touched.Username && errors.Username)}
              helperText={touched.Username && errors.Username}
            />
            <TextField
              fullWidth
              autoComplete="old-password"
              type={showoldPassword ? "text" : "password"}
              label="كلمة السر القديمة"
              {...getFieldProps("oldpassword")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowoldPassword((prev) => !prev)}
                    >
                      <Icon
                        icon={
                          showoldPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.oldpassword && errors.oldpassword)}
              helperText={touched.oldpassword && errors.oldpassword}
            />
            <TextField
              fullWidth
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              label="كلمة السر الجديدة"
              {...getFieldProps("password")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <Icon
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
            <TextField
              fullWidth
              autoComplete="new-password"
              type={showRPassword ? "text" : "password"}
              label=" اعد كلمة السر الجديدة"
              {...getFieldProps("Rpassword")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowRPassword((prev) => !prev)}
                    >
                      <Icon
                        icon={
                          showRPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.Rpassword && errors.Rpassword)}
              helperText={touched.Rpassword && errors.Rpassword}
            />
          </Stack>
          
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={animate}
          >
            <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              disabled={load}
            >
            {load ? (<div style={{display:'flex', justifyContent:'center'}}><CSpinner color="success"/> </div>):( "  تعديل")}
      
            </LoadingButton>
           { (pwchange===1 || pwchange===null) ? (''):(
            <div className="my-3 d-flex justify-content-center">
            <CButton disabled={log}  onClick={onLogout}>
            {log ? (<div style={{display:'flex', justifyContent:'center'}}><CSpinner color="success"/> </div>):( "تسجيل الخروج")}
         </CButton>
            </div>)}
          </Box>
        </Stack>
      </Form>
    </FormikProvider>
  );
};

export default SignupForm;
