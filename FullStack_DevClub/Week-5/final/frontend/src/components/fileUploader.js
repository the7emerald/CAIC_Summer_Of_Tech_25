import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "universal-cookie";
const cookies = new Cookies();


const FileUploader = ({ uploadedFiles }) => {
    const [media, setMedia] = useState(null);
    const [url, setUrl] = useState('');
    const [curr, setCurr] = useState(null)

    const handleChange = (e) => {
        setCurr(null)
        setUrl(null)
        if (e.target.files[0]) {
            setMedia(e.target.files[0]);
        }
        else {
            setMedia(null)
        }
    };


    const handleUpload = async () => {
        if (!media) return;
        setCurr('uploading')

        const formData = new FormData();
        formData.append('media', media);

        try {
            const token = cookies.get("LOGIN-COOKIE");
            const res = await axios.post('http://localhost:5000/api/upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setUrl(res.data);
            console.log(res.data)
            setCurr('uploaded')
        }
        catch (err) {
            console.error(err);
            setCurr("error")
            alert('Upload failed');
        }
    };

    useEffect(() => {
        if (curr === "uploaded")
            uploadedFiles(url);
    }, [curr]);

    return (
        <>
            <div style={{ color: 'white', height: '40px', justifyContent: 'center' }}>
                {curr === "uploading" ? (
                    <p style={{ fontSize: '20px' }} >Sending...</p>
                ) : (
                    <>
                        <input type="file" className='fileupload' onChange={handleChange} />
                        <button onClick={handleUpload} className='typeBox-button' >
                            Send
                        </button>
                    </>
                )}
            </div>
        </>
    );
};

export default FileUploader;
