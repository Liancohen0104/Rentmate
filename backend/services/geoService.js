import axios from "axios";

export async function getCityCoords(cityName) {
  const apiKey = process.env.GOOGLE_GEO_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${apiKey}`;
  
  const res = await axios.get(url);
  if (!res.data.results || res.data.results.length === 0) {
    throw new Error("City not found in Google Maps");
  }
  
  
  return res.data.results[0].geometry.location; // { lat, lng }
}
