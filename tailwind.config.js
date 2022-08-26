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
	},
	plugins: [require("flowbite/plugin"), require("@tailwindcss/line-clamp")],
};
