import nodemailer from "nodemailer";
import { Order, Reservation } from "@/types";

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "suensa";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const RESTAURANT_PHONE = process.env.NEXT_PUBLIC_RESTAURANT_PHONE || "+1 (555) 728-6742";
const RESTAURANT_EMAIL = process.env.NEXT_PUBLIC_RESTAURANT_EMAIL || "mohit.work@gmail.com";

interface EmailResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

/**
 * Send order confirmation email to the customer
 */
export async function sendOrderConfirmationEmail(order: Order): Promise<EmailResult> {
  if (!order.email || !order.email.includes("@")) {
    console.warn(`[EMAIL] Invalid recipient email for order #${order.id}: ${order.email}`);
    return { success: false, error: "Invalid recipient email" };
  }

  const trackingUrl = `${APP_URL}/track-order?orderId=${encodeURIComponent(order.id)}`;
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E7E5E4; font-size: 14px; color: #1C1917;">
          <strong>${item.name}</strong> × ${item.quantity}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E7E5E4; font-size: 14px; color: #1C1917; text-align: right; font-weight: bold;">
          ₹${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation #${order.id}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FDFBF7; margin: 0; padding: 30px 15px; color: #1C1917;">
        <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; border: 1px solid #E7E5E4; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background-color: #FBBF24; padding: 28px 24px; text-align: center;">
            <span style="font-size: 32px;">🍕</span>
            <h1 style="margin: 8px 0 4px; font-size: 24px; font-weight: 900; color: #0C0A09;">${APP_NAME}</h1>
            <p style="margin: 0; font-size: 13px; font-weight: bold; color: #78350F; text-transform: uppercase; letter-spacing: 1px;">Order Confirmation</p>
          </div>

          <!-- Body -->
          <div style="padding: 28px 24px;">
            <p style="font-size: 16px; margin: 0 0 16px;">Hello <strong>${order.customerName}</strong>,</p>
            <p style="font-size: 14px; color: #57534E; line-height: 1.6; margin: 0 0 24px;">
              Thank you for choosing ${APP_NAME}! We've received your order and our chefs are already preparing your artisanal dishes.
            </p>

            <!-- Order Snapshot Banner -->
            <div style="background: #F5F5F4; border-radius: 16px; padding: 16px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                <tr>
                  <td style="color: #78716C; padding: 4px 0;">Order Reference:</td>
                  <td style="text-align: right; font-weight: 900; color: #D97706; font-size: 15px;">#${order.id}</td>
                </tr>
                <tr>
                  <td style="color: #78716C; padding: 4px 0;">Order Type:</td>
                  <td style="text-align: right; font-weight: bold; color: #1C1917;">${order.orderType}</td>
                </tr>
                <tr>
                  <td style="color: #78716C; padding: 4px 0;">Payment Method:</td>
                  <td style="text-align: right; font-weight: bold; color: #1C1917;">${order.paymentMethod} (${order.paymentStatus})</td>
                </tr>
                ${
                  order.address
                    ? `<tr>
                        <td style="color: #78716C; padding: 4px 0;">Delivery Address:</td>
                        <td style="text-align: right; color: #1C1917;">${order.address}</td>
                      </tr>`
                    : ""
                }
              </table>
            </div>

            <!-- Items Table -->
            <h3 style="font-size: 15px; font-weight: 900; margin: 0 0 12px; color: #1C1917; text-transform: uppercase; letter-spacing: 0.5px;">Your Ordered Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Pricing Breakdown -->
            <div style="background: #FAF8F5; border-radius: 16px; padding: 16px; border: 1px solid #E7E5E4; margin-bottom: 28px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #57534E;">
                <tr>
                  <td style="padding: 4px 0;">Subtotal</td>
                  <td style="text-align: right; font-weight: bold; color: #1C1917;">₹${order.subtotal.toFixed(2)}</td>
                </tr>
                ${
                  (order.discount ?? 0) > 0
                    ? `<tr>
                        <td style="padding: 4px 0; color: #16A34A;">Discount Saved</td>
                        <td style="text-align: right; font-weight: bold; color: #16A34A;">-₹${(order.discount ?? 0).toFixed(2)}</td>
                      </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 4px 0;">Taxes & GST (5%)</td>
                  <td style="text-align: right; color: #1C1917;">₹${order.tax.toFixed(2)}</td>
                </tr>
                ${
                  (order.tip ?? 0) > 0
                    ? `<tr>
                        <td style="padding: 4px 0;">Driver Tip</td>
                        <td style="text-align: right; color: #1C1917;">₹${(order.tip ?? 0).toFixed(2)}</td>
                      </tr>`
                    : ""
                }
                <tr style="border-top: 1px solid #D6D3D1;">
                  <td style="padding: 10px 0 4px; font-size: 16px; font-weight: 900; color: #0C0A09;">Total Amount</td>
                  <td style="padding: 10px 0 4px; text-align: right; font-size: 18px; font-weight: 900; color: #D97706;">₹${order.total.toFixed(2)}</td>
                </tr>
              </table>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${trackingUrl}" style="display: inline-block; background-color: #FBBF24; color: #0C0A09; text-decoration: none; font-weight: 900; font-size: 14px; padding: 14px 32px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(251, 191, 36, 0.4);">
                Track Your Order Live →
              </a>
            </div>

            <p style="font-size: 12px; color: #A8A29E; text-align: center; line-height: 1.5; margin: 0;">
              Questions about your order? Call our hotline directly at <a href="tel:${RESTAURANT_PHONE}" style="color: #D97706; text-decoration: none; font-weight: bold;">${RESTAURANT_PHONE}</a> or email <a href="mailto:${RESTAURANT_EMAIL}" style="color: #D97706; text-decoration: none; font-weight: bold;">${RESTAURANT_EMAIL}</a>.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #F5F5F4; padding: 16px; text-align: center; font-size: 11px; color: #78716C; border-top: 1px solid #E7E5E4;">
            © ${new Date().getFullYear()} ${APP_NAME}. Handcrafted Artisanal Kitchen.
          </div>
        </div>
      </body>
    </html>
  `;

  const fromAddress = process.env.SMTP_FROM || `"${APP_NAME}" <${RESTAURANT_EMAIL}>`;
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`
======================================================
📧 [SIMULATED EMAIL DISPATCH - NO SMTP CONFIGURED]
------------------------------------------------------
To: ${order.customerName} <${order.email}>
Subject: 🍕 Order Confirmed! [#${order.id}] - ${APP_NAME}
Total: ₹${order.total} (${order.orderType})
Tracking Link: ${trackingUrl}
(To send real emails, provide SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local)
======================================================
    `);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: `"${order.customerName}" <${order.email}>`,
      subject: `🍕 Order Confirmed! [#${order.id}] - ${APP_NAME}`,
      html: emailHtml,
    });
    console.log(`[EMAIL] Order confirmation sent to ${order.email} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EMAIL] Failed to send order confirmation to ${order.email}:`, err);
    return { success: false, error: err instanceof Error ? err.message : "SMTP send failure" };
  }
}

