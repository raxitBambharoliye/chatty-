import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getCookieData, removeCookieData } from '../common'
import { APP_URL, COOKIE_KEY } from '../constant'
import { AxiosCLI } from '../axios';
import { EmailVerification } from '../components/Loaders';

function EmailVerify() {
  const tempUserData = getCookieData(COOKIE_KEY.TEM_USER);
  const [sendingMail, setSendingMail] = useState(false);
  let email = ""
  if (tempUserData) {
    email = tempUserData.email;
  }
  function editData() {
    return navigate(APP_URL.FE_REGISTER)
  }
  async function reSendEmail() {
    const tempUserData = getCookieData(COOKIE_KEY.TEM_USER)
    if (tempUserData) {
      setSendingMail(true)
      const response = await AxiosCLI.post(APP_URL.SEND_VERIFICATION_MAIL, tempUserData);
      setSendingMail(false);
    }
  }
  return (
    <div className='w-100  vh-100  d-flex flex-column align-items-center justify-content-center background'>
      <div className='emailVerify'>
        <h2>Verify Your Email</h2>
        <p>pleas verify your email, verifaction mail sent to your email <strong>{email}</strong></p>
        <Link className='resendMail' onClick={reSendEmail}>resend mail</Link>
        <Link className='ms-3 resendMail editData' onClick={editData} to={APP_URL.FE_REGISTER}>Edit Data</Link>
      </div>
      <div className={`${sendingMail ? "d-block" : "d-none"}`}>
        <EmailVerification text="reSending verification Mail ... " />
      </div>
    </div>

  )
}

export default EmailVerify
