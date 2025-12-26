import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH
);

export const sendWhatsApp = async (to, message) => {
  await client.messages.create({
    from: "whatsapp:+918797093015", // Twilio sandbox
    to: `whatsapp:${to}`,
    body: message
  });
};
