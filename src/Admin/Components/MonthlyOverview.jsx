import React from "react";
import { AccountCircle, TrendingUp } from "@mui/icons-material";
import SettingsCellIcon from "@mui/icons-material/SettingsCell";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import CardContent from "@mui/material/CardContent";

const formatCompactNumber = (value) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

const renderStats = (stats) => {
  const salesData = [
    {
      states: formatCompactNumber(stats?.sales),
      title: "Sales",
      color: "#F4BE2C",
      icon: <TrendingUp sx={{ fontSize: "1.75rem" }} />,
    },
    {
      states: formatCompactNumber(stats?.customers),
      title: "Customers",
      color: "#22CB5C",
      icon: <AccountCircle sx={{ fontSize: "1.75rem" }} />,
    },
    {
      states: formatCompactNumber(stats?.products),
      title: "Products",
      color: "#DE4839",
      icon: <SettingsCellIcon sx={{ fontSize: "1.75rem" }} />,
    },
    {
      states: `Rs ${formatCompactNumber(stats?.revenue)}`,
      title: "Revenue",
      color: "#12B0E8",
      icon: <AttachMoneyIcon sx={{ fontSize: "1.75rem" }} />,
    },
  ];

  return salesData.map((item, index) => (
    <Grid item xs={6} md={3} key={index}>
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Avatar
          variant="rounded"
          sx={{
            mr: 3,
            width: 88,
            height: 66,
            boxShadow: 3,
            color: "white",
            backgroundColor: item.color,
          }}
        >
          {item.icon}
        </Avatar>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Typography variant="caption">{item.title}</Typography>
          <Typography variant="h6">{item.states}</Typography>
        </Box>
      </Box>
    </Grid>
  ));
};

const MonthlyOverview = ({ stats }) => {
  return (
    <Card sx={{ position: "relative", bgcolor: "#242B2E", color: "white" }}>
      <CardHeader
        title="Monthly Overview"
        action={
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        }
        subheader={
          <Typography variant="body2">
            <Box component="span" sx={{ fontWeight: 600, mx: 2 }}>
              Live business snapshot
            </Box>
            This month
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: "2rem !important",
            letterSpacing: ".15px !important",
          },
        }}
      />
      <CardContent sx={{ pt: (theme) => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats(stats)}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MonthlyOverview;
