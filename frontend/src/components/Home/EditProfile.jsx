import React, { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Password } from '../Form'
import { Link } from 'react-router-dom'
import ImagePreview from '../ImagePreview'
import { useSelector } from 'react-redux'

function EditProfile({
    id,
    modalClass = ''
}) {
    const ref= useRef()
    const user= useSelector((state)=>state.userData.user)
    console.log('user', user)
    const { register, getValues, formState: { errors } ,handleSubmit} = useForm({
        defaultValues: {
            email: user.email,
            userName: user.userName,
            DOB: user.DOB,
        }
    })
    const editProfileSubmit = async (data) => {
        try {
            console.log('data', data)
            
        } catch (error) {
            console.error('CATCH ERROR IN ::: editProfileSubmit', error);
        }
    }
    return (
        <div>
            <div className={`modal fade  ${modalClass}`} id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form className="modal-dialog modal-dialog-centered modal-xl" onSubmit={handleSubmit(editProfileSubmit)}>
                    <div className={`modal-content`}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Profile</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12 col-lg-3 col-xl-2">
                                    <ImagePreview {...register("profileImage")} ref={ref} />
    
                                </div>
                                <div className="col-12 col-lg-9 col-xl-10 flex-grow-1">

                                        <Input inputClass='inputBlack' type='text' placeholder='Enter your User name ... ' label='User Name' ref={ref} {...register("userName", {
                                            required: "Please enter your user name",
                                        })} />
                                        {errors.userName && <p className='validationError pb-2'>{errors.userName.message}</p>}

                                        <Input inputClass='inputBlack' type='email' placeholder='Enter your email address ... ' label='Email Address' ref={ref} disabled {...register("email", {
                                            required: "Please enter your email address",
                                            pattern: {
                                                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                                message: 'Enter a valid email address',
                                            },
                                        })} />
                                        {errors.email && <p className='7 pb-2'>{errors.email.message}</p>}
                                        <Input inputClass='inputBlack' type='date' placeholder='Enter your password ... ' label='Date Of Birth' ref={ref} {...register("DOB", {
                                            required: "Please enter your date of birth",
                                        })} />
                                        {errors.DOB && <p className='validationError pb-2'>{errors.DOB.message}</p>}

                                        {errors.CPassword && <p className='validationError pb-2'>{errors.CPassword.message}</p>}
                                        <div className="d-flex mt-4">
                                            <Button buttonClass='themGradient btnRounded me-2' type='submit' value='Sign Up' ref={ref} />
                                            <Link to={'/'}>
                                                <Button buttonClass='themBlueBordered btnRounded' type='button' value='Log In' ref={ref} />
                                            </Link>
                                        </div>

                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" > Discard</button>
                            <button type="submit" className="btn btn-primary"  >Save</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default EditProfile
