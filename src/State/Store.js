import { applyMiddleware, combineReducers,legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/Reducer";
import { customerProductReducer } from "./Product/Reducer";
import {cartReducer} from "./cart/Reducer"
import {orderReducer} from "./Order/Reducer"
import adminOrderReducer from "./Admin/Order/Reducer";
import { LOGOUT } from "./Auth/ActionType";

const appReducer=combineReducers({
    auth:authReducer,
    customerproduct:customerProductReducer,
    cart:cartReducer,
    order:orderReducer,
    adminOrder:adminOrderReducer
})

const rootReducers = (state, action) => {
    if (action.type === LOGOUT) {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

export const store=legacy_createStore(rootReducers,applyMiddleware(thunk))
