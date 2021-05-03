/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, {useEffect, useState} from 'react';
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import LogoWhite from '../resources/images/Logo/logo_white.png';
import LogoBlack from '../resources/images/Logo/logo_black.png';

import Header from "./header"
import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
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
          <main>{children}</main>
        </div>
        <Footer></Footer>
      </>
      )
      }

    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
