import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

/**
 * Format currency for display
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "ZAR",
  }).format(amount);
};

/**
 * Create Nodemailer transporter with connection pooling
 * @returns {Object|null} Configured transporter or null if credentials missing
 */
const createTransporter = () => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;

    if (!emailUser || !emailPassword) {
      return null;
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
      pool: true,
      maxConnections: 1,
      rateDelta: 20000,
      rateLimit: 5,
    });

    return transporter;
  } catch (error) {
    return null;
  }
};

// ========== EMAIL TEMPLATE GENERATORS ==========

/**
 * Generate welcome email HTML template
 * @param {string} userName - Recipient's name
 * @param {string|null} verificationLink - Email verification link
 * @returns {string} HTML email content
 */
const generateWelcomeEmail = (userName, verificationLink = null) => {
  const frontendUrl =
    process.env.FRONTEND_URL || "https://mystore-drab.vercel.app";
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Welcome to Finezto - Where Elegance Meets Excellence">
    <title>Welcome to Finezto - Where Elegance Meets Excellence</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .mobile-padding { padding: 20px 15px !important; }
        }
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; color: #333333; }
    </style>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fafafa">
        <tr>
            <td align="center" style="padding: 30px 0;">
                <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <tr>
                        <td align="center" bgcolor="#000000" style="padding: 30px 20px; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);">
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 2px; margin: 0; font-family: 'Georgia', serif;">
                                FINEZTO
                            </h1>
                            <div style="height: 2px; width: 60px; background: linear-gradient(90deg, #d4af37, #ffd700); margin: 15px auto;"></div>
                            <p style="color: #cccccc; font-size: 12px; letter-spacing: 1px; margin: 0;">
                                WHERE ELEGANCE MEETS EXCELLENCE
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="mobile-padding" align="center" style="padding: 30px;">
                            <h2 style="color: #2c2c2c; font-size: 20px; font-weight: 300; margin: 0 0 15px; font-family: 'Georgia', serif;">
                                Welcome to Finezto, ${userName}!
                            </h2>
                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0 0 25px;">
                                We're absolutely delighted to welcome you to the Finezto family! Your journey towards exceptional style and elegance begins now.
                            </p>
                            ${
                              verificationLink
                                ? `
                            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                <h3 style="color: #059669; font-size: 16px; font-weight: 400; margin: 0 0 15px; font-family: 'Georgia', serif;">
                                    Verify Your Email
                                </h3>
                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0 0 20px;">
                                    Please verify your email address to complete your registration and unlock all features.
                                </p>
                                <a href="${verificationLink}" 
                                   style="display: inline-block; background: #059669; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-size: 14px; transition: all 0.3s ease;">
                                    VERIFY EMAIL ADDRESS
                                </a>
                            </div>
                            `
                                : ""
                            }
                            <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                <h3 style="color: #2c2c2c; font-size: 16px; font-weight: 400; margin: 0 0 15px; font-family: 'Georgia', serif;">
                                    Your Finezto Benefits
                                </h3>
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td width="30" style="padding: 5px 0; vertical-align: top;">
                                            <div style="width: 20px; height: 20px; background: #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">✓</div>
                                        </td>
                                        <td style="padding: 5px 0;">
                                            <p style="color: #666666; font-size: 14px; margin: 0;">Exclusive member-only discounts</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="30" style="padding: 5px 0; vertical-align: top;">
                                            <div style="width: 20px; height: 20px; background: #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">✓</div>
                                        </td>
                                        <td style="padding: 5px 0;">
                                            <p style="color: #666666; font-size: 14px; margin: 0;">Early access to new collections</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="30" style="padding: 5px 0; vertical-align: top;">
                                            <div style="width: 20px; height: 20px; background: #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">✓</div>
                                        </td>
                                        <td style="padding: 5px 0;">
                                            <p style="color: #666666; font-size: 14px; margin: 0;">Personalized style recommendations</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="30" style="padding: 5px 0; vertical-align: top;">
                                            <div style="width: 20px; height: 20px; background: #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">✓</div>
                                        </td>
                                        <td style="padding: 5px 0;">
                                            <p style="color: #666666; font-size: 14px; margin: 0;">Fast and secure checkout</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div style="margin: 25px 0;">
                                <a href="${frontendUrl}" 
                                   style="display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-size: 14px; transition: all 0.3s ease;">
                                    START EXPLORING
                                </a>
                            </div>
                            <div style="background: #fffaf0; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="color: #d4af37; font-size: 16px; font-weight: 400; margin: 0 0 12px; font-family: 'Georgia', serif;">
                                    Our Promise to You
                                </h3>
                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">
                                    At Finezto, we're dedicated to elevating your style experience with carefully curated collections, exceptional quality, and personalized service that makes you feel special.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" bgcolor="#1a1a1a" style="padding: 25px 20px;">
                            <div style="color: #d4af37; font-size: 18px; font-weight: bold; margin-bottom: 10px; font-family: 'Georgia', serif;">
                                FINEZTO
                            </div>
                            <p style="color: #cccccc; font-size: 12px; margin: 0 0 10px;">
                                Elevating Your Style Experience
                            </p>
                            <div style="margin: 15px 0;">
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #cccccc; text-decoration: none; font-size: 11px;">Instagram</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #cccccc; text-decoration: none; font-size: 11px;">Facebook</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #cccccc; text-decoration: none; font-size: 11px;">Twitter</a>
                            </div>
                            <p style="color: #666666; font-size: 10px; margin: 10px 0 0; line-height: 1.4;">
                                © 2024 Finezto. All rights reserved.<br>
                                <a href="#" style="color: #888888; text-decoration: none;">Privacy Policy</a> | 
                                <a href="#" style="color: #888888; text-decoration: none;">Terms</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * Generate order confirmation email HTML template
 * @param {string} userName - Recipient's name
 * @param {Object} order - Order details
 * @returns {string} HTML email content
 */
