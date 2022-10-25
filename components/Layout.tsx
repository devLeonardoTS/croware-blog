import React, { ReactNode } from "react";
import dftStyles from "./Layout.module.css";

import Footer from "./Footer";
import Script from "next/script";
import NavBar from "./navigation/NavBar";

type LayoutProps = {
	children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
	return (
		<div className={dftStyles.container}>
			<NavBar />
			{children}
			<Footer />

			<Script
				type="text/javascript"
				src="/scripts/dompurify/dist/purify.min.js"
			></Script>
			<Script src="/scripts/flowbite/dist/flowbite.js" />
		</div>
	);
}

export default Layout;
