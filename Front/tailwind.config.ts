import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
        'xLarge': '2170px',
        'Large' : '1500px',
        'xMedium': '1179px',
        'medium': '780px',
        'sm': '640px',
        'md': '768px',
        'lg':'1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // 'medium': '570px'
        
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
    require("tailwind-scrollbar-hide"),
  ],
}
export default config