const generateOrderConfirmationEmail = (userName, order) => {
  const shortOrderId =
    order._id && order._id.toString
      ? order._id.toString().slice(-8).toUpperCase()
      : "TEST1234";
  const orderDate = new Date(order.date || new Date()).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  const subtotal = order.amount || 0;
  const shipping = order.shippingCost || 0;
  const tax = order.taxAmount || 0;
  const total = subtotal + shipping + tax;
  const frontendUrl =
    process.env.FRONTEND_URL || "https://mystore-drab.vercel.app";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Order Confirmation - Finezto">
    <title>Order Confirmation - Finezto</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .mobile-padding { padding: 20px 15px !important; }
            .mobile-stack { display: block !important; width: 100% !important; }
            .mobile-stack > * { margin-bottom: 10px; }
        }
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; color: #333333; }
        .order-item { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eeeeee; }
        .order-item:last-child { border-bottom: none; }
        .item-details { flex: 1; }
        .item-price { text-align: right; min-width: 100px; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
        .summary-total { border-top: 2px solid #d4af37; padding-top: 8px; margin-top: 8px; font-weight: bold; }
    </style>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fafafa">
        <tr>
            <td align="center" style="padding: 30px 0;">
                <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <tr>
                        <td align="center" bgcolor="#000000" style="padding: 30px 20px; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);">
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 2px; margin: 0; font-family: 'Georgia', serif;">
                                FINEZTO
                            </h1>
                            <div style="height: 2px; width: 60px; background: linear-gradient(90deg, #d4af37, #ffd700); margin: 15px auto;"></div>
                            <p style="color: #cccccc; font-size: 12px; letter-spacing: 1px; margin: 0;">
                                ORDER CONFIRMATION
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="mobile-padding" align="center" style="padding: 30px;">
                            <h2 style="color: #2c2c2c; font-size: 20px; font-weight: 300; margin: 0 0 15px; font-family: 'Georgia', serif;">
                                Order Confirmed, ${userName}!
                            </h2>
                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0 0 25px;">
                                Thank you for your order! We're preparing your items with care and will notify you when your order ships.
                            </p>
                            <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                <h3 style="color: #2c2c2c; font-size: 16px; font-weight: 400; margin: 0 0 15px; font-family: 'Georgia', serif;">
                                    Order Details
                                </h3>
                                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 15px;">
                                    <tr>
                                        <td width="40%" style="padding: 5px 0; vertical-align: top;">
                                            <strong>Order Number:</strong>
                                        </td>
                                        <td width="60%" style="padding: 5px 0;">
                                            ${shortOrderId}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="40%" style="padding: 5px 0; vertical-align: top;">
                                            <strong>Order Date:</strong>
                                        </td>
                                        <td width="60%" style="padding: 5px 0;">
                                            ${orderDate}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="40%" style="padding: 5px 0; vertical-align: top;">
                                            <strong>Order Status:</strong>
                                        </td>
                                        <td width="60%" style="padding: 5px 0;">
                                            <span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 0.375rem; font-size: 12px; border: 1px solid #bfdbfe;">
                                                ${
                                                  order.status || "Order Placed"
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="40%" style="padding: 5px 0; vertical-align: top;">
                                            <strong>Payment Method:</strong>
                                        </td>
                                        <td width="60%" style="padding: 5px 0;">
                                            ${
                                              order.paymentMethod ||
                                              "Not specified"
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="40%" style="padding: 5px 0; vertical-align: top;">
                                            <strong>Payment Status:</strong>
                                        </td>
                                        <td width="60%" style="padding: 5px 0;">
                                            <span style="color: ${
                                              order.payment
                                                ? "#059669"
                                                : "#dc2626"
                                            }; font-weight: 500;">
                                                ${
                                                  order.payment
                                                    ? "Paid"
                                                    : "Pending"
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            ${
                              order.address
                                ? `
                            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                <h3 style="color: #059669; font-size: 16px; font-weight: 400; margin: 0 0 15px; font-family: 'Georgia', serif;">
                                    Shipping Address
                                </h3>
                                <p style="margin: 0; color: #666666; line-height: 1.5;">
                                    <strong>${
                                      order.address.name || userName
                                    }</strong><br>
                                    ${order.address.street || ""}<br>
                                    ${order.address.city || ""}, ${
                                    order.address.province || ""
                                  } ${order.address.postalCode || ""}<br>
                                    ${order.address.country || ""}<br>
                                    Phone: ${
                                      order.address.phone || "Not provided"
                                    }
                                </p>
                            </div>
                            `
                                : ""
                            }
                            <div style="margin-bottom: 25px;">
                                <h3 style="color: #2c2c2c; font-size: 16px; font-weight: 400; margin: 0 0 15px; font-family: 'Georgia', serif;">
                                    Order Items
                                </h3>
                                ${
                                  order.items && order.items.length > 0
                                    ? order.items
                                        .map(
                                          (item, index) => `
                                <div class="order-item">
                                    <div class="item-details">
                                        <p style="font-weight: 500; margin: 0 0 5px; color: #2c2c2c; font-size: 14px;">
                                            ${item.name || "Product"}
                                        </p>
                                        <p style="color: #666666; margin: 0; font-size: 12px;">
                                            Size: ${item.size || "Standard"} • 
                                            Color: ${
                                              item.color || "Not specified"
                                            } • 
                                            Qty: ${item.quantity || 1}
                                        </p>
                                        ${
                                          item.sku
                                            ? `<p style="color: #888888; margin: 5px 0 0; font-size: 11px;">SKU: ${item.sku}</p>`
                                            : ""
                                        }
                                    </div>
                                    <div class="item-price">
                                        <p style="font-weight: 500; margin: 0; color: #2c2c2c; font-size: 14px;">
                                            ${formatCurrency(
                                              (item.price || 0) *
                                                (item.quantity || 1)
                                            )}
                                        </p>
                                        <p style="color: #666666; margin: 0; font-size: 12px;">
                                            ${formatCurrency(
                                              item.price || 0
                                            )} each
                                        </p>
                                    </div>
                                </div>
                                `
                                        )
                                        .join("")
                                    : `
                                <div style="text-align: center; padding: 20px; color: #666666;">
                                    <p style="margin: 0;">No items found in this order.</p>
                                </div>
                                `
                                }
                            </div>
                            <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                <h3 style="color: #2c2c2c; font-size: 16px; font-weight: 400; margin: 0 0 15px; font-family: 'Georgia', serif;">
                                    Order Summary
                                </h3>
                                <div class="summary-row">
                                    <span>Subtotal:</span>
                                    <span>${formatCurrency(subtotal)}</span>
                                </div>
                                ${
                                  shipping > 0
                                    ? `
                                <div class="summary-row">
                                    <span>Shipping:</span>
                                    <span>${formatCurrency(shipping)}</span>
                                </div>
                                `
                                    : ""
                                }
                                ${
                                  tax > 0
                                    ? `
                                <div class="summary-row">
                                    <span>Tax:</span>
                                    <span>${formatCurrency(tax)}</span>
                                </div>
                                `
                                    : ""
                                }
                                <div class="summary-row summary-total">
                                    <span><strong>Total Amount:</strong></span>
                                    <span><strong>${formatCurrency(
                                      total
                                    )}</strong></span>
                                </div>
                            </div>
                            ${
                              order.cancellationReason
                                ? `
                            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                                <h4 style="color: #dc2626; margin: 0 0 10px; font-size: 14px;">Cancellation Note</h4>
                                <p style="margin: 0; color: #666666; font-size: 13px;">${order.cancellationReason}</p>
                            </div>
                            `
                                : ""
                            }
                            ${
                              order.returnReason
                                ? `
                            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                                <h4 style="color: #059669; margin: 0 0 10px; font-size: 14px;">Return Note</h4>
                                <p style="margin: 0; color: #666666; font-size: 13px;">${order.returnReason}</p>
                            </div>
                            `
                                : ""
                            }
                            <div style="background: #fffaf0; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="color: #d4af37; font-size: 16px; font-weight: 400; margin: 0 0 12px; font-family: 'Georgia', serif;">
                                    What's Next?
                                </h3>
                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">
                                    ${
                                      order.status === "Order Placed"
                                        ? "We'll send you a shipping confirmation email as soon as your order is on its way. You can also track your order status in your account."
                                        : order.status === "Delivered"
                                        ? "Your order has been delivered! We hope you love your purchase. If you have any questions, please contact our support team."
                                        : order.status === "Cancelled"
                                        ? "Your order has been cancelled. If this was a mistake, please contact our support team immediately."
                                        : "We're currently processing your order. You'll receive updates as your order progresses through our system."
                                    }
                                </p>
                            </div>
                            <div style="display: flex; gap: 10px; justify-content: center; margin: 25px 0 15px; flex-wrap: wrap;" class="mobile-stack">
                                <a href="${frontendUrl}/orders" 
                                   style="display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-size: 14px; transition: all 0.3s ease;">
                                    VIEW YOUR ORDER
                                </a>
                                <a href="${frontendUrl}/shop" 
                                   style="display: inline-block; background: transparent; color: #000000; text-decoration: none; padding: 12px 25px; border: 1px solid #000000; border-radius: 4px; font-size: 14px; transition: all 0.3s ease;">
                                    CONTINUE SHOPPING
                                </a>
                                <a href="${frontendUrl}/contact" 
                                   style="display: inline-block; background: #d4af37; color: #000000; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-size: 14px; transition: all 0.3s ease;">
                                    CONTACT SUPPORT
                                </a>
                            </div>
                            <div style="background: #ffdbdb; border: 1px solid #ffabab; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                <h3 style="color: #d40000; font-size: 16px; font-weight: 400; margin: 0 0 15px; font-family: 'Georgia', serif;">
                                    Order Cancellation
                                </h3>
                                <p style="margin: 0; color: #666666; line-height: 1.5;">
                                    To cancel your order, please visit your account page or contact our support team at support@finezto.com
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" bgcolor="#1a1a1a" style="padding: 25px 20px;">
                            <p style="color: #888888; font-size: 11px; margin: 0 0 12px;">
                                Need help with your order? Contact us at support@finezto.com
                            </p>
                            <div style="margin: 0 0 15px;">
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #cccccc; text-decoration: none; font-size: 11px;">Instagram</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #cccccc; text-decoration: none; font-size: 11px;">Facebook</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #cccccc; text-decoration: none; font-size: 11px;">Pinterest</a>
                            </div>
                            <p style="color: #666666; font-size: 10px; margin: 0; line-height: 1.4;">
                                © 2024 Finezto. All rights reserved.<br>
                                <a href="#" style="color: #888888; text-decoration: none;">Privacy Policy</a> | 
                                <a href="#" style="color: #888888; text-decoration: none;">Terms of Service</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * Generate newsletter confirmation email HTML template
 * @param {string} email - Subscriber's email
 * @param {string} name - Subscriber's name
 * @returns {string} HTML email content
 */
const generateNewsletterConfirmationEmail = (email, name = "") => {
  const frontendUrl =
    process.env.FRONTEND_URL || "https://mystore-drab.vercel.app";

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Welcome to the Finezto Family!">
    <title>Welcome to the Finezto Family!</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .mobile-padding { padding: 20px 15px !important; }
        }
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; color: #333333; }
    </style>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fafafa">
        <tr>
            <td align="center" style="padding: 30px 0;">
                <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <tr>
                        <td align="center" bgcolor="#000000" style="padding: 30px 20px; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);">
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 2px; margin: 0; font-family: 'Georgia', serif;">
                                FINEZTO
                            </h1>
                            <div style="height: 2px; width: 60px; background: linear-gradient(90deg, #d4af37, #ffd700); margin: 15px auto;"></div>
                            <p style="color: #cccccc; font-size: 12px; letter-spacing: 1px; margin: 0;">
                                WELCOME TO OUR COMMUNITY
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="mobile-padding" align="center" style="padding: 30px;">
                            <h2 style="color: #2c2c2c; font-size: 20px; font-weight: 300; margin: 0 0 15px; font-family: 'Georgia', serif;">
                                Dear ${name || "Valued Customer"},
                            </h2>
                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0 0 25px;">
                                Thank you for joining the Finezto community! We're thrilled to have you on board.
                            </p>
                            <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                <h3 style="color: #2c2c2c; font-size: 16px; font-weight: 400; margin: 0 0 15px; font-family: 'Georgia', serif;">
                                    What to Expect
                                </h3>
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td width="30" style="padding: 5px 0; vertical-align: top;">
                                            <div style="width: 20px; height: 20px; background: #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">✓</div>
                                        </td>
                                        <td style="padding: 5px 0;">
                                            <p style="color: #666666; font-size: 14px; margin: 0;">Exclusive early access to new collections</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="30" style="padding: 5px 0; vertical-align: top;">
                                            <div style="width: 20px; height: 20px; background: #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">✓</div>
                                        </td>
                                        <td style="padding: 5px 0;">
                                            <p style="color: #666666; font-size: 14px; margin: 0;">Members-only discounts and promotions</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="30" style="padding: 5px 0; vertical-align: top;">
                                            <div style="width: 20px; height: 20px; background: #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">✓</div>
                                        </td>
                                        <td style="padding: 5px 0;">
                                            <p style="color: #666666; font-size: 14px; margin: 0;">Styling tips and fashion insights</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td width="30" style="padding: 5px 0; vertical-align: top;">
                                            <div style="width: 20px; height: 20px; background: #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">✓</div>
                                        </td>
                                        <td style="padding: 5px 0;">
                                            <p style="color: #666666; font-size: 14px; margin: 0;">First look at seasonal trends</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0 0 25px;">
                                We're committed to bringing you the finest quality products and exceptional shopping experiences.
                            </p>
                            <div style="margin: 25px 0;">
                                <a href="${frontendUrl}" 
                                   style="display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-size: 14px; transition: all 0.3s ease;">
                                    START SHOPPING
                                </a>
                            </div>
                            <div style="background: #fffaf0; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="color: #d4af37; font-size: 16px; font-weight: 400; margin: 0 0 12px; font-family: 'Georgia', serif;">
                                    Our Promise to You
                                </h3>
                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">
                                    At Finezto, we're dedicated to elevating your style experience with carefully curated collections and exceptional customer service.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" bgcolor="#1a1a1a" style="padding: 25px 20px;">
                            <div style="color: #d4af37; font-size: 18px; font-weight: bold; margin-bottom: 10px; font-family: 'Georgia', serif;">
                                FINEZTO
                            </div>
                            <p style="color: #cccccc; font-size: 12px; margin: 0 0 10px;">
                                Elevating Your Style Experience
                            </p>
                            <div style="margin: 15px 0;">
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #cccccc; text-decoration: none; font-size: 11px;">Instagram</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #cccccc; text-decoration: none; font-size: 11px;">Facebook</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #cccccc; text-decoration: none; font-size: 11px;">Twitter</a>
                            </div>
                            <p style="color: #888888; font-size: 10px; margin: 15px 0 0; line-height: 1.4;">
                                You're receiving this email because you subscribed to our newsletter.<br>
                                If you didn't request this subscription, please <a href="${frontendUrl}/unsubscribe?email=${encodeURIComponent(
    email
  )}" style="color: #d4af37; text-decoration: none;">unsubscribe here</a>.
                            </p>
                            <p style="color: #666666; font-size: 10px; margin: 10px 0 0; line-height: 1.4;">
                                © 2024 Finezto. All rights reserved.<br>
                                <a href="#" style="color: #888888; text-decoration: none;">Privacy Policy</a> | 
                                <a href="#" style="color: #888888; text-decoration: none;">Terms</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * Generate order status update email HTML template
 * @param {string} userName - Recipient's name
 * @param {Object} order - Order details
 * @param {string} newStatus - New order status
 * @returns {string} HTML email content
 */
const generateStatusUpdateEmail = (userName, order, newStatus) => {
  const orderDate = new Date(order.date).toLocaleDateString();
  const shortOrderId = order._id.toString().slice(-8).toUpperCase();
  const frontendUrl =
    process.env.FRONTEND_URL || "https://mystore-drab.vercel.app";

  const statusMessages = {
    "Order Placed":
      "Your order has been successfully placed and is being processed.",
    Packing: "Your order is now being packed and prepared for shipment.",
    Shipped:
      "Great news! Your order has been shipped and is on its way to you.",
    "Out for Delivery": "Your order is out for delivery and will arrive soon.",
    Delivered:
      "Your order has been successfully delivered. Thank you for shopping with us!",
    Cancelled:
      "Your order has been cancelled as requested. Please see details below.",
    Returned:
      "Your return request has been processed. We've received your returned items.",
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Order Status Update - Finezto">
    <title>Order Status Update - Finezto</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .mobile-padding { padding: 20px 15px !important; }
        }
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; color: #333333; }
    </style>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fafafa">
        <tr>
            <td align="center" style="padding: 30px 0;">
                <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <tr>
                        <td align="center" bgcolor="#000000" style="padding: 30px 20px; background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);">
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 2px; margin: 0; font-family: 'Georgia', serif;">
                                FINEZTO
                            </h1>
                            <div style="height: 2px; width: 60px; background: linear-gradient(90deg, #d4af37, #ffd700); margin: 15px auto;"></div>
                            <p style="color: #cccccc; font-size: 12px; letter-spacing: 1px; margin: 0;">
                                ORDER STATUS UPDATE
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="mobile-padding" align="center" style="padding: 30px;">
                            <h2 style="color: #2c2c2c; font-size: 20px; font-weight: 300; margin: 0 0 15px; font-family: 'Georgia', serif;">
                                Order Status Updated, ${userName}!
                            </h2>
                            ${
                              newStatus === "Cancelled" ||
                              newStatus === "Returned"
                                ? `
                            <div style="background: ${
                              newStatus === "Cancelled" ? "#fef2f2" : "#f0fdf4"
                            }; 
                                        border: 1px solid ${
                                          newStatus === "Cancelled"
                                            ? "#fecaca"
                                            : "#bbf7d0"
                                        }; 
                                        border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <h3 style="color: ${
                                  newStatus === "Cancelled"
                                    ? "#dc2626"
                                    : "#059669"
                                }; 
                                            margin: 0 0 10px;">
                                    ${
                                      newStatus === "Cancelled"
                                        ? "Order Cancelled"
                                        : "Return Processed"
                                    }
                                </h3>
                                ${
                                  order.cancellationReason
                                    ? `<p><strong>Reason:</strong> ${order.cancellationReason}</p>`
                                    : ""
                                }
                                ${
                                  order.returnReason
                                    ? `<p><strong>Return Reason:</strong> ${order.returnReason}</p>`
                                    : ""
                                }
                            </div>
                            `
                                : ""
                            }
                            <div style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 25px; text-align: center;">
                                <div style="font-size: 16px; font-weight: 500; color: #2c2c2c; margin-bottom: 10px;">
                                    New Status: <span style="color: #d4af37;">${newStatus}</span>
                                </div>
                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">
                                    ${
                                      statusMessages[newStatus] ||
                                      "Your order status has been updated."
                                    }
                                </p>
                            </div>
                            ${
                              (newStatus === "Cancelled" && order.payment) ||
                              newStatus === "Returned"
                                ? `
                            <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 6px; padding: 15px; margin: 15px 0;">
                                <h4 style="color: #ea580c; margin: 0 0 10px;">Refund Information</h4>
                                <p style="margin: 0; font-size: 14px;">
                                    Your refund will be processed within 5-7 business days. 
                                    The amount will be credited back to your original payment method.
                                </p>
                            </div>
                            `
                                : ""
                            }
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #f8f8f8; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                <tr>
                                    <td width="50%" style="padding: 5px 0;">
                                        <strong>Order Number:</strong>
                                    </td>
                                    <td width="50%" style="padding: 5px 0; text-align: right;">
                                        ${shortOrderId}
                                    </td>
                                </tr>
                                <tr>
                                    <td width="50%" style="padding: 5px 0;">
                                        <strong>Order Date:</strong>
                                    </td>
                                    <td width="50%" style="padding: 5px 0; text-align: right;">
                                        ${orderDate}
                                    </td>
                                </tr>
                                <tr>
                                    <td width="50%" style="padding: 5px 0;">
                                        <strong>Total Amount:</strong>
                                    </td>
                                    <td width="50%" style="padding: 5px 0; text-align: right;">
                                        ${formatCurrency(order.amount)}
                                    </td>
                                </tr>
                            </table>
                            <h3 style="color: #2c2c2c; font-size: 16px; font-weight: 400; margin: 0 0 15px; text-align: left; font-family: 'Georgia', serif;">
                                Order Items
                            </h3>
                            ${order.items
                              .map(
                                (item, index) => `
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: ${
                              index === order.items.length - 1
                                ? "none"
                                : "1px solid #eeeeee"
                            };">
                                <div style="flex: 1;">
                                    <p style="font-weight: 500; margin: 0 0 5px; color: #2c2c2c; font-size: 14px;">${
                                      item.name
                                    }</p>
                                    <p style="color: #666666; margin: 0; font-size: 12px;">Size: ${
                                      item.size
                                    } • Qty: ${item.quantity}</p>
                                </div>
                                <div style="text-align: right;">
                                    <p style="font-weight: 500; margin: 0; color: #2c2c2c; font-size: 14px;">${formatCurrency(
                                      item.price * item.quantity
                                    )}</p>
                                </div>
                            </div>
                            `
                              )
                              .join("")}
                            ${
                              newStatus === "Delivered"
                                ? `
                            <div style="background: #f0f9ff; border: 1px solid #7dd3fc; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="color: #0369a1; font-size: 16px; font-weight: 400; margin: 0 0 12px; font-family: 'Georgia', serif;">
                                    Need to Return an Item?
                                </h3>
                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0 0 15px;">
                                    To return your order, email <strong>support@finezto.com</strong> with "Return" as the subject. Include the following information in your email:
                                </p>
                                <ul style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0 0 15px; padding-left: 20px;">
                                    <li>Your order number: <strong>${shortOrderId}</strong></li>
                                    <li>Reason for returning the item(s)</li>
                                    <li>Which specific item(s) you'd like to return</li>
                                    <li>Photos of the item(s)</li>
                                </ul>
                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">
                                    Our support team will guide you through the return process and provide you with a return authorization number and shipping instructions.
                                </p>
                            </div>
                            `
                                : ""
                            }
                            <div style="background: #fffaf0; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <h3 style="color: #d4af37; font-size: 16px; font-weight: 400; margin: 0 0 12px; font-family: 'Georgia', serif;">
                                    What's Next?
                                </h3>
                                <p style="color: #666666; font-size: 14px; line-height: 1.5; margin: 0;">
                                    ${
                                      newStatus === "Delivered"
                                        ? "We hope you love your purchase! If you have any questions, please contact our support team."
                                        : newStatus === "Cancelled" ||
                                          newStatus === "Returned"
                                        ? "If you have any questions about this action, please contact our support team."
                                        : "We'll notify you when your order status changes again. You can also track your order in your account."
                                    }
                                </p>
                            </div>
                            <div style="display: flex; gap: 10px; justify-content: center; margin: 25px 0 15px;">
                                <a href="${frontendUrl}/orders" 
                                   style="display: inline-block; background: #000000; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-size: 14px; transition: all 0.3s ease;">
                                    VIEW YOUR ORDERS
                                </a>
                                <a href="${frontendUrl}/contact" 
                                   style="display: inline-block; background: transparent; color: #000000; text-decoration: none; padding: 12px 25px; border: 1px solid #000000; border-radius: 4px; font-size: 14px; transition: all 0.3s ease;">
                                    CONTACT SUPPORT
                                </a>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" bgcolor="#1a1a1a" style="padding: 25px 20px;">
                            <p style="color: #888888; font-size: 11px; margin: 0 0 12px;">
                                Need help? Contact us at support@finezto.com
                            </p>
                            <div style="margin: 0 0 15px;">
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #cccccc; text-decoration: none; font-size: 11px;">Instagram</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #cccccc; text-decoration: none; font-size: 11px;">Facebook</a>
                                <a href="#" style="display: inline-block; margin: 0 8px; color: #cccccc; text-decoration: none; font-size: 11px;">Pinterest</a>
                            </div>
                            <p style="color: #666666; font-size: 10px; margin: 0; line-height: 1.4;">
                                © 2024 Finezto. All rights reserved.<br>
                                <a href="#" style="color: #888888; text-decoration: none;">Privacy Policy</a> | 
                                <a href="#" style="color: #888888; text-decoration: none;">Terms</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

/**
 * Generate contact form email HTML template
 * @param {Object} formData - Contact form data
 * @returns {string} HTML email content
 */
const generateContactEmail = (formData) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="New Contact Form Submission - Finezto">
    <title>New Contact Form Submission - Finezto</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .mobile-padding { padding: 20px 15px !important; }
        }
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; color: #333333; }
    </style>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#fafafa">
        <tr>
            <td align="center" style="padding: 30px 0;">
                <table class="container" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <tr>
                        <td align="center" bgcolor="#000000" style="padding: 30px 20px;">
                            <h1 style="color: #ffffff; font-size: 24px; font-weight: 300; letter-spacing: 2px; margin: 0; font-family: 'Georgia', serif;">
                                FINEZTO
                            </h1>
                            <div style="height: 2px; width: 60px; background: linear-gradient(90deg, #d4af37, #ffd700); margin: 15px auto;"></div>
                            <p style="color: #cccccc; font-size: 12px; letter-spacing: 1px; margin: 0;">
                                NEW CONTACT FORM SUBMISSION
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td class="mobile-padding" style="padding: 30px;">
                            <h2 style="color: #2c2c2c; font-size: 20px; font-weight: 300; margin: 0 0 20px; font-family: 'Georgia', serif;">
                                New Contact Form Submission
                            </h2>
                            <div style="background: #f8f8f8; border-radius: 8px; padding: 20px;">
                                <p><strong>Name:</strong> ${formData.name}</p>
                                <p><strong>Email:</strong> ${formData.email}</p>
                                <p><strong>Message:</strong></p>
                                <p style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #d4af37;">${formData.message.replace(
                                  /\n/g,
                                  "<br>"
                                )}</p>
                            </div>
                            <p style="color: #666666; font-size: 12px; margin-top: 20px;">
                                This message was sent from the contact form on your website.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
};

