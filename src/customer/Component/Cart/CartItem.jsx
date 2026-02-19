import { Button, IconButton } from "@mui/material";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateCartItem, removeCartItem } from "../../../State/cart/Action";

const CartItem = ({ item, readOnly = false }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.cart);
  const [quantity, setQuantity] = useState(item.quantity); // local state
  const cartItemId = item?.cartItemId ?? item?.id;
  const originalPrice = Number(item?.price || 0);
  const discountedPrice = Number(item?.discountedPrice || 0);
  const resolvedDiscountPercent =
    item?.discountPercent ??
    item?.discountPersent ??
    (originalPrice > 0 && discountedPrice >= 0
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0);

  const handleUpdateCartItem = (num) => {
    if (readOnly) return;
    if (!cartItemId) return;
    const newQuantity = quantity + num;
    if (newQuantity < 1) return;

    setQuantity(newQuantity); // Update local state for UI feedback
    const data = {
      data: { quantity: newQuantity },
      cartItemId
    };
    dispatch(updateCartItem(data));
  };

  const handleRemoveCartItem = () => {
    if (readOnly) return;
    if (!cartItemId && !item?.product?.id) return;
    dispatch(removeCartItem(item));
  };

  return (
    <div className="p-5 shadow-lg border rounded-md">
      <div className="flex items-center">
        {/* Product Image */}
        <div className="w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem]">
          <img
            className="w-full h-full object-cover object-top"
            src={item.product.imageUrl}
            alt=""
          />
        </div>

        {/* Text Content */}
        <div className="ml-5 space-y-1">
          <p className="font-semibold">{item.product.title}</p>
          <p className="opacity-70 -ml-1">Size: {item.size}, White</p>
          <p className="opacity-70 mt-2 -ml-1">Seller: {item.product.brand}</p>

          {/* Price Section */}
          <div className="flex space-x-5 items-center text-gray-900 pt-5">
            <p className="font-semibold">₹{item.discountedPrice}</p>
            <p className="opacity-50 line-through">₹{item.price}</p>
            <p className="text-green-600 font-semibold">{resolvedDiscountPercent}% Off</p>
          </div>
        </div>
      </div>

      {/* Quantity & Remove */}
      <div className="lg:flex items-center lg:space-x-10 pt-4">
        {/* Quantity Controller */}
        <div className="flex items-center space-x-2">
          {readOnly ? (
            <span className="py-1 px-7 border rounded-sm">Qty: {quantity}</span>
          ) : (
            <>
              <IconButton onClick={() => handleUpdateCartItem(-1)} disabled={quantity <= 1 || loading}>
                <RemoveCircleOutlineIcon />
              </IconButton>
              <span className="py-1 px-7 border rounded-sm">{quantity}</span>
              <IconButton onClick={() => handleUpdateCartItem(1)} sx={{ color: 'violet' }} disabled={loading}>
                <AddCircleOutlineIcon />
              </IconButton>
            </>
          )}
        </div>

        {/* Remove Button */}
        {!readOnly && (
          <div>
            <Button onClick={handleRemoveCartItem} sx={{ color: 'violet' }} disabled={loading}>remove</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
