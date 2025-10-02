// scrape פונקציות שירות לביצוע
import axios from "axios";
import * as cheerio from "cheerio";

const ZENROWS_URL = "https://api.zenrows.com/v1/";
const BASE_URL = "https://www.yad2.co.il/realestate/rent";

// מחזיר מודעות של עמוד בודד ומיפוי של שדה מצב דירה
async function scrapePage(page = 1) {
  const response = await axios.get(ZENROWS_URL, {
    params: {
      url: `${BASE_URL}?Page=${page}`,
      apikey: process.env.ZENROWS_API_KEY,
      js_render: "true",
      premium_proxy: "true",
      proxy_country: "il",
    },
  });

  const $ = cheerio.load(response.data);
  const nextDataScript = $("#__NEXT_DATA__").html();
  const nextData = JSON.parse(nextDataScript);

  const enums = nextData.props.pageProps.enums || {};

  for (const q of nextData.props.pageProps.dehydratedState.queries) {
    if (q.state?.data?.private) {
      return { apartments: q.state.data.private, enums };
    }
  }
  return { apartments: [], enums };
}

// מיפוי שדות של מודעה
function normalizeApartment(raw, enums) {
  return {
    id: raw.orderId,
    token: raw.token,
    city: raw.address?.city?.text || null,
    area: raw.address?.area?.text || null,
    neighborhood: raw.address?.neighborhood?.text || null,
    street: raw.address?.street?.text || null,
    houseNumber: raw.address?.house?.number || null,
    floor: raw.address?.house?.floor || null,
    lat: raw.address?.coords?.lat || null,
    lon: raw.address?.coords?.lon || null,
    price: raw.price || null,
    priceBefore: raw.priceBeforeTag || null,
    propertyType: raw.additionalDetails?.property?.text || null,
    rooms: raw.additionalDetails?.roomsCount || null,
    size: raw.additionalDetails?.squareMeter || null,
    conditionId: raw.additionalDetails?.propertyCondition?.id || null,
    conditionText:
      enums?.propertyCondition?.[raw.additionalDetails?.propertyCondition?.id] || null,
    coverImage: raw.metaData?.coverImage || null,
    images: raw.metaData?.images || [],
    tags: raw.tags?.map((t) => t.name) || [],
  };
}

// מחזיר מודעות דירות להשכרה עם הגבלה על מספר המודעות
export async function scrapeApartments(limit = 50) {
  let results = [];
  let page = 1;

  while (results.length < limit) {
    const { apartments, enums } = await scrapePage(page);
    if (!apartments.length) break;

    results.push(...apartments.map((apt) => normalizeApartment(apt, enums)));
    page++;
  }

  return results.slice(0, limit);
}

// מחזיר מודעות גולמיות (כפי שמגיעות מיד2) עם הגבלה על מספר המודעות
export async function scrapeRawApartments(limit = 50) {
  let results = [];
  let page = 1;

  while (results.length < limit) {
    const { apartments } = await scrapePage(page);
    if (!apartments.length) break;

    results.push(...apartments); 
    page++;
  }

  return results.slice(0, limit);
}


