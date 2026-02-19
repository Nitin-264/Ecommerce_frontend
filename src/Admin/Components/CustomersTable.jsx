import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrders } from "../../State/Admin/Order/Action";
import {
  Card,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Box,
} from "@mui/material";

const CustomersTable = () => {
  const dispatch = useDispatch();
  const { adminOrder } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  const customers = useMemo(() => {
    const orders = adminOrder?.orders || [];
    const customerMap = new Map();

    orders.forEach((order) => {
      const user = order?.user || {};
      const shipping = order?.shippingAddress || {};

      const userId = user?.id;
      const email = user?.email || "";
      const name =
        [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
        [shipping?.firstName, shipping?.lastName].filter(Boolean).join(" ") ||
        "Unknown User";
      const phone =
        user?.mobile ||
        user?.phoneNumber ||
        shipping?.mobile ||
        shipping?.phoneNumber ||
        "-";

      const key = userId || email || `guest-${order?.id}`;

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: userId || "-",
          name,
          email: email || "-",
          phone,
          ordersCount: 0,
          totalSpent: 0,
        });
      }

      const current = customerMap.get(key);
      current.ordersCount += 1;
      current.totalSpent += Number(
        order?.totalDiscountedPrice ?? order?.totalPrice ?? 0
      );
    });

    return Array.from(customerMap.values());
  }, [adminOrder?.orders]);

  return (
    <Card sx={{ mt: 2 }} className="bg-[#1b1b1b]">
      <CardHeader title="Customers" />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customers table">
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Orders</TableCell>
              <TableCell>Total Spent</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={`${customer.id}-${customer.email}-${index}`}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar>{customer.name?.[0]?.toUpperCase() || "U"}</Avatar>
                    <Box>{customer.name}</Box>
                  </Box>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.ordersCount}</TableCell>
                <TableCell>Rs. {customer.totalSpent}</TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No customer data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default CustomersTable;
