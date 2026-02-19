import { ADD_ITEM_TO_CART_FAILURE, ADD_ITEM_TO_CART_REQUEST, ADD_ITEM_TO_CART_SUCCESS, CLEAR_CART, GET_CART_FAILURE, GET_CART_REQUEST, GET_CART_SUCCESS, REMOVE_CART_ITEM_FAILURE, REMOVE_CART_ITEM_REQUEST, REMOVE_CART_ITEM_SUCCESS, UPDATE_CART_ITEM_FAILURE, UPDATE_CART_ITEM_REQUEST, UPDATE_CART_ITEM_SUCCESS } from "./ActionType";
import { api } from "../../Config/ApiConfig"
export const getCart = () => async (dispatch) => {
    dispatch({ type: GET_CART_REQUEST })

    try {
        const { data } = await api.get(`api/cart/`)
        dispatch({ type: GET_CART_SUCCESS, payload: data })
    } catch (error) {
        dispatch({ type: GET_CART_FAILURE, payload: error.message })
    }
}
export const addItemToCart = (reqData) => async (dispatch) => {
    dispatch({ type: ADD_ITEM_TO_CART_REQUEST });

    try {
        const { data } = await api.put("/api/cart/add", reqData);
        dispatch({ type: ADD_ITEM_TO_CART_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: ADD_ITEM_TO_CART_FAILURE, payload: error.message });
    }
};


export const removeCartItem = (cartItemData) => async (dispatch) => {
    dispatch({ type: REMOVE_CART_ITEM_REQUEST });
    try {
        const fetchCart = async () => {
            const endpoints = ["api/cart/", "/api/cart/"];
            for (const endpoint of endpoints) {
                try {
                    const { data } = await api.get(endpoint);
                    return data;
                } catch (error) {
                    // try next endpoint variant
                }
            }
            return null;
        };

        const firstCart = await fetchCart();
        const cartItems = firstCart?.cartItem || [];
        const isObjectPayload = typeof cartItemData === "object";

        const isSameCartItem = (item) => {
            if (!item) return false;
            const sameCartId =
                (cartItemData?.cartItemId && item?.cartItemId === cartItemData?.cartItemId) ||
                (cartItemData?.id && item?.id === cartItemData?.id);
            const sameProduct =
                item?.product?.id &&
                cartItemData?.product?.id &&
                item.product.id === cartItemData.product.id;
            const sameVariant =
                (item?.size || null) === (cartItemData?.size || null) &&
                (item?.color || null) === (cartItemData?.color || null);
            return sameCartId || (sameProduct && sameVariant);
        };

        const matchedCartItem = isObjectPayload
            ? cartItems.find((item) => isSameCartItem(item))
            : null;

        const candidateIds = Array.from(
            new Set(
                [
                    matchedCartItem?.cartItemId,
                    matchedCartItem?.id,
                    isObjectPayload ? cartItemData?.cartItemId : cartItemData,
                    isObjectPayload ? cartItemData?.id : null,
                    isObjectPayload ? cartItemData?.product?.id : null,
                    isObjectPayload ? cartItemData?.cart_item_id : null,
                    isObjectPayload ? cartItemData?.cartitemId : null
                ].filter(Boolean)
            )
        );

        if (candidateIds.length === 0) {
            throw new Error("Unable to resolve cart item id");
        }

        let removed = false;
        for (const id of candidateIds) {
            const removeEndpoints = [
                `/api/cartItem/${id}`,
                `/api/cartItem/${id}/delete`,
                `/api/cartItem/remove/${id}`,
                `/api/cart_items/${id}`,
                `/api/cart_items/${id}/delete`,
                `/api/cart/${id}/remove`
            ];
            for (const endpoint of removeEndpoints) {
                try {
                    await api.delete(endpoint);
                    const refreshedCart = await fetchCart();
                    const refreshedItems = refreshedCart?.cartItem || [];
                    const stillExists = isObjectPayload
                        ? refreshedItems.some((item) => isSameCartItem(item))
                        : refreshedItems.some((item) => {
                              const itemIds = [item?.cartItemId, item?.id, item?.product?.id].filter(Boolean);
                              return itemIds.includes(cartItemData);
                          });

                    if (!stillExists) {
                        removed = true;
                        break;
                    }
                } catch (error) {
                    // try next endpoint variant
                }
            }
            if (removed) break;
        }

        if (!removed) {
            for (const id of candidateIds) {
                try {
                    await api.put(`/api/cartItem/${id}/0`);
                    const refreshedCart = await fetchCart();
                    const refreshedItems = refreshedCart?.cartItem || [];
                    const stillExists = isObjectPayload
                        ? refreshedItems.some((item) => isSameCartItem(item))
                        : refreshedItems.some((item) => {
                              const itemIds = [item?.cartItemId, item?.id, item?.product?.id].filter(Boolean);
                              return itemIds.includes(cartItemData);
                          });

                    if (!stillExists) {
                        removed = true;
                        break;
                    }
                } catch (error) {
                    // try next identifier
                }
            }
        }

        if (!removed) {
            throw new Error("Unable to remove cart item");
        }

        dispatch({ type: REMOVE_CART_ITEM_SUCCESS, payload: candidateIds });
        dispatch(getCart());
    } catch (error) {
        dispatch({ type: REMOVE_CART_ITEM_FAILURE, payload: error.message });
        dispatch(getCart());
    }
};

