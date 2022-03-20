import axios from "axios";  
export default axios.create({  
  baseURL: "https://sri143.pythonanywhere.com/api",  
  headers: {  
    "Content-type": "application/json" ,
  }  
});  