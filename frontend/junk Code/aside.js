   {/* aside start  */}
        <div className={`asideInner  d-flex flex-column vh-100 position-relative ${asideShow ? 'show ' : 'hide '} `}>

          <div className="asideHeader d-flex align-items-center justify-content-between position-sticky top-0">
            <h1 className='m-0'>Chatty 𝝅</h1>
            <div className="userProfile">
              <img src="./image/dummyProfile.png" alt="" />
            </div>
          </div>
          <div className="asideContacts flex-grow-1 overflow-auto">
            {contactArray.map((contact, index) => (
              <AsideContactsItem userName='Radhe Patel' tagLine='enjoy your life' index={index} activeChat={activeChat} key={index} onClick={(e) => { setActiveChat(index) }} />
            ))}
          </div>
          <div className="asideFooter">
            <div className="asideFooterMenu">
              <div className="menuItem"><Link><i className="fa-regular fa-address-book"></i></Link></div>
              <div className="menuItem"><Link><i className="fa-solid fa-user-plus"></i></Link></div>
              <div className="menuItem"><Link><i className="fa-solid fa-phone"></i></Link></div>
              <div className="menuItem"><Link className="menuItem" title='search'><i className="fa-solid fa-magnifying-glass"></i></Link></div>
              <div className="menuItem"><Link className="menuItem" title='logout' to={APP_URL.FE_LOGOUT}><i className="fa-solid fa-right-from-bracket"></i></Link></div>

            </div>
          </div>
        </div>