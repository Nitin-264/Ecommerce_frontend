import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { useLocation } from 'react-router-dom';
import DeliveryAddressForm from './DeliveryAddressForm';
import OrderSummary from './OrderSummary';

const steps = ['Login','Delivery Address', 'Order Summary','Payment'];

export default function Checkout() {
  const location=useLocation();
  const querySearch=new URLSearchParams(location.search);
  const step=querySearch.get('step');
  const orderId=querySearch.get('order_id');

  const isDeliveryStep = step === '2' && !orderId;
  const activeStep = isDeliveryStep ? 1 : 2;

  return (
    <Box sx={{ width: '100%' }} className="px-2 sm:px-6 lg:px-10">
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div className="mt-6 mb-10">
        {isDeliveryStep ? <DeliveryAddressForm/> : <OrderSummary/>}
      </div>
    </Box>
  );
}
