import React, { useEffect } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from "react-redux";
import { getOrders,confirmOrder,shipOrder,deliveredOrder,deleteOrder} from "../../State/Admin/Order/Action";
import {
  Card,
  CardHeader,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  AvatarGroup,
  Button,
  Box,
} from "@mui/material";

const OrdersTableView = () => {
  
// With this:
const [menuAnchorEls, setMenuAnchorEls] = React.useState({});

// This function opens menu for specific order id
const handleMenuOpen = (orderId, event) => {
  setMenuAnchorEls((prev) => ({
    ...prev,
    [orderId]: event.currentTarget,
  }));
};

// This function closes menu for specific order id
const handleMenuClose = (orderId) => {
  setMenuAnchorEls((prev) => ({
    ...prev,
    [orderId]: null,
  }));
};

  const dispatch = useDispatch();
  const { adminOrder } = useSelector((store) => store);

useEffect(() => {
  dispatch(getOrders());
}, []); // Fetch orders once on component mount

// Then refetch after status updates or deletes:
const handleConfirmedOrder = async (orderId) => {
  await dispatch(confirmOrder(orderId));
  dispatch(getOrders());
  handleMenuClose(orderId);
};

const handleShipedOrder = async (orderId) => {
  await dispatch(shipOrder(orderId));
  dispatch(getOrders());
  handleMenuClose(orderId);
};

const handleDeliveredOrder = async (orderId) => {
  await dispatch(deliveredOrder(orderId));
  dispatch(getOrders());
  handleMenuClose(orderId);
};

const handleDeleteOrder = async (orderId) => {
  await dispatch(deleteOrder(orderId));
  dispatch(getOrders());
  handleMenuClose(orderId);
};

  return (
    <div>
      <Card className="mt-2 bg-[#1b1b1b]">
        <CardHeader title="All Orders" />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="orders table">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Id</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adminOrder.orders?.map((order,index) => {
                // Images
                const images = order.orderItem.map((item) => item.product.imageUrl);
                // Titles
                const titles = order.orderItem.map((item) => item.product.title);
                // Calculate total price
                const totalPrice = order.orderItem.reduce(
                  (sum, item) => sum + (item.product.discountedPrice * item.quantity),
                  0
                );
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <AvatarGroup max={5}>
                        {images.map((imgUrl, idx) => (
                          <Avatar key={idx} src={imgUrl} />
                        ))}
                      </AvatarGroup>
                    </TableCell>
                    <TableCell>
                      {titles.map((title, idx) => (
                        <Box key={idx}>{title}</Box>
                      ))}
                    </TableCell>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{totalPrice}</TableCell>
                    <TableCell align="left">
                        <span
                          className={`${
                            order.orderStatus === "CONFIRMED"
                              ? "bg-green-500 text-white px-2 py-1 rounded"
                              : order.orderStatus === "SHIPPED"
                              ? "bg-blue-500 text-white px-2 py-1 rounded"
                              :order.orderStatus==="PLACED"
                              ? "bg-gray-500 text-white px-2 py-1 rounded"
                              :order.orderStatus==="DELIVERED"
                              ? "bg-yellow-500 text-white px-2 py-1 rounded"
                              : "bg-red-500 text-white px-2 py-1 rounded"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </TableCell>
                     
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};

export default OrdersTableView;
