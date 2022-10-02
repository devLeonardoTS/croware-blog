import {
	Button,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Tab,
	Tabs,
} from "@mui/material";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { BiDotsVertical } from "react-icons/bi";
import { FaCog, FaFeatherAlt, FaUserEdit } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";
import EditorPanel from "../../components/panels/EditorPanel";
import dftStyles from "../../styles/AuthorsProfile.module.css";

// const OwnCKEditor = dynamic(
// 	async () => {
// 		const m = await import("../../components/OwnCKEditor");
// 		return m.default;
// 	},
// 	{ ssr: false, loading: () => <div>Loading Editor...</div> }
// );

// type PageTabs = "PUBLICACOES" | "COLABS";

const ArticleList = () => {
	return (
		<div className="p-4">
			<p>{"Artigos do autor."}</p>
		</div>
	);
};

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

const panelSelector = (tab: boolean | number) => {
	switch (tab) {
		case 0:
			return ArticleList();
		case 1:
			return ColabsList();
		case 2:
			return StoredArticles();
		default:
			return null;
	}
};

// const getEditorPanel = (
// 	editorState: [string, Dispatch<SetStateAction<string>>]
// ) => {
// 	const [editorContent, setEditorContent] = editorState;

// 	return (
// 		<div className={dftStyles.editorContainer}>
// 			<OwnCKEditor
// 				value={editorContent}
// 				name="editor"
// 				onChange={(data: any) => {
// 					setEditorContent(data);
// 				}}
// 			/>
// 		</div>
// 	);
// };

const getAuthorDialogMenu = (
	anchorEl: null | HTMLElement,
	open: boolean,
	handlers: {
		closeHandler: () => void;
		newPublicationHandler: () => void;
	}
) => {
	return (
		<Menu
			id="author-menu"
			anchorEl={anchorEl}
			open={open}
			onClose={handlers.closeHandler}
			MenuListProps={{
				"aria-labelledby": "basic-button",
			}}
			anchorOrigin={{
				vertical: "center",
				horizontal: "left",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			classes={{
				paper: dftStyles.dialogMenu,
			}}
		>
			<MenuItem
				onClick={() => {
					handlers.closeHandler();
					handlers.newPublicationHandler();
				}}
			>
				<FaFeatherAlt />
				Nova publicação
			</MenuItem>

			<MenuItem
				onClick={() => {
					handlers.closeHandler();
				}}
			>
				<FaUserEdit />
				Editar perfil
			</MenuItem>

			<Divider />

			<MenuItem
				onClick={() => {
					handlers.closeHandler();
				}}
			>
				<GoSignOut />
				Sign out
			</MenuItem>
		</Menu>
	);
};

const Profile: NextPage = () => {
	const editorState = useState("");

	const [customPanel, setCustomPanel] = useState<ReactNode>(null);

	const [currentTab, setCurrentTab] = useState<boolean | number>(0);

	const [authorMenuAnchor, setAuthorMenuAnchor] = useState<null | HTMLElement>(
		null
	);
	const isAuthorMenuOpen = Boolean(authorMenuAnchor);
	const closeAuthorDialogMenu = () => {
		setAuthorMenuAnchor(null);
	};

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setCurrentTab(newValue);
		setCustomPanel(null);
	};

	const handleNewPublicationClick = () => {
		setCurrentTab(false);
		setCustomPanel(<EditorPanel />);
	};

	const currentPanel = panelSelector(currentTab);

	return (
		<main className={dftStyles.container}>
			<div className={dftStyles.contentContainer}>
				<div className={dftStyles.profileContainer}>
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
										aria-controls={isAuthorMenuOpen ? "author-menu" : undefined}
										aria-haspopup={"true"}
										aria-expanded={isAuthorMenuOpen ? "true" : undefined}
										onClick={ev => {
											setAuthorMenuAnchor(ev.currentTarget);
										}}
									>
										<FaCog />
									</IconButton>
									{getAuthorDialogMenu(authorMenuAnchor, isAuthorMenuOpen, {
										closeHandler: closeAuthorDialogMenu,
										newPublicationHandler: handleNewPublicationClick,
									})}
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
				<div className={dftStyles.tabPanel}>{currentPanel || customPanel}</div>
			</div>
		</main>
	);
};

export default Profile;
