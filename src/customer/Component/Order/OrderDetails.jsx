import React, { useEffect } from "react";
import AddressCard from "../AddressCard/AddressCard";
import OrderTracker, { getTrackerStepFromStatus } from "./OrderTracker";
import { Box, Grid } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../../State/Order/Action";

const normalizeShippingAddress = (address = {}, order = {}) => {
  const source = address || order?.address || {};
  return {
    firstName: source?.firstName || order?.user?.firstName || "",
    lastName: source?.lastName || order?.user?.lastName || "",
    streetAddress:
      source?.streetAddress ||
      source?.address ||
      source?.addressLine1 ||
      source?.line1 ||
      source?.street ||
      "",
    city: source?.city || source?.town || source?.district || "",
    state: source?.state || source?.region || source?.province || "",
    pinCode:
      source?.pinCode ||
      source?.postalCode ||
      source?.zipCode ||
      source?.zip ||
      source?.pincode ||
      "",
    mobile:
      source?.mobile ||
      source?.phoneNumber ||
      source?.phone ||
      source?.contactNumber ||
      order?.user?.mobile ||
      ""
  };
};

export default function OrderDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { order, loading } = useSelector((store) => store.order);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    if (!orderId) return;
    const intervalId = setInterval(() => {
      dispatch(getOrderById(orderId));
    }, 15000);
    return () => clearInterval(intervalId);
  }, [dispatch, orderId]);

  if (loading && !order) {
    return <div className="px-5 lg:px-20 py-10 text-left">Loading order...</div>;
  }

  if (!order) {
    return <div className="px-5 lg:px-20 py-10 text-left">Order not found.</div>;
  }

  const shippingAddress = normalizeShippingAddress(order?.shippingAddress, order);
  const orderStatusValue =
    order?.orderStatus ||
    order?.order_status ||
    order?.status ||
    "";
  const orderItems = (order?.orderItem || []).filter((item) => {
    const quantity = Number(item?.quantity ?? 0);
    const effectivePrice = Number(item?.discountedPrice ?? item?.price ?? 0);
    return quantity > 0 && effectivePrice > 0;
  });

  return (
    <div className="px-5 lg:px-20 pb-12">
      <div className="text-left">
        <h1 className="font-bold text-xl py-5">Delivery Address</h1>
        <AddressCard address={shippingAddress} />
      </div>

      <div className="py-10 overflow-x-auto">
        <OrderTracker activeStep={getTrackerStepFromStatus(orderStatusValue)} />
      </div>

      <div className="space-y-5">
        {orderItems.map((item, index) => (
          <Grid
            key={item?.id || `${item?.product?.id || "item"}-${index}`}
            container
            sx={{
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className="shadow-xl rounded-md p-5 border"
          >
            <Grid item xs={12} md={8} className="flex items-center text-left">
              <img
                className="w-[5rem] h-[5rem] object-cover object-top"
                src={item?.product?.imageUrl}
                alt={item?.product?.title || "Product"}
              />
              <div className="space-y-2 ml-5">
                <p>{item?.product?.title}</p>
                <p className="space-x-5">
                  <span>Color: {item?.product?.color || "-"}</span>
                  <span>Size: {item?.size || "-"}</span>
                </p>
                <p>Seller: {item?.product?.brand || "-"}</p>
                <p>Rs. {item?.discountedPrice ?? item?.price ?? "-"}</p>
              </div>
            </Grid>

            <Grid item xs={12} md="auto" className="mt-4 md:mt-0">
              <Box
                sx={{ color: deepPurple[500], display: "flex", alignItems: "center", cursor: "pointer" }}
                onClick={() => {
                  if (item?.product?.id) {
                    navigate(`/product/${item.product.id}#reviews`);
                  }
                }}
              >
                <StarBorderIcon sx={{ fontSize: "2rem" }} className="px-2 text-5xl" />
                <span>Rate & Review Product</span>
              </Box>
            </Grid>
          </Grid>
        ))}
      </div>
    </div>
  );
}
