import lodash from "lodash";
import { nanoid } from "nanoid";
import create from "zustand";

// Types

export type NavLinkType = {
	id: string;
	name: string;
	path: string;
	hidden: boolean;
};

type MainNavigationType = {
	mainLinks: NavLinkType[];
	previous: NavLinkType;
	current: NavLinkType;
	setCurrentNavLink: (
		name: string,
		path?: string,
		hidden?: boolean
	) => Promise<void> | void;
	hideAll: () => Promise<void> | void;
	showAll: () => Promise<void> | void;
	hideLink: (name: string) => Promise<void> | void;
	showLink: (name: string) => Promise<void> | void;
};

// Helpers

export const mkNavLink = (name: string, path?: string, hidden?: boolean) => {
	let shouldHide = hidden;
	switch (typeof shouldHide) {
		case "boolean":
			shouldHide = shouldHide;
			break;
		default:
			shouldHide = false;
			break;
	}

	const link: NavLinkType = {
		id: nanoid(),
		name,
		path: path || window.location.pathname,
		hidden: shouldHide,
	};

	return link;
};

// Constants

const MAIN_NAV_LINKS = [
	mkNavLink("Artigos", "/"),
	mkNavLink("Eventos", "/events"),
	mkNavLink("Projetos", "/projects"),
	mkNavLink("Sobre", "/about", true),
];

const useNavigationStorage = create<MainNavigationType>((set, get) => {
	// const setCurrentNavFromMainLinks = (name: string) => {
	// 	const loweredName = name.toLowerCase();

	// 	const current = get().current;
	// 	const loweredCurrentName = get().current.name.toLowerCase();

	// 	if (loweredCurrentName === loweredName) {
	// 		return;
	// 	}

	// 	const active = get().mainLinks.find(link =>
	// 		link.name.toLowerCase().includes(loweredName)
	// 	);

	// 	if (!active) {
	// 		return;
	// 	}

	// 	set({
	// 		previous: current,
	// 		current: active,
	// 	});
	// };

	const setCurrentNavLink = async (
		name: string,
		path?: string,
		hidden?: boolean
	) => {
		const navLink = mkNavLink(name, path, hidden);
		set({ current: navLink });
	};

	const hideAll = () => {
		const links = lodash.cloneDeep(get().mainLinks);
		links.forEach(link => (link.hidden = true));

		set({ mainLinks: links });
	};

	const showAll = () => {
		const links = lodash.cloneDeep(get().mainLinks);
		links.forEach(link => (link.hidden = false));
		set({ mainLinks: links });
	};

	const hideLink = (name: string) => {
		const lowName = name.toLowerCase();

		const links = lodash.cloneDeep(get().mainLinks);

		for (const item of links) {
			if (item.name.toLowerCase() === lowName) {
				item.hidden = true;
				break;
			}
		}

		set({ mainLinks: links });
	};

	const showLink = (name: string) => {
		const lowName = name.toLowerCase();

		const links = lodash.cloneDeep(get().mainLinks);

		for (const item of links) {
			if (item.name.toLowerCase() === lowName) {
				item.hidden = false;
				break;
			}
		}

		set({ mainLinks: links });
	};

	return {
		mainLinks: MAIN_NAV_LINKS,
		previous: MAIN_NAV_LINKS[0],
		current: MAIN_NAV_LINKS[0],
		setCurrentNavLink,
		hideAll,
		showAll,
		hideLink,
		showLink,
	};
});

export default useNavigationStorage;
