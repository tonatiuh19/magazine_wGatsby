import React, {useState,useEffect} from 'react'
import {Form,} from 'react-bootstrap';
import {getPostAttachmentsByPost, getImageAttachment, updatePost, updatePostImage, updatePostTypes, updatePostTypesWithImage} from '../../apiFunctions/apiFunctions'
import Loading from '../../resources/Loading/Loading';
import EditorPost from './EditorPost';
import FacebookPost from './FacebookPost';
import ImagePost from './ImagePost';
import InstagramPost from './InstagramPost';
import TwitterPost from './TwitterPost';
import YoutubePost from './YoutubePost';
import {decode_utf8} from '../../resources/Decode/Decode';

const EditPost = (props) => {
    const [title, setTitle] = useState('');
    const [short, setShort] = useState('');
    const [titleError, setTitleError] = useState(false);
    const [shortError, setShortError] = useState(false);
    const [category, setCategory] = useState(0);
    const [loading, setLoading] = useState(true);
    const [postsAttachments, setPostsAttachments] = useState([]);
    const [editContent, setEditContent] = useState([{}]);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');

    const [url, setURL] = useState('');
    const [productImagePost, setProductImage] = useState('');
    const [errorImagePost, setErrorImagePost] = useState(false);
    const [errorImageTextPost, setErrorImageTextPost] = useState('Necesitas incluir una imagen');
    const [image, setImagePost] = useState({ raw: "" });

    const [startDate, setStartDate] = useState('');
    const [datePublishError, setDatePublishError] = useState(false);

    useEffect(() => {
        setTitle(props.title);
        setCategory(props.type);
        getPostAttachmentsByPost(props.idPost).then((x) =>{
            setPostsAttachments(x);

            setErrorImagePost(false);
            setLoading(true);
            getImageAttachment(props.idPostAttach).then((x) =>{
                //console.log(x);
                setProductImage(x);
                setURL(x);
            }).finally(() => setLoading(false));

        }).finally(() => setLoading(false));
    }, []);

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

        for (let index = 1; index < postsAttachments.length; index++) {
            if(postsAttachments[index].valid === false){
                return false;
            }
        }
        return true;
    }

    const getUser = () =>{
        return Number(localStorage.getItem("08191993"));
    }

    const updatePostsTypes = (id_post) =>{
        //console.log("id",id_post);
        let promises = [];       
        for(let i=0; i<postsAttachments.length; i++){
            if(postsAttachments[i].id_post_attachment_type !== 5){
               promises.push(updatePostTypes(id_post, postsAttachments[i].id_post_attachment_type, postsAttachments[i].content, postsAttachments[i].id,  postsAttachments[i].id_post_attachment));
            }
        }
        return promises;
    };

    const updatePostsTypesWithImage = (id_post) =>{
        //console.log("id",id_post);
        let promises = [];       
        for(let i=0; i<postsAttachments.length; i++){
            if(postsAttachments[i].id_post_attachment_type === 5){
                /*promises.push({
                    raw: postNewContent[i].raw, 
                    id_post: id_post, 
                    content: postNewContent[i].content, 
                    type: postNewContent[i].type,
                    id: postNewContent[i].id
                });*/
                if("raw" in postsAttachments[i]){
                    //console.log("nuevo", postsAttachments[i].raw)
                    promises.push(updatePostTypesWithImage(postsAttachments[i].raw, id_post, postsAttachments[i].id_post_attachment_type, postsAttachments[i].content, postsAttachments[i].id, 1, postsAttachments[i].id_post_attachment));
                }else{
                    //console.log("cambio", postsAttachments[i].raw)
                    promises.push(updatePostTypesWithImage(postsAttachments[i].raw, id_post, postsAttachments[i].id_post_attachment_type, postsAttachments[i].content, postsAttachments[i].id, 0, postsAttachments[i].id_post_attachment));
                }
                
            }
        }
        return promises;
    };

    const update = (e) =>{
        e.preventDefault();
        if(!validatePost()){
            setError(true);
            setErrorText('Necesitas completar todos los campos');
        }else{
            setError(false);
            setLoading(true);
            //console.log(postsAttachments);
            updatePost(getUser(), title, category, props.idPost, short).then((x) => {
                //console.log("img", image.raw);
                if(image.raw === ""){
                    updatePostImage(image.raw, x[0].id_post, props.idPost, 0).finally(() => setLoading(false));
                }else{
                    updatePostImage(image.raw, x[0].id_post, props.idPost, 1).finally(() => setLoading(false));
                }
                setLoading(true);
                Promise.all(updatePostsTypes(x[0].id_post)).then(function (results) {
                    //console.log(results);
                }).finally(() => setLoading(false));
                setLoading(true);
                //console.log(insertPostsTypesWithImage(x[0].id_post));
                Promise.all(updatePostsTypesWithImage(x[0].id_post)).then(function (resultss) {
                    //console.log(resultss);
                }).finally(() => setLoading(false));
            }).then(() =>{
                props.onChange(1);
            });
        }
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
        if (!(filename === "png" || filename === "jpg" || filename === "JPG" || filename === "PNG")) {
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

    return (
        <div>
            {loading ? (<div id="outer" className="container">
                <div id="inner" className="row">
                    <div className="col-12 text-center">
                        <Loading></Loading>
                    </div>   
                </div>
            </div>) 
            : 
            (<Form>
                <h5># {props.idPost}</h5>
                <div className="mb-3">
                    <label className="form-label">Titulo del Articulo/Post/Noticia/Nota</label>
                    <input type="text" maxLength={115} defaultValue={decode_utf8(props.title)} onChange={e => {setTitle(e.target.value)}} className="form-control" placeholder="Ej. Facebook: Ahora facebook permite publicar videos..." />
                    <div id="emailHelp" className="form-text">Debe ser menor a 115 caracteres.</div>
                    {titleError ? (<div className="alert alert-danger p-1" role="alert">Esta campo no puede estar vacio</div>) : null}
                </div>
                <hr></hr>
                <div className="mb-3">
                    <label className="form-label">Descripción corta del Articulo/Post/Noticia/Nota/Reseña/etc</label>
                    <textarea className="form-control" maxLength={250} defaultValue={decode_utf8(props.short)} onChange={e => {setShort(e.target.value)}} rows={3}></textarea>
                    <div id="emailHelp" className="form-text">Debe ser menor a 250 caracteres.</div>
                    {shortError ? (<div className="alert alert-danger p-1" role="alert">Esta campo no puede estar vacio</div>) : null}
                </div>
                <hr></hr>
                <div className="mb-3">
                    <label className="form-label">¿En que fecha y horario sera publicado?</label>
                    <input type="datetime-local" value={props.dateToPublish} onChange={e => {setStartDate(e.target.value)}} className="form-control"  />
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
                                {<><h5 className="btn btn-primary">Seleccionar nueva imagen</h5>
                                    <p>Solo se permiten archivos jpg & png.</p></>}
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
                    <select className="form-select" defaultValue={props.type} onChange={(e) => {setCategory(e.target.value)}}>
                        {props.postTypes.map((x, index) => {
                            return (<option key={x.id_post_type} value={x.id_post_type}>{decode_utf8(x.name)}</option>);
                        })}
                    </select>
                </div>
                <hr></hr>

                {postsAttachments.sort((a, b) => a.order_post - b.order_post).map((x, index) =>{
                    
                    if(x.id_post_attachment_type === 6){
                        x.id = index+1;
                        const handleEditorChange = (content) => {
                            x.content = content.content;
                            x.valid = content.valid
                        }
                        return (
                            <div key={index}>
                                <div className="row card">
                                    <div className="col-sm-12 card-header">
                                        <span className="btn btn-dark btn-sm float-start">{x.order_post}</span>
                                    </div>
                                    <EditorPost onChange={handleEditorChange} content={decode_utf8(x.content)} isEditing={1}></EditorPost>
                                </div>
                                <hr></hr>
                            </div>
                        );
                        
                    }else if(x.id_post_attachment_type === 1){
                        x.id = index+1;
                        const handleEditorChange = (content) => {
                            x.content = content.content;
                            x.valid = content.valid
                        }
                        return (
                            <div key={index}>
                                <div className="row card">
                                    <div className="col-sm-12 card-header">
                                        <span className="btn btn-dark btn-sm float-start">{x.order_post}</span>
                                    </div>
                                    <YoutubePost onChange={handleEditorChange} content={x.content} isEditing={1}></YoutubePost>
                                </div>
                                <hr></hr>
                            </div>
                        );

                    }else if(x.id_post_attachment_type === 2){
                        x.id = index+1;
                        const handleEditorChange = (content) => {
                            x.content = content.content;
                            x.valid = content.valid
                        }
                        return (
                            <div key={index}>
                                <div className="row card">
                                    <div className="col-sm-12 card-header">
                                        <span className="btn btn-dark btn-sm float-start">{x.order_post}</span>
                                        
                                    </div>
                                    <InstagramPost onChange={handleEditorChange} content={x.content} isEditing={1}></InstagramPost>
                                </div>
                                <hr></hr>
                            </div>
                        );

                    }else if(x.id_post_attachment_type === 3){
                        x.id = index+1;
                        const handleEditorChange = (content) => {
                            x.content = content.content;
                            x.valid = content.valid
                        }
                        return (
                            <div key={index}>
                                <div className="row card">
                                    <div className="col-sm-12 card-header">
                                        <span className="btn btn-dark btn-sm float-start">{x.order_post}</span>
                                        
                                    </div>
                                    <div className="col-sm-12 mt-2" >
                                        <TwitterPost onChange={handleEditorChange} content={x.content} isEditing={1}></TwitterPost>
                                    </div>
                                </div>
                                <hr></hr>
                            </div>
                        );

                    }else if(x.id_post_attachment_type === 4){
                        x.id = index+1;
                        const handleEditorChange = (content) => {
                            x.content = content.content;
                            x.valid = content.valid
                            
                        }
                        return (
                            <div key={index}>
                                <div className="row card">
                                    <div className="col-sm-12 card-header">
                                        <span className="btn btn-dark btn-sm float-start">{x.order_post}</span>
                                        
                                    </div>
                                    <div className="col-sm-12 mt-2" >
                                        <FacebookPost onChange={handleEditorChange} content={x.content} isEditing={1}></FacebookPost>
                                    </div>
                                </div>
                                <hr></hr>
                            </div>
                        );

                    }else if(x.id_post_attachment_type === 5){
                        x.id = index+1;
                        const handleEditorChange = (content) => {
                            x.content = content;
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
                                        <span className="btn btn-dark btn-sm float-start">{x.order_post}</span>
                                        
                                    </div>
                                    <div className="col-sm-12 mt-2 justify-content-center" >
                                        <ImagePost onChange={handleChangeImage} idPostAttach={x.id_post_attachment} order={index} isEditing={1}></ImagePost>
                                        <Form.Group controlId="formBasicEmail">
                                            <Form.Label>Pie de foto</Form.Label>
                                            <Form.Control type="text" defaultValue={decode_utf8(x.content)} onChange={(e) => handleEditorChange(e.target.value)} />
                                        </Form.Group>
                                    </div>
                                </div>
                                <hr></hr>
                            </div>
                        );
                    }
                })}
                {error ? (<div className="alert alert-danger" role="alert">{errorText}</div>) : null}
                {true ? (<button className="btn btn-primary float-end" onClick={(e) => update(e)}>Actualizar</button>) : null}
            </Form>)}
            
            
        </div>
    )
}

export default EditPost
