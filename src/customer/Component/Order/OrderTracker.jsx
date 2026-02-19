import React from 'react'
import  {Stepper, Step, StepLabel } from "@mui/material"

const step=[
  'placed',
  'Order Confirmed',
  'Shipped',
  'Out for delivery',
  'Delivered'
]

export const getTrackerStepFromStatus = (status) => {
  const value = String(status || "")
    .toLowerCase()
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .trim();

  if (!value) return 0;
  if (value === "placed" || value.includes("place") || value.includes("pending")) return 0;
  if (value === "confirmed" || value.includes("confirm")) return 1;
  if (value === "shipped" || value.includes("ship")) return 2;
  if (value === "out for delivery" || value.includes("out for delivery") || value.includes("out of delivery")) return 3;
  if (value === "delivered" || value.includes("deliver") || value.includes("complete")) return 4;

  return 0;
};

const OrderTracker = ({activeStep}) => {
  return (
    <div className='w-full'>
      <Stepper activeStep={activeStep} alternativeLabel>
       {step.map((label)=><Step key={label}>
        <StepLabel
          sx={{
            "& .MuiStepLabel-label": {
              fontSize: { xs: "0.75rem", sm: "0.9rem" },
              whiteSpace: "nowrap"
            }
          }}
        >
          {label}
        </StepLabel>
       </Step>)} 
      </Stepper>
    </div>
  )
}

export default OrderTracker
