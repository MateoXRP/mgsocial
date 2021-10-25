import { Router } from 'express';
import axios from 'axios';

const router = Router();
const mapboxBaseUrl = 'https://api.mapbox.com/geocoding/v5';

interface Feature {
  id: string;
  type: string;
  place_type: string[];
  relevance: number;
  properties: {
    wikidata: string;
    category: string;
    landmark?: boolean;
    address: string;
    foursquare: string;
    maki: string;
  };
  text: string;
  place_name: string;
  bbox: number[];
  center: number[];
  geometry: {
    type: string;
    coordinates: number[];
  };
  context: {
    id: string;
    wikidata: string;
    short_code: string;
    text: string;
  }[];
}

interface MapboxPlacesResponse {
  type: string;
  query: string[];
  features: Feature[];
  attribution: string;
}

router.get('/places-search', async (req, res) => {
  const { q } = req.query;
  const url = `${mapboxBaseUrl}/mapbox.places/${q}.json?access_token=${process.env.MAPBOX_ACCESS_TOKEN}`;
  try {
    const { data } = await axios.get<MapboxPlacesResponse>(url);
    return res.json({
      success: true,
      places: data.features.map((feature) => {
        return {
          id: feature.id,
          text: feature.text,
          placeName: feature.place_name,
        };
      }),
    });
  } catch (error) {
    return res.json({
      success: false,
      places: [],
    });
  }
});

export default router;
