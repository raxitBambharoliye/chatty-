import React from 'react'
import { Input } from '../Form'
import AsideContactsItem from './AsideContactsItem'
import { useSelector } from 'react-redux'

function Friend() {
    const friends = useSelector((state) => state.chat.friends)
    console.log('friends', friends)

    return (
        <>
            {(!friends || friends.length === 0) &&
                <div className='h-100 d-flex flex-column justify-content-center align-items-center '>
                    <h4 className='emptyMessage'>Friends not found</h4>
                </div>
            }
            {(friends && friends.length>=0)&&(<>
                <Input inputClass='inputBlack mx-2' placeholder="Search User Name ... "></Input>
                {contactArray.map((contact, index) => (
                    <AsideContactsItem userName='Radhe Patel' tagLine='enjoy your life' index={index} activeChat={activeChat} key={index} onClick={(e) => { setActiveChat(index) }} />
                ))}
            </>)}
        </>
    )
}

export default Friend
