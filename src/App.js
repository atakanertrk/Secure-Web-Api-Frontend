import './App.css';
import React from 'react';
import axios from 'axios'
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import CreateOrder from './components/CreateOrder';
import constants from './constants.json';
import { HmacSHA256 } from 'crypto-js';

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

  componentDidMount() {
    this.setState({
      token: read_cookie("token")
    });
  }

  loginOnClick = async (paramater) => {
    var un = document.getElementById("username").value;
    var pw = document.getElementById("password").value;
    var hashedInfo = sha256(un + pw).toString();
    console.log(hashedInfo);
    var LoginObject = {
      hashedUserNameAndPassword: hashedInfo
    }
    await axios.post(`https://${constants.url}/api/login`, LoginObject)
      .then(res => {
        bake_cookie('token', res.data.token);
        this.setState({
          token: res.data.token
        })
      }).catch(err => {
        console.log(err);
        this.setState({
          token: ""
        })
        alert("login failed");
      });
  }

  createAccountOnClick = async (paramater) => {
    var un = document.getElementById("username").value;
    var pw = document.getElementById("password").value;
    var hashedInfo = sha256(un + pw).toString();
    if (un != "" && pw != "") {
      var createAccObj = {
        UserName: un,
        HashedUserNameAndPassword: hashedInfo
      }
      console.log(createAccObj);
      await axios.post(`https://${constants.url}/api/signin`, createAccObj)
        .then(res => {
          bake_cookie('token', res.data.token);
          this.setState({
            token: res.data.token
          })
        }).catch(err => {
          console.log(err);
          this.setState({
            token: ""
          })
          alert("create failed");
        });
    }
  }

  render() {
    if (this.state.token != "") {
      return (
        <div>
          <CreateOrder />
        </div>
      );
    }
    return (
      <div className="App">
        <h4 style={{marginTop:"10%"}}>Secure Web Application</h4>
        <div style={{ width: "50%", marginLeft: "25%", marginTop: "4%" }}>
          <div className="form-group">
            <label>User Name</label>
            <input type="text" class="form-control" placeholder="user name" id="username" autoComplete="off" />
            <small class="form-text text-muted">your security is important to us !</small>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" class="form-control" placeholder="Password" id="password" autoComplete="off" />
          </div>
          <hr style={{ width: "10px" }} />
          <button type="button" class="btn btn-primary" onClick={() => { this.loginOnClick("hello") }}>Login</button>
          <hr style={{ width: "100px" }} />
          <button type="button" class="btn btn-secondary" onClick={() => { this.createAccountOnClick("hello") }}>Create Account</button>
        </div>
      </div>
    );
  }
}

export default App;
