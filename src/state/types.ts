import { Map, Set } from "immutable";
import { Site, StreamInfo, Taxon } from "../api/types";

export type MediaUrl = string;

export interface State {
  sunrise: TimeSegment; // "06:00"
  sunset: TimeSegment; // "18:00"

  // The features we're showing on the map
  habitatData: GeoJSON.GeoJsonObject | null;
  streamData: GeoJSON.GeoJsonObject | null;

  // each of the recorder sites
  sitesById: Map<string, Site>;

  // a cache of the audio info we've fetched from the server.
  // This is used to constuct a map of {TimeSegment: StreamInfo[]}
  siteAudioByAudioId: { [id: string]: StreamInfo };

  // We cache all the organisms that the API passes
  taxaById: Map<string, Taxon>;

  // Ids of all the taxa available at a site
  taxaIdBySiteId: Map<string, Set<string>>;

  // Ids of taxa spotted at a particular time at a site
  taxaIdBySiteIdByTime: Map<string, Map<TimeSegment, Set<string>>>;

  // If there is audio available for an animal you can look it up by it's gbif ID here
  taxaAudioById: { [gbif_key: string]: MediaUrl[] };

  // Simiar as the audio but for images. Again uses the gbif ID
  taxaImageById: { [gbif_key: string]: MediaUrl[] };

  // User's focus a site by clicking on it from the map
  focusedSiteId: string | null;

  // The time of day the user has selected
  focusedTimeSegment: TimeSegment;

  // The id for the currently showing animal in the info pane
  focusedTaxonId: string | null;

  // the currently loaded / playing audio for the site
  currentSiteAudioId: string | null;

  // Audio states
  siteAudio: AudioState;
  taxonAudio: AudioState;
}

export interface AudioState {
  progress: number;
  timestamp: number;
  duration: number;
  isLoaded: boolean;
  isPlaying: boolean;
  // the audio has finished playing
  isFinished: boolean;
}

export type TimeSegment =
  | "01:00"
  | "02:00"
  | "03:00"
  | "04:00"
  | "05:00"
  | "06:00"
  | "07:00"
  | "08:00"
  | "09:00"
  | "10:00"
  | "11:00"
  | "12:00"
  | "13:00"
  | "14:00"
  | "15:00"
  | "16:00"
  | "17:00"
  | "18:00"
  | "19:00"
  | "20:00"
  | "21:00"
  | "22:00"
  | "23:00"
  | "00:00";

export const allTimeSegments: TimeSegment[] = [
  "01:00",
  "02:00",
  "03:00",
  "04:00",
  "05:00",
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
  "22:00",
  "23:00",
  "00:00"
];
Object.freeze(allTimeSegments);