// ========== EMAIL SENDING FUNCTIONS ==========

/**
 * Send welcome email to new user
 * @param {string} userEmail - Recipient's email
 * @param {string} userName - Recipient's name
 * @param {string|null} verificationToken - Email verification token
 * @returns {Promise<boolean>} Success status
 */
const sendWelcomeEmail = async (
  userEmail,
  userName,
  verificationToken = null
) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.error("Email transporter not configured: missing credentials");
      return false;
    }

    // Verify transporter connectivity before attempting to send
    try {
      await transporter.verify();
    } catch (verifyErr) {
      console.error("Email transporter verification failed:", verifyErr);
      return false;
    }

    const verificationLink = verificationToken
      ? `${
          process.env.FRONTEND_URL || "https://mystore-drab.vercel.app"
        }/verify-email?token=${verificationToken}`
      : null;

    const mailOptions = {
      from: {
        name: "Finezto",
        address: process.env.EMAIL_USER,
      },
      to: userEmail,
      subject: "Welcome to Finezto - Where Elegance Meets Excellence",
      html: generateWelcomeEmail(userName, verificationLink),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      "Welcome email sent to",
      userEmail,
      info?.messageId || info?.response
    );
    return true;
  } catch (error) {
    console.error("Failed to send welcome email to", userEmail, error);
    return false;
  }
};

