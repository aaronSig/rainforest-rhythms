import { Map, Set } from "immutable";
import { State } from "../types";

export function createTestState(item: { [key in keyof State]?: any }): State {
  return Object.assign({}, standardState, item);
}

// some test data to use
// Here some of the data has been loaded and audio for the first site is playing
export const standardState: State = {
  sunrise: "06:00",
  sunset: "18:00",
  habitatData: null,
  streamData: null,
  sitesById: Map({
    "1": {
      site_name: "E100 edge",
      habitat: "Logged Fragment",
      short_desc: null,
      longitude: 117.58604,
      latitude: 4.68392,
      id: "1",
      n_audio: 3200
    },
    "2": {
      site_name: "D100 641",
      habitat: "Logged Fragment",
      short_desc: null,
      longitude: 117.58753,
      latitude: 4.71129,
      id: "2",
      n_audio: 174
    },
    "3": {
      site_name: "F100 641",
      habitat: "Logged Fragment",
      short_desc: null,
      longitude: 117.18753,
      latitude: 3.71129,
      id: "3",
      n_audio: 17
    }
  }),
  siteAudioByAudioId: {
    "3086": {
      date: "2018-12-29",
      audio: "3086",
      site: "1",
      box_id: "375191015341",
      time: "10:21:03"
    },
    "9288": {
      date: "2018-12-02",
      audio: "9288",
      site: "1",
      box_id: "360444602939",
      time: "21:30:53"
    },
    "20132": {
      date: "2018-10-23",
      audio: "20132",
      site: "2",
      box_id: "336903525515",
      time: "08:21:12"
    },
    "20683": {
      date: "2018-10-19",
      audio: "20683",
      site: "3",
      box_id: "334836651816",
      time: "18:21:14"
    }
  },
  taxaById: Map({
    "1": {
      taxon_class: "Aves",
      scientific_name: "Macronus ptilosus",
      taxon_rank: "SPECIES",
      common_name: "Fluffy-backed Tit-Babbler",
      id: "1",
      gbif_key: "6100830"
    },
    "2": {
      taxon_class: "Aves",
      scientific_name: "Psilopogon duvaucelii",
      taxon_rank: "SPECIES",
      common_name: "Blue-eared Barbet",
      id: "2",
      gbif_key: "7885381"
    },
    "20": {
      taxon_class: "Aves",
      scientific_name: "Orthotomus atrogularis",
      taxon_rank: "SPECIES",
      common_name: "Dark-necked Tailorbird",
      id: "20",
      gbif_key: "2493033"
    },
    "5": {
      taxon_class: "Aves",
      scientific_name: "Macronus bornensis",
      taxon_rank: "SPECIES",
      common_name: "Bold-striped Tit-Babbler",
      id: "5",
      gbif_key: "6100833"
    }
  }),
  taxaIdBySiteId: Map({
    "1": Set(["1", "2"]),
    "3": Set(["20", "5"])
  }),
  taxaIdBySiteIdByTime: Map({
    "1": Map({
      "10:00": Set(["1"]),
      "11:00": Set(["1", "2"])
    }),
    "3": Map({
      "09:00": Set(["20"]),
      "14:00": Set(["5"])
    })
  }) as any,
  taxaAudioById: {
    "2493033": ["example.com/dark-necked-tailorbird.mp3"],
    "6100833": ["example.com/bold-striped-tit-babbler.mp3"]
  },
  taxaImageById: {
    "2493033": ["example.com/dark-necked-tailorbird.jpeg"],
    "6100833": ["example.com/bold-striped-tit-babbler.png"]
  },
  focusedSiteId: "1",
  focusedTimeSegment: "10:00",
  focusedTaxonId: "1",
  currentSiteAudioId: "3086",
  siteAudio: {
    progress: 0.5,
    timestamp: 12.43,
    duration: 19.52,
    isLoaded: true,
    isPlaying: true,
    isFinished: false
  },
  taxonAudio: {
    progress: 0,
    timestamp: 0,
    duration: 0.16,
    isLoaded: true,
    isPlaying: false,
    isFinished: false
  }
};

test("Has State", () => {
  expect(standardState).toEqual(createTestState({}));
});
