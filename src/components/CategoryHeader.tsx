import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryHeaderProps {
  categoryDisplayName: string;
}

export function CategoryHeader({ categoryDisplayName }: CategoryHeaderProps) {
  return (
    <>
      <div className="bg-white p-3 md:p-4 rounded-sm shadow-sm mb-4 md:mb-6">
        <div className="flex items-center text-sm">
          <Link to="/" className="text-primary hover:text-secondary">Home</Link>
          <span className="mx-2 text-gray-500">/</span>
          <span className="text-gray-600">{categoryDisplayName}</span>
        </div>
      </div>

      <div className="flex items-center mb-6 md:mb-8 gap-4 md:gap-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary shrink-0">{categoryDisplayName}</h1>
        <div className="h-0.5 bg-gray-200 w-full"></div>
      </div>
    </>
  );
}