/**
 * Send newsletter confirmation email
 * @param {string} email - Subscriber's email
 * @param {string} name - Subscriber's name
 * @returns {Promise<Object|null>} Email sending result
 */
const sendNewsletterConfirmationEmail = async (email, name = "") => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return null;
    }

    await transporter.verify();

    const mailOptions = {
      from: {
        name: "Finezto",
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: "Welcome to the Finezto Family!",
      html: generateNewsletterConfirmationEmail(email, name),
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

/**
 * Send order confirmation email
 * @param {string} userEmail - Recipient's email
 * @param {string} userName - Recipient's name
 * @param {Object} order - Order details
 * @returns {Promise<Object|null>} Email sending result
 */
const sendOrderConfirmationEmail = async (userEmail, userName, order) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return null;
    }

    await transporter.verify();

    const shortOrderId =
      order._id && order._id.toString
        ? order._id.toString().slice(-8).toUpperCase()
        : "TEST1234";

    const mailOptions = {
      from: {
        name: "Finezto",
        address: process.env.EMAIL_USER,
      },
      to: userEmail,
      subject: `Your Finezto Order #${shortOrderId} is Confirmed!`,
      html: generateOrderConfirmationEmail(userName, order),
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    return null;
  }
};

/**
 * Send order status update email
 * @param {string} userEmail - Recipient's email
 * @param {string} userName - Recipient's name
 * @param {Object} order - Order details
 * @param {string} newStatus - New order status
 * @returns {Promise<Object|null>} Email sending result
 */
