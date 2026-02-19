import { Grid } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderCard from "./OrderCard";
import { getOrderHistory } from "../../../State/Order/Action";

const orderStatus = [
  { label: "On the way", value: "on_the_way" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
];

const normalizeStatus = (status) => {
  const value = (status || "").toLowerCase();
  if (value.includes("deliver")) return "delivered";
  if (value.includes("cancel")) return "cancelled";
  if (value.includes("return")) return "returned";
  return "on_the_way";
};

const Order = () => {
  const dispatch = useDispatch();
  const { order } = useSelector((store) => store);
  const [selectedStatus, setSelectedStatus] = useState([]);

  useEffect(() => {
    dispatch(getOrderHistory());
  }, [dispatch]);

  const filteredOrders = useMemo(() => {
    const allOrders = order?.orders || [];
    if (selectedStatus.length === 0) return allOrders;
    return allOrders.filter((item) =>
      selectedStatus.includes(normalizeStatus(item.orderStatus))
    );
  }, [order?.orders, selectedStatus]);

  const handleStatusFilter = (value) => {
    setSelectedStatus((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  return (
    <div className="px-5 lg:px-20 pb-12">
      <Grid container columnSpacing={4}>
        <Grid item xs={12} md={3}>
          <div className="h-auto shadow-lg bg-white p-5 md:sticky md:top-6">
            <h1 className="font-bold text-lg">Filter</h1>
            <div className="space-y-4 mt-10">
              <h1 className="font-semibold">ORDER STATUS</h1>
              {orderStatus.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={option.value}
                    type="checkbox"
                    checked={selectedStatus.includes(option.value)}
                    onChange={() => handleStatusFilter(option.value)}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label className="ml-3 text-m text-gray-600" htmlFor={option.value}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Grid>

        <Grid item xs={12} md={9}>
          <div className="space-y-5">
            {order.loading && <p>Loading orders...</p>}
            {!order.loading && filteredOrders.length === 0 && (
              <p className="text-gray-600">No orders found.</p>
            )}
            {filteredOrders.map((item) => (
              <OrderCard key={item.id} order={item} />
            ))}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Order;
