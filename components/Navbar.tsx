import React, { useEffect } from "react";
import NavLinks from "./constants/NavLinks";
import dftStyles from "./Navbar.module.css";
import { BiMenu } from "react-icons/bi";
import { OptStyles } from "../@types/styling-types";
import { StyleHandler } from "../helpers/styling-utils";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { IMG_CROWARE_LOGO } from "../helpers/constants/assetUrls";
// import useWindowSize from "../hooks/useWindowSize";
// import useBreakpoints from "../hooks/useBreakpoints";

type NavbarStyles = {
	[key: string]: string | undefined;
	container?: string;
	logoLink?: string;
	linkList?: string;
	menuContainer?: string;
	menuBtn?: string;
};

type NavbarProps = {
	optStyles?: OptStyles<NavbarStyles>;
};

export default function Navbar({ optStyles }: NavbarProps) {
	const styles: NavbarStyles = StyleHandler({
		default: dftStyles,
		optional: optStyles,
	});

	const router = useRouter();
	// const
	// console.log("asPath: ", router.asPath.split("/"));
	// console.log("pathName: ", router.pathname);

	// const winSize = useWindowSize();
	// const winBps = useBreakpoints();

	return (
		<nav className={styles.container || undefined}>
			<Link href={"/"} className={styles.logoLink || undefined}>
				<a className={styles.logoImg}>
					<Image
						src={IMG_CROWARE_LOGO}
						width={"100%"}
						height={28}
						alt="Croware's Logo"
					/>
				</a>
			</Link>
			<NavLinks
				dftStyles={{
					linkList: styles.linkList,
				}}
			/>
			<div className={styles.menuContainer || undefined}>
				<p className={styles.activeLink}></p>
				<button className={styles.menuBtn || undefined}>
					<BiMenu />
				</button>
			</div>
		</nav>
	);
}
