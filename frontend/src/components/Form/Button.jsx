import React from 'react'

function Button({
    value = "click",
    type = "button",
    buttonClass = '',
    ...props
},ref) {
  return (
      <button type={type} className={`btn ${buttonClass}`} ref={ref} {...props}>{ value}</button>
  )
}

export default React.forwardRef(Button)
