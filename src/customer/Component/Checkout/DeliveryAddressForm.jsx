import { Box, Button, Grid, TextField } from "@mui/material";
import AddressCard from "../AddressCard/AddressCard";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { createOrder, getOrderHistory } from "../../../State/Order/Action";

const DeliveryAddressForm = () => {

    const dispatch=useDispatch();
    const navigate=useNavigate();
    const { user } = useSelector((store) => store.auth);
    const { orders } = useSelector((store) => store.order);
    const profilePhone =
      user?.mobile ||
      user?.phoneNumber ||
      user?.phone ||
      user?.contactNumber ||
      "";

    const normalizeAddress = (address = {}) => ({
      firstName: address.firstName || user?.firstName || "",
      lastName: address.lastName || user?.lastName || "",
      streetAddress:
        address.streetAddress ||
        address.address ||
        address.addressLine1 ||
        address.line1 ||
        address.street ||
        "",
      city: address.city || address.town || address.district || "",
      state: address.state || address.region || address.province || "",
      pinCode:
        address.pinCode ||
        address.postalCode ||
        address.zipCode ||
        address.zip ||
        address.pincode ||
        "",
      mobile:
        address.mobile ||
        address.phoneNumber ||
        address.phone ||
        address.contactNumber ||
        profilePhone ||
        ""
    });

    const hasUsableAddress = (address = {}) =>
      Boolean(
        (address.streetAddress || "").trim() ||
        (address.city || "").trim() ||
        (address.state || "").trim() ||
        (address.pinCode || "").trim()
      );

    const savedAddresses = useMemo(() => {
      const profileAddresses = !user
        ? []
        : Array.isArray(user.addresses)
        ? user.addresses
        : user.address
        ? [user.address]
        : [];

      const orderAddresses = Array.isArray(orders)
        ? orders.map((order) => order?.shippingAddress).filter(Boolean)
        : [];

      const merged = [...profileAddresses, ...orderAddresses]
        .map((address) => normalizeAddress(address))
        .filter((address) => hasUsableAddress(address));

      const uniqueAddresses = [];
      const seen = new Set();
      for (const address of merged) {
        const key = `${address.firstName}|${address.lastName}|${address.streetAddress}|${address.city}|${address.state}|${address.pinCode}|${address.mobile}`;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueAddresses.push(address);
        }
      }

      return uniqueAddresses;
    }, [user, orders]);

    useEffect(() => {
      dispatch(getOrderHistory());
    }, [dispatch]);

    const handleDeliverToSavedAddress = (address) => {
      const orderData = { address: normalizeAddress(address), navigate };
      dispatch(createOrder(orderData));
    };

    const handleEvent = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const address = {
        firstName: data.get('firstName'),
        lastName: data.get('lastName'),   
        streetAddress: data.get('address'),
        state: data.get('state'),
        city:data.get('city'),
        pinCode: data.get('pin'),
        mobile: profilePhone,
    };

    const orderData = { address,navigate };
    dispatch(createOrder(orderData)); 
};

  return (
    <Grid container spacing={4}>
      {/* Address Card Section */}
      <Grid item xs={12} lg={5}>
        <Box className="border rounded-md shadow-md h-[30.5rem] overflow-y-auto">
          {savedAddresses.length === 0 ? (
            <Box className="p-5 py-7 border-b">
              <AddressCard address={{}} />
            </Box>
          ) : (
            savedAddresses.map((address, index) => (
              <Box key={index} className="p-5 py-7 border-b">
                <AddressCard address={address} />
                <Button
                  className="text-left "
                  sx={{ mt: 2, bgcolor: "rgb(145,85,253)", color: "#fff" }}
                  size="large"
                  variant="contained"
                  onClick={() => handleDeliverToSavedAddress(address)}
                >
                  Deliver Here
                </Button>
              </Box>
            ))
          )}
        </Box>
      </Grid>

      {/* Form Section */}
      <Grid item xs={12} lg={7}>
        <Box className="border rounded-md shadow-md p-5">
          <form onSubmit={handleEvent }>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  fullWidth
                  autoComplete="given-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  fullWidth
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="address"
                  name="address"
                  label="Address"
                  fullWidth
                  multiline
                  rows={4}
                  autoComplete="street-address"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="state"
                  name="state"
                  label="State/Region"
                  fullWidth
                  autoComplete="address-level1"
                />
              </Grid>
               <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="city"
                  name="city"
                  label="City"
                  fullWidth
                  autoComplete="address-level1"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="pin"
                  name="pin"
                  label="Pin Code"
                  fullWidth
                  autoComplete="postal-code"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.5,
                    mt: 2,
                    bgcolor: "rgb(145,85,253)",
                    color: "#fff",
                    "&:hover": { bgcolor: "rgb(125,65,233)" },
                  }}
                >
                  Deliver Here
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DeliveryAddressForm;
