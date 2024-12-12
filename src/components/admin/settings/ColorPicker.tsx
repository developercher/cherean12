'use client';
import { useState } from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export default function ColorPicker({ color, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    '#ff014f', '#00ff00', '#0000ff', '#ff0000',
    '#ffff00', '#00ffff', '#ff00ff', '#000000',
    '#ffffff', '#808080'
  ];

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div
          className="w-10 h-10 rounded-lg cursor-pointer border border-gray-300"
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(!isOpen)}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
        />
      </div>

      {isOpen && (
        <div className="absolute mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 z-10">
          <div className="grid grid-cols-5 gap-2">
            {presetColors.map((presetColor) => (
              <div
                key={presetColor}
                className="w-8 h-8 rounded-lg cursor-pointer border border-gray-300"
                style={{ backgroundColor: presetColor }}
                onClick={() => {
                  onChange(presetColor);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 