import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { APP_URL } from '../constant';

function Home() {
    let user = useSelector((state) => state.userData.user);
    console.log('user', user)

  return (
    <div>
          <h1>Home Page </h1>
      <p>hello {user.userName}</p>
      <Link to={APP_URL.FE_LOGOUT}>LogOut</Link>
    </div>
  )
}

export default Home
