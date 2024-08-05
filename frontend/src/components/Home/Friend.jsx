import React, { useEffect, useState } from 'react'
import { Input } from '../Form'
import AsideContactsItem from './AsideContactsItem'
import { useDispatch, useSelector } from 'react-redux'
import { changeActiveUserChat } from '../../reducers/chatReducer';

function Friend() {
    const friends = useSelector((state) => state.chat.friends);
    const dispatch = useDispatch();
    console.log('friends', friends)
    const [activeChat,setActiveChat]=useState(-1)
    useEffect(()=>{
        if(activeChat<0){
            return;
        }
        dispatch(changeActiveUserChat(friends[activeChat]));
    },[activeChat])
    return (
        <>
            {(!friends || friends.length === 0) &&
                <div className='h-100 d-flex flex-column justify-content-center align-items-center '>
                    <h4 className='emptyMessage'>Friends not found</h4>
                </div>
            }
            {(friends && friends.length>=0)&&(<>
                <Input inputClass='inputBlack mx-2' placeholder="Search User Name ... "></Input>
                {friends.map((contact, index) => (
                    <AsideContactsItem userName={contact.userName} tagLine={contact.tagLine??"-"} index={index} activeChat={activeChat} key={index} onClick={(e) => { setActiveChat(index) }} />
                ))}
            </>)}
        </>
    )
}

export default Friend
