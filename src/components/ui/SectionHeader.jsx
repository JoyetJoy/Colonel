import React from 'react';

export function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
    </div>
  );
}
