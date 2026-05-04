import React from 'react';
import { ImageIcon } from 'lucide-react';

export function DocumentCard({ label, imageUrl, onImageClick }) {
  return (
    <div className="group relative bg-gray-50 rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
      <div
        className={`aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden ${imageUrl ? 'cursor-pointer' : ''}`}
        onClick={() => imageUrl && onImageClick && onImageClick(imageUrl)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`${imageUrl ? "hidden" : "flex"} flex-col items-center justify-center gap-2 text-gray-300`}
          style={imageUrl ? { display: "none" } : {}}
        >
          <ImageIcon className="w-10 h-10" />
          <span className="text-xs font-medium">No image</span>
        </div>
      </div>
      <div className="px-3 py-2.5 border-t border-gray-100 bg-white">
        <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-400">{label}</p>
      </div>
    </div>
  );
}
