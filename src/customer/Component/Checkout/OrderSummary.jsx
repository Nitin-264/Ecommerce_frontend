import React, { useEffect } from 'react'
import AddressCard from '../AddressCard/AddressCard'
import { Button } from '@mui/material'
import CartItem from '../Cart/CartItem'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { getOrderById } from '../../../State/Order/Action'
import { createPayment } from '../../../State/Payment/Action'

const OrderSummary = () => {

  const dispatch=useDispatch()
  const location=useLocation()
  const searchParams=new URLSearchParams(location.search);
  const orderId=searchParams.get("order_id")
  const {order, auth}=useSelector(store=>store);
  const profilePhone =
    auth?.user?.mobile ||
    auth?.user?.phoneNumber ||
    auth?.user?.phone ||
    auth?.user?.contactNumber ||
    "";
  const summaryAddress = {
    ...(order.order?.shippingAddress || {}),
    mobile:
      order.order?.shippingAddress?.mobile ||
      order.order?.shippingAddress?.phoneNumber ||
      order.order?.shippingAddress?.phone ||
      order.order?.shippingAddress?.contactNumber ||
      profilePhone ||
      "",
  };
  const visibleOrderItems = (order.order?.orderItem || []).filter((item) => {
    const qty = item?.quantity;
    if (qty === undefined || qty === null) return true;
    return Number(qty) > 0;
  });

  useEffect(()=>{
    dispatch(getOrderById(orderId))
  },[dispatch, orderId])

  const handleCheckout=()=>{
    dispatch(createPayment(orderId))
  }

  return (
    <div>
      <div className='p-5 shadow-lg rounded-s-md border'>
        <AddressCard address={summaryAddress}/>
      </div>
      <div>
        <div>
      {/* Main layout */}
      <div className="lg:grid grid-cols-3 lg:px-16 relative">
        {/* Left side: Cart items */}
        <div className="col-span-2">
          {visibleOrderItems.map((items, index)=>(
            <CartItem
              key={items?.id ?? `${items?.product?.id || "item"}-${index}`}
              item={items}
              readOnly
            />
          ))}
        </div>

        {/* Right side: Price details */}
        <div className="px-5 sticky top-0 h-[100vh] mt-5 lg:mt-0">
          <div className="border p-4 rounded-md shadow-sm">
            <p className="uppercase font-bold opacity-60 pb-4">Price Details</p>
            <hr />
            <div className="space-y-3 font-semibold pt-3 text-black">
              <div className="flex justify-between">
                <span>Price</span>
                <span>₹{order.order?.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span className='text-green-600'>₹{order.order?.discount}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className='text-green-600'>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className='text-green-600'>₹{order.order?.totalDiscountedPrice}</span>
              </div>
            </div>
            <Button variant='contained' className='w-full mt-5' sx={{px:'2.5rem',py:'.7rem',bgcolor:"Violet"}}
             onClick={handleCheckout}>
                    Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  )
}

export default OrderSummary
