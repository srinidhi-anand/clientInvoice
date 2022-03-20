import axios from "axios";  
export default axios.create({  
  baseURL: "http://sri143.pythonanywhere.com/api",  
  headers: {  
    "Content-type": "application/json" ,
  }  
});  