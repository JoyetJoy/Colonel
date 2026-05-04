import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, onSubmit, title, children, maxWidth = "max-w-2xl" }) {
  if (!isOpen) return null;

  const content = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-xl shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-6 overflow-y-auto flex-1">
        {children}
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 h-screen backdrop-blur-sm pointer-events-auto">
      <div
        className={`bg-white rounded-xl shadow-lg w-full ${maxWidth} max-h-screen flex flex-col animate-in fade-in zoom-in duration-200 pointer-events-auto`}
        onClick={e => e.stopPropagation()}
      >
        {onSubmit ? (
          <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
            {content}
          </form>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}
