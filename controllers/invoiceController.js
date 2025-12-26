import PDFDocument from "pdfkit";
import Order from "../models/Order.js";

export const generateInvoice = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "title price images");

  if (!order) {
    return res.status(404).send("Order not found");
  }

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");

  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(20).text("Bharat Traditions Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Customer: ${order.user.name}`);
  doc.text(`Email: ${order.user.email}`);
  doc.text(`Status: ${order.status}`);
  doc.moveDown();

  order.items.forEach((item) => {
    doc.text(`${item.product.title}`);
    doc.text(`Qty: ${item.quantity} × ₹${item.price}`);
    doc.moveDown(0.5);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount}`);

  doc.end();
};
