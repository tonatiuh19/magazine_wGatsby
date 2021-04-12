import React, {useState, useEffect} from 'react';
import {getMainPostsbyType} from '../../apiFunctions/apiFunctions';
import PostCard from '../Post/PostCard';
import { useHistory } from "react-router-dom";

const AfterHeader = (props) => {
    const [posts, setposts] = useState([]);
    const [loading, seLloading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        getMainPostsbyType(props.type).then((x) =>{
            setposts(x);
        });
    }, []);

    const openCategory = (e) =>{
        e.preventDefault();
        history.push("/"+props.title);
    }

    return (
        <div className="container">
            <div className="row text-center">
                <h1>{props.title}</h1>
            </div>
            <div className="row row-cols-1 row-cols-md-3 g-4 p-5 justify-content-center">
                {posts.map((x, index) =>{
                    return (<div className="col" key={index}>
                    <PostCard idPost={x.id_post}></PostCard>
                </div>);
                })}
            </div>
            <div className="row text-center mb-5">
                <div className="d-grid gap-2">
                    <a href="" onClick={(e) => openCategory(e)} className="btn btn-dark post-card">Ver mas</a>
                </div>
            </div>
        </div>
    )
}

export default AfterHeader
