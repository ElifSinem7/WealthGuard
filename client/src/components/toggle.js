import React from "react";

const Toggle = ({ checked, onChange }) => {
  return (
    <div className="relative inline-block w-12 align-middle select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <div
        className={`block w-12 h-6 rounded-full ${
          checked ? "accent-bg" : "bg-gray-300"
        }`}
      ></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform ${
          checked ? "translate-x-6" : ""
        }`}
      ></div>
    </div>
  );
};

export default Toggle;
