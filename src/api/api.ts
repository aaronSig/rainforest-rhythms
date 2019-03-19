import "whatwg-fetch";
import { TaxonAudio, TaxonImage } from "../state/types";
import {
  AccessToken,
  HabitatName,
  RecorderType,
  Site,
  SiteInfo,
  Status,
  StreamInfo,
  Taxon
} from "./types";

const isServer = !window.location.href.includes("://localhost");
const prefix = isServer ? "/api" : "";

// const host = "https://davidorme.pythonanywhere.com";
const base = `${prefix}/call/json/`;

async function get(
  path: string | (string | number | undefined)[],
  defaultResult: any | null = null,
  basePath: string = base
): Promise<any | null> {
  let p = path;
  if (path instanceof Array) {
    p = path.filter(t => t !== undefined).join("/");
  }
  // -- when in the server contex
  // const req = await fetch(`/api/${basePath}${p}`);

  const req = await fetch(`${basePath}${p}`);
  if (req.ok) {
    return await req.json();
  }
  console.error("Error fetching", path, req.status, req.statusText);
  return defaultResult;
}

export default {
  async getStatus(): Promise<Status | null> {
    return await get("get_status");
  },

  sites: {
    async list(): Promise<Site[]> {
      return (await get("get_sites", [])).map(idsToString);
    },
    async get(siteId: number): Promise<SiteInfo> {
      return idsToString(await get("get_site", [siteId]));
    },

    /***
     * Gets an image for this site at this time
     */
    async imageUrl(time: number, siteId: string): Promise<string | null> {
      const image = await get(["get_site_image", siteId, time], null);
      console.log("habitatPhoto imageUrl image", image, time, siteId);
      return image;
    }
  },

  streams: {
    async search(siteId: string, time: number, shuffle?: boolean): Promise<StreamInfo | null> {
      return idsToString(await get(["stream_get", siteId, time, shuffle ? "1" : undefined]));
    },
    async info(streamId: string | number): Promise<StreamInfo | null> {
      return idsToString(await get(["stream_play", streamId]));
    },
    /**
     * takes an audio file id and returns the same standard set of information for the next track along.
     * @param streamId
     */
    async next(streamId: string): Promise<StreamInfo | null> {
      return idsToString(await get(["stream_next", streamId]));
    },
    async accessToken(): Promise<AccessToken | null> {
      return await get("get_dl_access_token");
    },
    /***
     * Get the link to the mp3. Will handle refreshing the access token if needed
     */
    async audioStream(boxId: string): Promise<string | null> {
      const token = await this.accessToken();
      if (!token) {
        return null;
      }
      return `https://dl.boxcloud.com/api/2.0/files/${boxId}/content?access_token=${
        token.access_token
      }`;
    }
  },

  habitats: {
    async get(): Promise<HabitatName[]> {
      return await get(["get_habitats"], []);
    }
  },

  recorderTypes: {
    async get(): Promise<RecorderType[]> {
      return await get(["get_recorder_types"], []);
    }
  },

  taxa: {
    async get(siteId: number | string, time?: number): Promise<Taxon[]> {
      return (await get(["get_taxa", siteId, time], [])).map(idsToString);
    },
    async image(taxonId: string): Promise<TaxonImage | null> {
      const result = (await get(["get_taxon_image", taxonId], null)) as TaxonImage | null;
      if (result) {
        result.taxon_id = taxonId;
      }
      return result;
    },
    async audio(taxonId: string): Promise<TaxonAudio[]> {
      let results = (await get(["get_taxon_sounds", taxonId], [])) as TaxonAudio[];
      if (results) {
        results.forEach(r => (r.taxon_id = taxonId));
      }
      return results;
    }
  },

  geoJson: {
    async streams(): Promise<GeoJSON.GeoJsonObject> {
      return await get(`${prefix}/rainforest_rhythms/static/geojson/stream_data.geojson`, null, "");
    },
    async habitats(): Promise<GeoJSON.GeoJsonObject> {
      return await get(`${prefix}/static/geojson/map_data.geojson`, null, "");
    }
  }
};

// The IDs from the api come in as numbers which Maps in ImmutableJS don't like
function idsToString(obj: any) {
  if (obj === null) {
    return;
  }
  if ("id" in obj) {
    obj.id = `${obj.id}`;
  }
  if ("gbif_key" in obj) {
    obj.gbif_key = `${obj.gbif_key}`;
  }
  if ("audio" in obj) {
    obj.audio = `${obj.audio}`;
  }
  if ("site" in obj) {
    obj.site = `${obj.site}`;
  }
  return obj;
}
