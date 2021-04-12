import React, { useEffect, useState } from 'react'
import './styles/posts.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff, faPlusCircle, faTimesCircle, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { BsFillImageFill, BsTextIndentLeft, BsTrash, BsPencil, BsFillEyeFill } from 'react-icons/bs';
import { FiDelete } from 'react-icons/fi';
import { GrYoutube, GrFacebook, GrInstagram, GrTwitter } from 'react-icons/gr';
import { FaUserAstronaut } from 'react-icons/fa';
import { getUserInfo, getPostsbyUser, getPostsTypes, insertPost, insertPostTypes, insertPostTypesWithImage, deActivatePost, insertPostImage } from '../../apiFunctions/apiFunctions';
import Loading from '../../resources/Loading/Loading';
import {Form, Modal, Button} from 'react-bootstrap';
import { useHistory, Link } from "react-router-dom";
import {decode_utf8} from '../../resources/Decode/Decode';
import Moment from 'moment';
import ReactPaginate from 'react-paginate';

import ImagePost from './ImagePost';
import EditorPost from './EditorPost';
import YoutubePost from './YoutubePost';
import InstagramPost from './InstagramPost';
import TwitterPost from './TwitterPost';
import FacebookPost from './FacebookPost';
import EditPost from './EditPost';
import GeneralError from '../../resources/Error/GeneralError';

