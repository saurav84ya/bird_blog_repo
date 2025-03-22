import React from "react";

const Input = ({ type, value, onChange, name, label, placeholder }) => {
  return (
    <div className="space-y-1  ">
      <label className="ml-5" >{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        className="w-full bg-[#1E3035] p-3 mt-3 rounded-lg"
      />
    </div>
  );
};

export default Input;
