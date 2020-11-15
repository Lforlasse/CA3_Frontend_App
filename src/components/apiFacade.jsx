import Settings from "../settings";

//Change to Settings.URL_LOCAL for local editing.
const URL = Settings.URL;
let roles = [];

function handleHttpErrors(res) {
 if (!res.ok) {
   return Promise.reject({ status: res.status, fullError: res.json() })
 }
 return res.json();
}
 
function apiFacade() {
 
const login = (user, password) => {
    const options = makeOptions("POST", true,{username: user, password: password });
    return fetch(URL + "/api/login", options)
      .then(handleHttpErrors)
      .then(res => {
        setToken(res.token) 
        roles = res.roles;
      })
      .catch(error => console.log(error))
}

const fetchData = (role) => { //TODO add
  const options = makeOptions("GET",true); //True add's the token
  return fetch(URL + "/api/info/" + role, options).then(handleHttpErrors);
}

const makeOptions= (method,addToken,body) =>{
   var opts = {
     method: method,
     headers: {
       "Content-type": "application/json",
       'Accept': 'application/json',
     }
   }
   if (addToken && loggedIn()) {
     opts.headers["x-access-token"] = getToken();
   }
   if (body) {
     opts.body = JSON.stringify(body);
   }
   return opts;
 }

const setToken = (token) => {
    localStorage.setItem("jwtToken", token)
}

const getToken = () => {
    return localStorage.getItem("jwtToken")
}

const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
}

const logout = () => {
    localStorage.removeItem("jwtToken");
}

const getRoles = () => {
  return roles;
}
  
 return {
     makeOptions,
     setToken,
     getToken,
     loggedIn,
     login,
     logout,
     fetchData,
     getRoles
 }
}
const facade = apiFacade();
export default facade;