import React, { useEffect, useMemo } from 'react';
import Achivement from './Achivement';
import MonthlyOverview from './MonthlyOverview';
import OrdersTableView from '../View/OrderView';
import ProductsTable from './ProductsTable';
import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../../State/Admin/Order/Action';
import { findProducts } from '../../State/Product/Action';

const AdminDashBoard = () => {
  const dispatch = useDispatch();
  const { adminOrder, customerproduct } = useSelector((store) => store);

  useEffect(() => {
    dispatch(getOrders());
    dispatch(
      findProducts({
        category: "",
        colors: [],
        sizes: [],
        minPrice: 0,
        maxPrice: 10000000,
        minDiscount: 0,
        sort: "",
        pageNumber: 0,
        pageSize: 500,
        stock: ""
      })
    );
  }, [dispatch]);

  const productList = useMemo(() => {
    if (Array.isArray(customerproduct?.products)) return customerproduct.products;
    if (Array.isArray(customerproduct?.products?.content)) return customerproduct.products.content;
    if (Array.isArray(customerproduct?.products?.products)) return customerproduct.products.products;
    return [];
  }, [customerproduct?.products]);

  const stats = useMemo(() => {
    const orders = adminOrder?.orders || [];
    const revenue = orders.reduce((sum, order) => {
      const directTotal = Number(order?.totalDiscountedPrice ?? order?.totalPrice ?? 0);
      if (directTotal > 0) return sum + directTotal;

      const itemsTotal = (order?.orderItem || []).reduce((itemSum, item) => {
        const qty = Number(item?.quantity ?? 0);
        const unitPrice = Number(item?.discountedPrice ?? item?.price ?? item?.product?.discountedPrice ?? item?.product?.price ?? 0);
        return itemSum + qty * unitPrice;
      }, 0);
      return sum + itemsTotal;
    }, 0);

    const customers = new Set(
      orders.map((order) => order?.user?.id || order?.user?.email || order?.shippingAddress?.email).filter(Boolean)
    ).size;

    return {
      sales: orders.length,
      customers,
      products: productList.length,
      revenue
    };
  }, [adminOrder?.orders, productList]);

  return (
    <div className="p-10">
  {/* Row for Achievement and MonthlyOverview side by side */}
  <div className="flex flex-col md:flex-row gap-6 mb-10">
    <div className="md:w-2/5 w-full">
      <Achivement stats={stats} />
    </div>
    <div className="md:w-3/5 w-full">
      <MonthlyOverview stats={stats} />
    </div>
  </div>

 <div className="flex flex-col md:flex-row gap-6">
    <div className="md:w-1/2 w-full">
      <OrdersTableView />
    </div>
    <div className="md:w-1/2 w-full">
      <ProductsTable />
    </div>
  </div>
</div>
  );
}

export default AdminDashBoard;
