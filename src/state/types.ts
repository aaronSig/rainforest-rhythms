import { Map, Set } from "immutable";
import { Site, StreamInfo, Taxon } from "../api/types";

export interface TaxonImage {
  taxon_id: string;
  // The url to the page in GBIF for this occurrence
  gbif_occurrence_key: string;
  // The URL for the image
  gbif_media_identifier: string;
}

export interface TaxonAudio {
  taxon_id: string;
  // The url to the page in GBIF for this occurrence
  gbif_occurrence_key: string;
  // url for the  sound
  gbif_media_identifier: string;
  // if the recording is a song, call or of both
  gbif_occurrence_behavior: string;
}

// an object merging the taxon data with its images and audio when they're loaded
export interface TaxonWithMedia extends Taxon {
  audio: TaxonAudio[];
  image: TaxonImage;
  // A flag denoting if this animal is ususally present at
  // the currently focused time.
  seenAtThisTime: boolean;
}

export interface State {
  loading: number; // a number larger than 1 means something is loading

  sunrise: TimeSegment; // "06:00"
  sunset: TimeSegment; // "18:00"

  // The features we're showing on the map
  habitatData: GeoJSON.GeoJsonObject | null; //  ++done
  streamData: GeoJSON.GeoJsonObject | null; //  ++done

  // each of the recorder sites
  sitesById: Map<string, Site>; //  ++done

  // a cache of the audio info we've fetched from the server.
  // This is used to constuct a map of {TimeSegment: StreamInfo[]}
  siteAudioByAudioId: Map<string, StreamInfo>;

  // We cache all the organisms that the API passes
  taxaById: Map<string, Taxon>; //  ++done

  // Ids of all the taxa available at a site
  taxaIdBySiteId: Map<string, Set<string>>; //  ++done

  // Ids of taxa spotted at a particular time at a site
  taxaIdBySiteIdByTime: Map<string, Map<TimeSegment, Set<string>>>; //  ++done

  // If there is audio available for an animal you can look it up by it's ID here
  taxaAudioById: Map<string, TaxonAudio[]>;

  // Simiar as the audio but for images.
  taxaImageById: Map<string, TaxonImage>;

  // User's focus a site by clicking on it from the map
  focusedSiteId: string | null; //  ++done

  // The time of day the user has selected
  focusedTimeSegment: TimeSegment; //  ++done

  // The id for the currently showing animal in the info pane
  focusedTaxonId: string | null; //  ++done

  // the currently loaded / playing audio for the site
  currentSiteAudioId: string | null; //  ++done
  requestedTimestamp: number | null; // this is the timestamp the user requested in the url

  // Audio states
  siteAudio: SiteAudioState;
  taxonAudio: TaxonAudioState;
}

export interface SiteAudioState {
  url: string | null;
  loadedPercent: number;
  isReady: boolean;
  isPlaying: boolean;
  isFinished: boolean;
  shouldPlay: boolean;
  timestamp: number;
}

export interface TaxonAudioState {
  audioInfo: TaxonAudio | null;
  isReady: boolean;
  isPlaying: boolean;
  // the audio has finished playing
  isFinished: boolean;
  // instruct the audio to play, if it can.
  shouldPlay: boolean;
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

// These need to be in order
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
