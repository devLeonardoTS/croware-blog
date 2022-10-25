const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{css,js,ts,jsx,tsx}",
		"./components/**/*.{css,js,ts,jsx,tsx}",
	],
	theme: {
		screens: {
			sm: "425px",
			md: "768px",
			lg: "1024px",
			xl: "1440px",
		},
		colors: {
			"clr-primary": "#221f1f",
			"clr-secondary": "#f2f4f4",
			"clr-accent": "#ef4444",
			"clr-info": colors.blue[500],
			"clr-error": colors.red[700],
		},
	},
	plugins: [require("flowbite/plugin"), require("@tailwindcss/line-clamp")],
};
