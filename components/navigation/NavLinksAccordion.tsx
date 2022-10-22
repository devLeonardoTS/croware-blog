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
				<List className={dftStyles.linksList} component="menu" disablePadding>
					{(links || []).map(link => {
						if (link.hidden) {
							return;
						}
						return (
							<ListItemButton
								key={link.id}
								component="li"
								className={dftStyles.link}
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
								<a href={link.path}>{link.name}</a>
							</ListItemButton>
						);
					})}
				</List>
			</Collapse>
		</Fragment>
	);
};

export default NavLinksAccordion;
