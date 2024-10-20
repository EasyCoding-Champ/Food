import React from 'react'

const Payment = (props) => {
let payment=props.item
  return (
    <div>
      {payment && (
        <div>
          <p>Redirecting to payment...</p>
          <a href={payment} target="_blank" rel="noopener noreferrer">Pay Now</a>
        </div>
      )}
    </div>
  )
}

export default Payment
