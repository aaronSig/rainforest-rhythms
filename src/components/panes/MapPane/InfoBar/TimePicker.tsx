import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Site } from "../../../../api/types";
import styles from "./TimePicker.module.css";

interface TimePickerProps {
  time: string;
  focusedSite: Site;
  onSearchForAudio: (time: string, siteId: string) => void;
}

// A way to search for a specific time
function TimePicker(props: TimePickerProps) {
  const { time, onSearchForAudio, focusedSite } = props;
  const inputRef = useRef(null as null | HTMLInputElement);
  const [isFocused, setFocused] = useState(false);
  const [isOveridden, setOveridden] = useState(false);
  const [searchTime, setSearchTime] = useState(time);

  useEffect(() => {
    setOveridden(false);
  }, [time]);

  const onChage = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTime(e.target.value);
  };

  const onFocus = () => {
    setSearchTime(time);
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
  };

  const onKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearchForAudio(searchTime, focusedSite.id);
      setOveridden(true);
      inputRef.current!.blur();
    }
  };

  return (
    <div className={styles.TimePicker} onFocus={onFocus} onBlur={onBlur} onChange={onChage}>
      <input
        ref={inputRef}
        type="time"
        value={isFocused || isOveridden ? searchTime : time}
        onKeyPress={onKeyPress}
        required
      />
    </div>
  );
}

export default TimePicker;