/**
 * Send reservation confirmation email to the customer
 */
export async function sendReservationConfirmationEmail(reservation: Reservation): Promise<EmailResult> {
  if (!reservation.email || !reservation.email.includes("@")) {
    console.warn(`[EMAIL] Invalid recipient email for reservation #${reservation.id}: ${reservation.email}`);
    return { success: false, error: "Invalid recipient email" };
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Table Reservation Confirmed #${reservation.id}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FDFBF7; margin: 0; padding: 30px 15px; color: #1C1917;">
        <div style="max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 24px; border: 1px solid #E7E5E4; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background-color: #0C0A09; padding: 28px 24px; text-align: center; color: #FFFFFF;">
            <span style="font-size: 32px;">🍷</span>
            <h1 style="margin: 8px 0 4px; font-size: 24px; font-weight: 900; color: #FBBF24;">${APP_NAME}</h1>
            <p style="margin: 0; font-size: 13px; font-weight: bold; color: #D6D3D1; text-transform: uppercase; letter-spacing: 1px;">Table Reservation Confirmed</p>
          </div>

          <!-- Body -->
          <div style="padding: 28px 24px;">
            <p style="font-size: 16px; margin: 0 0 16px;">Dear <strong>${reservation.customerName}</strong>,</p>
            <p style="font-size: 14px; color: #57534E; line-height: 1.6; margin: 0 0 24px;">
              Your table has been reserved! We look forward to welcoming you for an unforgettable dining experience at ${APP_NAME}.
            </p>

            <!-- Reservation Card -->
            <div style="background: #FDF8ED; border: 1px solid #FDE68A; border-radius: 20px; padding: 20px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="color: #92400E; padding: 6px 0; font-weight: bold;">Booking Reference:</td>
                  <td style="text-align: right; font-weight: 900; color: #B45309; font-size: 16px;">#${reservation.id}</td>
                </tr>
                <tr>
                  <td style="color: #92400E; padding: 6px 0;">Date:</td>
                  <td style="text-align: right; font-weight: bold; color: #1C1917;">${reservation.date}</td>
                </tr>
                <tr>
                  <td style="color: #92400E; padding: 6px 0;">Time Slot:</td>
                  <td style="text-align: right; font-weight: bold; color: #1C1917;">${reservation.timeSlot}</td>
                </tr>
                <tr>
                  <td style="color: #92400E; padding: 6px 0;">Number of Guests:</td>
                  <td style="text-align: right; font-weight: bold; color: #1C1917;">${reservation.guests} ${reservation.guests === 1 ? "Guest" : "Guests"}</td>
                </tr>
                <tr>
                  <td style="color: #92400E; padding: 6px 0;">Seating Area:</td>
                  <td style="text-align: right; font-weight: bold; color: #1C1917;">${reservation.seatingArea}</td>
                </tr>
                ${
                  reservation.specialRequests
                    ? `<tr>
                        <td style="color: #92400E; padding: 6px 0;">Special Requests:</td>
                        <td style="text-align: right; color: #57534E; font-style: italic;">"${reservation.specialRequests}"</td>
                      </tr>`
                    : ""
                }
                <tr>
                  <td style="color: #92400E; padding: 6px 0;">Reservation Status:</td>
                  <td style="text-align: right; font-weight: 900; color: #16A34A;">● ${reservation.status}</td>
                </tr>
              </table>
            </div>

            <!-- Notes -->
            <div style="background: #F5F5F4; border-radius: 14px; padding: 14px; font-size: 12px; color: #57534E; line-height: 1.6; margin-bottom: 24px;">
              <strong>Guest Guidelines:</strong>
              <ul style="margin: 6px 0 0; padding-left: 20px;">
                <li>Please arrive 10 minutes prior to your reserved time slot.</li>
                <li>Tables are held for up to 15 minutes past the scheduled reservation time.</li>
                <li>To modify or reschedule your booking, please contact us directly.</li>
              </ul>
            </div>

            <p style="font-size: 12px; color: #A8A29E; text-align: center; line-height: 1.5; margin: 0;">
              Need to modify or cancel? Call us directly at <a href="tel:${RESTAURANT_PHONE}" style="color: #B45309; text-decoration: none; font-weight: bold;">${RESTAURANT_PHONE}</a> or email <a href="mailto:${RESTAURANT_EMAIL}" style="color: #B45309; text-decoration: none; font-weight: bold;">${RESTAURANT_EMAIL}</a>.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #F5F5F4; padding: 16px; text-align: center; font-size: 11px; color: #78716C; border-top: 1px solid #E7E5E4;">
            © ${new Date().getFullYear()} ${APP_NAME}. 442 Culinary Boulevard, Gourmet District.
          </div>
        </div>
      </body>
    </html>
  `;

  const fromAddress = process.env.SMTP_FROM || `"${APP_NAME}" <${RESTAURANT_EMAIL}>`;
  const transporter = getTransporter();

  if (!transporter) {
    console.log(`
======================================================
📧 [SIMULATED EMAIL DISPATCH - NO SMTP CONFIGURED]
------------------------------------------------------
To: ${reservation.customerName} <${reservation.email}>
Subject: 🍷 Table Reservation Confirmed [#${reservation.id}] - ${APP_NAME}
Date & Time: ${reservation.date} at ${reservation.timeSlot} (${reservation.guests} Guests)
Area: ${reservation.seatingArea}
(To send real emails, provide SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local)
======================================================
    `);
    return { success: true, simulated: true };
  }

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: `"${reservation.customerName}" <${reservation.email}>`,
      subject: `🍷 Table Reservation Confirmed [#${reservation.id}] - ${APP_NAME}`,
      html: emailHtml,
    });
    console.log(`[EMAIL] Reservation confirmation sent to ${reservation.email} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EMAIL] Failed to send reservation confirmation to ${reservation.email}:`, err);
    return { success: false, error: err instanceof Error ? err.message : "SMTP send failure" };
  }
}
