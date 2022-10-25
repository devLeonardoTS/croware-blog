/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		// loader: "cloudinary",
		// path: "https://res.cloudinary.com/devlts/image/fetch/",
		domains: ["res.cloudinary.com"],
	},
};

module.exports = nextConfig;
