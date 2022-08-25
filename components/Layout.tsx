import React, { ReactNode } from "react";
import dftStyles from "./Layout.module.css";

import Navbar from "./Navbar";
import Footer from "./Footer";
import Script from "next/script";

type LayoutProps = {
	children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
	return (
		<div className={dftStyles.container}>
			<Navbar />
			{children}
			<Footer />

			<Script src="./scripts/flowbite/dist/flowbite.js" />
		</div>
	);
}

export default Layout;
