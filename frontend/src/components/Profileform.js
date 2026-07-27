import * as Yup from "yup";
import { useState } from "react";
import { useFormik, Form, FormikProvider } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import {
  Stack,
  Box,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

import { motion } from "framer-motion";
import {  Typography } from "@mui/material"
import userimg from '../assets/images/users/onou.png'

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

const SignupForm = ({ setAuth }) => {
  const navigate = useNavigate();
  
    const [file, setFile] = useState(userimg);
    
async function submit(){
  try{
  let res = await axios.post("http://127.0.0.1:8000/api/register",
  {
name: formik.values.Username,
email: formik.values.email,
password: formik.values.password,
password_confirmation:formik.values.Rpassword, 
  })
  .then((res)=>res)
  
  if(res.status===200) {
    window.localStorage.setItem("token",res.data.data.token);
    window.localStorage.setItem("username",res.data.data.username);
      setAuth(true);
    navigate("/", { replace: true });}
  }
  catch (err){
    if(err.response.status===422){
      setemailvalidation(false);
    }
    }
  
}
  const [emailvalidation, setemailvalidation]=useState(true);
  const SignupSchema = Yup.object().shape({
    
    email: Yup.string()
      .email("يجب أن يكون البريد الإلكتروني عنوان بريد إلكتروني صالحًا")
      .required("البريد الالكتروني مطلوب"),
      Username: Yup.string()
      .min(3, "اسم المستخدم قصير جدا")
      .max(50, "اسم المستخدم طويل جدا")
      .required("الرجاء ادخال اسم المستخدم"),
    firstname: Yup.string().required("كلمة السر مطلوبة")
    .min(8, 'كلمة المرور قصيرة جدًا - يجب ألا تقل عن 8 أحرف'),
    lastname: Yup.string()
    .required("الرجاء ادخال اسم المستخدم"),
     
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      Username:"",
      firstname: "",
      lastname: "",
    },
    validationSchema: SignupSchema,
     onSubmit: () => {
      setTimeout(() => {
        setemailvalidation(true);
        submit();},1000);
      
    },
  });

  const { errors, touched, handleSubmit,  getFieldProps } = formik;
  const emailerror= emailvalidation ? "":"البريد الالكتروني الذي أدخلته موجود";
          
  return (
    <div>
    <Typography
            
            variant="body2"
            align="center"
            sx={{ mb: 2,color: "text.secondary" }}
          >
          <label htmlFor="image">
       <img   style={{ width: 100, height: 100 }} src={file}    />    
       </label>
        <input id="image" type="file" accept='image/*' style={{ display:"none"}} onChange={(e)=>setFile(URL.createObjectURL(e.target.files[0]))}/>        
            
                </Typography>
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
          

          <Stack
            spacing={2}
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            animate={animate}
          >
          <Stack
          spacing={2}
            component={motion.div}
            initial={{ opacity: 0, y: 40 }}
            animate={animate}>
          <TextField
              fullWidth
              autoComplete="firstname"
              type="text"
              label="الاسم"
              {...getFieldProps("firstname")}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
            <TextField
              fullWidth
              autoComplete="lastname"
              type="text"
              label="اللقب"
              {...getFieldProps("lastname")}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
          </Stack>
            <TextField
              fullWidth
              autoComplete="new-username"
              type="email"
              label="عنوان البريد الالكتروني"
              {...getFieldProps("email")}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />
           <TextField
              fullWidth
              autoComplete=""
              type="text"
              label="اسم المستخدم"
              {...getFieldProps("Username")}
              error={Boolean(touched.Username && errors.Username)}
              helperText={touched.Username && errors.Username}
            />
            </Stack>
          <Stack style={{alignItems:"center", color:"red"}}>
            {emailerror}
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
              
            >
              حفظ
              </LoadingButton>
          </Box>
        </Stack>
      </Form>
    </FormikProvider>
    
    </div>
  );
};

export default SignupForm;
