import "whatwg-fetch";
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

const host = "https://davidorme.pythonanywhere.com";
const base = "/call/json/";

async function get(
  path: string | (string | number | undefined)[],
  defaultResult: any | null = null,
  basePath: string = base
): Promise<any | null> {
  let p = path;
  if (path instanceof Array) {
    p = path.filter(t => t !== undefined).join("/");
  }
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
      return await get("get_sites", []);
    },
    async get(siteId: number): Promise<SiteInfo> {
      return await get("get_site", [siteId]);
    }
  },

  streams: {
    async search(siteId: number, time: number, shuffle?: boolean): Promise<StreamInfo | null> {
      return await get(["stream_get", siteId, time, shuffle ? "1" : undefined]);
    },
    async info(streamId: string | number): Promise<StreamInfo | null> {
      return await get(["stream_play", streamId]);
    },
    /**
     * takes an audio file id and returns the same standard set of information for the next track along.
     * @param streamId
     */
    async next(streamId: string): Promise<StreamInfo | null> {
      return await get(["stream_next", streamId]);
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
      return await get(["get_taxa", siteId, time], []);
    }
  },

  geoJson: {
    async streams(): Promise<GeoJSON.GeoJsonObject> {
      return await get("rainforest_rhythms/static/geojson/stream_data.geojson", null, "");
    },
    async habitats(): Promise<GeoJSON.GeoJsonObject> {
      return await get("static/geojson/map_data.geojson", null, "");
    }
  }
};
