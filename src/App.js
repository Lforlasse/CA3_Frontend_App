import React, { useState, useEffect } from "react"
import facade from "./components/apiFacade";
import 'bootstrap/dist/css/bootstrap.min.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = (evt) => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  }
  const onChange = (evt) => {
    setLoginCredentials({ ...loginCredentials, [evt.target.id]: evt.target.value })
  }

  return (
    <div class="row">
      <div class="col" />
      <div class="col-lg">
        <h2>Login</h2>
        <form onChange={onChange} >
          <input class="form-control" placeholder="User Name" id="username" />
          <br />
          <input type="password" class="form-control" placeholder="Password" id="password" />
          <br />
          <button class="btn btn-primary" onClick={performLogin}>Login</button>
        </form>
      </div>
      <div class="col" />
    </div>
  )

}
function LoggedIn(props) {
  const role = props.roles.includes("admin") ? "admin" : "user"

  useEffect(() => {
    facade.fetchData(role)
      .then(data => props.setDataFromServer(data));
  }, [])

  return (
    <div>
      <h2>Data Received from server</h2>
      <h3>{props.dataFromServer.msg}</h3>
    </div>
  )

}

function App() {
  const [dataFromServer, setDataFromServer] = useState("Loading...")
  const [loggedIn, setLoggedIn] = useState(false)

  const logout = () => {
    facade.logout();
    setLoggedIn(false);
  }

  const login = (user, pass) => {
    facade.login(user, pass)
      .then(res => setLoggedIn(true));
  }

  let fetchCustom;

  function FetchCustom() {
    fetch("https://mesterskab.dk/ca3backend/api/info/fetchcustom")
      .then(response => response.json())
      .then(json => fetchCustom = json)
    return (<p>{fetchCustom}</p>)
  }

  return (
    <Router>
      <div className="container">
        <div className="row">
          <div className="col">

            <Switch>
              <Route exact path="/">
                {!loggedIn ? (<LogIn login={login} />) :
                  (<div className="row">
                    <div className="col">
                      {loggedIn ? (
                        <div className="w-100">
                          <Link to="/" className="btn btn-danger">Home</Link>

                          <Link to="/user" className="btn btn-primary">User endpoint demo</Link>

                          <Link to="/external" className="btn btn-primary">external server fetch demo</Link>
                        </div>) : ""}
                      {loggedIn && facade.getRoles().includes("admin") ?

                        <Link to="/admin" className="btn btn-primary">Admin endpoint demo</Link>

                        : ""}

                      <LoggedIn dataFromServer={dataFromServer} roles={facade.getRoles()} setDataFromServer={setDataFromServer} />
                      <button onClick={logout}>Logout</button>
                    </div>
                  </div>
                  )}

              </Route>
              <Route path="/user">
                <p>User stuff: {dataFromServer.msg}</p>
              </Route>
              <Route path="/admin">
                <p>test</p>
                <p>Admin stuff: {dataFromServer.msg}</p>
              </Route>
              <Route path="/external">
                <div>
                  <FetchCustom></FetchCustom>
                </div>
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router >
  )

}
export default App;

