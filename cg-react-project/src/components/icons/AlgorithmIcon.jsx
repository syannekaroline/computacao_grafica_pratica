import React from 'react';

function AlgorithmIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={size} height={size} style={{ fill: color }}>
      <path d="M22 16L14 2l-3.52 6.16A7 7 0 1 0 15.92 16zM6 16.22L18.44 14h-2.52a7 7 0 0 0-3.46-5.08zM11.46 9.65A5 5 0 0 1 13.9 14H9.56zM9 20a5 5 0 0 1 0-10h.41L6 16h7.9A5 5 0 0 1 9 20z" />
    </svg>
  );
}

export default AlgorithmIcon;