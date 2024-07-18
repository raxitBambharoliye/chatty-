import React, { useRef } from 'react'
import '../assets/css/login.css'
import Input from '../components/Form/Input';
import { Button, Password } from '../components/Form';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { APP_URL, COOKIE_KEY } from '../constant';
import { getCookieData, setDataInCookie } from '../common';
import { useDispatch, useSelector, } from 'react-redux';
function Register() {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userData);
    const ref = useRef();
    const { register, formState: { errors }, handleSubmit, getValues ,setError ,setValue} = useForm({
        defaultValues: {
            userName:'raxit',
            email: 'r@gmail.com',
            password: 'ra@Patel.08',
            CPassword: 'ra@Patel.08',
        },
    }); 
    
    const tempUserData = getCookieData(COOKIE_KEY.TEM_USER);
    console.log('tempUserData', tempUserData)
    if (tempUserData ) {
        setValue("userName",tempUserData.userName)
        setValue("email",tempUserData.email)
        setValue("password",tempUserData.password)
        setValue("CPassword",tempUserData.CPassword)
        setValue("DOB",tempUserData.DOB)
    }
    const registerHandler = async (data) => {
        try {
            console.log(data);
            setDataInCookie(COOKIE_KEY.TEM_USER, data);
           return navigate(APP_URL.FE_EMAIL_VERIFY)
        } catch (error) {
            console.log('error.response.data.errors', error.response.data.errors.length)
            if (error.response.status === 400 && error.response.data.errors ) {
                for(let i = 0; i < error.response.data.errors.length;i++){
                    let element = error.response.data.errors[i];
                    setError(element.path, {
                        message:element.msg
                    })
                }
            }
            console.log('CATCH ERROR IN : registerHandler', error);
        }
    }
     async function sendMail(){
         try {
            console.log("sendMail test ")
            const temUserData = getCookieData(COOKIE_KEY.TEM_USER);
            if (temUserData) {
                //NOTE - call send mail url
            }
        } catch (error) {
            console.log('CATCH ERROR IN : sendMail', error);
        }
    }

    return (
        <div className='w-100  vh-100  d-flex flex-column align-items-center justify-content-center background'>
            <div className="loginInner">
                <h1 className='text-center mb-4'>Chatty π</h1>
                <form action="" onSubmit={handleSubmit(registerHandler)}>

                <Input inputClass='inputBlack' type='text' placeholder='Enter your User name ... ' label='User Name' ref={ref} {...register("userName", {
                        required: "Please enter your user name",
                    })} />
                    {errors.userName && <p className='validationError pb-2'>{errors.userName.message}</p>}

                    <Input inputClass='inputBlack' type='email' placeholder='Enter your email address ... ' label='Email Address' ref={ref} {...register("email", {
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
                    
                    <Password inputClass='inputBlack'  placeholder='Enter your password ... ' label='Password' ref={ref} {...register("password", {
                        required: "Please enter your password",
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters long',

                        }
                    })} />
                    {errors.password && <p className='validationError pb-2'>{errors.password.message}</p>}

                    
                    <Password inputClass='inputBlack'  placeholder='Conform your password ... ' label='Conform Password' ref={ref} {...register("CPassword", {
                        required: "Please Conform your password",
                        validate:value=>value === getValues("password") || 'Password not matches.',
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters long',
                        }
                    })} />
                    {errors.CPassword && <p className='validationError pb-2'>{errors.CPassword.message}</p>}
                    <div className="d-flex mt-4">
                        <Button buttonClass='themGradient btnRounded me-2' type='submit' value='Sign Up' ref={ref} />
                        <Link to={'/'}>
                        <Button buttonClass='themBlueBordered btnRounded' type='button' value='Log In' ref={ref} />
                        </Link>
                    </div>
                </form>
                <div className="loginWith">
                    <Link className='loginWithButton'>
                        <img src="./icon/google.png" className='iconImg' alt="" />
                        Continue With Google
                    </Link>
                </div>
            </div>
        </div>
    )
}


export default Register
