import React from 'react';
import PaypalExpressBtn from './PayPalExpressCheckOut';
import { post } from 'utils/request'; //Promise

export default class MyApp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            paymentID: ''
        }
    }
    render() {    
        const onSuccess = (payment) => {
            console.log("Your payment was succeeded!", payment);
        }         
        const onCancel = (data) => {
            // User pressed "cancel" or close Paypal's popup! 
            console.log('You have cancelled the payment!', data);
        }         
        const onError = (err) => {
 // The main Paypal's script cannot be loaded or somethings block the loading of that script! 
            console.log("Error!", err);
// Since the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js" 
// => sometimes it may take about 0.5 second for everything to get set, or for the button to appear      
        }               
        let currency = 'USD'; // or you can set this value from your props or state   
        let total = 1; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout 
        let client = {
            sandbox:    'ARDSf5WjYMJbH1mx9afk93Oum38izGFEa6M3BW3i-ZGl6jkIpa0aEt3QzsgHvp06yWyTxhn9tQnXi0eH', // sandbox client ID
            production: 'xxxxxxxxx' // production client ID
        }
 return (
            <PaypalExpressBtn

currency={currency}
paymentID = {this.state.paymentID}
client = {client}
total={total}
onError={onError}
onSuccess={onSuccess}
onCancel={onCancel}
 />
        );
    }
    componentDidMount() {
      post(401001, {"balance": "4.98",
    "currency": "USD"})
      .done( data => {
        this.setState({ paymentID: data.payment_id, order_id: data.order_id})
      })
      //请求获取paymentID
    }

 }