import React, {Component} from 'react';
import {render} from 'react-dom';
import Header from './header.js';
import Footer from './footer.js';
import Login from './login.js';


export const Main = props => {
  return (
    <div>
      <Header />
        <div className="cf-content">
          {props.children}
        </div>
      <Footer />
    </div>
    )
}