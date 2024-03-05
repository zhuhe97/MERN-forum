/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				'sea-green': {
					50: '#f1f8f3',
					100: '#ddeedf',
					200: '#bdddc3',
					300: '#91c49e',
					400: '#62a575',
					500: '#45925d',
					600: '#2f6c43',
					700: '#255737',
					800: '#20452e',
					900: '#1b3926',
					950: '#0e2016',
				},
			},
		},
	},
	plugins: [],
};
