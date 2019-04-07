export interface Status {
  n_sites: number;
  last_scan: string;
  n_audio: number;
}

export interface Taxon {
  taxon_class: string;
  scientific_name: string;
  taxon_rank: string;
  common_name: string;
  id: string;
  gbif_key: string;
  image: TaxonImage;
  audio: TaxonAudio;
}

export interface TaxonImage {
  // The URL for the image. Either the gbif_media_identifier or a link to our ShutterStock image
  media_url: string;
  // Taken from the gbif occurrence. Both of the below can be null if we're using a stock image
  gbif_rights_holder: string | null;
  // The url to the page in GBIF for this occurrence
  gbif_occurrence_key: string | null;
}

export interface TaxonAudio {
  // The url to the page in GBIF for this occurrence
  gbif_occurrence_key: string;
  // url for the  sound
  gbif_media_identifier: string;
  // if the recording is a song, call or of both
  gbif_occurrence_behavior: string;
  // The image copyright owner. Taken from the gbif occurrence.
  gbif_rights_holder: string;
}

// an object merging the taxon data with info on when its seen
export interface TaxonWithPresence extends Taxon {
  // A flag denoting if this animal is ususally present at
  // the currently focused time.
  seenAtThisTime: boolean;
}

export interface Site {
  site_name: string;
  habitat: string;
  short_desc: string | null;
  longitude: number;
  latitude: number;
  id: string;
  n_audio: number;
  // Maps the time to the url returned from get_site_image
  photo: { [key in TimeSegment]: string };
}

export interface SiteInfo {
  long_desc: string | null;
  site_name: string;
  habitat: string;
  image: string;
  short_desc: string | null;
  longitude: number;
  latitude: number;
  id: string;
  window_counts: number[];
}

export interface StreamInfo {
  date: string;
  audio: string;
  site: string;
  box_id: string;
  time: string;
}

export type AccessToken = string;
export type HabitatName = string;
export type RecorderType = string;

// MEGA API response.
export interface MegaResponse {
  // all of the recorder sites
  sitesById: { [key: string]: Site };

  // All the audio the app will need. This is a map with the audio ID
  // as it’s key. (This can come in an array if easier.)
  // The app will work out which site/ time to load.
  // This could either be one clip per hour or one clip each 20 minutes. If the former
  // is used then I'll use the next/previous buttons on the waveform to search for the next audio piece
  siteAudioByAudioId: { [siteId: string]: StreamInfo[] };

  // All of the species data. Filter out any that don't have an image
  taxaById: { [taxonId: string]: Taxon };

  // Ids of all the taxa available at a site
  taxaIdBySiteId: { [siteId: string]: string[] };

  /***
   * Ids of taxa spotted at a particular time at a site
   *
   * so:
   * {
   *    siteId: {
   *        TimeSegment: [taxaId, taxaId, taxaId]
   *    }
   * }
   */
  taxaIdBySiteIdByTime: { [siteId: string]: { [timeSegment in TimeSegment]: string[] } };
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
