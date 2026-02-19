import Grid from "@mui/material/Grid";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";

const ProductReviewCard = ({ review }) => {
  const displayName = review?.name || "Anonymous";
  const reviewDate = review?.createdAt
    ? new Date(review.createdAt).toLocaleDateString()
    : "";

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={2} sm={1}>
          <Box>
            <Avatar
              className="text-white"
              sx={{
                width: 56,
                height: 56,
                bgcolor: "#9155fd",
              }}
            >
              {displayName[0]?.toUpperCase() || "A"}
            </Avatar>
          </Box>
        </Grid>

        <Grid item xs={10} sm={11}>
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-lg">{displayName}</p>
              <p className="opacity-70">{reviewDate}</p>
            </div>
            <Rating name="half-rating" value={review?.rating || 0} readOnly precision={0.5} />
            <p>{review?.comment || ""}</p>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};
export default ProductReviewCard
