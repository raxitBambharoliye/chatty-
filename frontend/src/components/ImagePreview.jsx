import React, { useEffect, useId, useState } from 'react'

function ImagePreview({
    src=null,
    SubmitButtonStatus=()=>{},
    ...props
},ref) {
    const id = useId();
    const [image, setImage] = useState(src);
    const onChangeHandler = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]))
        SubmitButtonStatus("profilePicture")
    }
    useEffect(() => {
        
    },[])
    return (
        <>
            <label className="profile " htmlFor={id}>
                <i className="fa-solid fa-pen"></i>
                <img src={image} alt="" />
            </label>
            <input type="file" id={id} className='singlePreviewInput' {...props}  ref={ref} onChange={onChangeHandler} />
        </>
    )
}
export default React.forwardRef(ImagePreview)