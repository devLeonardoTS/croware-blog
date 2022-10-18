import {
	AnchorHTMLAttributes,
	DetailedHTMLProps,
	LiHTMLAttributes,
	MenuHTMLAttributes,
	ReactNode,
} from "react";
import { NavLinkType } from "../../stores/NavigationStorage";

type LinksBarProps = {
	links: NavLinkType[];
	current?: NavLinkType;
	rootProps?: DetailedHTMLProps<MenuHTMLAttributes<HTMLElement>, HTMLElement>;
	listItemProps?: DetailedHTMLProps<
		LiHTMLAttributes<HTMLLIElement>,
		HTMLLIElement
	>;
	anchorProps?: DetailedHTMLProps<
		AnchorHTMLAttributes<HTMLAnchorElement>,
		HTMLAnchorElement
	>;
};

const LinksBar = ({
	links,
	current,
	rootProps,
	listItemProps,
	anchorProps,
}: LinksBarProps) => {
	return (
		<menu {...rootProps}>
			{links.map(link => {
				return (
					<li
						key={link.id}
						hidden={link.hidden}
						{...(current?.name.toLowerCase() === link.name.toLowerCase() && {
							"data-active": true,
						})}
						{...listItemProps}
					>
						<a href={link.path} {...anchorProps}>
							{link.name}
						</a>
					</li>
				);
			})}
		</menu>
	);
};

export default LinksBar;
