const PDFDocument = require("pdfkit");

const generateInvoice = ({
  userName,
  userEmail,
  planName,
  planPrice,
  applicationLimit,
  paymentId,
  orderId,
  startDate,
  endDate,
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
      });

      const chunks = [];

      doc.on("data", (chunk) => {
        chunks.push(chunk);
      });

      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });

      doc.on("error", reject);

      // ==========================================
      // HEADER
      // ==========================================

      doc
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("INTERNSHALA CLONE", {
          align: "center",
        });

      doc
        .moveDown(0.5)
        .fontSize(18)
        .font("Helvetica-Bold")
        .text("SUBSCRIPTION INVOICE", {
          align: "center",
        });

      doc.moveDown(2);

      // ==========================================
      // CUSTOMER DETAILS
      // ==========================================

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Customer Details");

      doc.moveDown(0.5);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`Name: ${userName}`)
        .text(`Email: ${userEmail}`);

      doc.moveDown(1.5);

      // ==========================================
      // PLAN DETAILS
      // ==========================================

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Subscription Details");

      doc.moveDown(0.5);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`Plan: ${planName}`)
        .text(`Price: ₹${planPrice}`)
        .text(
          `Monthly Applications: ${
            applicationLimit === null
              ? "Unlimited"
              : applicationLimit
          }`
        )
        .text(
          `Start Date: ${new Date(startDate).toDateString()}`
        )
        .text(
          `End Date: ${new Date(endDate).toDateString()}`
        );

      doc.moveDown(1.5);

      // ==========================================
      // PAYMENT DETAILS
      // ==========================================

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("Payment Details");

      doc.moveDown(0.5);

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(`Payment ID: ${paymentId}`)
        .text(`Order ID: ${orderId}`)
        .text("Payment Status: Successful")
        .text("Currency: INR");

      doc.moveDown(2);

      // ==========================================
      // TOTAL
      // ==========================================

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text(`Total Paid: ₹${planPrice}`, {
          align: "right",
        });

      doc.moveDown(3);

      // ==========================================
      // FOOTER
      // ==========================================

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(
          "Thank you for subscribing.",
          {
            align: "center",
          }
        );

      doc
        .moveDown(0.5)
        .text(
          "This is a computer-generated invoice.",
          {
            align: "center",
          }
        );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateInvoice;