import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Password } from '../Form'
import { Link } from 'react-router-dom'
import ImagePreview from '../ImagePreview'
import { useDispatch, useSelector } from 'react-redux'
import { AxiosCLI } from '../../axios'
import { APP_URL, COOKIE_KEY } from '../../constant'
import { setUser } from '../../reducers/userReducer'
import { setDataInCookie } from '../../common'

function EditProfile({
    id,
    modalClass = ''
}) {
    const ref = useRef()
    const user = useSelector((state) => state.userData.user)
    const [submitButton, setSubmitButton] = useState(true);
    const [defaultValues, setDefaultValues] = useState(user)
    const dispatch = useDispatch();
    const { register, getValues, formState: { errors }, setError,handleSubmit, setValue } = useForm({
        defaultValues: {
            email: user.email,
            userName: user.userName,
            DOB: user.DOB,
            tagLine: user.tagLine ? user.tagLine : null
        }
    })


    useEffect(() => {
        setValue("email", user.email);
        setValue("userName", user.userName);
        setValue("DOB", user.DOB);
        setValue("tagLine", user.tagLine);
        setDefaultValues(user)
    }, [user])

    const closeButtonRef = useRef();

    const editProfileSubmit = async (data) => {
        try {
            const formData = new FormData()
            if (data.profileImage[0]) {
                formData.append('profileImage', data.profileImage[0])
            }
            formData.append('userName', data.userName)
            formData.append('DOB', data.DOB)
            formData.append('userId', user._id)
            formData.append("tagLine", data.tagLine);
            const editResponse = await AxiosCLI.post(APP_URL.EDIT_USER_PROFILE, formData);
            if (editResponse && editResponse.status == 200 && editResponse.data && editResponse.data.user) {
                dispatch(setUser(editResponse.data.user));
                setDataInCookie(COOKIE_KEY.USER, editResponse.data.user);
                closeButtonRef.current.click();
            }
        } catch (error) {
            console.error('CATCH ERROR IN ::: editProfileSubmit', error);
            if (error.response.status === 400 && error.response.data.errors) {
                for (let i = 0; i < error.response.data.errors.length; i++) {
                    let element = error.response.data.errors[i];
                    setError(element.path, {
                        message: element.msg
                    })
                }
            }
        }
    }
    const activeSave = (field) => {
        if (defaultValues[field] != getValues(field)) {
            setSubmitButton(false)
        } else if (field == "profilePicture") {
            setSubmitButton(false)
        }
        else {
            setSubmitButton(true)
        }
    }

    return (
        <div>
            <div className={`modal fade  ${modalClass}`} id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form className="modal-dialog modal-dialog-centered modal-xl" action='' onSubmit={handleSubmit(editProfileSubmit)}>
                    <div className={`modal-content`}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Profile</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                {errors.root && <p className='alert rootErrorValidation text-center' role="alert">{errors.root.message }</p>}
                                <div className="col-12 col-lg-3 col-xl-2">
                                    <ImagePreview {...register("profileImage",)} SubmitButtonStatus={activeSave} />
                                </div>
                                <div className="col-12 col-lg-9 col-xl-10 flex-grow-1">
                                    <Input inputClass='inputBlack' type='text' placeholder='Enter your User name ... ' label='User Name' ref={ref}  {...register("userName", {
                                        required: "Please enter your user name",
                                        onChange: () => { activeSave("userName") }
                                    })}

                                    />
                                    {errors.userName && <p className='validationError pb-2'>{errors.userName.message}</p>}

                                    <Input inputClass='inputBlack' type='email' placeholder='Enter your email address ... ' label='Email Address' ref={ref} disabled {...register("email", {
                                        required: "Please enter your email address",
                                        pattern: {
                                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                            message: 'Enter a valid email address',
                                        },

                                    })} />
                                    {errors.email && <p className='7 pb-2'>{errors.email.message}</p>}
                                    <Input inputClass='inputBlack' type='date' placeholder='Enter your password ... ' label='Date Of Birth' ref={ref} onChange={(e) => { activeSave("DOB", e.target.value) }} {...register("DOB", {
                                        required: "Please enter your date of birth",
                                        onChange: () => { activeSave("DOB") }

                                    })} />
                                    {errors.DOB && <p className='validationError pb-2'>{errors.DOB.message}</p>}
                                    {/* tagLine */}
                                    <Input inputClass='inputBlack' type='text' placeholder='Enter your Tag Line ... ' label='Tag Line' ref={ref} onChange={(e) => { activeSave("tagLine", e.target.value) }} {...register("tagLine", {
                                        onChange: () => { activeSave("tagLine") }
                                    })} />
                                    {errors.DOB && <p className='validationError pb-2'>{errors.DOB.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button buttonClass='buttonBlack hover btnRounded me-2' type='button' value='Discard' data-bs-dismiss="modal" ref={closeButtonRef} />
                            <Button buttonClass='themBlueBordered btnRounded' type='submit' value='Save' disabled={submitButton} ref={ref} />
                        </div>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default EditProfile
