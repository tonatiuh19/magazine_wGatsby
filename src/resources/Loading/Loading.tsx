import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAtom } from '@fortawesome/free-solid-svg-icons';

const Loading = () => {
    return (
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
            <FontAwesomeIcon icon={faAtom} pulse />
        </div>
    )
}

export default Loading
