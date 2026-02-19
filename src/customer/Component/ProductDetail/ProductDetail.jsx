import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import { addItemToCart } from "../../../State/cart/Action";
import { findProductById } from "../../../State/Product/Action";
import HomeSectionCard from "../HomeSectioncard/HomeSectionCard";
import ProductReviewCard from "./ProductReviewCard";
import mens_kurta from "../../Data/Mens_Kurta";

export default function ProductDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { productId } = useParams();
  const { customerproduct, auth } = useSelector((store) => store);

  const product = customerproduct.product;
  const [selectedSize, setSelectedSize] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [reviewError, setReviewError] = useState("");

  const sizeOptions = useMemo(() => {
    if (!product?.size || !Array.isArray(product.size)) return [];
    return product.size.map((item) => item.name);
  }, [product]);

  const reviewStorageKey = useMemo(
    () => `product-reviews-${productId}`,
    [productId]
  );

  useEffect(() => {
    if (!productId) return;
    dispatch(findProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (sizeOptions.length > 0) {
      setSelectedSize(sizeOptions[0]);
    }
  }, [sizeOptions]);

  useEffect(() => {
    if (!productId) return;
    const storedReviews = localStorage.getItem(reviewStorageKey);
    if (storedReviews) {
      setReviews(JSON.parse(storedReviews));
    } else {
      setReviews([]);
    }
  }, [productId, reviewStorageKey]);

  const handleAddToCart = () => {
    if (!product?.id) return;
    const data = {
      productId: product.id,
      size: selectedSize || sizeOptions[0] || "M",
    };
    dispatch(addItemToCart(data));
    navigate("/cart");
  };

  const price = product?.price ?? 0;
  const discountedPrice = product?.discountedPrice ?? 0;
  const discountPercent = product?.discountPersent ?? 0;
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, item) => sum + item.rating, 0) / totalReviews
      : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((item) => item.rating === star).length;
    const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { star, count, percentage };
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.rating || newReview.comment.trim().length < 5) {
      setReviewError("Please select rating and write at least 5 characters.");
      return;
    }

    const reviewToAdd = {
      id: Date.now(),
      name: auth.user?.firstName || "Anonymous",
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedReviews = [reviewToAdd, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(reviewStorageKey, JSON.stringify(updatedReviews));
    setNewReview({ rating: 0, comment: "" });
    setReviewError("");
  };

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">
          Home / Men / Clothing / {product?.title || "Product"}
        </p>

        <section className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            {product?.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product?.title || "product"}
                className="h-[520px] w-full rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-[520px] items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                Image not available
              </div>
            )}
          </div>

          <div>
            <p className="text-base font-semibold text-gray-500">
              {product?.brand || "Brand"}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              {product?.title || "Product"}
            </h1>
            <p className="mt-2 text-gray-600">{product?.color || ""}</p>

            <div className="mt-5 flex items-center gap-3">
              <p className="text-3xl font-bold text-gray-900">Rs. {discountedPrice}</p>
              <p className="text-lg text-gray-400 line-through">Rs. {price}</p>
              <p className="text-lg font-semibold text-green-600">
                {discountPercent}% off
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Rating value={averageRating} precision={0.5} readOnly />
              <span className="text-sm text-gray-500">
                {averageRating.toFixed(1)} ({totalReviews} review{totalReviews === 1 ? "" : "s"})
              </span>
            </div>

            {sizeOptions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900">Select Size</h3>
                <div className="mt-3 flex flex-wrap gap-3">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[64px] rounded-md border px-4 py-2 text-sm font-medium transition ${
                        selectedSize === size
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-blue-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">Selected: {selectedSize}</p>
              </div>
            )}

            <Button
              onClick={handleAddToCart}
              variant="contained"
              sx={{
                mt: 4,
                width: "100%",
                maxWidth: "280px",
                px: "2.5rem",
                py: "0.9rem",
                fontWeight: 700,
                letterSpacing: 0.3,
                bgcolor: "#fb641b",
                "&:hover": { bgcolor: "#e85b18" },
              }}
            >
              Add to Cart
            </Button>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-base font-semibold text-gray-900">Description</h3>
              <p className="mt-3 leading-7 text-gray-700">
                {product?.description || "No description available."}
              </p>
            </div>
          </div>
        </section>

        <section id="reviews" className="mt-12 rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="pb-4 text-xl font-semibold text-gray-900">Ratings & Reviews</h2>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <form
                onSubmit={handleReviewSubmit}
                className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <h3 className="text-base font-semibold text-gray-900">Write a review</h3>
                <div className="mt-3">
                  <Rating
                    value={newReview.rating}
                    onChange={(_, value) =>
                      setNewReview((prev) => ({ ...prev, rating: value || 0 }))
                    }
                  />
                </div>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  placeholder="Share your experience with this product..."
                  className="mt-3 w-full rounded-md border border-gray-300 bg-white p-3 text-sm outline-none focus:border-blue-500"
                  rows={3}
                />
                {reviewError && (
                  <p className="mt-2 text-sm text-red-600">{reviewError}</p>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 2,
                    bgcolor: "#2874f0",
                    "&:hover": { bgcolor: "#1f5ec4" },
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Submit Review
                </Button>
              </form>

              <div className="space-y-5">
                {reviews.length === 0 && (
                  <p className="text-sm text-gray-500">
                    No reviews yet. Be the first to review this product.
                  </p>
                )}
                {reviews.map((item) => (
                  <ProductReviewCard key={item.id} review={item} />
                ))}
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <h3 className="text-lg font-semibold">Overall Rating</h3>
              <div className="mt-2 flex items-center gap-2">
                <Rating value={averageRating} precision={0.5} readOnly />
                <p className="text-sm text-gray-500">
                  {averageRating.toFixed(1)} ({totalReviews} ratings)
                </p>
              </div>
              <Box className="mt-5 space-y-4">
                {ratingDistribution.map((item) => (
                  <Grid key={item.star} container alignItems="center" spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="body2">{item.star} star</Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{ height: 8, borderRadius: 10 }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant="body2" className="text-gray-500">
                        {item.count}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Box>
            </Grid>
          </Grid>
        </section>

        <section className="mt-14">
          <h2 className="text-xl font-bold text-gray-900">Similar Products</h2>
          <div className="mt-5 flex flex-wrap gap-4">
            {mens_kurta.slice(0, 4).map((item, index) => (
              <HomeSectionCard key={`${item.title}-${index}`} product={item} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
