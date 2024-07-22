import Lottie from 'lottie-react'
import React from 'react'
import EmailAnimation from '../../assets/animation/EmailAnimation.json'
function EmailVerification({text}) {
  return (
    <div className={`loader d-flex`}>
      <div className="loaderInner ">
        <Lottie animationData={EmailAnimation} />
      </div>
      <h2 className='mx-3 text-center'>{text} </h2>
    </div>
  )
}

export default EmailVerification
