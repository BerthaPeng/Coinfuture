import React, { Component } from "react";
import PaypalExpressBtn from "react-paypal-express-checkout";
import { Redirect } from "react-router-dom";
class PayPal extends Component {
constructor(props) {
   super(props);
   this.state = {
      redirect: false
   };
   this.createOrder = this.createOrder.bind(this);
}

createOrder(payment) {
let postData = {
   uid: this.props.userData.uid,
   token: this.props.userData.token,
   payerID: payment.payerID,
   paymentID: payment.paymentID,
   paymentToken: payment.paymentToken,
   pid: this.props.pid
};

PostData("createOrder", postData).then(result => {
   let responseJson = result;
   if (responseJson.status === "true") {
      this.setState({ redirect: true });
   }
});
}

render() {
if (this.state.redirect) {
   return <Redirect to={"/orders"} />;
}

const onSuccess = payment => {
   this.createOrder(payment);
};

const onCancel = data => {
   console.log("The payment was cancelled!", data);
};

const onError = err => {
console.log("Error!", err);
};

let env = "sandbox"; // Change to "production" for live
let currency = "USD";
let total = this.props.value;

const client = {
sandbox: "ARDSf5WjYMJbH1mx9afk93Oum38izGFEa6M3BW3i-ZGl6jkIpa0aEt3QzsgHvp06yWyTxhn9tQnXi0eH",
production: "<insert production client id>"
};

return (
<PaypalExpressBtn
env={env}
client={client}
currency={currency}
total={total}
onError={onError}
onSuccess={onSuccess}
onCancel={onCancel}
/>
);
}
}

export default PayPal;