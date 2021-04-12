import React, { useEffect, useState } from 'react'
import './styles/posts.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faQuestion } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../resources/Loading/Loading';
import { useHistory, Link } from "react-router-dom";
import { getFullUserInfo, getSocialNetworks, updateCreative, insertCreactiveSocials } from '../../apiFunctions/apiFunctions';
import { FaUserAstronaut, FaArrowCircleUp } from 'react-icons/fa';
import {Form, Row, Col, Modal, Button} from 'react-bootstrap';
import SocialNetworks from './SocialNetworks';

const Posts = () => {
    const [loading, setLoading] = useState(true);
    const [fullName, setFullName] = useState('');
    const [socials, setSocials] = useState([]);
    const [socialsSelected, setSocialsSelected] = useState([]);
    const [validation, setValidation] = useState({
        mail: false,
        pwd: false,
        firstName: false,
        lastName: false,
        socials: false,
        justification: false
    });
    const [generalValidation, setGeneralValidation] = useState(false);
    const [email, setEmail] = useState('');
    const [actualPwd, setActualPwd] = useState('');
    const [validatePwd, setValidatePwd] = useState('');
    const [correctPwd, setcorrectPwd] = useState(false);
    const [pwd, setPwd] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showEdit, setShowEdit] = useState(false);
    const history = useHistory();

    const signOff = () =>{
        localStorage.clear();
        history.push("/");
    }

    const getUser = () =>{
        return Number(localStorage.getItem("08191993"));
    }

    const userLoggedIn = () =>{
        if (localStorage.getItem("08191993") === null) {
            return false;
        }else{
            return true;
        }
    }

    const startData = () =>{
        setLoading(true);
        if(userLoggedIn()){
            getFullUserInfo(getUser()).then((x) =>{
                setFullName(x[0].nombre+' '+x[0].apellido);
                setEmail(x[0].email);
                setFirstName(x[0].nombre);
                setLastName(x[0].apellido);
                setActualPwd(x[0].pwd);
                setPwd("12345");
                setSocialsSelected(x);
                getSocialNetworks().then((x) => {
                    setSocials(x);
                }).finally(() => setLoading(false));
            }).finally(() => setLoading(false));
        }else{
            signOff();
        }
    }


    useEffect(() => {
        startData();
    }, []);

    const validationForm = () => {
        if(!(validateEmail(email))){
            validation.mail = true;
            setValidation({...validation});
            return false;
        }else{
            validation.mail = false;
            setValidation({...validation});
        }

        if(pwd === ''){
            validation.pwd = true;
            setValidation({...validation});
            return false;
        }else{
            validation.pwd = false;
            setValidation({...validation});
        }

        if(firstName === ''){
            validation.firstName = true;
            setValidation({...validation});
            return false;
        }else{
            validation.firstName = false;
            setValidation({...validation});
        }

        if(lastName === ''){
            validation.lastName = true;
            setValidation({...validation});
            return false;
        }else{
            validation.lastName = false;
            setValidation({...validation});
        }

        if(socials.length >= 1){
            for(let key in socials){
                if(socials[key].value === ''){
                    validation.socials = true;
                    setValidation({...validation});
                    return false;
                }else{
                    validation.socials = false;
                    setValidation({...validation});
                }
            }
        }

        if(socialsSelected.length >= 1){
            for(let key in socialsSelected){
                if(socialsSelected[key].value === ''){
                    validation.socials = true;
                    setValidation({...validation});
                    return false;
                }else{
                    validation.socials = false;
                    setValidation({...validation});
                }
            }
        }

        return true;
    }

    const updateForm = (e) =>{
        e.preventDefault();
        if(validationForm()){
            setShowEdit(true);
            setGeneralValidation(false);
        }else{
            setGeneralValidation(true);
        }
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const handleCloseEdit = () =>{
        setShowEdit(false);
    }

    const insertCreativeSocials = (id_user) =>{
        let promises = [];       
        for(let i=0; i<socials.length; i++){
            if("value" in socials[i]){
                promises.push(insertCreactiveSocials(id_user, socials[i].id_creatives_social_networks_types, socials[i].value));
            }
        }
        for(let i=0; i<socialsSelected.length; i++){
            if("value" in socialsSelected[i]){
                promises.push(insertCreactiveSocials(id_user, socialsSelected[i].id_creatives_social_networks_type, socialsSelected[i].value));
            }
        }
        return promises;
    };

    const sendForm = () =>{
        if(actualPwd == validatePwd){
            setcorrectPwd(false);
            setLoading(true);
            updateCreative(email, pwd, firstName, lastName, getUser()).then(() =>{
                Promise.all(insertCreativeSocials(getUser())).then((r) =>{
                    //console.log(r);
                }).finally(() => {
                    setShowEdit(false);
                    setLoading(false);
                    startData();
                });
            });
        }else{
            setcorrectPwd(true);
        }

    }

    const help = () =>{

    }


    return (
        <div >
            <div className="d-flex" id="wrapper">

                <div className="bg-light border-right " id="sidebar-wrapper">
                    <div className="sidebar-heading"><h3>Perfil</h3></div>
                    <div className="sidebar-heading">
                        <button className="btn btn-sm btn-outline-dark me-1" onClick={() => signOff()}><FontAwesomeIcon icon={faPowerOff} /></button>
                        <button className="btn btn-sm btn-outline-dark" onClick={() => help()}><FontAwesomeIcon icon={faQuestion} /></button>
                    </div>
                    <div className="list-group list-group-flush">
                        <Link to="/profile/" className="list-group-item list-group-item-action bg-light text-dark"><FaUserAstronaut /> {fullName}</Link>
                        <Link to="/creatives/" className="list-group-item list-group-item-action bg-light">Mis Posts</Link>
                        <Link to="/profile/" className="list-group-item list-group-item-action bg-dark text-white">Mi Perfil</Link>
                        
                    </div>
                </div>

                <div id="page-content-wrapper">

                <div className="container-fluid">
                    {loading ? (
                        <div id="outer" className="container">
                            <div id="inner" className="row">
                                <div className="col-12 text-center">
                                    <Loading></Loading>
                                </div>   
                            </div>
                        </div>
                    ) : 
                        (<>
                            <Modal
                                show={showEdit}
                                onHide={handleCloseEdit}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Body>
                                    <Form>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label>Ingresa la contraseña actual para continuar</Form.Label>
                                            <Form.Control type="password" onChange={(e) => setValidatePwd(e.target.value)} />                                      
                                        </Form.Group>
                                        {correctPwd ? (<div className="alert alert-danger p-1" role="alert"> La contraseña no coincide</div>) : null}
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseEdit}>
                                        Cancelar
                                    </Button>
                                    <Button variant="success" onClick={() => sendForm()}>
                                        Actualizar
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                            <div className="container mt-5 mb-5">
                                <div className="row text-center justify-content-center">
                                    <div className="col-sm-8">
                                        
                                        <Form>
                                            <Form.Group>
                                                {validation.mail ? (<Form.Control type="email" className="border border-danger" onChange={(e) => setEmail(e.target.value)} placeholder="Escribe tu correo electronico" />) 
                                                : (<Form.Control type="email" className="border border-secondary" defaultValue={email} onChange={(e) => setEmail(e.target.value)} placeholder="Escribe tu correo electronico" />)}
                                            </Form.Group>
                                            <Form.Group>
                                                {validation.pwd ? (<Form.Control type="password" className="border border-danger" onChange={(e) => setPwd(e.target.value)} placeholder="Escribe una contraseña" />) 
                                                : (<Form.Control type="password" className="border border-secondary" defaultValue={actualPwd} onChange={(e) => setPwd(e.target.value)} placeholder="Escribe una contraseña" />)}
                                            </Form.Group>
                                            <Form.Group>
                                                <Row>
                                                    <Col>
                                                        {validation.firstName ? (<Form.Control className="border border-danger" onChange={(e) => setFirstName(e.target.value)} placeholder="Primer Nombre" />) 
                                                        : (<Form.Control className="border border-secondary" defaultValue={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Primer Nombre" />)}
                                                    </Col>
                                                    <Col>
                                                        {validation.lastName ? (<Form.Control className="border border-danger" onChange={(e) => setLastName(e.target.value)} placeholder="Apellido" />) 
                                                        : (<Form.Control className="border border-secondary" defaultValue={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Apellido" />)}
                                                    </Col>
                                                </Row>
                                            </Form.Group>

                                            <div className={validation.socials ? "container border border-danger rounded mb-2" : "container border border-secondary rounded mb-2"}>
                                                <div className="row text-left">
                                                    <div className="col-sm-12">
                                                        <p>
                                                            <label className="mt-1 text-muted">Selecciona e indica cual(es) es(son) tu(s) perfil(es) social(es):</label>
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {socialsSelected.map((x, index) => {
                                                    const handleSocialContent = (val) =>{
                                                        x.value = val.value;
                                                    }
                                                    for(let key in socials){
                                                        if(socials[key].id_creatives_social_networks_types === x.id_creatives_social_networks_type){
                                                            socials[key].id_creatives_social_networks_types = 0;
                                                        }
                                                    }
                                                    return (<SocialNetworks key={index} type={x.id_creatives_social_networks_type} default={x.value} edit={1} value={x.title} onChange={handleSocialContent}></SocialNetworks>);
                                                    
                                                })}     
                                                {socials.map((x, index) => {

                                                    const handleSocialContent = (val) =>{
                                                        x.value = val.value;
                                                    }
                                                    if(x.id_creatives_social_networks_types !== 0){
                                                        return (<SocialNetworks key={index} type={x.id_creatives_social_networks_type} edit={0} value={x.title} onChange={handleSocialContent}></SocialNetworks>);
                                                    }

                                                })}                   
                                            </div>
                                            
                                            {generalValidation ? (<div className="container">
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="alert alert-danger p-1 show" role="alert">
                                                            Faltan campos por completar <a onClick={() => window.scroll(0,0)} className="text-danger"><FaArrowCircleUp /></a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>) : null}
                                            <Form.Group>
                                                <button className="btn btn-outline-success col-sm-12" onClick={(e) =>updateForm(e)}>Actualizar</button>
                                            </Form.Group>
                                            <Form.Group>
                                            
                                            </Form.Group>
                                        
                                        </Form>
                                    </div>
                                </div>
                            </div>
                            
                        </>)
                    }
                    
                    
                </div>
                </div>

            </div>
        </div>
    )
}

export default Posts
