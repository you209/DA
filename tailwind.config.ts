import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        calm: {
          50: '#f2fbfa',
          100: '#def5f3',
          600: '#0f766e'
        }
      }
    }
  },
  plugins: []
};

export default config;
