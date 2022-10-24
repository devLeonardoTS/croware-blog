import { Divider, IconButton, Tab, Tabs } from "@mui/material";
import { NextPage } from "next";
import React, { ReactNode, useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";

import AuthorMenuDialog, {
	AuthorMenuDialogCloseHandler,
} from "../../components/dialogs/AuthorMenuDialog";
import ArticleListPanel from "../../components/panels/ArticleListPanel";
import EditorPanel from "../../components/panels/EditorPanel";
import Assets from "../../helpers/constants/Assets";
import useNavigationStorage from "../../stores/NavigationStorage";
import useUserSession, { SessionAuthor } from "../../stores/UserSessionStore";
import dftStyles from "../../styles/AuthorsProfile.module.css";

const ColabsList = () => {
	return (
		<div className="p-4">
			<p>{"Colaborações do autor."}</p>
		</div>
	);
};

const StoredArticles = () => {
	return (
		<div className="p-4">
			<p>{"Artigos não publicados."}</p>
		</div>
	);
};

const Profile: NextPage = () => {
	const setCurrentNavLink = useNavigationStorage(s => s.setCurrentNavLink);

	const userAuthStatus = useUserSession(s => s.status);
	const userData = useUserSession(s => s.user);
	const authorData = useUserSession(s => s.author);

	const [userId, setUserId] = useState<String>();
	const [author, setAuthor] = useState<SessionAuthor>();
	const [isAuthenticated, setAuthenticated] = useState(false);

	const [customPanel, setCustomPanel] = useState<ReactNode>(null);
	const [currentTab, setCurrentTab] = useState<boolean | number>(0);

	const [authorMenuAnchor, setAuthorMenuAnchor] = useState<
		HTMLElement | undefined
	>(undefined);
	const isAuthorMenuOpen = Boolean(authorMenuAnchor);
	const closeAuthorDialogMenu: AuthorMenuDialogCloseHandler = () => {
		setAuthorMenuAnchor(undefined);
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setCurrentTab(newValue);
		setCustomPanel(null);
	};

	const handleNewPublicationClick = () => {
		setCurrentTab(false);
		setCustomPanel(<EditorPanel />);
	};

	const panelSelector = (tab: boolean | number) => {
		switch (tab) {
			case 0:
				return <ArticleListPanel />;
			case 1:
				return ColabsList();
			case 2:
				return StoredArticles();
			default:
				return null;
		}
	};

	const currentPanel = panelSelector(currentTab);

	useEffect(() => {
		if (customPanel) {
			setCurrentTab(false);
		}
	}, [customPanel]);

	useEffect(() => {
		setCurrentNavLink("profile");
	}, [setCurrentNavLink]);

	useEffect(() => {
		setAuthenticated(userAuthStatus === "authenticated");
	}, [userAuthStatus]);

	useEffect(() => {
		if (isAuthenticated) {
			setUserId(userData?.id);
			setAuthor(authorData);
		} else {
			setCustomPanel(null);
			setCurrentTab(0);
		}
	}, [isAuthenticated, userData?.id, authorData]);

	return (
		<main className={dftStyles.container}>
			<div className={dftStyles.contentContainer}>
				<div className={dftStyles.profileContainer}>
					<div className={dftStyles.head}>
						<div className={dftStyles.banner}>
							<img
								src={author?.banner || Assets.placeholder.profile.banner}
								width={"100%"}
								height={"100%"}
								alt="User profile's banner"
							/>
							{isAuthenticated && (
								<menu className={dftStyles.bannerIconContainer}>
									<li key="author-menu">
										<>
											<IconButton
												classes={{
													root: dftStyles.bannerIcon,
												}}
												aria-label={"Author's menu"}
												aria-controls={
													isAuthorMenuOpen ? "author-menu" : undefined
												}
												aria-haspopup={"true"}
												aria-expanded={isAuthorMenuOpen ? "true" : undefined}
												onClick={ev => {
													setAuthorMenuAnchor(ev.currentTarget);
												}}
											>
												<FaCog />
											</IconButton>
											{
												<AuthorMenuDialog
													isOpen={isAuthorMenuOpen}
													onClose={closeAuthorDialogMenu}
													customPanelSetter={setCustomPanel}
													anchorEl={authorMenuAnchor}
												/>
											}
										</>
									</li>
								</menu>
							)}
						</div>
						<div className={dftStyles.content}>
							<div className={dftStyles.userPictureContainer}>
								<div className={dftStyles.picture}>
									<img
										src={author?.picture || Assets.placeholder.profile.picture}
										width={"100%"}
										height={"100%"}
										alt="User profile's picture"
									/>
								</div>
							</div>
							<div className={dftStyles.userDetailsContainer}>
								<div className={dftStyles.head}>
									<h1>{author?.name || "Nome do Autor"}</h1>
								</div>
								<div
									className={dftStyles.body}
									dangerouslySetInnerHTML={{
										__html: author?.bio || "<p>Biografia do autor</p>",
									}}
								></div>
							</div>
						</div>
					</div>

					<Divider />

					<div className={dftStyles.tabsContainer}>
						<Tabs
							value={currentTab}
							onChange={handleTabChange}
							variant="scrollable"
							scrollButtons="auto"
							allowScrollButtonsMobile
							aria-label="Scrollable tabs to view author generated data, like publications or colabs."
							classes={{
								indicator: dftStyles.tabsIndicator,
							}}
						>
							<Tab label="Artigos" />
							<Tab label="Colaborações" />
							{isAuthenticated && <Tab label="Artigos Armazenados" />}
						</Tabs>
					</div>
				</div>

				<div className={dftStyles.tabPanel}>{currentPanel || customPanel}</div>
			</div>
		</main>
	);
};

export default Profile;
