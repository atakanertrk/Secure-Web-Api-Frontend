import './CreateOrder.css';
import React from 'react';
import axios from 'axios'
import sha256 from 'crypto-js/sha256';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import App from '../App';

class CreateOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            menuItemsList: null,
        };
    }

    componentDidMount() {
        this.setState({
            token: read_cookie("token")
        });
        console.log("here : " + this.state.token);
        this.loadMenu();
    }
    clearState = async () => {
        delete_cookie("token");
        await this.setState({
            token: ""
        });
    }

    loadMenu = async () => {
        await axios.get(`https://localhost:44309/api/user/getmenuitemslist`)
            .then(res => {
                this.setState({
                    menuItemsList: res.data
                });
                console.log(this.state.menuItemsList);
            }).catch(err => {
                console.log(err);
            });
    }

    render() {
        // return signin/login page if token is not generated
        if (this.state.token == "") {
            return (
                <App />
            );
        }
        // load menu items if not null, if null, then it returns loading...
        if (this.state.menuItemsList != null) {
            const listItems = this.state.menuItemsList.map((item) =>
                <div>
                    <li>{item.id}</li>
                    <li>{item.itemName}</li>
                    <li>{item.description}</li>
                    <li>{item.price}</li>
                    <hr />
                </div>
            );
            return (
                <div>
                    <p>create order page</p>
                    <button onClick={() => { this.clearState() }}>logout</button> <br />
                    <hr />
                    <ul>{listItems}</ul>
                </div>
            );
        }
        return(<p>loading...</p>);
       
    }
}

export default CreateOrder;