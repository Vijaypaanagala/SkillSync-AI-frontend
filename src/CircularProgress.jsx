import React from "react";

const CircularProgress = ({ progress, size = 120, strokeWidth = 8, getColor }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className="score-circle-svg">
      {/* Background Circle */}
      <circle
        stroke="#ddd"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      {/* Progress Circle */}
      <circle
        stroke={getColor(progress)}
        fill="transparent"
        strokeWidth={strokeWidth}
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        // 🚫 Removed transition to avoid laggy updates
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
        }}
      />
      {/* Percentage Text */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={size / 3.5}
        fontWeight="bold"
        fill={getColor(progress)}
      >
        {Math.round(progress)}%
      </text>
    </svg>
  );
};

export default CircularProgress;
