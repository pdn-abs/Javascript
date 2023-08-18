const axios = require("axios");

const api = async()=> {
const {data}= await axios.get("https://jsonplaceholder.typicode.com/todos");

return data;
}

const App = async() => {
  const acquiredData =await api();
  console.log(acquiredData);
}
App();