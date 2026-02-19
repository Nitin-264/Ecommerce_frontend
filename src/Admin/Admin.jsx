import { useTheme } from '@mui/material/styles';
import React from 'react'
import useMediaQuery from '@mui/material/useMediaQuery';
import { Route, Routes, useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Box from "@mui/material/Box"
import ListItemIcon from '@mui/material/ListItemIcon';
import DashBoardIcon from "@mui/icons-material/Dashboard"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import CssBaseline from '@mui/material/CssBaseline';
import ListItemText from '@mui/material/ListItemText';
import AdminDashBoard from "../../src/Admin/Components/DashBoard"
import CreateProduct from "../../src/Admin/Components/CreateProduct"
import CustomersTable from "../../src/Admin/Components/CustomersTable"
import OrdersTable from "../../src/Admin/Components/OrdersTable"
import ProductsTable from "../../src/Admin/Components/ProductsTable"
import AdminAccount from "../../src/Admin/Components/AdminAccount";


const menu = [
  { name: "Dashboard", path: "/admin" ,icon:<DashBoardIcon/>},
  { name: "Products", path: "/admin/products" ,icon:<DashBoardIcon/>},
  { name: "Customers", path: "/admin/customers" ,icon:<DashBoardIcon/>},
  { name: "Orders", path: "/admin/orders",icon:<DashBoardIcon/> },
  { name: "AddProduct", path: "/admin/product/create" ,icon:<DashBoardIcon/>},
  { name: "", path: " " },
];
const Admin = () => {
  const theme = useTheme();
  useMediaQuery(theme.breakpoints.up('lg'));
  const navigate = useNavigate();

  const drawerWidth = '240px'; // or '15%'

  const drawer = (
    <Box
      sx={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: '1px solid blue',
        height: "100vh",          // Full viewport height
        position: "fixed",        // Makes drawer sticky
        top: 0,
        left: 0,
        width: drawerWidth,
        bgcolor: '#fff',          // Add background for stickiness
        zIndex: 1000
      }}
    >
      {/* ...drawer content... */}
      <List>
        {menu.map((item, index) => (
          <ListItem key={item.name} disablePadding onClick={() => navigate(item.path)}>
            <ListItemButton>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText>{item.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {/* Account List at bottom */}
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/admin/account")}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText>Account</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <div>
      <CssBaseline />
      {/* Sidebar - sticky */}
      <div style={{
        width: drawerWidth,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        borderRight: '1px solid #ccc',
        background: '#fff'
      }}>
        {drawer}
      </div>
      {/* Main Content */}
      <div style={{
        marginLeft: drawerWidth,     // Push content to right of sidebar
        width: `calc(100% - ${drawerWidth})`,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <Routes>
          <Route path='/' element={<AdminDashBoard />} />
          <Route path='/product/create' element={<CreateProduct />} />
          <Route path='/products' element={<ProductsTable />} />
          <Route path='/customers' element={<CustomersTable />} />
          <Route path='/orders' element={<OrdersTable />} />
          <Route path='/account' element={<AdminAccount />} />
        </Routes>
      </div>
    </div>
  );
};
export default Admin;
