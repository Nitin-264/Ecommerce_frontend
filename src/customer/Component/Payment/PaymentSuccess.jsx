// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useParams, useSearchParams } from 'react-router-dom'
// import { updatePayment } from '../../../State/Payment/Action'
// import { getOrderById } from "../../../State/Order/Action"
// import Alert from '@mui/material/Alert';
// import AlertTitle from '@mui/material/AlertTitle';
// import OrderTracker from "../../Component/Order/OrderTracker"
// import { Grid } from '@mui/material'
// import AddressCard from "../AddressCard/AddressCard"

// const PaymentSuccess = () => {
//   const [paymentId, setPaymentId] = useState()
//   const [referencedId, setReferencedId] = useState()
//   const [paymentStatus, setPaymentStatus] = useState()
//   const { orderId } = useParams();
//   const dispatch = useDispatch();
//   const { order } = useSelector(store => store)

//   console.log("order ",order.order)

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     setPaymentId(urlParams.get("razorpay_payment_id"));
//     setPaymentStatus(urlParams.get("razorpay_payment_link_status"))
//   }, [])

//   useEffect(() => {
//     const data = { orderId, paymentId }
//     dispatch(getOrderById(orderId))
//     dispatch(updatePayment(data))
//   }, [orderId, paymentId])

//   return (
//   <div className='px-2 lg:px-36'>
//     {/* Success Alert */}
//     <div className='flex flex-col items-center justify-center'>
//       <Alert
//         variant='filled'
//         severity='success'
//         sx={{ mb: 6, width: 'fit-content' }}
//       >
//         <AlertTitle>Payment Success</AlertTitle>
//         Congratulations! Your order has been placed.
//       </Alert>
//     </div>

//     {/* Order Tracker */}
//     <OrderTracker activeStep={1} />

//     {/* Order Items */}
//     <Grid container spacing={3} className='py-5 pt-20' direction='column'>
//       {order.order?.orderItem.map((item, index) => (
//         <Grid
//           item
//           key={index}
//           className='p-5 rounded-md shadow-xl'
//         >
//           {/* Flex layout: Product Info left, AddressCard right */}
//           <div className='flex items-start justify-between'>
//             {/* Product Info */}
//             <div className='flex items-center'>
//               <img
//                 className='w-[5rem] h-[5rem] object-cover object-top'
//                 src={item.product.imageUrl}
//                 alt='Product'
//               />
//               <div className='ml-5 space-y-2'>
//                 <p>{item.product.title}</p>
//                 <div className='space-x-5 text-xs font-semibold opacity-50'>
//                   <span>Color: {item.color}</span>
//                   <span>Size: {item.size}</span>
//                 </div>
//                 <p>Seller: {item.prodct.brand}</p>
//                 <p>₹{item.price}</p>
//               </div>
//             </div>

//             {/* AddressCard aligned to right */}
//             <div className='min-w-[250px]'>
//               <AddressCard address={order.order?.shippingAddress} />
//             </div>
//           </div>
//         </Grid>
//       ))}
//     </Grid>
//   </div>
// );

// }

// export default PaymentSuccess


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { updatePayment } from "../../../State/Payment/Action";
import { getOrderById } from "../../../State/Order/Action";
import { clearCart } from "../../../State/cart/Action";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import OrderTracker, { getTrackerStepFromStatus } from "../../Component/Order/OrderTracker";
import { Grid } from "@mui/material";
import AddressCard from "../AddressCard/AddressCard";

const PaymentSuccess = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch();
  const { order } = useSelector((store) => store.order);
  const orderStatusValue =
    order?.orderStatus ||
    order?.order_status ||
    order?.status ||
    "";

  const validOrderItems = (order?.orderItem || []).filter((item) => {
    const quantity = Number(item?.quantity ?? 0);
    const effectivePrice = Number(item?.discountedPrice ?? item?.price ?? 0);
    return quantity > 0 && effectivePrice > 0;
  });

  const [paymentId, setPaymentId] = useState(null);

  // 🔥 Extract Razorpay payment id from URL
  useEffect(() => {
    const payment_id = searchParams.get("razorpay_payment_id");
    if (payment_id) {
      setPaymentId(payment_id);
    }
  }, [searchParams]);

  // 🔥 Confirm payment in backend
  useEffect(() => {
    if (paymentId && orderId) {
      dispatch(updatePayment({ orderId, paymentId }))
        .then(() => {
          dispatch(getOrderById(orderId));
          dispatch(clearCart());
        })
        .catch((err) => {
          console.log("Payment confirmation error:", err);
        });
    }
  }, [orderId, paymentId, dispatch]);

  useEffect(() => {
    if (!orderId) return;

    dispatch(getOrderById(orderId));
    const intervalId = setInterval(() => {
      dispatch(getOrderById(orderId));
    }, 15000);

    return () => clearInterval(intervalId);
  }, [dispatch, orderId]);

  if (!order) return null;

  return (
    <div className="px-2 lg:px-36">
      {/* Success Alert */}
      <div className="flex flex-col items-center justify-center">
        <Alert
          variant="filled"
          severity="success"
          sx={{ mb: 6, width: "fit-content" }}
        >
          <AlertTitle>Payment Success</AlertTitle>
          Congratulations! Your order has been placed.
        </Alert>
      </div>

      {/* Order Tracker */}
      <OrderTracker activeStep={getTrackerStepFromStatus(orderStatusValue)} />

      {/* Order Items */}
      <Grid container spacing={3} className="py-5 pt-20" direction="column">
        {validOrderItems.map((item, index) => (
          <Grid
            item
            key={index}
            className="p-5 rounded-md shadow-xl"
          >
            <div className="flex items-start justify-between">
              
              {/* Product Info */}
              <div className="flex items-center">
                <img
                  className="w-[5rem] h-[5rem] object-cover object-top"
                  src={item?.product?.imageUrl}
                  alt="Product"
                />
                <div className="ml-5 space-y-2">
                  <p>{item?.product?.title}</p>
                  <div className="space-x-5 text-xs font-semibold opacity-50">
                    <span>Color: {item?.product?.color}</span>
                    <span>Size: {item?.size}</span>
                  </div>
                  <p>Seller: {item?.product?.brand}</p>
                  <p>₹{item?.discountedPrice ?? item?.price}</p>
                </div>
              </div>

              {/* Address */}
              <div className="min-w-[250px]">
                <AddressCard address={order?.shippingAddress} />
              </div>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default PaymentSuccess;