const Posts = () => {
    const [loading, setLoading] = useState(true);
    const [noPosts, setNoPosts] = useState(false);
    const [posts, setPosts] = useState([]);
    const [postsTypes, setPostsTypes] = useState([]);
    const [postNewContent, setPostNewContent] = useState([{}]);
    const [newPostStatus, setNewPostStatus] = useState(false);
    const [editPostStatus, setEditPostStatus] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [title, setTitle] = useState('');
    const [short, setShort] = useState('');
    const [titleError, setTitleError] = useState(false);
    const [shortError, setShortError] = useState(false);
    const [category, setCategory] = useState(0);
    const [categoryError, setCategoryError] = useState(false);
    const [error, setError] = useState(false);
    const [url, setURL] = useState('');
    const [productImagePost, setProductImage] = useState('');
    const [errorImagePost, setErrorImagePost] = useState(false);
    const [errorImageTextPost, setErrorImageTextPost] = useState('Necesitas incluir una imagen');
    const [image, setImagePost] = useState({ raw: "" });
    const [generalError, setGeneralError] = useState(false);
    const [fullName, setFullName] = useState("");
    const history = useHistory();

    const [showDelete, setShowDelete] = useState(false);
    const [deletePostID, setDeletePost] = useState(0);

    const [idPostEdit, setIdPostEdit] = useState(0);
    const [titlePostEdit, setTitlePostEdit] = useState('');
    const [typePostEdit, setTypePostEdit] = useState(0);
    const [shortEdit, setShortEdit] = useState('');
    const [dateToPublishEdit, setDateToPublishEdit] = useState('');

    const [showInactive, setShowInactive] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [datePublishError, setDatePublishError] = useState(false);

    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [pageCount, setPageCount] = useState(0);

    const signOff = () =>{
        localStorage.clear();
        history.push("/");
    }

    const getUser = () =>{
        return Number(localStorage.getItem("08191993"));
    }

    const addTotEditor = (e, type) =>{
        e.preventDefault();
        //console.log(postNewContent);
        setPostNewContent([...postNewContent, {
            id: 0,
            type: type,
            content: '',
            valid: false
        }]);
    }

    const renderAdd = () =>{
        return (<div className="container">
            <div className="row">
                <div className="col-sm-2"><button className="btn btn-outline-dark" onClick={(e) => addTotEditor(e, 6)}><BsTextIndentLeft /></button></div>
                <div className="col-sm-2"><button className="btn btn-outline-dark" onClick={(e) => addTotEditor(e, 5)}><BsFillImageFill /></button></div>
                <div className="col-sm-2"><button className="btn btn-outline-dark" onClick={(e) => addTotEditor(e, 1)}><GrYoutube /></button></div>
                <div className="col-sm-2"><button className="btn btn-outline-dark" onClick={(e) => addTotEditor(e, 2)}><GrInstagram /></button></div>
                <div className="col-sm-2"><button className="btn btn-outline-dark" onClick={(e) => addTotEditor(e, 4)}><GrFacebook /></button></div>
                <div className="col-sm-2"><button className="btn btn-outline-dark" onClick={(e) => addTotEditor(e, 3)}><GrTwitter /></button></div>
            </div>
        </div>);
    }

    const handleRemoveItem = (e, id) => {
        //console.log(postNewContent);
        e.preventDefault();
        setPostNewContent(postNewContent.filter((item) => item.id !== id));
    };

    const validatePost = () =>{
        if(title === ''){
            setTitleError(true);
            return false;
        }else{
            setTitleError(false);
        }

        if(short === ''){
            setShortError(true);
            return false;
        }else{
            setShortError(false);
        }

        if(startDate === ''){
            setDatePublishError(true);
            return false;
        }else{
            setDatePublishError(false);
        }

        if(image.raw === ""){
            setErrorImagePost(true);
            return false;
        }else{
            setErrorImagePost(false);
        }

        if(category === 0){
            setCategoryError(true);
            return false;
        }else{
            setCategoryError(false);
        }

        for (let index = 1; index < postNewContent.length; index++) {
            if(postNewContent[index].valid === false){
                return false;
            }
        }
        return true;
    }

    const insertPostsTypes = (id_post) =>{
        let promises = [];       
        for(let i=1; i<postNewContent.length; i++){
            if(postNewContent[i].type !== 5){
                /*promises.push({
                    id_post: id_post, 
                    type: postNewContent[i].type, 
                    content: postNewContent[i].content, 
                    id: postNewContent[i].id
                });*/
                promises.push(insertPostTypes(id_post, postNewContent[i].type, postNewContent[i].content, postNewContent[i].id));
            }
        }
        return promises;
    };

    const insertPostsTypesWithImage = (id_post) =>{
        let promises = [];       
        for(let i=1; i<postNewContent.length; i++){
            if(postNewContent[i].type === 5){
                /*promises.push({
                    raw: postNewContent[i].raw, 
                    id_post: id_post, 
                    content: postNewContent[i].content, 
                    type: postNewContent[i].type,
                    id: postNewContent[i].id
                });*/
                promises.push(insertPostTypesWithImage(postNewContent[i].raw, id_post, postNewContent[i].type, postNewContent[i].content, postNewContent[i].id));
            }
        }
        return promises;
    };

    const publish = (e) => {
        e.preventDefault();
        //console.log(validatePost());
        if(!validatePost()){
            setError(true);
            setErrorText('Necesitas completar todos los campos');
        }else{
            setError(false);
            setLoading(true);
            insertPost(getUser(), title, category, short, startDate).then((x) => {
                insertPostImage(image.raw, x[0].id_post).finally(() => setLoading(false));
                Promise.all(insertPostsTypes(x[0].id_post)).then(function (results) {
                    //console.log(results);
                });
                //console.log(insertPostsTypesWithImage(x[0].id_post));
                Promise.all(insertPostsTypesWithImage(x[0].id_post)).then(function (resultss) {
                    //console.log(resultss);
                });
            }).then(() =>{
                setErrorText('');
                setPostNewContent([{}]);
                setError(false);
                setNewPostStatus(false);
                setImagePost({ raw: "" });
                setURL('');
                setProductImage('');
            }).finally(() => {
                startInfo();
            });
        }
        
    };

    const cancelPost = () =>{
        setErrorText('');
        setPostNewContent([{}]);
        setError(false);
        setNewPostStatus(false);
        setImagePost({ raw: "" });
        setURL('');
        setProductImage('');
    }

    const editPost = (id, title, type, short, dateToPublish) =>{
        setNewPostStatus(true);
        setEditPostStatus(true);
        setIdPostEdit(id);
        setTitlePostEdit(title);
        setTypePostEdit(type);
        setShortEdit(short);
        setDateToPublishEdit(dateToPublish);
    }

    const cancelEditPost = (from) =>{
        if(from === 1){
            setErrorText('');
            setPostNewContent([{}]);
            setError(false);
            setNewPostStatus(false);
            setEditPostStatus(false);
            startInfo();
        }else{
            setErrorText('');
            setPostNewContent([{}]);
            setError(false);
            setNewPostStatus(false);
            setEditPostStatus(false);
        }
        
    }

    const deletePost = () =>{
        setShowDelete(false);
        setLoading(true);
        deActivatePost(deletePostID).then(()=>{
            getPostsbyUser(getUser()).then((x) =>{
                getPostsTypes().then((y) => {
                    setPostsTypes(y);
                });
                if(x === 0){
                    setNoPosts(true);
                }else{
                    const slice = x.slice(offset, offset + perPage)
                    setPosts(slice);
                    setPageCount(Math.ceil(x.length / perPage));
                }
            }).finally(() => {setLoading(false);});
        });
    }

    const handleCloseDelete = () =>{
        setShowDelete(false);
    }

    const handleChangeImagePost = (e) =>{
        if(validateImagePost(e.target.files[0])){
            if (e.target.files.length) {
                setURL(URL.createObjectURL(e.target.files[0]));
                setImagePost({
                  
                  raw: e.target.files[0]
                });
                setErrorImagePost(false);
              }else{
                setErrorImagePost(true);
              }
        }

    }

    const validateImagePost = (file) =>{
        let fileNameArr =  file.name.split(".");
        let filename = fileNameArr[fileNameArr.length-1];
        if (!(filename === "png" || filename === "jpg" || filename === "JPG" || filename === "PNG" || filename === "jpeg" || filename === "JPEG")) {
            setErrorImageTextPost("Solo se soportan archivos png o jpg");
            return false;
        }
        if (file.size > 3195432) {
           setErrorImageTextPost("Solo se soportan archivos menores a 3 MB");
           return false;
        }
        setErrorImagePost(false);
        return true;
    }

    const startInfo = () =>{
        setLoading(true);
        getPostsbyUser(getUser()).then((x) =>{
            
            if(!Array.isArray(x) && x !== 0){
                setGeneralError(true);
                signOff();
            }
            getPostsTypes().then((y) => {
                setPostsTypes(y);
            });
            if(x === 0){
                //console.log("no");
                setNoPosts(true);
            }else{
                setNoPosts(false);
                const slice = x.slice(offset, offset + perPage)
                setPosts(slice);
                setPageCount(Math.ceil(x.length / perPage));
            }
        }).finally(() => {
            setLoading(false);
            window.scrollTo(0, 0)
        });
    }

    const userLoggedIn = () =>{
        if (localStorage.getItem("08191993") === null) {
            return false;
        }else{
            return true;
        }
    }

    useEffect(() => {
        if(userLoggedIn()){
            getUserInfo(getUser()).then((x) =>{
                if(x == 0){

                }else{
                    setFullName(x[0].nombre+' '+x[0].apellido);
                }
            }).finally(() => setLoading(false));
            startInfo();
        }else{
            signOff();
        }
    }, [offset]);

    const handleCloseInactive = () =>{
        setShowInactive(false);
        signOff();
    }

    const help = () =>{

    }

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        setOffset(selectedPage + 1)
    };

    return (
        <div >
            {generalError ? (<GeneralError></GeneralError>)
            :
                (<>
                <Modal
                    show={showInactive}
                    onHide={handleCloseInactive}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header>
                        <Modal.Title>Tu cuenta aun no se encuentra activa</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseInactive}>
                        Entendido
                    </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={showDelete}
                    onHide={handleCloseDelete}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header>
                        <Modal.Title>¿Estas seguro?</Modal.Title>
                        <button type="button" className="btn-close" onClick={() => {handleCloseDelete(); setDeletePost(0)}}></button>
                    </Modal.Header>
                    
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {handleCloseDelete(); setDeletePost(0);}}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={()=> deletePost()}>Eliminar</Button>
                    </Modal.Footer>
                </Modal>
                <div className="d-flex" id="wrapper">
    
                    <div className="bg-light border-right " id="sidebar-wrapper">
                        <div className="sidebar-heading"><h3>Publicaciones</h3></div>
                        <div className="sidebar-heading"><button className="btn btn-sm btn-outline-dark me-1" onClick={() => signOff()}><FontAwesomeIcon icon={faPowerOff} /></button>
                        <button className="btn btn-sm btn-outline-dark" onClick={() => help()}><FontAwesomeIcon icon={faQuestion} /></button>
                        </div>
                        <div className="list-group list-group-flush">
                            <Link to="/profile/" className="list-group-item list-group-item-action bg-light text-dark"><FaUserAstronaut /> {fullName}</Link>
                            <Link to="/creatives/" className="list-group-item list-group-item-action bg-dark text-white">Mis Posts</Link>
                            <Link to="/profile/" className="list-group-item list-group-item-action bg-light">Mi Perfil</Link>
                            
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
                                {newPostStatus ? 
                                    (
                                        <div className="container mb-5">
                                            {editPostStatus ? (
                                                <div className="row justify-content-center">
                                                    <div className="col-sm-12 mt-2">
                                                        <div className="float-end"><button className="btn btn-outline-danger" onClick={() => cancelEditPost(0)}><FontAwesomeIcon icon={faTimesCircle} /> Cancelar</button></div>
                                                    </div>
                                                    <div className="col-sm-8">
                                                        <EditPost idPost={idPostEdit} title={titlePostEdit} type={typePostEdit} short={shortEdit} dateToPublish={dateToPublishEdit} onChange={(x) => cancelEditPost(x)} postTypes={postsTypes}></EditPost>
                                                    </div>
                                                </div>
                                            ) 
                                            : 
                                            (
                                            <div className="row justify-content-center">
                                                <div className="col-sm-12 mt-2">
                                                    <div className="float-end"><button className="btn btn-outline-danger" onClick={() => cancelPost()}><FontAwesomeIcon icon={faTimesCircle} /> Cancelar</button></div>
                                                </div>
                                                <div className="col-sm-8">
                                                    <Form>
                                                        <div className="mb-3">
                                                            <label className="form-label">Titulo del Articulo/Post/Noticia/Nota/Reseña/etc</label>
                                                            <input type="text" maxLength={115} onChange={e => {setTitle(e.target.value)}} className="form-control" placeholder="Ej. Facebook: Ahora facebook permite publicar videos..." />
                                                            <div id="emailHelp" className="form-text">Debe ser menor a 115 caracteres.</div>
                                                            {titleError ? (<div className="alert alert-danger p-1" role="alert">Esta campo no puede estar vacio</div>) : null}
                                                        </div>
                                                        <hr></hr>
                                                        <div className="mb-3">
                                                            <label className="form-label">Descripción corta del Articulo/Post/Noticia/Nota/Reseña/etc</label>
                                                            <textarea className="form-control" maxLength={250} onChange={e => {setShort(e.target.value)}} rows={3}></textarea>
                                                            <div id="emailHelp" className="form-text">Debe ser menor a 250 caracteres.</div>
                                                            {shortError ? (<div className="alert alert-danger p-1" role="alert">Esta campo no puede estar vacio</div>) : null}
                                                        </div>
                                                        <hr></hr>
                                                        <div className="mb-3">
                                                            <label className="form-label">¿En que fecha y horario sera publicado?</label>
                                                            <input type="datetime-local" min={new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString()} onChange={e => {setStartDate(e.target.value)}} className="form-control"  />
                                                            {datePublishError ? (<div className="alert alert-danger p-1" role="alert">Esta campo no puede estar vacio</div>) : null}
                                                        </div>
                                                        <hr></hr>
                                                        <div className="mb-3">
                                                            <label className="form-label">Miniatura: <span className="small text-muted">(Imagen que aparecera debajo o arriba del titulo.)</span></label>
                                                            <p></p>
                                                            <label htmlFor="PostImage">
                                                                {url ? (
                                                                    <>
                                                                    {<img className="card-img-top" src={url} width="300" />}
                                                                    </>
                                                                ) : 
                                                                (
                                                                    <>
                                                                        <h5 className="btn btn-primary">Seleccionar nueva imagen</h5>
                                                                        <p>Solo se permiten archivos jpg & png.</p>
                                                                    </>
                                                                )}
                                                            </label>
                                                            <input type="file" className="form-control" accept="image/*"
                                                                id="PostImage"
                                                                style={{ display: "none" }}
                                                                onChange={handleChangeImagePost} />
                                                            {errorImagePost ? (<div className="alert alert-danger p-1" role="alert">{errorImageTextPost}</div>) : null}
                                                        </div>
                                                        <hr></hr>
                                                        <div className="input-group mb-3">
                                                            <label className="input-group-text" >¿Que categoría?</label>
                                                            <select className="form-select" onChange={(e) => {setCategory(e.target.value)}}>
                                                                <option value={category}>...</option>
                                                                {postsTypes.map((x, index) => {
                                                                    return (<option key={x.id_post_type} value={x.id_post_type}>{decode_utf8(x.name)}</option>);
                                                                })}
                                                            </select>
                                                            {categoryError ? (<div className="alert alert-danger p-1" role="alert">Esta campo no puede estar vacio</div>) : null}
                                                        </div>
                                                        <hr></hr>
                                                        <label>¿Que quisieras añadir?</label>
                                                        <div className="col-sm-12">
                                                            {renderAdd()}
                                                            <hr></hr>
                                                            <div className="container">
                                                                    {postNewContent.map((x, index) =>{
                                                                        if(x.type === 6){
                                                                            x.id = index;
                                                                            const handleEditorChange = (content) => {
                                                                                x.content = content.content;
                                                                                x.valid = content.valid
                                                                            }
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div className="row card">
                                                                                        <div className="col-sm-12 card-header">
                                                                                            <span className="btn btn-dark btn-sm float-start">{index}</span>
                                                                                            <button className="btn btn-danger btn-sm float-end" onClick={(e) => handleRemoveItem(e, index)}><FiDelete /></button>
                                                                                        </div>
                                                                                        <EditorPost onChange={handleEditorChange} isEditing={0}></EditorPost>
                                                                                    </div>
                                                                                    <hr></hr>
                                                                                </div>
                                                                            );
                                                                            
                                                                        }else if(x.type === 1){
                                                                            x.id = index;
                                                                            const handleEditorChange = (content) => {
                                                                                x.content = content.content;
                                                                                x.valid = content.valid
                                                                            }
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div className="row card">
                                                                                        <div className="col-sm-12 card-header">
                                                                                            <span className="btn btn-dark btn-sm float-start">{index}</span>
                                                                                            <button className="btn btn-danger btn-sm float-end" onClick={(e) => handleRemoveItem(e, index)}><FiDelete /></button>
                                                                                        </div>
                                                                                        <YoutubePost onChange={handleEditorChange} isEditing={0}></YoutubePost>
                                                                                    </div>
                                                                                    <hr></hr>
                                                                                </div>
                                                                            );
    
                                                                        }else if(x.type === 2){
                                                                            x.id = index;
                                                                            const handleEditorChange = (content) => {
                                                                                x.content = content.content;
                                                                                x.valid = content.valid
                                                                            }
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div className="row card">
                                                                                        <div className="col-sm-12 card-header">
                                                                                            <span className="btn btn-dark btn-sm float-start">{index}</span>
                                                                                            <button className="btn btn-danger btn-sm float-end" onClick={(e) => handleRemoveItem(e, index)}><FiDelete /></button>
                                                                                        </div>
                                                                                        <InstagramPost onChange={handleEditorChange} isEditing={0}></InstagramPost>
                                                                                    </div>
                                                                                    <hr></hr>
                                                                                </div>
                                                                            );
    
                                                                        }else if(x.type === 3){
                                                                            x.id = index;
                                                                            const handleEditorChange = (content) => {
                                                                                x.content = content.content;
                                                                                x.valid = content.valid
                                                                            }
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div className="row card">
                                                                                        <div className="col-sm-12 card-header">
                                                                                            <span className="btn btn-dark btn-sm float-start">{index}</span>
                                                                                            <button className="btn btn-danger btn-sm float-end" onClick={(e) => handleRemoveItem(e, index)}><FiDelete /></button>
                                                                                        </div>
                                                                                        <div className="col-sm-12 mt-2" >
                                                                                        <TwitterPost onChange={handleEditorChange} isEditing={0}></TwitterPost>
                                                                                        </div>
                                                                                    </div>
                                                                                    <hr></hr>
                                                                                </div>
                                                                            );
    
                                                                        }else if(x.type === 4){
                                                                            x.id = index;
                                                                            const handleEditorChange = (content) => {
                                                                                x.content = content.content;
                                                                                x.valid = content.valid
                                                                                
                                                                            }
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div className="row card">
                                                                                        <div className="col-sm-12 card-header">
                                                                                            <span className="btn btn-dark btn-sm float-start">{index}</span>
                                                                                            <button className="btn btn-danger btn-sm float-end" onClick={(e) => handleRemoveItem(e, index)}><FiDelete /></button>
                                                                                        </div>
                                                                                        <div className="col-sm-12 mt-2" >
                                                                                        <FacebookPost onChange={handleEditorChange} isEditing={0}></FacebookPost>
                                                                                        </div>
                                                                                    </div>
                                                                                    <hr></hr>
                                                                                </div>
                                                                            );
    
                                                                        }else if(x.type === 5){
                                                                            x.id = index;
    
                                                                            const handleEditorChange = (content) => {
                                                                                x.content = content;
                                                                                //console.log(x);
                                                                            }
    
                                                                            const handleChangeImage = (e) => {
                                                                                if (e.target.files.length) {
                                                                                    x.preview = URL.createObjectURL(e.target.files[0]);
                                                                                    x.raw = e.target.files[0];
                                                                                    x.valid = true;
                                                                                }
                                                                            };
                                                                            return (
                                                                                <div key={index}>
                                                                                    <div className="row card">
                                                                                        <div className="col-sm-12 card-header">
                                                                                            <span className="btn btn-dark btn-sm float-start">{index}</span>
                                                                                            <button className="btn btn-danger btn-sm float-end" onClick={(e) => handleRemoveItem(e, index)}><FiDelete /></button>
                                                                                        </div>
                                                                                        <div className="col-sm-12 mt-2 justify-content-center" >
                                                                                            <ImagePost onChange={handleChangeImage} order={index} isEditing={0}></ImagePost>
                                                                                            <Form.Group controlId="formBasicEmail">
                                                                                                <Form.Label>Pie de foto</Form.Label>
                                                                                                <Form.Control type="text" placeholder="" onChange={(e) => handleEditorChange(e.target.value)} />
                                                                                            </Form.Group>
                                                                                        </div>
                                                                                    </div>
                                                                                    <hr></hr>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    })}
                                                            
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-12">
                                                                {error ? (<div className="alert alert-danger" role="alert">{errorText}</div>) : null}
                                                                
                                                                {postNewContent.length >= 2 ? (<button className="btn btn-success float-end" onClick={(e) => publish(e)}>Publicar</button>) : null}
                                                            </div>        
                                                        </div>
                                                    </Form>
                                                </div>
                                            </div>
                                            )}
                                            
                                        </div>
                                    ) 
                                    : (
                                    <>
                                        {noPosts ? (
                                            <div id="outer" className="container">
                                                <div id="inner" className="row">
                                                    <div className="col-12 text-center">
                                                        <h4>Aun no tienes posts</h4>
                                                        <button className="btn btn-outline-success" onClick={() => setNewPostStatus(true)}><FontAwesomeIcon icon={faPlusCircle} /> Nuevo post</button>
                                                    </div>   
                                                </div>
                                            </div>
                                        ): (
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-sm-12 mt-2">
                                                        <div className="float-end"><button className="btn btn-outline-success" onClick={() => setNewPostStatus(true)}><FontAwesomeIcon icon={faPlusCircle} /> Nuevo post</button></div>
                                                    </div>
                                                    <div className="col-sm-12">
                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">#</th>
                                                                    <th scope="col">Titulo</th>
                                                                    <th scope="col">Tipo</th>
                                                                    <th scope="col">Fecha</th>
                                                                    <th scope="col"><BsFillEyeFill /></th>
                                                                    <th scope="col">Editar</th>
                                                                    <th scope="col">Eliminar</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    posts.map((x, index) =>{
                                                                        if(x.active == 2){
                                                                            return (<tr key={index} className="table-warning">
                                                                                <th scope="row">{x.id_post}</th>
                                                                                <td>{decode_utf8(x.titulo)}</td>
                                                                                <td>{decode_utf8(x.name)}</td>
                                                                                <td>{Moment(x.date_created).format('lll')}</td>
                                                                                <td>{0}</td>
                                                                                <td><button className="btn btn-primary btn-sm" onClick={() => editPost(x.id_post, x.titulo, x.id_post_type, x.short_content, x.date_toPublish)}><BsPencil /></button></td>
                                                                                <td><button className="btn btn-danger btn-sm" onClick={() => {setDeletePost(x.id_post); setShowDelete(true);}}><BsTrash /></button></td>
                                                                              </tr>);
                                                                        }else{
                                                                            return (<tr key={index}>
                                                                                <th scope="row">{x.id_post}</th>
                                                                                <td>{decode_utf8(x.titulo)}</td>
                                                                                <td>{decode_utf8(x.name)}</td>
                                                                                <td>{Moment(x.date_created).format('lll')}</td>
                                                                                <td>{0}</td>
                                                                                <td><button className="btn btn-primary btn-sm" onClick={() => editPost(x.id_post, x.titulo, x.id_post_type, x.short_content, x.date_toPublish)}><BsPencil /></button></td>
                                                                                <td><button className="btn btn-danger btn-sm" onClick={() => {setDeletePost(x.id_post); setShowDelete(true);}}><BsTrash /></button></td>
                                                                              </tr>);
                                                                        }
                                                                        
                                                                    })
                                                                }
                                                                
                                                            </tbody>
                                                            
                                                        </table>
                                                        <div className="">
                                                            <ReactPaginate
                                                                previousLabel={"<"}
                                                                nextLabel={">"}
                                                                breakLabel={"..."}
                                                                breakClassName={"break-me"}
                                                                pageCount={pageCount}
                                                                marginPagesDisplayed={2}
                                                                pageRangeDisplayed={5}
                                                                onPageChange={handlePageClick}
                                                                containerClassName={"pagination"}
                                                                subContainerClassName={"pages pagination"}
                                                                activeClassName={"active"}
                                                             />
                                                        </div>
    
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                
                            </>)
                        }
                        
                        
                    </div>
                    </div>
    
                </div></>)
            }
            
        </div>
    )
}

export default Posts
