import React, {useEffect, useState} from 'react';
import {getLastPost} from '../../apiFunctions/apiFunctions';
import Loading from '../../resources/Loading/Loading';
import Post from './Post';
import {decode_utf8, firsLetterUpperCase, removeAccents} from '../../resources/Decode/Decode';

const LastPost = () => {
    const [id, setId] = useState(0);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getLastPost().then((x) =>{
            setId(x[0].id_post);
            setTitle(x[0].titulo);
        }).finally(() => setLoading(false));
    }, [])

    return (
        <div>
            {loading ? (<div id="outer" className="container">
                <div id="inner" className="row">
                    <div className="col-12 text-center">
                        <Loading></Loading>
                    </div>   
                </div>
            </div>) : 
            (<Post id={id} titulo={decode_utf8(title)}></Post>)}
        </div>
    )
}

export default LastPost
