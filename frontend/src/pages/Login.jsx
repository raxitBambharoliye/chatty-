import React, { useRef } from 'react'
import { SocketEvent } from '../soket/eventHandler'
import '../assets/css/login.css'
import Input from '../components/Form/Input';
import { Button } from '../components/Form';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import { APP_URL } from '../constant';
import { AxiosCLI } from '../axios';
function Login() {
    SocketEvent.SocketConnection();
    const ref = useRef();
    const { register, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            email: 'r@gmail.com',
            password: 'ra@Patel.08',
        },
    });
    const logInHandler = async (data) => {
        const response = await AxiosCLI.post(APP_URL.LOGIN, data);
        console.log('response', response)
    }
    return (
        <div className='w-100  vh-100  d-flex flex-column align-items-center justify-content-center background'>
            <div className="loginInner">
                <h1 className='text-center mb-4'>Chatty π</h1>
                <form action="" onSubmit={handleSubmit(logInHandler)}>
                    <Input inputClass='inputBlack' type='email' placeholder='Enter your email address ... ' label='Email Address' ref={ref} {...register("email",{
                        required: "Please enter your email address",
                        pattern: {
                            value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                            message: 'Enter a valid email address',
                          },
                    })} />
                    {errors.email && <p className='validationError pb-2'>{errors.email.message}</p>}

                    <Input inputClass='inputBlack' type='password' placeholder='Enter your password ... ' label='Password' ref={ref} {...register("password",{
                        required: "Please enter your password",
                        minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters long',
                          
                        }
                    })} />
                    {errors.password && <p className='validationError pb-2'>{errors.password.message}</p>}

                    <div className="d-flex mt-4">
                        <Button buttonClass='themGradient btnRounded me-2' type='submit' value='Log In' ref={ref} />
                        <Button buttonClass='themBlueBordered btnRounded' type='button' value='Sign Up' ref={ref} />
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


export default Login
