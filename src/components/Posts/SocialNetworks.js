import React, {useState} from 'react'

const SocialNetworks = (props) => {
    const [selected, setSelected] = useState(true);
    const [social, setSocial] = useState('');

    const socialProfile = (value) =>{
        props.onChange({
            id: props.type,
            value: value
        });
    }

    const checkChange = (e) =>{
        if(e.target.checked){
            setSelected(false);
        }else{
            setSelected(true);
        }
        
    }

    return (
        <div className="row mb-2 text-left">
            <div className="col-sm-4">
                <div className="mb-3 form-check">
                    {props.edit === 1 ? (<input type="checkbox" className="form-check-input" onChange={(e) => checkChange(e)}></input>) 
                    : (<input type="checkbox" className="form-check-input" onChange={(e) => checkChange(e)}></input>)}
                    <label className="form-check-label text-muted">{props.value}</label>
                </div>
            </div>
            <div className="col-sm-8">
                {props.edit === 1 ? (<input type="text" className="form-control" defaultValue={props.default} onChange={(e) => socialProfile(e.target.value)} disabled={selected}></input>) 
                : (<input type="text" className="form-control" onChange={(e) => socialProfile(e.target.value)} disabled={selected}></input>)}
                
            </div>
        </div>
    )
}

export default SocialNetworks
