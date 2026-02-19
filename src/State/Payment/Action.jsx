import {api} from "../../Config/ApiConfig"
import {CREATE_PAYMENT_FAILURE,CREATE_PAYMENT_REQUEST, UPDATE_PAYMENT_FAILURE, UPDATE_PAYMENT_REQUEST} from "./ActionType"

export const createPayment=(orderId)=>async(dispatch)=>{
    dispatch({type:CREATE_PAYMENT_REQUEST})
    try{
        console.log("Order id for payment is ::",orderId)

        let discountedAmount = null;
        try {
          const { data: orderData } = await api.get(`/api/orders/${orderId}`);
          discountedAmount =
            Number(
              orderData?.totalDiscountedPrice ??
              orderData?.total_amount ??
              orderData?.amount
            ) || null;
        } catch (error) {
          // continue with default payment endpoint if order lookup fails
        }

        const payloads = discountedAmount
          ? [
              { path: `/api/payments/${orderId}`, config: { params: { amount: discountedAmount } } },
              { path: `/api/payments/${orderId}`, body: { amount: discountedAmount } },
              { path: `/api/payments/${orderId}`, body: { totalAmount: discountedAmount } },
              { path: `/api/payments/${orderId}` }
            ]
          : [{ path: `/api/payments/${orderId}` }];

        let paymentData = null;
        for (const requestConfig of payloads) {
          try {
            const response = await api.post(
              requestConfig.path,
              requestConfig.body || {},
              requestConfig.config || {}
            );
            paymentData = response?.data;
            if (paymentData) break;
          } catch (error) {
            // try next payload variant
          }
        }

        const paymentLinkUrl =
          paymentData?.payment_Link_Url ||
          paymentData?.paymentLinkUrl ||
          paymentData?.payment_link_url ||
          paymentData?.url;

        console.log("payment link url is :: ", paymentLinkUrl);
        if(paymentLinkUrl){
            window.location.href=paymentLinkUrl;
            return;
        }

        throw new Error("Payment link not generated");
    }catch(error){
        dispatch({type:CREATE_PAYMENT_FAILURE,payload:error.message})
    }
}

// export const updatePayment=(reqData)=>async(dispatch)=>{
//     dispatch({type:UPDATE_PAYMENT_REQUEST})
//     try{
//         const {data} =await api.get(`/api/payments?payment_id=${reqData.paymentId}&order_id=${reqData.orderId}`);

//        console.log("update paymnent :- ",data)
//     }catch(error){
//         dispatch({type:UPDATE_PAYMENT_FAILURE,payload:error.mesage})
//     }
// }


export const updatePayment = ({ orderId, paymentId }) => async (dispatch) => {
  try {
    await api.get(
      `/api/payments/confirm?razorpay_payment_id=${paymentId}&order_id=${orderId}`
    );
  } catch (error) {
    console.log("Payment confirm error:", error);
  }
};
