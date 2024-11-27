import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container px-4 py-6 md:py-8 mx-auto">
        <div className="text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} News Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}