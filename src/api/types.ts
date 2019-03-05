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
}

export interface Site {
  site_name: string;
  habitat: string;
  short_desc: string | null;
  longitude: number;
  latitude: number;
  id: string;
  n_audio: number;
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

export interface AccessToken {
  access_token: string;
  expires_in: number;
}

export type HabitatName = string;
export type RecorderType = string;
