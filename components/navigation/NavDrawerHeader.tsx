import { IconButton } from "@mui/material";
import { nanoid } from "nanoid";
import { FaFeatherAlt } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import { NavLinkType } from "../../stores/NavigationStorage";
import Tooltip from "../Tooltip";
import dftStyles from "./NavDrawerHeader.module.css";

type NavDrawerHeaderProps = {
	bannerSrc: string;
	avatarSrc: string;
	currentLink: NavLinkType;
	isAuthFormOpen: boolean;
	isAuthenticated: boolean;
	toggleDrawer: (status: boolean) => Promise<void> | void;
	toggleAuthForm: () => Promise<void> | void;
};

const NavDrawerHeader = ({
	bannerSrc,
	avatarSrc,
	currentLink,
	toggleDrawer,
	toggleAuthForm,
	isAuthFormOpen,
	isAuthenticated,
}: NavDrawerHeaderProps) => {
	return (
		<div className={dftStyles.container}>
			<div className={dftStyles.bannerContainer}>
				<img
					className={dftStyles.banner}
					src={bannerSrc}
					width={"100%"}
					height={"100%"}
					alt="User profile's banner"
				/>
				<div className={dftStyles.bannerOverlay}>
					<div className={dftStyles.title}>
						<a href={currentLink.path}>{currentLink.name}</a>
					</div>
					<div className={dftStyles.greetings}>
						<p>{"Bem-vindo(a)"}</p>
					</div>
					<menu className={dftStyles.menu}>
						<li key={nanoid()} className={dftStyles.item}>
							<IconButton
								className={dftStyles.iconButton}
								onClick={ev => {
									toggleDrawer(false);
								}}
							>
								<IoClose />
							</IconButton>
						</li>
						{!isAuthenticated && (
							<li key={nanoid()} className={dftStyles.item}>
								<Tooltip
									muiTooltipProps={{
										title: "Sign-in",
										placement: "left",
										arrow: true,
									}}
								>
									<IconButton
										className={dftStyles.iconButton}
										onClick={ev => {
											toggleAuthForm();
										}}
										{...(isAuthFormOpen && {
											"data-active": true,
										})}
									>
										<FaFeatherAlt fontSize="small" />
									</IconButton>
								</Tooltip>
							</li>
						)}
					</menu>
				</div>
			</div>
			{(isAuthenticated || isAuthFormOpen) && (
				<div className={dftStyles.avatarContainer}>
					<div className={dftStyles.avatar}>
						<img
							src={avatarSrc}
							width={"100%"}
							height={"100%"}
							alt="User profile's picture"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default NavDrawerHeader;
