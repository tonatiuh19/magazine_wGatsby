import React, {useEffect, useState} from 'react';
import { useHistory, Link } from "react-router-dom";
import Loading from '../../resources/Loading/Loading';
import {Form, Row, Col, Modal, Button} from 'react-bootstrap';
import {getSocialNetworks, insertCreactive, insertCreactiveSocials } from '../../apiFunctions/apiFunctions';
import SocialNetworks from './SocialNetworks';
import { FaArrowCircleUp, FaMagic } from 'react-icons/fa';

const NewProfile = () => {

    const [loading, setLoading] = useState(true);
    const [socials, setSocials] = useState([]);
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
    const [pwd, setPwd] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [justification, setJustification] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const history = useHistory();

    const signOff = () =>{
        localStorage.clear();
        history.push("/");
    }

    const userLoggedIn = () =>{
        if (localStorage.getItem("08191993") === null) {
            return false;
        }else{
            return true;
        }
    }

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

        /*if(socials.length >= 1){
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
        }*/

        if(justification === ''){
            validation.justification = true;
            setValidation({...validation});
            return false;
        }else{
            validation.justification = false;
            setValidation({...validation});
        }

        return true;
    }

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    useEffect(() => {
        if(userLoggedIn()){
            history.push("/creatives");
        }else{
            getSocialNetworks().then((x) => {
                setSocials(x);
            }).finally(() => setLoading(false));
        }
    }, []);

    const insertCreativeSocials = (id_user) =>{
        let promises = [];       
        for(let i=0; i<socials.length; i++){
            if("value" in socials[i]){
                promises.push(insertCreactiveSocials(id_user, socials[i].id_creatives_social_networks_types, socials[i].value));
            }
        }
        return promises;
    };

    const sendForm = (e) =>{
        e.preventDefault();
        if(validationForm()){
            setGeneralValidation(false);
            setLoading(true);
            insertCreactive(email, pwd, firstName, lastName, justification).then((x) => {
                Promise.all(insertCreativeSocials(x[0].id_user)).then(function (results) {
                    //console.log(results);
                }).finally(() => {
                    setLoading(false);
                    setShowSuccess(true);
                });
            });
        }else{
            setGeneralValidation(true);
        }
    }

    const handleCloseSuccess = () =>{
        setShowSuccess(false);
        history.push("/");
    }

    return (
        <div className="container mb-5">
            {loading ? (<div id="outer" className="container">
                <div id="inner" className="row">
                    <div className="col-sm-12 text-center">
                        <Loading></Loading>
                    </div>   
                </div>
            </div>) :
            (<>
            <Modal
                show={showSuccess}
                onHide={handleCloseSuccess}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>Te haz registrado con exito  <FaMagic /></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Enseguida nos pondremos en contacto contigo con instrucciones cuando tu cuenta se encuentre activa.
                </Modal.Body>
                <Modal.Footer>
                <Button variant="success" onClick={handleCloseSuccess}>
                    Entendido
                </Button>
                </Modal.Footer>
            </Modal>
            <div className="container mt-5">
                <div className="row text-center">
                    <div className="col-sm-12">
                        <h1>Bienvenido</h1>
                    </div>
                </div>
                <div className="row text-center justify-content-center">
                    <div className="col-sm-8">
                        
                        <Form>
                            <div className="mb-3">
                                {validation.mail ? (<input type="email" className="form-control border border-danger" onChange={(e) => setEmail(e.target.value)} placeholder="Escribe tu correo electronico" />) 
                                : (<input type="email" className="form-control border border-secondary" onChange={(e) => setEmail(e.target.value)} placeholder="Escribe tu correo electronico" />)}
                            </div>
                            <div className="mb-3">
                                {validation.pwd ? (<input type="password" className="form-control border border-danger" onChange={(e) => setPwd(e.target.value)} placeholder="Escribe una contraseña" />) 
                                : (<input type="password" className="form-control border border-secondary" onChange={(e) => setPwd(e.target.value)} placeholder="Escribe una contraseña" />)}
                            </div>
                            <div className="mb-3">
                                <Row>
                                    <Col>
                                        {validation.firstName ? (<input className="form-control border border-danger" onChange={(e) => setFirstName(e.target.value)} placeholder="Primer Nombre" />) 
                                        : (<input className="form-control border border-secondary" onChange={(e) => setFirstName(e.target.value)} placeholder="Primer Nombre" />)}
                                    </Col>
                                    <Col>
                                        {validation.lastName ? (<input className="border border-danger" onChange={(e) => setLastName(e.target.value)} placeholder="Apellido" />) 
                                        : (<input className="form-control border border-secondary" onChange={(e) => setLastName(e.target.value)} placeholder="Apellido" />)}
                                    </Col>
                                </Row>
                            </div>

                            {/*<div className={validation.socials ? "container border border-danger rounded mb-2" : "container border border-secondary rounded mb-2"}>
                                <div className="row text-left">
                                    <div className="col-sm-12">
                                        <p>
                                            <label className="mt-1 text-muted">Selecciona e indica cual(es) es(son) tu(s) perfil(es) social(es):</label>
                                        </p>
                                    </div>
                                </div>
                                
                                {socials.map((x:any, index:any) => {

                                    const handleSocialContent = (val:any) =>{
                                        x.value = val.value;
                                    }
                                    return (<SocialNetworks key={index} type={x.id_creatives_social_networks_types} edit={0} value={x.title} onChange={handleSocialContent}></SocialNetworks>);
                                })}                            
                            </div>*/}
                            
                            <div className="mb-3">
                                {validation.justification ? (<textarea className="form-control border border-danger" onChange={(e) => setJustification(e.target.value)} placeholder="¿Porque te gustaría publicar en pocas palabras tus articulos/notas/noticias/... en Agustirri?" rows={3} />) 
                                : (<textarea className="form-control border border-secondary" onChange={(e) => setJustification(e.target.value)} placeholder="¿Porque te gustaría publicar en pocas palabras tus articulos/notas/noticias/... en Agustirri?"  rows={3} />)}
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
                            <div className="mb-3">
                                <button className="btn btn-outline-success col-sm-12" onClick={(e) =>sendForm(e)}>Enviar</button>
                            </div>
                            <div className="mb-3">
                                <div className="form-check">
                                    <label className="form-check-label text-muted" >Al enviar acepto <Link to="/terminosycondiciones">Terminos y condiciones</Link> y <Link to="/avisodeprivacidad">Politicas de privacidad.</Link></label>
                                </div>
                            </div>
                          
                        </Form>
                    </div>
                </div>
            </div></>)}
        </div>
    )
}

export default NewProfile
