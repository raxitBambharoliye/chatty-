import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';

function PopUp() {
  const popupData = useSelector((state) => state.chat.popup);
  console.log('popupData', popupData)

  if (popupData && popupData.message) {
    return (
      <div className='popUpContainer '>
        <div className="card popup_inner text-center">
         {popupData.title && <div className="card-header">{ popupData.title}</div>}
          <div className="card-body">
            <p className="card-text">
              {popupData.message}
            </p>
            {popupData.button && (
              <Link to={popupData.redirectUrl??"#"} className="btn btn-primary">
              {popupData.button}
            </Link>
            )}
          </div>
        </div>

      </div>
    )
  }
  return (<></>);
}

export default PopUp
