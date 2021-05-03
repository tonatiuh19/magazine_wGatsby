import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css';
import './styles/navBar.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Main from '../components/Main/Main';
import Layout from '../components/layout';

const IndexPage = () =>{
  return (
    <Router forceRefresh={true}>
      <App></App>
    </Router>
  );
} 

export default IndexPage
