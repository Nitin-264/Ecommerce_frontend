import { Grid } from "@mui/material";
import React from "react";
import AdjustIcon from "@mui/icons-material/Adjust";
import { useNavigate } from "react-router-dom";

const getStatusText = (status) => {
  const normalized = (status || "").toLowerCase();
  if (normalized.includes("deliver")) return "Delivered";
  if (normalized.includes("cancel")) return "Cancelled";
  if (normalized.includes("return")) return "Returned";
  return "On the way";
};

const OrderCard = ({ order }) => {
  const navigate = useNavigate();
  const validItems = (order?.orderItem || []).filter((item) => {
    const quantity = Number(item?.quantity ?? 0);
    const effectivePrice = Number(item?.discountedPrice ?? item?.price ?? 0);
    return quantity > 0 && effectivePrice > 0;
  });
  const firstItem = validItems[0];
  const status = getStatusText(order?.orderStatus);
  const delivered = status === "Delivered";

  if (!firstItem) return null;

  return (
    <div
      onClick={() => navigate(`/account/order/${order.id}`)}
      className="p-5 shadow-lg hover:shadow-xl border cursor-pointer"
    >
      <Grid container spacing={2} sx={{ justifyContent: "space-between" }}>
        <Grid item xs={12} md={7}>
          <div className="flex">
            <img
              className="w-[5rem] h-[5rem] object-cover object-top"
              src={firstItem.product?.imageUrl}
              alt={firstItem.product?.title || "Product"}
            />
            <div className="ml-5 space-y-2">
              <p>{firstItem.product?.title}</p>
              <p className="opacity-50 text-xs font-semibold">
                Size: {firstItem.size || "-"}
              </p>
              <p className="opacity-50 text-xs font-semibold">
                Color: {firstItem.product?.color || "-"}
              </p>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} md={2}>
          <p>Rs. {order.totalDiscountedPrice ?? firstItem.discountedPrice ?? firstItem.price}</p>
        </Grid>

        <Grid item xs={12} md={3}>
          {delivered ? (
            <div>
              <p>
                <AdjustIcon
                  sx={{ width: "15px", height: "15px" }}
                  className="text-green-600 mr-2 text-sm"
                />
                <span>Delivered</span>
              </p>
              <p>Your item has been delivered</p>
            </div>
          ) : (
            <p>
              <span>Status: {status}</span>
            </p>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderCard;
