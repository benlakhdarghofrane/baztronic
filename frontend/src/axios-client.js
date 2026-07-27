import axios from "axios";
const axiosClient = axios.create({
      
 //baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
 baseURL:"http://127.0.0.1:8000/api/"
 //baseURL:"https://backend.baztronic.ca/api/"
});
axiosClient.interceptors.request.use((config)=>{
   const token= localStorage.getItem('ACESS_TOKEN');
    config.headers.Authorization=`Bearer ${token}`
    return config;
});
axiosClient.interceptors.response.use((response)=>{
return response;
},(error)=>{
    try {
        const {response}=error;
        if(response.status===401){
           // localStorage.removeItem('ACESS_TOKEN');
        }
    } catch (e) {
      // console.log(e);
    }
    throw error;
}
)
export default axiosClient;