/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["res.cloudinary.com"],
	},
	env: {
		NEXT_PUBLIC_MAIN_API_BASEURL: process.env.NEXT_PUBLIC_MAIN_API_BASEURL,
	},
};

module.exports = nextConfig;
