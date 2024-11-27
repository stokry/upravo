/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#8b1852',
        secondary: '#a65d82',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1200px'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#1f2937',
            h1: {
              fontWeight: '700',
              fontSize: '2.25rem',
              marginTop: '2rem',
              marginBottom: '1rem'
            },
            h2: {
              fontWeight: '700',
              fontSize: '1.875rem',
              marginTop: '1.75rem',
              marginBottom: '0.75rem'
            },
            h3: {
              fontWeight: '600',
              fontSize: '1.5rem',
              marginTop: '1.5rem',
              marginBottom: '0.75rem'
            },
            h4: {
              fontWeight: '600',
              fontSize: '1.25rem',
              marginTop: '1.25rem',
              marginBottom: '0.5rem'
            },
            p: {
              marginTop: '1rem',
              marginBottom: '1rem'
            },
            a: {
              color: '#8b1852',
              '&:hover': {
                color: '#a65d82'
              }
            },
            'ul > li': {
              paddingLeft: '1.5rem',
              '&::before': {
                backgroundColor: '#8b1852'
              }
            },
            blockquote: {
              borderLeftColor: '#8b1852',
              fontStyle: 'italic'
            }
          }
        }
      }
    }
  },
  plugins: [],
};