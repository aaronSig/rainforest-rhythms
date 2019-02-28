export const UPDATE_AUDIO_CONTROL_PROGRESS = "UPDATE_AUDIO_CONTROL_PROGRESS";
export function updateAudioControlProgress(progress: number) {
  return {
    type: UPDATE_AUDIO_CONTROL_PROGRESS,
    item: {
      progress
    }
  };
}

export const COMMIT_AUDIO_CONTROL_PROGRESS = "COMMIT_AUDIO_CONTROL_PROGRESS";
export function commitAudioControlProgress() {
  // probably throw another event here
  return {
    type: COMMIT_AUDIO_CONTROL_PROGRESS
  };
}
