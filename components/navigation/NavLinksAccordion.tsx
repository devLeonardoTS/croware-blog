import {
	ListItemButton,
	ListItemIcon,
	Collapse,
	List,
	Divider,
} from "@mui/material";
import { Fragment } from "react";
import { IoLinkSharp } from "react-icons/io5";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import { NavLinkType } from "../../stores/NavigationStorage";
import dftStyles from "./NavLinksAccordion.module.css";

type NavLinksAccordionProps = {
	isOpen: boolean;
	toggleAccordion: (status: boolean) => Promise<void> | void;
	links?: NavLinkType[];
	current?: NavLinkType;
};

const NavLinksAccordion = ({
	isOpen,
	toggleAccordion,
	links,
	current,
}: NavLinksAccordionProps) => {
	return (
		<Fragment>
			<ListItemButton
				className={dftStyles.button}
				onClick={() => toggleAccordion(!isOpen)}
			>
				<div className={dftStyles.title}>
					<ListItemIcon className={dftStyles.icon}>
						<IoLinkSharp />
					</ListItemIcon>
					<p className={dftStyles.text}>{"Páginas"}</p>
				</div>
				<div className={dftStyles.actions}>
					{isOpen ? <MdExpandLess /> : <MdExpandMore />}
				</div>
			</ListItemButton>
			<Collapse in={isOpen} timeout="auto" unmountOnExit>
				<Divider />
				<List
					className={dftStyles.linksList}
					component="menu"
					disablePadding
				>
					{(links || []).map(link => {
						if (link.hidden) {
							return;
						}
						return (
							<li key={link.id}>
								<ListItemButton
									className={dftStyles.link}
									component="a"
									href={link.path}
								>
									<span
										className={dftStyles.addorn}
										{...(current?.name.toLowerCase() ===
											link.name.toLowerCase() && {
											"data-active": true,
										})}
									>
										&nbsp;
									</span>
									{link.name}
								</ListItemButton>
							</li>
						);
					})}
				</List>
			</Collapse>
		</Fragment>
	);
};

export default NavLinksAccordion;
