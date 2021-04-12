import React, {useEffect, useState} from 'react';
import {getImageAttachment} from '../../apiFunctions/apiFunctions'
import Loading from '../../resources/Loading/Loading';

const ImagePost = (props) => {
    const [image, setImage] = useState({ raw: "" });
    const [productImage, setProductImage] = useState('');
    const [errorImage, setErrorImage] = useState(true);
    const [errorImageText, setErrorImageText] = useState('Necesitas incluir una imagen');
    const [valid, setValid] = useState(true);
    const [url, setURL] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangeImage = (e) => {
        if(validateImage(e.target.files[0])){
            if (e.target.files.length) {
                setURL(URL.createObjectURL(e.target.files[0]));
                setImage({
                  
                  raw: e.target.files[0]
                });
                setErrorImage(false);
                props.onChange(e);
              }else{
                setErrorImage(true);
              }
        }
        
    };

    const validateImage = (file) =>{
        let fileNameArr =  file.name.split(".");
        let filename = fileNameArr[fileNameArr.length-1];
        if (!(filename === "png" || filename === "jpg" || filename === "JPG" || filename === "PNG" || filename === "jpeg" || filename === "JPEG")) {
            setErrorImageText("Solo se soportan archivos png o jpg");
            return false;
        }
        if (file.size > 3195432) {
           setErrorImageText("Solo se soportan archivos menores a 3 MB");
           return false;
        }
        setErrorImage(false);
        return true;
    }

    useEffect(()=>{
        if(props.isEditing === 1){
            setErrorImage(false);
            setLoading(true);
            getImageAttachment(props.idPostAttach).then((x) =>{
                //console.log(x);
                setProductImage(x);
                setURL(x);
            }).finally(() => setLoading(false));
        }
    }, []);

    return (
        <div className="card text-center" style={{width: "100%"}}>
            {loading ? (<div id="outer" className="container">
                <div id="inner" className="row">
                    <div className="col-12 text-center">
                        <Loading></Loading>
                    </div>   
                </div>
            </div>) 
            : 
                (
                    <>
                        <label htmlFor={props.order}>
                            {url ? (
                                <>
                                {<img className="card-img-top" src={url} width="300" />}
                                {props.isEditing === 1 ? (<><h5 className="btn btn-primary">Seleccionar nueva imagen</h5>
                                    <p>Solo se permiten archivos jpg & png.</p></>) : null}
                                </>
                            ) : 
                            (
                                <>
                                    <h5 className="btn btn-primary">Seleccionar nueva imagen</h5>
                                    <p>Solo se permiten archivos jpg & png.</p>
                                </>
                            )}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            id={props.order}
                            style={{ display: "none" }}
                            onChange={handleChangeImage}
                        />
                        <br />
                        {errorImage ? (<div className="alert alert-danger" role="alert">{errorImageText}</div>) : null}
                    </>
                )
            }
            
        </div>
    )
}

export default ImagePost
