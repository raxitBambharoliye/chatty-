import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Password, Selection } from '../../Form'
import { Link } from 'react-router-dom'
import ImagePreview from '../../ImagePreview'
import { useDispatch, useSelector } from 'react-redux'
import { AxiosCLI } from '../../../axios'
import { APP_URL, COOKIE_KEY } from '../../../constant'
import { setUser } from '../../../reducers/userReducer'
import { setDataInCookie } from '../../../common'
import AddFriendInGroup from './AddFriendInGroup'

function CreateGroup({ id, modalClass = '' }) {
    const ref = useRef()
    const user = useSelector((state) => state.userData.user)
    const [submitButton, setSubmitButton] = useState(true);
    const [defaultValues, setDefaultValues] = useState(user)
    const dispatch = useDispatch();
    const { register, getValues, formState: { errors }, setError, handleSubmit, setValue } = useForm();




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
    const createGroup = (data) => {
        console.log("hello")
        console.log(data)
    }
    return (
        <div>
            <div className={`modal fade  ${modalClass}`} id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form className="modal-dialog modal-dialog-centered modal-xl" action='' onSubmit={handleSubmit(createGroup)}>
                    <div className={`modal-content`}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-center w-100" id="exampleModalLabel">Create New Group</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                {errors.root && <p className='alert rootErrorValidation text-center' role="alert">{errors.root.message}</p>}
                                <div className="col-12 col-lg-3 col-xl-2">
                                    <ImagePreview {...register("profileImage",)} src={user.profilePicture ?? "./image/dummyProfile.png"} SubmitButtonStatus={activeSave} />
                                </div>
                                <div className="col-12 col-lg-9 col-xl-10 flex-grow-1">
                                    <Input inputClass='inputBlack' type='text' placeholder='Enter your group name ... ' label='Group Name' ref={ref}  {...register("userName", {
                                        required: "Please enter your group name",
                                        onChange: () => { activeSave("groupName") }
                                    })}
                                    />
                                    {errors.groupName && <p className='validationError pb-2'>{errors.groupName.message}</p>}

                                    <Input inputClass='inputBlack' type='text' placeholder='Enter your groups tag line ... ' label='Tag Line    ' ref={ref}  {...register("tagLine", {
                                        required: "Please enter your email address",
                                    })} />
                                    {errors.tagLine && <p className='7 pb-2'>{errors.tagLine.message}</p>}
                                    <AddFriendInGroup/>

                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button buttonClass='buttonBlack hover btnRounded me-2' type='button' value='Discard' data-bs-dismiss="modal" ref={closeButtonRef} />
                            <Button buttonClass='themBlueBordered btnRounded' type='submit' value='Save' ref={ref} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateGroup
