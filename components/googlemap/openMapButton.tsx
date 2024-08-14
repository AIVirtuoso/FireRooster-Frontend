import React from "react";

interface OpenMapButtonProps {
  address: string;
}

const OpenMapButton: React.FC<OpenMapButtonProps> = ({ address }) => {
  const openMap = () => {
    const formattedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${formattedAddress}`;
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <button style={{ width: "30px", marginLeft: "50px" }} onClick={openMap}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Google Maps"
        role="img"
        viewBox="0 0 512 512"
        fill="#000000"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          {" "}
          <rect width="512" height="512" rx="15%" fill="#ffffff"></rect>{" "}
          <clipPath id="a">
            {" "}
            <path d="M375 136a133 133 0 00-79-66 136 136 0 00-40-6 133 133 0 00-103 48 133 133 0 00-31 86c0 38 13 64 13 64 15 32 42 61 61 86a399 399 0 0130 45 222 222 0 0117 42c3 10 6 13 13 13s11-5 13-13a228 228 0 0116-41 472 472 0 0145-63c5-6 32-39 45-64 0 0 15-29 15-68 0-37-15-63-15-63z"></path>{" "}
          </clipPath>{" "}
          <g stroke-width="130" clip-path="url(#a)">
            {" "}
            <path stroke="#fbbc04" d="M104 379l152-181"></path>{" "}
            <path stroke="#4285f4" d="M256 198L378 53"></path>{" "}
            <path stroke="#34a853" d="M189 459l243-290"></path>{" "}
            <path stroke="#1a73e8" d="M255 120l-79-67"></path>{" "}
            <path stroke="#ea4335" d="M76 232l91-109"></path>{" "}
          </g>{" "}
          <circle cx="256" cy="198" r="51" fill="#ffffff"></circle>{" "}
        </g>
      </svg>
    </button>
  );
  // <button onClick={openMap}>Open Map for {address}</button>;
};

export default OpenMapButton;
