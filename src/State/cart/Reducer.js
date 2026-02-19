import { ADD_ITEM_TO_CART_FAILURE, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, CLEAR_CART, GET_CART_FAILURE, GET_CART_REQUEST, GET_CART_SUCCESS, REMOVE_CART_ITEM_FAILURE, REMOVE_CART_ITEM_REQUEST, REMOVE_CART_ITEM_SUCCESS, UPDATE_CART_ITEM_FAILURE, UPDATE_CART_ITEM_REQUEST, UPDATE_CART_ITEM_SUCCESS } from "./ActionType";
const initialState = {
    cart: null,
    loading: false,
    error: null,
    cartItem: [],
};

const getVisibleCartItems = (items = []) =>
    (items || []).filter((item) => {
        const qty = item?.quantity;
        if (qty === undefined || qty === null) return true;
        return Number(qty) > 0;
    });

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_ITEM_TO_CART_REQUEST:
            return { ...state, loading: true, error: null };

        case ADD_ITEM_TO_CART_SUCCESS:
            return {
                ...state,
                cartItem: [...state.cartItem, action.payload.cartItem],
                loading: false,
            };

        case ADD_ITEM_TO_CART_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case GET_CART_REQUEST:
            return {...state,loading:true, error:null
            }
        case GET_CART_SUCCESS: {
            const visibleCartItems = getVisibleCartItems(action.payload?.cartItem || []);
            return {
                ...state,
                cartItem: visibleCartItems,
                cart: {
                    ...action.payload,
                    cartItem: visibleCartItems
                },
                loading: false,
            };
        }

        case GET_CART_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };

        case REMOVE_CART_ITEM_REQUEST:
        case UPDATE_CART_ITEM_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };

        // case REMOVE_CART_ITEM_SUCCESS:
        //     return {
        //         ...state,
        //         deletecartItem: action.payload,
        //         loading: false,
        //     };

        case REMOVE_CART_ITEM_SUCCESS: {
            if (!state.cart) {
                return { ...state, loading: false };
            }
            const removedIdSet = new Set(
                Array.isArray(action.payload) ? action.payload : [action.payload]
            );
            return {
                ...state,
                cartItem: state.cartItem.filter(item => {
                    const itemIds = [item?.cartItemId, item?.id, item?.product?.id].filter(Boolean);
                    return !itemIds.some(id => removedIdSet.has(id));
                }),
                cart: {
                    ...state.cart,
                    cartItem: state.cart.cartItem.filter(
                        item => {
                            const itemIds = [item?.cartItemId, item?.id, item?.product?.id].filter(Boolean);
                            return !itemIds.some(id => removedIdSet.has(id));
                        }
                    )
                },
                loading: false,
            };
        }
        // case UPDATE_CART_ITEM_SUCCESS:
        //     return {
        //         ...state,
        //         updatecartItem: action.payload,
        //         loading: false,
        //     };

        case UPDATE_CART_ITEM_SUCCESS:
            if (!state.cart) {
                return { ...state, loading: false };
            }
            return {
                ...state,
                cart: {
                    ...state.cart,
                    cartItem: state.cart.cartItem.map(item => {
                        const currentId = item?.cartItemId ?? item?.id;
                        const updatedId = action.payload?.cartItemId ?? action.payload?.id;
                        return currentId === updatedId ? action.payload : item;
                    })
                },
                loading: false,
            };
        case REMOVE_CART_ITEM_FAILURE:
        case UPDATE_CART_ITEM_FAILURE:
            return {
                ...state,
                error: action.payload,
                loading: false,
            };
        case CLEAR_CART:
            return {
                ...state,
                loading: false,
                error: null,
                cartItem: [],
                cart: {
                    ...(state.cart || {}),
                    cartItem: [],
                    totalPrice: 0,
                    totalDiscountedPrice: 0,
                    discounte: 0
                }
            };
        default:
            return state;
    }
};
