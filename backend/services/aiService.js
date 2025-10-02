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
You are an AI system that ranks real estate listings according to user requirements.

### Input
1. User requirements (JSON object).
2. Listings: array of objects with fields:
   id, city, area, neighborhood, street, houseNumber, price, priceBefore,
   propertyType, rooms, squareMeter, floor, condition, tags, distanceKm.

### Output
- Always return **valid JSON only**:
{
  "items": [
    { "id": "<id from input>", "score": 0.0-1.0, "reason": "עד 20 מילים בעברית בלבד" }
  ]
}
- Sort items by score (highest first).
- **Every listing must include a score and a reason** (reason must be in Hebrew only, ≤20 words).
- If the apartment is not in the requested city, still give it a score and explain that it is in a nearby city, including distanceKm.

### Scoring Rules

1. **City (Top Priority)**
   - Apartments in the requested city = highest priority.
   - If no matches in the city → allow apartments from other cities (already pre-filtered by distance).
   - Always explain if the apartment is in a nearby city and include distanceKm in the reason.

2. **Price**
   - Respect minPrice / maxPrice ranges.
   - Allow small flexibility: ±10% deviation is acceptable.

3. **Rooms**
   - Respect minRooms / maxRooms.
   - Allow small flexibility: ±0.5 room.

4. **Apartment Size**
   - Respect minSquareMeter / maxSquareMeter.
   - Allow small flexibility: ±10%.

5. **Neighborhood**
   - If requested and matches → boost.
   - If mismatched but same city → slight penalty.

6. **Tags**
   - tagsWanted → boost.
   - tagsExcluded → heavy penalty.

7. **Priority**
   - If specified (price, rooms, location, size) → strongest weight.
   - If not specified → default weights:
     - Location: 40%
     - Price: 25%
     - Rooms: 20%
     - Size + Tags: 15%

8. **General**
   - Never invent details not in listings.
   - All reasons must be in Hebrew, ≤20 words.
   - Even for less suitable apartments, still provide a score and reason.

### Example Output
{
  "items": [
    { "id": 101, "score": 0.95, "reason": "בתל אביב, מחיר מתאים, 3 חדרים, 70 מ״ר" },
    { "id": 202, "score": 0.70, "reason": "רמת גן, 15 ק״מ מתל אביב, מחיר סביר, 2 חדרים" }
  ]
}

### Now rank the following:

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
        maxOutputTokens: 12000,
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
