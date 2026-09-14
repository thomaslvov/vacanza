export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = (searchParams.get("name") || "").trim();
  const destination = (searchParams.get("destination") || "").trim();
  const date = (searchParams.get("date") || "").trim();
  const travelers = (searchParams.get("travelers") || "").trim();
  const phone = (searchParams.get("phone") || "").trim();

  const message = [
    "היי",
    `אשמח שתבנה לי חופשה ל${destination}`,
    "",
    `שם: ${name}`,
    `תאריך / תקופה: ${date}`,
    `מספר נוסעים: ${travelers}`,
    `טלפון: ${phone}`,
  ].join("\n");

  const whatsappUrl = `https://wa.me/972546363398?text=${encodeURIComponent(
    message
  )}`;

  return Response.redirect(whatsappUrl, 302);
}