import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, CATEGORY_NAMES } from '../config/constants';

const leftCategories = [
  CATEGORIES.VIJESTI,
  CATEGORIES.SVIJET,
  CATEGORIES.REGIJA,
  CATEGORIES.CRNA_KRONIKA
];

const rightCategories = [
  CATEGORIES.SPORT,
  CATEGORIES.LIFESTYLE,
  CATEGORIES.MAGAZIN,
  CATEGORIES.ZDRAVLJE
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const menuButton = document.getElementById('menuButton');
      const mobileMenu = document.getElementById('mobileMenu');
      
      if (isMenuOpen && 
          menuButton && 
          mobileMenu && 
          !menuButton.contains(e.target as Node) && 
          !mobileMenu.contains(e.target as Node)) {
        setIsMenuOpen(false);
        document.body.style.overflow = '';
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Mobile Nav */}
        <nav className="lg:hidden flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="text-primary">brzi</span>
            <span className="text-secondary">.info</span>
          </Link>

          <button 
            className="text-gray-600 hover:text-primary p-2 focus:outline-none" 
            aria-label="Toggle menu"
            id="menuButton"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 ${isMenuOpen ? 'hidden' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16m-7 6h7" 
              />
            </svg>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 ${!isMenuOpen ? 'hidden' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div id="mobileMenu" className={`${isMenuOpen ? '' : 'hidden'} lg:hidden`}>
          <div className="py-4 border-t">
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {[...leftCategories, ...rightCategories].map((category) => (
                <Link 
                  key={category}
                  to={`/${category}`}
                  className="text-gray-600 hover:text-primary py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {CATEGORY_NAMES[category]}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex justify-between items-center h-16 border-t">
          {/* Left Categories */}
          <div className="flex space-x-6 items-center">
            {leftCategories.map((category) => (
              <Link 
                key={category}
                to={`/${category}`}
                className="text-gray-600 hover:text-primary"
              >
                {CATEGORY_NAMES[category]}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center">
            <span className="text-primary">brzi</span>
            <span className="text-secondary">.info</span>
          </Link>

          {/* Right Categories */}
          <div className="flex space-x-6 items-center">
            {rightCategories.map((category) => (
              <Link 
                key={category}
                to={`/${category}`}
                className="text-gray-600 hover:text-primary"
              >
                {CATEGORY_NAMES[category]}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}