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
            totalPrice : 0
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
                var total = 0;
                res.data.map((order) => 
                    total += order.totalPrice
                );
                console.log(total);
                this.setState({
                    usersOrders: res.data,
                    totalPrice : total
                });
            }).catch(err => {
                console.log(err);
            })
    }
    addOrder = async (itemId) => {
        var _amount = document.getElementById("amount" + itemId).value;
        var _adress = document.getElementById("adress").value;
        if(_adress == ""){
            alert("please write your adress before create order");
        }
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
                <div class="col-sm" style={{padding:"20px"}}>
                    <div className="card" style={{width:"15rem"}}>
                        <img src="https://cdn-prod.medicalnewstoday.com/content/images/articles/325/325521/illustration-of-different-plates-of-food.jpg" className="card-img-top" alt="image" />
                        <div className="card-body">
                            <h5 className="card-title">{item.itemName}</h5>
                            <p className="card-text">{item.description}</p>
                            <p className="card-text">{item.price}</p>
                            Amount: <input type="number" min="1" max="50" step="0.25" required id={"amount" + item.id} /> <br />
                            <p></p>
                            <button onClick={() => { this.addOrder(item.id) }} className="btn-sm btn-success">Add To Orders</button>
                        </div>
                    </div>
                </div>
                
            );
            var usersOrders = this.state.usersOrders.map((order) =>
                <div>
                    <p hidden>order id: {order.id}</p>
                    <p hidden>item id : {order.menuItemId}</p>
                    <p><strong>item name :</strong> {order.menuItemName} | <strong>order amount :</strong> {order.orderAmount} | <strong>total price :</strong> {order.totalPrice} | <strong>adress :</strong> {order.adress.substring(0, 20)}...</p>
                    <button onClick={() => { this.deleteOrder(order.id) }} className="btn-sm btn-danger">delete order</button>
                    <hr />
                </div>
            );
            return (
                <div>
                    <button onClick={() => { this.clearState() }} className="btn-sm btn-warning" style={{margin:"20px"}}>logout</button> <br />
                    <h2 style={{color:"darkgreen", margin:"20px"}}>Lets Create Order</h2>
                    <hr />
                    <div style={{textAlign:"center", fontWeight:"bold"}}> Write Your Adress Before Create Orders : <br/> <input type="text" id={"adress"} style={{width:"70%"}} autoComplete="off"  /></div>
                    <hr/>
                    <div style={{margin:"20px"}}>{usersOrders}</div>
                    <div>TOTAL PRICE : {this.state.totalPrice}</div>
                    <hr/>
                    <div className="container"><div className="row">{listItems}</div></div>
                    <div style={{marginBottom:"80px"}}></div>
                </div>
            );
        }
        return (<h1>loading...</h1>);

    }
}

export default CreateOrder;