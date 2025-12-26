import Product from "../models/Product.js";

/* ADD REVIEW */
export const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user.id
  );

  if (alreadyReviewed) {
    return res.status(400).json({ message: "Already reviewed" });
  }

  const review = {
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) /
    product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
};

/* DELETE REVIEW (OWNER / SELLER) */
export const deleteReview = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ message: "Not found" });

  const review = product.reviews.id(req.params.reviewId);
  if (!review) return res.status(404).json({ message: "Review not found" });

  // permission
  if (
    review.user.toString() !== req.user.id &&
    req.user.role !== "seller" &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  review.deleteOne();
  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.length === 0
      ? 0
      : product.reviews.reduce((a, r) => a + r.rating, 0) /
        product.reviews.length;

  await product.save();
  res.json({ message: "Review deleted" });
};