export const updateCartItem = (reqData) => async (dispatch) => {
    dispatch({ type: UPDATE_CART_ITEM_REQUEST });
    
    try {
        const { data } = await api.put(`/api/cartItem/${reqData.cartItemId}/${reqData.data.quantity}`);
        dispatch({ type: UPDATE_CART_ITEM_SUCCESS, payload: data });
        dispatch(getCart());
    } catch (error) {
        dispatch({ type: UPDATE_CART_ITEM_FAILURE, payload: error.message });
    }
};

export const clearCart = () => async (dispatch) => {
    dispatch({ type: CLEAR_CART });
    try {
        const fetchCartData = async () => {
            const endpoints = ["api/cart/", "/api/cart/"];
            for (const endpoint of endpoints) {
                try {
                    const { data } = await api.get(endpoint);
                    return data;
                } catch (error) {
                    // try next endpoint variant
                }
            }
            return null;
        };

        const isItemStillPresent = (items = [], targetItem = {}) => {
            const targetIds = new Set(
                [
                    targetItem?.cartItemId,
                    targetItem?.id,
                    targetItem?.productId,
                    targetItem?.product?.id
                ].filter(Boolean)
            );

            return (items || []).some((item) => {
                const itemIds = [
                    item?.cartItemId,
                    item?.id,
                    item?.productId,
                    item?.product?.id
                ].filter(Boolean);
                const sameIdentity = itemIds.some((id) => targetIds.has(id));
                if (!sameIdentity) return false;
                const qty = Number(item?.quantity ?? 1);
                return qty > 0;
            });
        };

        const removeByIdCandidates = async (ids = [], targetItem = {}) => {
            for (const id of ids) {
                const removeEndpoints = [
                    `/api/cartItem/${id}`,
                    `/api/cartItem/${id}/delete`,
                    `/api/cartItem/remove/${id}`,
                    `/api/cart_items/${id}`,
                    `/api/cart_items/${id}/delete`,
                    `/api/cart/${id}/remove`
                ];

                for (const endpoint of removeEndpoints) {
                    try {
                        await api.delete(endpoint);
                        const refreshedCartData = await fetchCartData();
                        const refreshedCartItems =
                            refreshedCartData?.cartItem ||
                            refreshedCartData?.cartItems ||
                            refreshedCartData?.items ||
                            [];
                        if (!isItemStillPresent(refreshedCartItems, targetItem)) {
                            return true;
                        }
                    } catch (error) {
                        // try next endpoint variant
                    }
                }

                try {
                    await api.put(`/api/cartItem/${id}/0`);
                    const refreshedCartData = await fetchCartData();
                    const refreshedCartItems =
                        refreshedCartData?.cartItem ||
                        refreshedCartData?.cartItems ||
                        refreshedCartData?.items ||
                        [];
                    if (!isItemStillPresent(refreshedCartItems, targetItem)) {
                        return true;
                    }
                } catch (error) {
                    // try next id candidate
                }
            }
            return false;
        };

        const clearItems = async (items = []) => {
            for (const item of items) {
                const ids = Array.from(
                    new Set(
                        [
                            item?.cartItemId,
                            item?.id,
                            item?.productId,
                            item?.product?.id
                        ].filter(Boolean)
                    )
                );
                await removeByIdCandidates(ids, item);
            }
        };

        const firstCartData = await fetchCartData();
        const firstCartItems = firstCartData?.cartItem || firstCartData?.cartItems || firstCartData?.items || [];
        await clearItems(firstCartItems);

        // Verify once more to avoid stale items showing in next order flow.
        const secondCartData = await fetchCartData();
        const secondCartItems = secondCartData?.cartItem || secondCartData?.cartItems || secondCartData?.items || [];
        if (secondCartItems.length > 0) {
            await clearItems(secondCartItems);
        }

        dispatch(getCart());
    } catch (error) {
        dispatch({ type: GET_CART_FAILURE, payload: error.message });
    }
};
