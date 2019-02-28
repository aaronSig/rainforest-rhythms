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
  id: number;
  gbif_key: number;
}

export interface Site {
  site_name: string;
  habitat: string;
  short_desc: string;
  longitude: number;
  latitude: number;
  id: number;
  n_audio: number;
}

export interface SiteInfo {
  long_desc: string;
  site_name: string;
  habitat: string;
  image: string;
  short_desc: string;
  longitude: number;
  latitude: number;
  id: number;
  window_counts: number[];
}

export interface StreamInfo {
  date: string;
  audio: number;
  site: number;
  box_id: string;
  time: string;
}

export interface AccessToken {
  access_token: string;
  expires_in: number;
}

export type HabitatName = string;
export type RecorderType = string;
