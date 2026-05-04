import React from "react";
import { XCircle } from "lucide-react";

export default function ImagePreview({ previewImage, setPreviewImage }) {
    if (!previewImage) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setPreviewImage(null)}
        >
            <div className="relative max-w-5xl w-full flex items-center justify-center">
                <button
                    onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
                    className="absolute -top-12 right-0 md:-right-12 md:-top-12 p-2 text-white hover:text-gray-300 transition-colors"
                >
                    <XCircle className="w-8 h-8" />
                </button>
                <img
                    src={previewImage}
                    alt="Preview"
                    className="max-w-full max-h-[90vh] object-contain rounded-xl bg-white p-4 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
}
