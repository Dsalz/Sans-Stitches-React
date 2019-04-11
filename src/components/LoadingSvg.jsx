import React from "react";

/**
 * @description svg to depict loading state component
 * @returns {HTMLSvgElement} svg
 */
const LoadingSvg = () => (
  <div className="loading-svg-div" id="loading-svg-div">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className="lds-rolling"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        ng-attr-stroke="{{config.color}}"
        ng-attr-stroke-width="{{config.width}}"
        ng-attr-r="{{config.radius}}"
        ng-attr-stroke-dasharray="{{config.dasharray}}"
        stroke="#d81e5b"
        strokeWidth="10"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138"
        transform="rotate(308.372 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
          dur="0.7s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </div>
);

export default LoadingSvg;
