import React, {useState, useEffect} from 'react';
import { Editor } from '@tinymce/tinymce-react';

const EditorPost = (props) => {
    const [valid, setValid] = useState(true);
    const [content, setContent] = useState('');

    const handleEditorChange = (content, editor) => {
        if(content.length !== 0){
            props.onChange({
                content: content,
                valid: true
            });
            setValid(false);
        }else{
            props.onChange({
                content: content,
                valid: false
            });
            setValid(true);
        }
    }

    useEffect(() => {
        if(props.isEditing === 1){
            setValid(false);
        }
    }, []);

    return (
        <div >
            <div className="col-sm-12 mt-2" >
                <Editor
                    apiKey="3ka4ppcuraelrtsljbrk7x54z40wmtqnz4muz4rfa555n2ur"
                    initialValue={props.content}
                    init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code wordcount'
                        ],
                        toolbar:
                            'undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat '
                        }}
                    onEditorChange={handleEditorChange}
                />
            </div>
            {
                valid ? 
                    (<div className="alert alert-danger p-1" role="alert">
                        Esta campo no puede estar vacio
                    </div>) 
                    :  null
            }
        </div>
    )
}

export default EditorPost
