import React, {useEffect, useState} from 'react'
import { getPostsByType, insertVisitor } from '../../apiFunctions/apiFunctions';
import Loading from '../../resources/Loading/Loading';
import moment from 'moment';
import 'moment/locale/es';
import {decode_utf8, removeAccents} from '../../resources/Decode/Decode';
import { useHistory, Link } from "react-router-dom";
import { osName, browserVersion, browserName, mobileVendor, mobileModel, engineName, deviceType, deviceDetect } from "react-device-detect";
import HelpImage from '../../resources/images/Helping/helping.png';
import Idea from '../../resources/images/Helping/Idea2.jpg';
import Team from '../../resources/images/Helping/Team.jpg';
import Creativity from '../../resources/images/Helping/Creativity.jpg';

const AdsWithUs = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        
        insertVisitor("0.0", osName, browserVersion, browserName, mobileVendor, mobileModel, engineName, deviceType, deviceDetect).finally(() => setLoading(false));
    }, [])

    return (
        <div>
            {loading ? (
                <div id="outer" className="container">
                    <div id="inner" className="row">
                        <div className="col-12 text-center">
                            <Loading></Loading>
                        </div>   
                    </div>
                </div>
            ) 
            : (<>
                <div className="col-sm-12 bg-dark p-5">
                    <div className="row  text-white text-center">
                        <div className="col-sm-12">
                            <img src={HelpImage} className="img-fluid" alt="De la mano, ayudando" />
                            <h1 className="fw-bolder">Mas alla del Storytelling</h1>
                        </div>
                        
                    </div>
                    
                    <div className="row text-white">
                        <div className="col-sm-12 fs-3">
                            <p>Comprender y adoptar la tecnología se ha vuelto esencial para nuestra forma de vida: cómo trabajamos, cómo nos divertimos, cómo compramos, cómo aprendemos y, en última instancia, cómo nos conectamos con otras personas y el mundo que nos rodea. AGUSTIRRI aporta experiencia y entusiasmo de renombre mundial a nuestro contenido galardonado sobre la cultura actual impulsada por la tecnología, lo que nos convierte en una autoridad confiable en todo lo relacionado con la tecnología.</p>
                        </div>
                    </div>
                </div> 
                <div className="container">
                    <div className="row p-1 justify-content-center mb-5 mt-3">                         
                        <div className="container">
                            <div className="row text-center mt-5 mb-3">
                                <img src={Idea} className="img-thumbnail w-75 mx-auto d-block" alt="De la mano, ayudando" />
                                <h2 className="fw-bolder mt-3">Cosas que podríamos hacer juntos</h2>
                            </div>
                            <div className="row mt-5 mb-3">
                                <h4 className="">Nuestra amplia cartera de editores premium llega a los consumidores dondequiera que se encuentren en su camino de compra, desde el descubrimiento y el conocimiento, la consideración y la intención, hasta la compra y la publicación.</h4>
                            </div>
                            <div className="row mt-5 mb-3">
                                <div className="col-sm mt-5 align-middle">
                                    <div className="card-group">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title fw-bolder">Integración de contenido editorial</h5>
                                                <p className="card-text">alineado con nuestras voces, series y reseñas de expertos.</p>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title fw-bolder">Pruebas y optimización de contenido</h5>
                                                <p className="card-text">análisis humano + automatización de alta velocidad.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-group">
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title fw-bolder">Distribución del contenido</h5>
                                                <p className="card-text">entregando compradores calificados que están preparados y listos para comprar, publicidad donde tiene que ir.</p>
                                            </div>
                                        </div>
                                        <div className="card">
                                            <div className="card-body">
                                                <h5 className="card-title fw-bolder">Estadísticas de la audiencia y segmentación profunda</h5>
                                                <p className="card-text">proporcionar información, personalización, optimización y análisis.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm">
                                    <img src={Creativity} className="img-thumbnail w-75 mx-auto d-block" alt="De la mano, ayudando" />
                                </div>
                                

                            </div>
                            <div className="row text-center mt-5 mb-3">
                                <h5 className="">¡Trabajemos juntos! Ponte en contacto: <a href="mailto:mequieroanunciar@agustirri.com?Subject=Me%20quiero%20anunciar%20en%20Agustirri" className="btn btn-outline-dark btn-sm">mequieroanunciar@agustirri.com</a></h5>
                            </div>
                        </div>         
                    </div>
                </div>    
            </>)}
        </div>
    )
}

export default AdsWithUs