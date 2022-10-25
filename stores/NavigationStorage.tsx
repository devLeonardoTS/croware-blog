import lodash from "lodash";
import { nanoid } from "nanoid";
import create from "zustand";
import { persist } from "zustand/middleware";
import STORAGE_KEYS, { STORAGE_VERSION } from "./StorageKeys";

// Types

export type NavLinkType = {
	id: string;
	name: string;
	title: string;
	path: string;
	hidden: boolean;
};

export type MainNavStateType = {
	mainLinks: NavLinkType[];
	previous: NavLinkType;
	current: NavLinkType;
};

export type NavLinkMakerArgs = {
	title?: string;
	path?: string;
	hidden?: boolean;
};
export type NavLinkMaker = (
	name: string,
	args?: NavLinkMakerArgs
) => Promise<NavLinkType> | NavLinkType;

type MainNavigationType = {
	mainLinks: NavLinkType[];
	previous: NavLinkType;
	current: NavLinkType;
	setCurrentNavLink: NavLinkMaker;
	hideAll: () => Promise<void> | void;
	showAll: () => Promise<void> | void;
	hideLink: (name: string) => Promise<void> | void;
	showLink: (name: string) => Promise<void> | void;
};

// Helpers

export const mkNavLink: NavLinkMaker = (name, args) => {
	let shouldHide = args?.hidden;
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
		title: args?.title || "",
		path: args?.path || window.location.pathname,
		hidden: shouldHide,
	};

	return link;
};

// Constants

const MAIN_NAV_LINKS = [
	mkNavLink("Artigos", { path: "/" }),
	mkNavLink("Eventos", { path: "/events" }),
	mkNavLink("Projetos", { path: "/projects" }),
	mkNavLink("Sobre", { path: "/about", hidden: true }),
];

const useNavigationStorage = create<MainNavigationType>()(
	persist(
		// @ts-ignore
		(set, get) => {
			const setCurrentNavLink = async (
				name: string,
				args?: NavLinkMakerArgs
			) => {
				if (typeof name !== "string") {
					return;
				}

				const loweredName = name.toLowerCase().trim();

				if (loweredName.length < 1) {
					return;
				}

				const oldCurrent = get().current;
				const currentPath = window?.location?.pathname;

				if (oldCurrent.path === currentPath) {
					return;
				}

				const sanitizedName =
					loweredName[0].toUpperCase() + loweredName.slice(1);

				const current = await mkNavLink(sanitizedName, {
					title: args?.title,
					path: args?.path,
					hidden: args?.hidden,
				});

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
					Object.entries(state).filter(
						([key]) => !["mainLinks"].includes(key)
					)
				);
			},
			version: STORAGE_VERSION,
		}
	)
);

export default useNavigationStorage;
