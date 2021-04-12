import React, {useEffect, useState} from 'react';
import {getPostsHeader, insertVisitor} from '../../apiFunctions/apiFunctions';
import Loading from '../../resources/Loading/Loading';
import {decode_utf8} from '../../resources/Decode/Decode';
import PostCard from '../Post/PostCard';
import AfterHeader from './AfterHeader';
import { osName, browserVersion, browserName, mobileVendor, mobileModel, engineName, deviceType, deviceDetect } from "react-device-detect";

const Main = () => {
    const [postsHeader, setPostsHeader] = useState([]);
    const [mainPosts, setMainPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPostsHeader().then((x) => {
            setPostsHeader(x);
        }).finally(() => setLoading(false));
        insertVisitor('0', osName, browserVersion, browserName, mobileVendor, mobileModel, engineName, deviceType, deviceDetect);
    }, []);

    return (
        <div>
            {loading ? (<Loading></Loading>) 
            : (<>
            <div className="col-sm-12 bg-dark">
                <div className="row row-cols-1 row-cols-md-4 g-3 p-5 justify-content-center">
                    {postsHeader.map((x, index)=>{
                        return (<div className="col" key={index}>
                            <PostCard idPost={x.id_post} isHeader={1}></PostCard>
                        </div>)
                    })}
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="row p-5 justify-content-center">
                            {postsHeader.map((x, index) =>{
                                return (<AfterHeader type={x.id_post_type} title={decode_utf8(x.name)} isHeader={0} key={index}></AfterHeader>);
                            })}
                        </div>
                    </div>
                </div>
            </div></>
            )}
            
        </div>
    )
}

export default Main
