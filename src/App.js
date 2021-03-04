import './App.css';
import React from 'react';
import axios from 'axios'
import sha256 from 'crypto-js/sha256';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import CreateOrder from './components/CreateOrder';

class App extends React.Component {
  // sha256(nonce + message);

  // delete_cookie(cookie_key);
  // read_cookie(cookie_key)
  // bake_cookie(cookie_key, 'test');
  constructor(props) {
    super(props);
    this.state = {
      token: "",
    };
  }

  loginOnClick = async (paramater) => {
    var un = document.getElementById("username").value;
    var pw = document.getElementById("password").value;
    var LoginObject = {
      UserName: un,
      Password: pw
    }
    console.log(LoginObject);
    await axios.post(`https://server.webde.biz.tr/api/login`, LoginObject)
      .then(res => {
        bake_cookie('token', res.data.token);
        console.log(res.data.token);
        this.setState({
          token: res.data.token
        })
      }).catch(err => {
        console.log(err);
        this.setState({
          token: ""
        })
      });
  }

  createAccountOnClick = async (paramater) => {
    var un = document.getElementById("username").value;
    var pw = document.getElementById("password").value;
    var createAccObj = {
      UserName: un,
      Password: pw
    }
    console.log(createAccObj);
    await axios.post(`https://server.webde.biz.tr/api/signin`, createAccObj)
      .then(res => {
        bake_cookie('token', res.data.token);
        console.log(res.data.token);
        this.setState({
          token: res.data.token
        })
      }).catch(err => {
        console.log(err);
        this.setState({
          token: ""
        })
      });
  }

  render() {
    if(this.state.token != ""){
      return(
        <div>
          <CreateOrder/>
        </div>
      );
    }
    return (
      <div className="App">
        <p>User Name</p>
        <input type="text" id="username" autoComplete="off" required />
        <p>Password</p>
        <input type="text" id="password" autoComplete="off" required />
        <hr style={{ width: "100px" }} />
        <br />
        <button onClick={() => { this.loginOnClick("hello") }} >Login</button>
        <br />
        <button onClick={() => { this.createAccountOnClick("hello") }} >Create Account</button>
        <br/>
        <p>current token is : {this.state.token}</p>
      </div>
    );
  }
}

export default App;
