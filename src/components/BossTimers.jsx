import React, { useState, useEffect } from "react";

export default function CountdownTimers() {
  // Convert MM:SS to total seconds
  const convertToSeconds = (mmss) => {
    const [minutes, seconds] = mmss.split(":").map(Number);
    return minutes * 60 + seconds;
  };
  // Default 15 min
  const [timeInput, setTimeInput] = useState("15:00");
  // 6 timers - 15 min default time
  const [timers, setTimers] = useState(
    Array(6).fill({ time: convertToSeconds(timeInput), isRunning: false })
  );

  // Handle input change in MM:SS format
  const handleTimeChange = (event) => {
    setTimeInput(event.target.value);
  };

  // Format seconds to MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  // Start a specific timer
  const startTimer = (index) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer, i) =>
        i === index
          ? { ...timer, time: convertToSeconds(timeInput), isRunning: true }
          : timer
      )
    );
  };

  // Reset a specific timer
  const resetTimer = (index) => {
    setTimers((prevTimers) =>
      prevTimers.map((timer, i) =>
        i === index ? { ...timer, time: 0, isRunning: false } : timer
      )
    );
  };

  // Decrease the timers every second when running
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) =>
        prevTimers.map((timer) =>
          timer.isRunning && timer.time > 0
            ? { ...timer, time: timer.time - 1 }
            : timer
        )
      );
    }, 1000);

    // Cleanup interval when component unmounts or when stopped
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>
        <h1>Metin2 Boss Timer</h1>
        <label htmlFor="timeInput">Time (MM:SS):</label>
        <input
          type="text"
          id="timeInput"
          value={timeInput}
          onChange={handleTimeChange}
          pattern="\d{2}:\d{2}"
          placeholder="MM:SS"
        />
      </div>

      <div id="timers">
        {timers.map((timer, index) => (
          <div key={index} className="timer-window">
            <h3>CH{index + 1}</h3>
            <p>{formatTime(timer.time)} remaining</p>
            <button onClick={() => startTimer(index)}>Start Timer</button>
            <button onClick={() => resetTimer(index)}>Reset Timer</button>
          </div>
        ))}
      </div>
    </>
  );
}
