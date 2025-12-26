export const sellerStats = async (req, res) => {
  const products = await Product.find({ seller: req.user.id });

  res.json({
    totalProducts: products.length
  });
};
