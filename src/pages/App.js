import React, {useEffect, useState} from 'react';
import SEO from "../components/seo"
import './App.css';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {Navbar, Nav, Image} from 'react-bootstrap';
import './styles/navBar.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Posts from '../components/Posts/Posts';
import Footer from '../components/Footer/Footer';
import Main from '../components/Main/Main';
import Profile from '../components/Posts/Profile';
import {getPostsTypesNavBar} from '../apiFunctions/apiFunctions';
import Loading from '../resources/Loading/Loading';
import NewProfile from '../components/Posts/NewProfile';
import LogoWhite from '../resources/images/Logo/logo_white.png';
import LogoBlack from '../resources/images/Logo/logo_black.png';
import Principal from '../components/Principal/Principal';
import TermsConditions from '../components/TermsConditions/TermsConditions';
import PrivacyConditions from '../components/TermsConditions/PrivacyConditions';
import AdsWithUs from '../components/AdsWithUs/AdsWithUs';
import LastPost from '../components/Post/LastPost';

const IndexPage = () =>{

  const [loading, setLoading] = useState(true);
  const [postsTypes, setPostsTypes] = useState([]);
  const [navBarTheme, setNavBarTheme] = useState("dark");
  const [logo, setLogo] = useState(LogoWhite);

  useEffect(() => {
    getPostsTypesNavBar().then((y) => {
      setPostsTypes(y);
  }).finally(() => setLoading(false));
  }, []);

  const listener = () => {
    if(-document.body.getBoundingClientRect().top > 400){
      setNavBarTheme("light");
      setLogo(LogoBlack);
    }else{
      setNavBarTheme("dark");
      setLogo(LogoWhite);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => {
      window.removeEventListener("scroll", listener);
    };
  });

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } 

  function decode_utf8(s) {
    return decodeURIComponent(escape(s));
  }

return (
  <div className="App">
    {loading ? (<div id="outer" className="container">
      <div id="inner" className="row">
        <div className="col-12 text-center">
          <Loading></Loading>
        </div>   
      </div>
    </div>): 
    (
    <>
      <SEO title="Home" />
      <Navbar bg={navBarTheme} variant={navBarTheme} fixed="top" expand="lg">
        <Navbar.Brand className="ms-2"><Link to="/"><Image src={logo} width="150" fluid /></Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto fontBold fw-bolder">
            {postsTypes.map((x, index) =>{
                return (<Nav.Link key={index} className="socialNetworkPost rounded" href={"/"+removeAccents(decode_utf8(x.name.replace(/\s/g, '')).toLowerCase())+"/"}>{decode_utf8(x.name)}</Nav.Link>);
            })}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="flex-shrink-0 main-container content">
        <main>
          <Router>
            <Switch>
              <Route exact path='/' component={Main} />
              <Route path="/creatives" component={Posts} />
              <Route path="/holaCreativo" component={NewProfile} />
              <Route path="/profile" component={Profile} />
              <Route path="/terminosycondiciones" component={TermsConditions} />
              <Route path="/avisodeprivacidad" component={PrivacyConditions} />
              <Route path="/anunciateconnosotros" component={AdsWithUs} />
              <Route path="/loultimo" component={LastPost} />
              {postsTypes.map((x, index) =>{
                return (<Route key={index} path={"/"+removeAccents(decode_utf8(x.name.replace(/\s/g, '')).toLowerCase())+"/:id?/:titulo?"} render={(props) => (
                  <Principal {...props} idType={x.id_post_type} type={x.name} />
                )} />);
              })}
            </Switch>    
          </Router>
        </main>
      </div>
      <Footer></Footer>
    </>
    )
    }

  </div>
);
} 

export default IndexPage
