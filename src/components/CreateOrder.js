import './CreateOrder.css';
import React from 'react';
import axios from 'axios'
import sha256 from 'crypto-js/sha256';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import App from '../App';
import constants from '../constants.json';

class CreateOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            menuItemsList: null,
            usersOrders: null,
        };
    }
    clearState = async () => {
        delete_cookie("token");
        await this.setState({
            token: ""
        });
    }
    componentDidMount() {
        this.setState({
            token: read_cookie("token")
        });
        this.loadUsersOrdersToState();
        this.loadMenu();
    }
    loadMenu = async () => {
        await axios.get(`https://${constants.url}/api/user/getmenuitemslist`)
            .then(res => {
                this.setState({
                    menuItemsList: res.data
                });
            }).catch(err => {
                console.log(err);
            });
        this.loadUsersOrdersToState();
    }
    loadUsersOrdersToState = async () => {
        const headers = { Authorization: `Bearer ${read_cookie("token")}` };
        await axios.get(`https://${constants.url}/api/user/ordersofuser`, { headers })
            .then(res => {
                this.setState({
                    usersOrders: res.data
                });
            }).catch(err => {
                console.log(err);
            })
    }
    addOrder = async (itemId) => {
        var _amount = document.getElementById("amount" + itemId).value;
        var _adress = document.getElementById("adress" + itemId).value;
        if (_adress != "") {
            _amount = parseFloat(_amount);
            const headers = { Authorization: `Bearer ${read_cookie("token")}` };
            var createOrderModel = {
                menuItemId: itemId,
                orderAmount: _amount,
                adress: _adress
            }
            await axios.put(`https://${constants.url}/api/user/createorder`, createOrderModel, { headers })
                .then(res => {
                    console.log(res);
                    alert("order added successfully");
                }).catch(err => {
                    console.log(err);
                });
            this.loadUsersOrdersToState();
        }
    }
    deleteOrder = async (id) => {
        const headers = { Authorization: `Bearer ${read_cookie("token")}` };
        var url = `https://${constants.url}/api/user/deleteorder?orderid=${id}`;
        await axios.delete(url, { headers })
            .then(res => {
                console.log(res);
                this.loadUsersOrdersToState();
                alert("deleted !");
            }).catch(err => {
                console.log(err);
            })
    }


    render() {
        // return signin/login page if token is not generated
        if (this.state.token == "") {
            return (
                <App />
            );
        }
        // load menu items if not null, if null, then it returns loading...
        if (this.state.menuItemsList != null && this.state.usersOrders != null) {
            const listItems = this.state.menuItemsList.map((item) =>
                <div>
                    <li>{item.id}</li>
                    <li>{item.itemName}</li>
                    <li>{item.description}</li>
                    <li>{item.price}</li>
                    Amount: <input type="number" min="1" max="50" step="1" required id={"amount" + item.id} /> <br />
                    Adress: <input type="text" id={"adress" + item.id} />
                    <button onClick={() => { this.addOrder(item.id) }}>Add To Orders</button>
                    <hr />
                </div>
            );
            var usersOrders = this.state.usersOrders.map((order) =>
                <div>
                    <p>order id: {order.id}</p>
                    <p>item id : {order.menuItemId}</p>
                    <p>item name : {order.menuItemName}</p>
                    <p>order amount : {order.orderAmount}</p>
                    <p>total price : {order.totalPrice}</p>
                    <p>adress : {order.adress}</p>
                    <button onClick={() => { this.deleteOrder(order.id) }}>delete</button> <br />
                    <hr />
                </div>
            );
            return (
                <div>
                    <p>create order page</p>
                    <button onClick={() => { this.clearState() }}>logout</button> <br />
                    <hr />
                    <ul>{listItems}</ul>
                    <hr />
                    <div>{usersOrders}</div>
                </div>
            );
        }
        return (<h1>loading...</h1>);

    }
}

export default CreateOrder;