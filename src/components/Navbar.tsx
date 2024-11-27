import React from 'react';
import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';

const categories = ['Nogomet', 'Košarka', 'Tenis', 'Formula 1'];

export function Navbar() {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Newspaper className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SportNews</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/category/${category.toLowerCase()}`}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}