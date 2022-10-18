import { Divider, IconButton, Tab, Tabs } from "@mui/material";
import { NextPage } from "next";
import React, { ReactNode, useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";

import AuthorMenuDialog, {
	AuthorMenuDialogCloseHandler,
} from "../../components/dialogs/AuthorMenuDialog";
import ArticleListPanel from "../../components/panels/ArticleListPanel";
import EditorPanel from "../../components/panels/EditorPanel";
import useNavigationStorage, {
	mkNavLink,
} from "../../stores/NavigationStorage";
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

	return (
		<main className={dftStyles.container}>
			<div className={dftStyles.contentContainer}>
				<div className={dftStyles.profileContainer}>
					<div className={dftStyles.head}>
						<div className={dftStyles.banner}>
							<img
								src={"https://wallpaperaccess.com/full/859076.jpg"}
								width={"100%"}
								height={"100%"}
								alt="User profile's banner"
							/>
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
						</div>
						<div className={dftStyles.content}>
							<div className={dftStyles.userPictureContainer}>
								<img
									src={
										"https://pm1.narvii.com/7700/9900de90d3598fd01f7b009aefed860e824b9a24r1-750-783v2_hq.jpg"
									}
									width={"100%"}
									height={"100%"}
									alt="User profile's picture"
								/>
							</div>
							<div className={dftStyles.userDetailsContainer}>
								<div className={dftStyles.head}>
									<h1>{"MENHERA-KUN"}</h1>
								</div>
								<div className={dftStyles.body}>
									<p>
										{
											"THE NAME IS MENHERA, I'M 18. RIGHT NOW I'M TRYING TO GET THIS WEB PAGE TOGETHER AND MAKE IT WORK FLAWLESSLY ON MOBILE DEVICES."
										}
									</p>
								</div>
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
							<Tab label="Artigos Armazenados *" />
						</Tabs>
					</div>
				</div>

				<div className={dftStyles.tabPanel}>{currentPanel || customPanel}</div>
			</div>
		</main>
	);
};

export default Profile;
