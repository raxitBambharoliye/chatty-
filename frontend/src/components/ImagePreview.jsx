import React, { useId, useState } from 'react'

function ImagePreview({
    src = "./image/dummyProfile.png",
    ...props
},ref) {
    const id = useId();
    const [image, setImage] = useState(src);
    const onChangeHandler = (e) => {
        console.log(e.target.files[0])
        setImage(URL.createObjectURL(e.target.files[0]))
    }
    return (
        <>
            <label className="profile " htmlFor={id}>
                <i className="fa-solid fa-pen"></i>
                <img src={image} alt="" />
            </label>
            <input type="file" id={id} className='singlePreviewInput' onChange={onChangeHandler} {...props} ref={ref} />
        </>
    )
}
                
export default React.forwardRef(ImagePreview)
