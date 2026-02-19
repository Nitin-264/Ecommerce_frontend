import {api} from "../../Config/ApiConfig"
import {
    CREATE_ORDER_REQUEST,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
    GET_ORDER_BY_ID_REQUEST,
    GET_ORDER_BY_ID_SUCCESS,
    GET_ORDER_BY_ID_FAILURE,
    GET_ORDER_HISTORY_REQUEST,
    GET_ORDER_HISTORY_SUCCESS,
    GET_ORDER_HISTORY_FAILURE
} from "./ActionType"
import { clearCart } from "../cart/Action";


export const createOrder =(reqData)=> async (dispatch)=>{
    dispatch({type : CREATE_ORDER_REQUEST});
    try{
        console.log("address that i have to submit is ::",reqData.address)
        const {data} =await api.post("/api/orders/",reqData.address);
        dispatch({
            type:CREATE_ORDER_SUCCESS,
            payload:data
        });
        try {
            await dispatch(clearCart());
        } catch (clearError) {
            console.log("clear cart error after order creation:", clearError);
        }
        if(data.id){
            reqData.navigate({search:`step=3&order_id=${data.id}` })
        }
        console.log("created order = ",data);
    }catch(error){
        console.log("catch error : ",error);
        dispatch({
            type:CREATE_ORDER_FAILURE,
            payload:error.message
        });
    }
}

export const getOrderById=(orderId)=> async(dispatch)=>{
    dispatch({type:GET_ORDER_BY_ID_REQUEST});
    try{
        const normalizedOrderId =
            typeof orderId === "object" ? orderId?.orderId : orderId;
        const {data}= await api.get(`api/orders/${normalizedOrderId}`);
        dispatch({
            type:GET_ORDER_BY_ID_SUCCESS,
            payload:data
        })
    }catch(error){
        console.log("catch ",error)
        dispatch({
            type:GET_ORDER_BY_ID_FAILURE,
            payload:error.message
        })
    }
}

export const getOrderHistory = () => async (dispatch) => {
    dispatch({ type: GET_ORDER_HISTORY_REQUEST });
    try {
        const endpoints = ["/api/orders/", "/api/orders/user", "/api/orders/user/orders"];
        let responseData = null;

        for (const endpoint of endpoints) {
            try {
                const { data } = await api.get(endpoint);
                responseData = data;
                break;
            } catch (error) {
                // try next endpoint
            }
        }

        if (!responseData) {
            throw new Error("Unable to fetch order history");
        }

        const orders = Array.isArray(responseData)
            ? responseData
            : responseData?.content || responseData?.orders || (responseData?.id ? [responseData] : []);

        dispatch({
            type: GET_ORDER_HISTORY_SUCCESS,
            payload: orders
        });
    } catch (error) {
        dispatch({
            type: GET_ORDER_HISTORY_FAILURE,
            payload: error.message
        });
    }
};
