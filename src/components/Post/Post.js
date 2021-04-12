import React, {useEffect, useState} from 'react';
import Loading from '../../resources/Loading/Loading';
import {getPostContent, getFullUserInfo, getLastThreeByType, insertVisitor} from '../../apiFunctions/apiFunctions';
import { useHistory } from "react-router-dom";
import {decode_utf8, firsLetterUpperCase, removeAccents} from '../../resources/Decode/Decode';
import { FaInstagram, FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaGithub,FaArrowCircleDown, FaTwitch } from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import moment from 'moment';
import 'moment/locale/es';
import './styles/Post.css';
import PostCard from './PostCard';
import { osName, browserVersion, browserName, mobileVendor, mobileModel, engineName, deviceType, deviceDetect } from "react-device-detect";
import {Helmet} from "react-helmet";

const Post = (props) => {
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState([]);
    const [socialUserNetworks, setSocialUserNetworks] = useState([]);
    const [date, setDate] = useState('');
    const [author, setAuthor] = useState('');
    const [styleBtn, setStyleBtn] = useState({});
    const [recommendations, setRecommendations] = useState({});
    const [noRecommendations, setNoRecommendations] = useState(false);

    const history = useHistory();

    const btnTypes = (type) =>{
        if(type === 1){
            setStyleBtn({
                color: '#4080FF'
            });
        }else if(type === 2){
            setStyleBtn({
                color: '#219634'
            });
        }else if(type === 3){
            setStyleBtn({
                color: '#7db0e3'
            });
        }else if(type === 4){
            setStyleBtn({
                color: '#ad8980'
            });
        }else if(type === 5){
            setStyleBtn({
                color: '#617B92'
            });
        }else if(type === 6){
            setStyleBtn({
                color: '#F00000'
            });
        }else if(type === 7){
            setStyleBtn({
                color: '#098765'
            });
        }else if(type === 8){
            setStyleBtn({
                color: '#955286'
            });
        }
    } 

    useEffect(() => {
        getPostContent(props.id).then((x) =>{
            if(x===0){
                history.push("/");
            }
            
            document.title = props.titulo.replace(/-/g, ' ');
            getFullUserInfo(x[0].id_user).then((y)=>{
                setSocialUserNetworks(y);
                btnTypes(x[0].id_post_type);
                setAuthor(y[0].nombre+' '+y[0].apellido);
                
                moment.locale('es');
                setDate(moment(x[0].date_created).format('LLLL'));
                setPost(x);
            }).finally(() => setLoading(false));
        });
        getLastThreeByType(props.id).then((x) =>{
            //console.log("ss",x);
            if(x != 0){
                setNoRecommendations(true);
                setRecommendations(x);
            }
        });
        insertVisitor(String(props.id), osName, browserVersion, browserName, mobileVendor, mobileModel, engineName, deviceType, deviceDetect);
    }, []);

    const sendToCategory = (e) =>{
        e.preventDefault();
        history.push("/"+removeAccents(decode_utf8(post[0].name.replace(/\s/g, '')).toLowerCase())+"/");
    }

    /*const renderMeta = () =>{
        document.querySelector('meta[name="description"]').setAttribute("content", "");
    }*/

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

            <div className="col-sm-12 bg-dark">
                <div className="row p-5 text-white">
                    <div className="col-sm-3 m-2">
                        <button className="btn btn-outline-light btn-sm" style={styleBtn} onClick={(e) => sendToCategory(e)}>{decode_utf8(post[0].name)}</button>
                    </div>
                    <h1 className="fw-bolder">{props.titulo.replace(/-/g, ' ')}</h1>
                    <h5 className="mt-2">{decode_utf8(post[0].short_content)}</h5>
                    <small className="mt-2">por: <span className="nameAuthorPost">{author}</span> | {firsLetterUpperCase(date)}{/*
                        socialUserNetworks.map((x:any, index:any) =>{
                            if(x.id_creatives_social_networks_type === 1){
                                return (<a className="btn btn-link btn-sm p-1 me-1 text-white socialNetworkPost" href={x.value} target="_blank" key={index}><FaInstagram /></a>);
                            }else if(x.id_creatives_social_networks_type === 2){
                                return (<a className="btn btn-link btn-sm p-1 me-1 text-white socialNetworkPost" href={x.value} target="_blank" key={index}><FaFacebookF /></a>);
                            }else if(x.id_creatives_social_networks_type === 3){
                                return (<a className="btn btn-link btn-sm p-1 me-1 text-white socialNetworkPost" href={x.value} target="_blank" key={index}><FaTwitter /></a>);
                            }else if(x.id_creatives_social_networks_type === 4){
                                return (<a className="btn btn-link btn-sm p-1 me-1 text-white socialNetworkPost" href={x.value} target="_blank" key={index}><FaLinkedinIn /></a>);
                            }else if(x.id_creatives_social_networks_type === 5){
                                return (<a className="btn btn-link btn-sm p-1 me-1 text-white socialNetworkPost" href={x.value} target="_blank" key={index}><SiTiktok /></a>);
                            }else if(x.id_creatives_social_networks_type === 6){
                                return (<a className="btn btn-link btn-sm p-1 me-1 text-white socialNetworkPost" href={x.value} target="_blank" key={index}><FaYoutube /></a>);
                            }else if(x.id_creatives_social_networks_type === 7){
                                return (<a className="btn btn-link btn-sm p-1 me-1 text-white socialNetworkPost" href={x.value} target="_blank" key={index}><FaGithub /></a>);
                            }else if(x.id_creatives_social_networks_type === 8){
                                return (<a className="btn btn-link btn-sm p-1 me-1 text-white socialNetworkPost" href={x.value} target="_blank" key={index}><FaTwitch /></a>);
                            }
                        })*/
                    }</small>
                </div>
            </div>
            <div className="container">
                <div className="row p-1 justify-content-center mb-5">                         
                    {post.slice(1).map((x, index)=>{
                        if(x.id_post_attachment_type === 1){
                                return (
                                    <div className="col-sm-10 mb-4 text-center contentHtml fs-5" key={index}>
                                        <div key={index} dangerouslySetInnerHTML={{ __html: x.content }} />
                                    </div>);
                        }else if(x.id_post_attachment_type === 2){
                                return (
                                    <div className="col-sm-10 mb-4 text-center contentHtml fs-5" key={index}>
                                        <div key={index} dangerouslySetInnerHTML={{ __html: x.content }} />
                                    </div>);
                        }else if(x.id_post_attachment_type === 3){
                                return (
                                    <div className="col-sm-10 mb-4 text-center contentHtml fs-5" key={index}>
                                        <div key={index} dangerouslySetInnerHTML={{ __html: x.content }} />
                                    </div>);
                        }else if(x.id_post_attachment_type === 4){
                                return (
                                    <div className="col-sm-10 mb-4 text-center contentHtml fs-5" key={index}>
                                        <div key={index} dangerouslySetInnerHTML={{ __html: x.content }} />
                                    </div>);
                        }else if(x.id_post_attachment_type === 5){
                                return(
                                    <div className="col-sm-10 text-center mb-4" key={index}>
                                        <div className="card col-sm-12 border-0">
                                            <img src={x.img} className="mx-auto d-block img-fluid mb-1 card-img-top-post" alt={decode_utf8(x.content)} />
                                            <div className="card-footer text-muted" >
                                                {decode_utf8(x.content)}
                                            </div>
                                        </div>
                                    </div>);
                        }else if(x.id_post_attachment_type === 6){
                                return (
                                    <div className="col-sm-10 mb-4 contentHtml fs-5" key={index}>
                                        <div key={index} dangerouslySetInnerHTML={{ __html: x.content }} />
                                    </div>);
                            
                        }
                    })}                      
                </div>
                
                
                {noRecommendations ? (
                    <>
                        <div className="row text-center mb-5">
                            <div >
                                <FaArrowCircleDown className="bigBorderHover" />
                            </div>
                        </div>
                        <div className="row text-center mb-5">
                            <div className="d-grid gap-2">
                                <a href="" className="btn btn-dark post-card">Ver mas</a>
                            </div>
                        </div>
                        <div className="row row-cols-1 row-cols-md-3 g-4 p-5 justify-content-center">
                            {recommendations.map((x, index)=>{
                                return (<div className="col" key={index}>
                                    <PostCard idPost={x.id_post} isHeader={0}></PostCard>
                                </div>)
                            })}
                        </div>
                    </>
                ) : null}
                
            </div></>
            )}
        </div>
    )
}

export default Post
