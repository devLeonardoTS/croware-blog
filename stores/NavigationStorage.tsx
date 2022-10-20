import lodash from "lodash";
import { nanoid } from "nanoid";
import create from "zustand";
import { persist } from "zustand/middleware";
import STORAGE_KEYS from "./StorageKeys";

// Types

export type NavLinkType = {
	id: string;
	name: string;
	path: string;
	hidden: boolean;
};

export type MainNavStateType = {
	mainLinks: NavLinkType[];
	previous: NavLinkType;
	current: NavLinkType;
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

const useNavigationStorage = create<MainNavigationType>()(
	persist(
		// @ts-ignore
		(set, get) => {
			const setCurrentNavLink = async (
				name: string,
				path?: string,
				hidden?: boolean
			) => {
				if (typeof name !== "string") {
					return;
				}

				const loweredName = name.toLowerCase().trim();

				if (loweredName.length < 1) {
					return;
				}

				const oldCurrent = get().current;
				const loweredCurrentName = get().current.name.toLowerCase();

				if (loweredCurrentName === loweredName) {
					return;
				}

				const sanitizedName =
					loweredName[0].toUpperCase() + loweredName.slice(1);

				const current = mkNavLink(sanitizedName, path, hidden);

				set({
					previous: oldCurrent,
					current: current,
				});
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
		},
		{
			name: STORAGE_KEYS.NAVIGATION,
			getStorage: () => localStorage,
			partialize: state => {
				return Object.fromEntries(
					Object.entries(state).filter(([key]) => !["mainLinks"].includes(key))
				);
			},
		}
	)
);

export default useNavigationStorage;
