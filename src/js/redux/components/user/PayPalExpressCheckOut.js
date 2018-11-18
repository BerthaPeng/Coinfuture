import React from 'react';
import ReactDOM from 'react-dom';
import scriptLoader from 'react-async-script-loader';
import PropTypes from 'prop-types';
import { post } from 'utils/request'; //Promise

class PaypalButton extends React.Component {
  constructor(props) {
    super(props);
    window.React = React;
    window.ReactDOM = ReactDOM;
    this.state = {
      showButton: false,
      env: 'production', // Or 'sandbox'
      client: {
        sandbox:    'ARDSf5WjYMJbH1mx9afk93Oum38izGFEa6M3BW3i-ZGl6jkIpa0aEt3QzsgHvp06yWyTxhn9tQnXi0eH', // sandbox client ID
        production: 'AZwao_cR8PomVrffQ5XHSCdO9A1R0us6AQB5mjuLbXe4nJm_n1_8kQK4HLF-nj0X3dQ5g5BR5YvqREFs' // production client ID
      },
      commit: true, // Show a 'Pay Now' button
      paymentID: '',
    };
  }
  componentDidMount() {
    const { isScriptLoaded, isScriptLoadSucceed } = this.props;
    if (isScriptLoaded && isScriptLoadSucceed) {
      this.setState({ showButton: true });
    }
    /*post(401001, {"balance": "4.98",
  "currency": "USD"})
    .done( data => {
      this.setState({ paymentID: data.payment_id, order_id: data.order_id})
    })
*/    //请求获取paymentID
  }
  componentWillReceiveProps({ isScriptLoaded, isScriptLoadSucceed }) {
    if (!this.state.show) {
      if (isScriptLoaded && !this.props.isScriptLoaded) {
        if (isScriptLoadSucceed) {
          this.setState({ showButton: true });
        } else {
          console.log('Cannot load Paypal script!');
          this.props.onError();
        }
      }
    }
  }
 
  render() {
    var { paymentID } = this.state;
    /*const payment = () => paypal.rest.payment.create(this.props.env, this.props.client, {
      transactions: [
                    { amount: { total: this.props.total, currency: this.props.currency } },
      ],
    });
    payment.paymentID = this.props.paymentID;*/
    const payment = () => {
      return this.props.paymentId;
    }
   /* const onAuthorize = (data, actions) =>  actions.payment.execute().then((payment) => {
      const payment = Object.assign({}, this.props.payment);
      payment.paid = true;
      payment.cancelled = false;
      payment.payerID = data.payerID;
      payment.paymentID = data.paymentID;
      payment.paymentToken = data.paymentToken;
      payment.returnUrl = data.returnUrl;
      this.props.onSuccess(data);
    });*/
    const onAuthorize = (data, actions) => {
      this.props.onSuccess(data);
    }
    let ppbtn = '';
    if (this.state.showButton) {
      ppbtn = (<paypal.Button.react
        env={this.state.env}
        client={this.props.client}
        payment={payment}
        commit
        onAuthorize={onAuthorize}
        onCancel={this.props.onCancel}
        style={{size: 'medium', shape: 'rect', label: 'paypal', tagline: false}}
      />);
    }
    return <div>{ppbtn}</div>;
  }
}
 
PaypalButton.propTypes = {
  currency: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  client: PropTypes.object.isRequired,
};
 
PaypalButton.defaultProps = {
  env: 'sandbox',
  onSuccess: (payment) => {
    console.log('The payment was succeeded!', payment);
  },
  onCancel: (data) => {
    console.log('The payment was cancelled!', data);
  },
  onError: (err) => {
    console.log('Error loading Paypal script!', err);
  },
};
 
export default scriptLoader('https://www.paypalobjects.com/api/checkout.js')(PaypalButton);