const sendOrderStatusUpdateEmail = async (
  userEmail,
  userName,
  order,
  newStatus
) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return null;
    }

    await transporter.verify();

    const shortOrderId = order._id.toString().slice(-8).toUpperCase();
    let subject;

    switch (newStatus) {
      case "Cancelled":
        subject = `Order #${shortOrderId} Has Been Cancelled`;
        break;
      case "Returned":
        subject = `Order #${shortOrderId} Return Processed`;
        break;
      default:
        subject = `Order #${shortOrderId} Status: ${newStatus}`;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Finezto" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: subject,
      html: generateStatusUpdateEmail(userName, order, newStatus),
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    return null;
  }
};

/**
 * Send contact form email
 * @param {Object} formData - Contact form data
 * @returns {Promise<boolean>} Success status
 */
const sendContactEmail = async (formData) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return false;
    }

    const mailOptions = {
      from: {
        name: "Finezto Website",
        address: process.env.EMAIL_USER,
      },
      to: process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${formData.name}`,
      html: generateContactEmail(formData),
      replyTo: formData.email,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Send password reset email
 * @param {string} email - Recipient's email
 * @param {string} name - Recipient's name
 * @param {string} resetCode - Password reset code
 * @returns {Promise<boolean>} Success status
 */
const sendPasswordResetEmail = async (email, name, resetCode) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Finezto" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - Finezto",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="description" content="Password Reset Request - Finezto">
            <title>Password Reset Request - Finezto</title>
            <style>
                body { font-family: Arial, sans-serif; }
            </style>
        </head>
        <body>
            <h2>Password Reset Request</h2>
            <p>Hello ${name},</p>
            <p>Use the verification code below to reset your password:</p>
            <div style="background: #000000; color: white; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; border-radius: 5px; letter-spacing: 3px;">
                ${resetCode}
            </div>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw error;
  }
};

export {
  sendWelcomeEmail,
  sendContactEmail,
  createTransporter,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
  sendPasswordResetEmail,
  sendNewsletterConfirmationEmail,
};
