import React, { useEffect, useRef } from 'react'
import '../assets/css/login.css'
import Input from '../components/Form/Input';
import { Button, Password } from '../components/Form';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { APP_URL, COOKIE_KEY } from '../constant';
import { AxiosCLI } from '../axios';
import { clearAllCookiesData, getCookieData, setDataInCookie } from '../common';
import { useDispatch, useSelector, } from 'react-redux';
import { setUser } from '../reducers/userReducer';
import { setNotification } from '../reducers/chatReducer'
function Login() {

    let navigate = useNavigate();

    //NOTE - check for logged in or not 
    const token = getCookieData(COOKIE_KEY.TOKEN, true);
    const userData = getCookieData(COOKIE_KEY.USER);
    useEffect(() => {
        if (token && userData) {
            navigate(APP_URL.FE_HOME);
            return;
        }
    }, [token, userData, navigate])

    //NOTE - if not logged in 
    const dispatch = useDispatch();
    const user = useSelector((state) => state.userData);
    const ref = useRef();
    const { register, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            email: 'raxitdev55@gmail.com',
            password: 'ra@Patel.08',
        },
    });

    const logInHandler = async (data) => {
        try {
            const response = await AxiosCLI.post(APP_URL.LOGIN, data);
            if (response.status === 200) {
                clearAllCookiesData()
                if (response.data.token && response.data.token != "") {
                    setDataInCookie(COOKIE_KEY.TOKEN, response.data.token);
                }
                if (response.data.userData) {
                    setDataInCookie(COOKIE_KEY.USER, response.data.userData);
                    dispatch(setUser(response.data.userData));
                    setDataInCookie(COOKIE_KEY.NOTIFICATIONS, response.data.notifications)
                    dispatch(setNotification(response.data.notifications))
                }
                navigate(APP_URL.FE_HOME)
            }
        } catch (error) {
            console.log('CATCH ERROR IN : logInHandler', error);
        }
    }
    //NOTE - login with google 
    const openGoogleLogin = async () => {
        window.open(
            `${import.meta.env.VITE_BASE_URL}/auth/google/callback`,
            '_self'
        )
    }
    return (
        <div className='w-100  vh-100  d-flex flex-column align-items-center justify-content-center background'>
            <div className="loginInner">
                <h1 className='text-center mb-4'>Chatty π</h1>
                <form action="" onSubmit={handleSubmit(logInHandler)}>
                    <Input inputClass='inputBlack' type='email' placeholder='Enter your email address ... ' label='Email Address' ref={ref} {...register("email", {
                        required: "Please enter your email address",
                        pattern: {
                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: 'Enter a valid email address',
                        },
                    })} />
                    {errors.email && <p className='validationError pb-2'>{errors.email.message}</p>}

                    <Password inputClass='inputBlack' placeholder='Enter your password ... ' label='Password' ref={ref} {...register("password", {
                        required: "Please enter your password",
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters long',

                        }
                    })} />
                    {errors.password && <p className='validationError pb-2'>{errors.password.message}</p>}
                    <Link className='formLink d-block text-end'>Forgot Password </Link>
                    <div className="d-flex mt-4">
                        <Button buttonClass='themGradient btnRounded me-2' type='submit' value='Log In' ref={ref} />
                        <Link to={APP_URL.FE_REGISTER}>
                            <Button buttonClass='themBlueBordered btnRounded' type='button' value='Sign Up' ref={ref} />
                        </Link>
                    </div>
                </form>
                <div className="loginWith">
                    <Link className='loginWithButton' onClick={openGoogleLogin}>
                        <img src="./icon/google.png" className='iconImg' alt="" />
                        Continue With Google
                    </Link>
                </div>
            </div>
        </div>
    )
}


export default Login
