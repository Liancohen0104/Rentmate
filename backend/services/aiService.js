import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.warn("[AI] Missing GOOGLE_API_KEY in .env. Falling back to deterministic results.");
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// נירמול תגים למערך מחרוזות
function normalizeTags(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean).map(String);
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

// לוקחים מכל דירה רק שדות רלוונטיים לדירוג 
function toMinimalListing(apartment) {
  return {
    id: apartment.id,
    city: apartment.city ?? null,
    area: apartment.area ?? null,
    neighborhood: apartment.neighborhood ?? null,
    street: apartment.street ?? null,
    houseNumber: apartment.houseNumber ?? null,
    price: apartment.price ?? null,
    priceBefore: apartment.priceBefore ?? null,
    propertyType: apartment.propertyType ?? null,
    rooms: apartment.rooms ?? null,
    squareMeter: apartment.size ?? null,
    size: apartment.size ?? null,
    floor: apartment.floor ?? null,
    condition: apartment.conditionText ?? null,
    tags: normalizeTags(apartment.tags ?? []),
  };
}

// AI מתשובת ה Json חילוץ
function tryParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
}

// בניית פרומפט
function buildPrompt(userRequirements, listings) {
  return `
INSTRUCTIONS:
You are a ranking system for real estate listings.

INPUT:
1) "User requirements" (JSON object). Keys may include:
   city, neighborhood, minRooms, maxRooms, minPrice, maxPrice,
   minSquareMeter, maxSquareMeter, propertyType, minFloor, maxFloor,
   tagsWanted, tagsExcluded, priority.
2) "Listings" (array of objects) with fields:
   id, city, area, neighborhood, street, houseNumber, price, priceBefore,
   propertyType, rooms, squareMeter, floor, condition, tags.

TASK:
- Rank all listings by how well they satisfy the user requirements.
- Always return **valid JSON only** in the format:
{
  "items": [
    { "id": "<same as input>", "score": 0.0-1.0, "reason": "Up to 20 hebrew words" }
  ]
}
- Sort items by score (descending).

SCORING RULES:
1. **City/Neighborhood Matching**
   - Treat city and neighborhood as very important.
   - Be tolerant to spelling differences, typos, hyphens, or variations (e.g., "תל אבי" ≈ "תל אביב", "תל אביב יפו" ≈ "תל אביב").
   - If neighborhood is specified and matches closely, strongly increase score.
   - If city matches but neighborhood mismatches, lower score but don’t eliminate.

2. **Tags**
   - If tagsWanted are present: listings with them get a significant score boost.
   - If tagsExcluded are present: listings containing them should be penalized heavily or excluded.

3. **Priority Handling**
   - If "priority" is specified (e.g., "price", "rooms", "location"):
     - Give this category the most weight in scoring.
   - If no priority is given, use default weights:
     - Price: 40%
     - Rooms: 30%
     - Location + Tags: 30%

4. **Numeric Filters**
   - Respect min/max ranges:
     - Rooms, price, square meters, floor.
   - Listings outside these ranges receive a low score, but may still appear if no better matches exist.

5. **General Rules**
   - Do NOT invent details not in the listing.
   - Always provide a short, clear English reason (max 20 words).
   - If no listing perfectly matches, return the closest ones with honest reasoning.

USER REQUIREMENTS:
${JSON.stringify(userRequirements, null, 2)}

LISTINGS:
${JSON.stringify(listings, null, 2)}
`;
}


// AI בחירת הדירות הטובות ביותר לפי דרישות משתמש בעזרת
export async function pickBestApartments(userRequirements, apartments, options = {}) {
  const maxResults = Number(options.maxResults ?? 10);

  // אם אין דירות כלל
  if (!apartments || apartments.length === 0) {
    return { ranked: [], meta: { ai: "skipped", reason: "no apartments" } };
  }

  // Gemini אם אין מפתח ל
  if (!genAI) {
    return {
      ranked: apartments.slice(0, maxResults),
      meta: { ai: "unavailable", reason: "Missing GOOGLE_API_KEY" },
    };
  }

  // ממפים לשדות מינימליים — על כל הדירות
  const minimalListings = apartments.map(toMinimalListing);

  // בונים פרומפט
  const prompt = buildPrompt(userRequirements, minimalListings);

  try {
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    });

    const text =
      (typeof result?.response?.text === "function" ? result.response.text() : undefined) ||
      result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    const parsed = tryParseJSON(text);

    // אם אין פלט תקין 
    if (!parsed || !Array.isArray(parsed.items)) {
      return {
        ranked: apartments.slice(0, maxResults),
        meta: { ai: "fallback", reason: "Invalid AI JSON" },
      };
    }

    // מיפוי תוצאות לפי מזהה דירה
    const scores = new Map();
    for (const item of parsed.items) {
      if (!item || typeof item !== "object") continue;
      const id = item.id;
      const score = Number(item.score);
      const reason = typeof item.reason === "string" ? item.reason : "";
      if (id != null && !Number.isNaN(score)) {
        scores.set(String(id), { score, reason });
      }
    }

    // מיון הדירות לפי הציון, דירות ללא ציון בסוף
    const ranked = [...apartments]
      .sort((a, b) => {
        const sa = scores.get(String(toMinimalListing(a).id))?.score ?? -1;
        const sb = scores.get(String(toMinimalListing(b).id))?.score ?? -1;
        return sb - sa;
      })
      .map((ap) => {
        const id = String(toMinimalListing(ap).id);
        const meta = scores.get(id) || { score: 0, reason: "" };
        return { ...ap, _ai: meta };
      });

    return {
      ranked: ranked.slice(0, maxResults),
      meta: {
        ai: "ok",
        model: GEMINI_MODEL,
        sent: minimalListings.length,
        returned: Math.min(maxResults, ranked.length),
      },
    };
  } catch (err) {
    console.error("[AI] Error:", err?.message || err);
    return {
      ranked: apartments.slice(0, maxResults),
      meta: { ai: "error", reason: "Exception while calling Gemini" },
    };
  }
}
