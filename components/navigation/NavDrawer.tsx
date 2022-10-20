import { SwipeableDrawer, SwipeableDrawerProps } from "@mui/material";
import { ReactEventHandler, useState } from "react";
import dftStyles from "./NavDrawer.module.css";

type NavDrawerProps = {
	drawerProps: SwipeableDrawerProps;
};

const NavDrawer = ({ drawerProps }: NavDrawerProps) => {
	return (
		<SwipeableDrawer
			anchor="right"
			classes={{
				paper: dftStyles.container,
			}}
			{...drawerProps}
			disableDiscovery
			disableSwipeToOpen
			disableBackdropTransition
		>
			<div className={dftStyles.content}>
				<div className={dftStyles.head}>small close btn on right</div>
				<div className={dftStyles.body}>
					<div className={dftStyles.userContainer}>user area</div>
					<div className={dftStyles.linksAccordion}>links accordion</div>
				</div>
				<div className={dftStyles.footer}>
					<div className={dftStyles.extraInfo}>info</div>
				</div>
			</div>
		</SwipeableDrawer>
	);
};

export default NavDrawer;
