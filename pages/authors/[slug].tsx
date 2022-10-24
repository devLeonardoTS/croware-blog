import { Divider, IconButton, Tab, Tabs } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import { stringify } from "qs";
import React, { ReactNode, useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";

import AuthorMenuDialog, {
	AuthorMenuDialogCloseHandler,
} from "../../components/dialogs/AuthorMenuDialog";
import ArticleListPanel from "../../components/panels/ArticleListPanel";
import ArticleStashPanel from "../../components/panels/ArticleStashPanel";
import EditorPanel from "../../components/panels/EditorPanel";
import Assets from "../../helpers/constants/Assets";
import Endpoints from "../../helpers/constants/Endpoints";
import { ServerAxios } from "../../helpers/utilities/ServerAxios";
import useNavigationStorage from "../../stores/NavigationStorage";
import useUserSession, { SessionAuthor } from "../../stores/UserSessionStore";
import dftStyles from "../../styles/AuthorsProfile.module.css";

type AuthorData = {
	id: number;
	attributes: {
		name: string;
		bio: string;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
		slug: string;
		picture?: {
			data: {
				id: number;
				attributes: {
					name: string;
					alternativeText: string;
					caption: string;
					width: number;
					height: number;
					formats: {
						thumbnail: {
							name: string;
							hash: string;
							ext: string;
							mime: string;
							path: string | null;
							width: number;
							height: number;
							size: number;
							url: string;
							provider_metadata: {
								public_id: string;
								resource_type: string;
							};
						};
						medium: {
							name: string;
							hash: string;
							ext: string;
							mime: string;
							path: string | null;
							width: number;
							height: number;
							size: number;
							url: string;
							provider_metadata: {
								public_id: string;
								resource_type: string;
							};
						};
						small: {
							name: string;
							hash: string;
							ext: string;
							mime: string;
							path: string | null;
							width: number;
							height: number;
							size: number;
							url: string;
							provider_metadata: {
								public_id: string;
								resource_type: string;
							};
						};
					};
					hash: string;
					ext: string;
					mime: string;
					size: number;
					url: string;
					previewUrl: string | null;
					provider: string;
					provider_metadata: {
						public_id: string;
						resource_type: string;
					};
					createdAt: string;
					updatedAt: string;
				};
			};
		};
		banner?: {
			data: {
				id: number;
				attributes: {
					name: string;
					alternativeText: string;
					caption: string;
					width: number;
					height: number;
					formats: {
						thumbnail: {
							name: string;
							hash: string;
							ext: string;
							mime: string;
							path: string | null;
							width: number;
							height: number;
							size: number;
							url: string;
							provider_metadata: {
								public_id: string;
								resource_type: string;
							};
						};
						medium: {
							name: string;
							hash: string;
							ext: string;
							mime: string;
							path: string | null;
							width: number;
							height: number;
							size: number;
							url: string;
							provider_metadata: {
								public_id: string;
								resource_type: string;
							};
						};
						small: {
							name: string;
							hash: string;
							ext: string;
							mime: string;
							path: string | null;
							width: number;
							height: number;
							size: number;
							url: string;
							provider_metadata: {
								public_id: string;
								resource_type: string;
							};
						};
					};
					hash: string;
					ext: string;
					mime: string;
					size: number;
					url: string;
					previewUrl: string | null;
					provider: string;
					provider_metadata: {
						public_id: string;
						resource_type: string;
					};
					createdAt: string;
					updatedAt: string;
				};
			};
		};
	};
};

type AuthorProfilePageProps = {
	author: AuthorData;
};

export const getServerSideProps: GetServerSideProps<
	AuthorProfilePageProps
> = async context => {
	const slug = context.params?.slug;

	const query = stringify(
		{
			populate: ["picture", "banner"],
			filters: {
				slug: {
					$eqi: slug,
				},
			},
		},
		{
			encodeValuesOnly: true,
		}
	);

	const url = `${Endpoints.authors}?${query}`;

	const result = await ServerAxios.client
		.get<{ data: Array<AuthorData> }>(url)
		.then(response => response.data?.data?.[0])
		.catch(error => {});

	// console.log("[authors:getSSProps] - Result...", result);

	if (!result) {
		return { notFound: true };
	}

	return {
		props: { author: result },
	};
};

const ColabsList = () => {
	return (
		<div className="p-4">
			<p>{"Colaborações do autor."}</p>
		</div>
	);
};

const Profile: NextPage<AuthorProfilePageProps> = ({ author }) => {
	// console.log("[authors:ProfilePage] - Author...", author);

	const setCurrentNavLink = useNavigationStorage(s => s.setCurrentNavLink);
	const userAuthStatus = useUserSession(s => s.status);
	const userAuthorData = useUserSession(s => s.author);

	const [userAuthor, setUserAuthor] = useState<SessionAuthor>();
	const [isAuthenticated, setAuthenticated] = useState(false);

	const [customPanel, setCustomPanel] = useState<ReactNode>(null);
	const [currentTab, setCurrentTab] = useState<boolean | number>(0);

	const [ownerMenuAnchor, setOwnerMenuAnchor] = useState<
		HTMLElement | undefined
	>(undefined);

	const isOwnerMenuOpen = Boolean(ownerMenuAnchor);
	const closeOwnerDialogMenu: AuthorMenuDialogCloseHandler = () => {
		setOwnerMenuAnchor(undefined);
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setCurrentTab(newValue);
		setCustomPanel(null);
	};

	const panelSelector = (tab: boolean | number) => {
		switch (tab) {
			case 0:
				return <ArticleListPanel />;
			case 1:
				return ColabsList();
			case 2:
				return <ArticleStashPanel />;
			default:
				return null;
		}
	};

	const currentPanel = panelSelector(currentTab);

	useEffect(() => {
		setCurrentNavLink("profile", { title: author.attributes.name });
	}, [author.attributes.name, setCurrentNavLink]);

	useEffect(() => {
		setAuthenticated(userAuthStatus === "authenticated");
	}, [userAuthStatus]);

	useEffect(() => {
		if (isAuthenticated) {
			setUserAuthor(userAuthorData);
			return;
		}

		setCustomPanel(null);
		setCurrentTab(0);
	}, [isAuthenticated, userAuthorData]);

	useEffect(() => {
		if (customPanel) {
			setCurrentTab(false);
		}
	}, [customPanel]);

	return (
		<main className={dftStyles.container}>
			<div className={dftStyles.contentContainer}>
				<div className={dftStyles.profileContainer}>
					<div className={dftStyles.head}>
						<div className={dftStyles.banner}>
							<img
								src={
									author.attributes?.banner?.data.attributes.url ||
									Assets.placeholder.profile.banner
								}
								width={"100%"}
								height={"100%"}
								alt="User profile's banner"
							/>
							{isAuthenticated && userAuthor?.id === author.id && (
								<menu className={dftStyles.bannerIconContainer}>
									<li key="author-menu">
										<>
											<IconButton
												classes={{
													root: dftStyles.bannerIcon,
												}}
												aria-label={"Author's menu"}
												aria-controls={
													isOwnerMenuOpen ? "author-menu" : undefined
												}
												aria-haspopup={"true"}
												aria-expanded={isOwnerMenuOpen ? "true" : undefined}
												onClick={ev => {
													setOwnerMenuAnchor(ev.currentTarget);
												}}
											>
												<FaCog />
											</IconButton>
											{
												<AuthorMenuDialog
													isOpen={isOwnerMenuOpen}
													onClose={closeOwnerDialogMenu}
													customPanelSetter={setCustomPanel}
													anchorEl={ownerMenuAnchor}
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
										src={
											author.attributes?.picture?.data.attributes.url ||
											Assets.placeholder.profile.picture
										}
										width={"100%"}
										height={"100%"}
										alt="User profile's picture"
									/>
								</div>
							</div>
							<div className={dftStyles.userDetailsContainer}>
								<div className={dftStyles.head}>
									<h1>{author.attributes.name || "Nome do Autor"}</h1>
								</div>
								<div
									className={dftStyles.body}
									dangerouslySetInnerHTML={{
										__html:
											author.attributes.bio || "<p>Biografia do autor</p>",
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
							{isAuthenticated && userAuthor?.id === author.id && (
								<Tab label="Artigos Armazenados" />
							)}
						</Tabs>
					</div>
				</div>

				<div className={dftStyles.tabPanel}>{currentPanel || customPanel}</div>
			</div>
		</main>
	);
};

export default Profile;
