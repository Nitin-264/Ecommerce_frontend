import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React from "react";
import trophy from "./img/download.jpeg";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const TropyImg = styled("img")(({ theme }) => ({
  position: "absolute",
  right: theme.spacing(4.5),
  bottom: theme.spacing(2.5),
  height: 160,
  zIndex: 1,
  [theme.breakpoints.down("sm")]: {
    height: 70,
    right: theme.spacing(2),
    bottom: theme.spacing(2),
  },
}));

const formatCompactNumber = (value) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

const Achivement = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        position: "relative",
        bgcolor: "#242B2E",
        color: "white",
        height: "100%",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h6" sx={{ letterSpacing: ".25px" }}>
              Shop With Trigon
            </Typography>
            <Typography variant="body2">Total Revenue</Typography>
            <Typography variant="h5" sx={{ my: 3 }}>
              Rs {formatCompactNumber(stats?.revenue)}
            </Typography>
            <Button size="small" variant="contained" onClick={() => navigate("/admin/orders")}>
              View Orders
            </Button>
          </Box>
          <Box sx={{ ml: 2 }}>
            <TropyImg src={trophy} alt="Trophy" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Achivement;
