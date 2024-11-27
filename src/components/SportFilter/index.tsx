import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { SPORT_CATEGORIES } from '../../config/constants';

export function SportFilter() {
  const { sport } = useParams<{ sport?: string }>();
  
  return (
    <div className="bg-white shadow-sm rounded-sm mb-6">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Sportske kategorije</h2>
      </div>
      <div className="p-2">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/sport"
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !sport
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Sve
          </Link>
          {Object.entries(SPORT_CATEGORIES).map(([key, value]) => (
            <Link
              key={key}
              to={`/sport/${value.toLowerCase()}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                sport?.toLowerCase() === value.toLowerCase()
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {value}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}