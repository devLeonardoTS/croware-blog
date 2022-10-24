import { Divider, SwipeableDrawer, SwipeableDrawerProps } from "@mui/material";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

import Assets from "../../helpers/constants/Assets";
import { NavLinkType } from "../../stores/NavigationStorage";
import useUserSession, { SessionAuthor } from "../../stores/UserSessionStore";
import DrawerSignInForm from "./DrawerSignInForm";
import DrawerUserInfo from "./DrawerUserInfo";
import dftStyles from "./NavDrawer.module.css";
import NavDrawerHeader from "./NavDrawerHeader";
import NavLinksAccordion from "./NavLinksAccordion";

type NavDrawerProps = {
	isOpen: boolean;
	toggleDrawer: (status: boolean) => Promise<void> | void;
	links: NavLinkType[];
	currentLink: NavLinkType;
	drawerProps?: SwipeableDrawerProps;
};

const authorDefaults: SessionAuthor = {
	id: "",
	name: "Author's name",
	bio: "Author's bio",
	banner: "",
	picture: "",
	slug: "",
};

const NavDrawer = ({
	isOpen,
	toggleDrawer,
	links,
	currentLink,
	drawerProps,
}: NavDrawerProps) => {
	const authStatus = useUserSession(s => s.status);
	const authorData = useUserSession(s => s.author);
	const signInHandler = useUserSession(s => s.signIn);
	const signOutHandler = useUserSession(s => s.signOut);

	const [isLinksOpen, setLinksOpen] = useState(true);
	const [isAuthFormOpen, setAuthOpen] = useState(false);
	const [isAuthenticated, setAuthenticated] = useState(false);
	const [author, setAuthor] = useState<SessionAuthor>(authorDefaults);

	const toggleLinks = (status: boolean) => {
		setLinksOpen(status);
	};

	useEffect(() => {
		// Fix for SSR vs. CSR.
		setAuthenticated(authStatus === "authenticated");
	}, [authStatus]);

	useEffect(() => {
		// Fix for SSR vs. CSR.
		setAuthor(authorData || authorDefaults);
	}, [authorData]);

	return (
		<SwipeableDrawer
			anchor="right"
			classes={{
				paper: dftStyles.container,
			}}
			{...drawerProps}
			open={isOpen}
			onOpen={() => toggleDrawer(true)}
			onClose={() => toggleDrawer(false)}
			disableDiscovery
			disableSwipeToOpen
			disableBackdropTransition
		>
			<div className={dftStyles.content}>
				<div className={dftStyles.head}>
					<div className={dftStyles.userContainer}>
						<NavDrawerHeader
							bannerSrc={author.banner || Assets.placeholder.profile.banner}
							avatarSrc={author.picture || Assets.placeholder.profile.picture}
							toggleDrawer={toggleDrawer}
							toggleAuthForm={() => setAuthOpen(!isAuthFormOpen)}
							currentLink={currentLink}
							isAuthFormOpen={isAuthFormOpen}
							isAuthenticated={isAuthenticated}
						/>
						{isAuthFormOpen && !isAuthenticated && (
							<DrawerSignInForm signInHandler={signInHandler} />
						)}
						{isAuthenticated && (
							<DrawerUserInfo
								user={author.name}
								signOutHandler={() => {
									const isAllowed = confirm("Tem certeza que deseja sair?");
									if (!isAllowed) {
										return;
									}
									setAuthOpen(false);
									signOutHandler();
								}}
							/>
						)}
					</div>
				</div>

				<Divider />

				<nav className={dftStyles.body}>
					<ul className={dftStyles.accordionMenu}>
						<li key={nanoid()} className={dftStyles.accordion}>
							<NavLinksAccordion
								isOpen={isLinksOpen}
								toggleAccordion={toggleLinks}
								links={links}
								current={currentLink}
							/>
						</li>
					</ul>
				</nav>

				<Divider />

				<div className={dftStyles.footer}>
					<div className={dftStyles.extraInfo}>
						<small>{"Croware version 0.0.0.1"}</small>
					</div>
				</div>
			</div>
		</SwipeableDrawer>
	);
};

export default NavDrawer;
