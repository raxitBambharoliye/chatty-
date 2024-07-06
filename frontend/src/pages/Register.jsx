import React, { useEffect, useRef } from 'react'
import { SocketEvent } from '../soket/eventHandler'
import '../assets/css/login.css'
import Input from '../components/Form/Input';
import { Button, Password } from '../components/Form';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { APP_URL, COOKIE_KEY } from '../constant';
import { AxiosCLI } from '../axios';
import { getCookieData, setDataInCookie } from '../common';
import { useDispatch, useSelector, } from 'react-redux';
import { setUser } from '../reducers/userReducer';
function Register() {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userData);
    const ref = useRef();
    const { register, formState: { errors }, handleSubmit, getValues ,setError} = useForm({
        defaultValues: {
            userName:'raxit',
            email: 'r@gmail.com',
            password: 'ra@Patel.08',
            CPassword: 'ra@Patel.08',
        },
    });  
    const registerHandler = async (data) => {
        try {
            console.log(data);
            const response = await AxiosCLI.post(APP_URL.REGISTER, data);
            if (response.status === 200) {
                SocketEvent.SocketConnection();
                if (response.data.token && response.data.token != "") {
                    console.log("set token works")
                    setDataInCookie(COOKIE_KEY.TOKEN, response.data.token);
                }
                if (response.data.userData) {
                    setDataInCookie(COOKIE_KEY.USER, response.data.userData);
                    dispatch(setUser(response.data.userData));
                }
                navigate(APP_URL.FE_HOME);
            }
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
