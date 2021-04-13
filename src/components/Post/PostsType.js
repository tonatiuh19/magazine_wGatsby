import React, {useEffect, useState} from 'react'
import { getPostsByType, insertVisitor } from '../../apiFunctions/apiFunctions';
import Loading from '../../resources/Loading/Loading';
import moment from 'moment';
import 'moment/locale/es';
import {decode_utf8, removeAccents} from '../../resources/Decode/Decode';
import { useHistory, Link } from "react-router-dom";
import { osName, browserVersion, browserName, mobileVendor, mobileModel, engineName, deviceType, deviceDetect } from "react-device-detect";
import {Helmet} from "react-helmet";

const PostsType = (props) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        getPostsByType(props.idType).then((x) =>{
            setPosts(x);
        }).finally(() => setLoading(false));
        insertVisitor("0."+String(props.idType), osName, browserVersion, browserName, mobileVendor, mobileModel, engineName, deviceType, deviceDetect);
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
                <div className="col-sm-12 bg-dark">
                    <div className="row p-5 text-white text-center">
                        <div className="col-sm-12">
                            <h1 className="fw-bolder">{decode_utf8(props.type)}</h1>
                        </div>
                        
                    </div>
                </div>
                <div className="container">
                    <div className="row p-1 justify-content-center mb-5">                         
                        {posts.map((x, index) =>{
                            moment.locale('es');
                            return (
                                
                                <div className="card h-100 border-dark post-card bg-dark mb-3" key={index}>
                                    <Link to={"/"+removeAccents(decode_utf8(props.type.replace(/\s/g, '')).toLowerCase())+"/"+x.id_post+"/"+decode_utf8(x.titulo)} style={{textDecoration: 'none'}}>
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                                <img src={x.img} className="card-img-top p-2" />
                                            </div>
                                            <div className="col-md-8 bg-dark text-white">
                                                <div className="card-body bg-dark text-white">
                                                    <h3 className="card-title">{decode_utf8(x.titulo)}</h3>
                                                    <p className="card-text">{decode_utf8(x.short_content)}</p>
                                                    <p className="card-text"><small className="text-muted">{moment(x.date_created).format('LLLL')}</small></p>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}               
                    </div>
                </div>    
            </>)}
        </div>
        );
}

export default PostsType
