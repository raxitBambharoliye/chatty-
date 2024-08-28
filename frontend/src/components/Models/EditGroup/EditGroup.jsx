import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input,  } from '../../Form'
import ImagePreview from '../../ImagePreview'
import { useDispatch, useSelector } from 'react-redux'
import { AxiosCLI } from '../../../axios'
import { APP_URL } from '../../../constant'
import { pushFriend, updateFriends } from '../../../reducers/chatReducer'

function EditGroup({ id, modalClass = '' }) {
    const ref = useRef()
    const activeUserChat=useSelector((state)=>state.chat.activeUserChat)
    const user = useSelector((state) => state.userData.user)
    const dispatch = useDispatch();
    const { register, formState: { errors }, setError, handleSubmit, setValue } = useForm({
        defaultValues: {
            groupName: activeUserChat.groupName,
            tagLine: activeUserChat.tagLine??null
        }
    });
    const closeButtonRef = useRef();
    const editGroup = async (data) => {
        const formData = new FormData();
        if (data.groupProfile[0]) {
            formData.append('groupProfile', data.groupProfile[0])
        }
        formData.append('groupName', data.groupName)
        formData.append("tagLine", data.tagLine);
        formData.append("groupId", activeUserChat._id);
        formData.append("changer", user._id);
        const updateGroup = await AxiosCLI.post(APP_URL.UPDATE_GROUP, formData);
        if (updateGroup.status === 200) {
            closeButtonRef.current.click();
        }
    }

    return (
        <div>
            <div className={`modal fade  ${modalClass}`} id={id} tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form className="modal-dialog modal-dialog-centered modal-xl" action='' onSubmit={handleSubmit(editGroup)}>
                    <div className={`modal-content`}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 text-center w-100" id="exampleModalLabel">Edit Group</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                {errors.root && <p className='alert rootErrorValidation text-center' role="alert">{errors.root.message}</p>}
                                <div className="col-12 col-lg-3 col-xl-2">
                                    <ImagePreview {...register("groupProfile",)} src={activeUserChat.groupProfile ?? "./image/dummyGroupProfile.png"} />
                                </div>
                                <div className="col-12 col-lg-9 col-xl-10 flex-grow-1">
                                    <Input inputClass='inputBlack' type='text' placeholder='Enter your group name ... ' label='Group Name' ref={ref}  {...register("groupName", {
                                        required: "Please enter your group name",
                                    })}
                                    />
                                    {errors.groupName && <p className='validationError pb-2'>{errors.groupName.message}</p>}
                                    <Input inputClass='inputBlack' type='text' placeholder='Enter your groups tag line ... ' label='Tag Line    ' ref={ref}  {...register("tagLine")} />
                                    {errors.tagLine && <p className='validationError pb-2'>{errors.tagLine.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Button buttonClass='buttonBlack hover btnRounded me-2' type='button' value='Discard' data-bs-dismiss="modal" ref={closeButtonRef} />
                            <Button buttonClass='themBlueBordered btnRounded' type='submit' value='Update Group' ref={ref} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditGroup;
