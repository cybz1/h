import { createHash, timingSafeEqual } from "node:crypto";

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "invalid origin" }, { status: 403, headers });
  const expected = process.env.BIRTHDAY_PIN;
  if (!expected) return Response.json({ error: "letter unavailable" }, { status: 503, headers });
  try {
    if (Number(request.headers.get("content-length")) > 256) return new Response(null, { status: 413, headers });
    const body: unknown = await request.json();
    const pin = body !== null && typeof body === "object" && "pin" in body && typeof body.pin === "string" ? body.pin : "";
    const digest = (value: string) => createHash("sha256").update(value).digest();
    if (!/^\d{8}$/.test(pin) || !timingSafeEqual(digest(pin), digest(expected))) {
      await new Promise(resolve => setTimeout(resolve, 700));
      return Response.json({ error: "incorrect code" }, { status: 401, headers });
    }
    return Response.json({ paragraphs: [
      "your birthday is soon",
      "and i wanted to make you something that feels a little like us so here is a tiny place with your favourite colours some kittens and us together in paris",
      "i hope you know how much you mean to me even when i don't find the right words to say it you make the little things feel special just by being you",
      "i hope you're no one else's naseeb except mine and i wish you all the best in life",
      "i hope this next year brings you so much happiness and peace and that all the things you quietly wish for start finding their way to you inshallah",
      "inshallah this is one of many more birthdays we get to experience together",
      "if i don't get to see you this 5th october then inshallah i'll be there for the next one",
      "you are my favourite person in the entire world and i hope you always feel loved by me",
    ] }, { headers });
  } catch { return Response.json({ error: "invalid request" }, { status: 400, headers }); }
}
