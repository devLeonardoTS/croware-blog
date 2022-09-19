import dayjs from "dayjs";
import { ReactNode } from "react";
import create from "zustand";
import { AUTHENTICATED_USER_LSK } from "../../helpers/constants/localStorageKeys";
import { OwnAxios } from "../../helpers/utilities/OwnAxios";

// Types.
type SessionProviderProps = {
	children: ReactNode;
};

type UserCredentials = {
	identifier: string;
	password: string;
};

type SignInResponse = {
	jwt: string;
	user: any;
};

type SessionUser = {
	id: string;
	email: string;
};

type SessionStatus = "unsigned" | "loading" | "authenticated";
type SessionContextType = {
	user: SessionUser | undefined;
	status: SessionStatus;
	signIn(credentials: UserCredentials): Promise<void>;
	signOut(): Promise<void>;
	tryRefresh(): Promise<void>;
};

const useUserSession = create<SessionContextType>((set, get) => {
	const signIn = async ({ identifier, password }: UserCredentials) => {
		if (get().user) {
			return;
		}

		set({ status: "loading" });

		const reqController = new AbortController();

		const endPoint = "/api/auth/local";

		const data = await OwnAxios.client
			.post<SignInResponse>(
				endPoint,
				{
					identifier,
					password,
				},
				{
					signal: reqController.signal,
				}
			)
			.then(response => response.data)
			.catch(error => {
				reqController.abort();
				if (window) {
					alert("Authentication failed, try again later.");
				}
			});

		if (!data) {
			get().signOut();
		}

		if (data) {
			// console.log("Auth data:", data);
			set(() => {
				return {
					user: {
						id: String(data.user.id),
						email: String(data.user.email),
					},
				};
			});

			set({ status: "authenticated" });

			OwnAxios.setAuthHeader(data.jwt);

			localStorage.setItem(
				AUTHENTICATED_USER_LSK,
				JSON.stringify({
					user: {
						id: data.user.id,
						email: data.user.email,
					},
					jwt: data.jwt,
					expiresAt: dayjs(Date.now()).add(24, "hours").toISOString(),
				})
			);
		}
	};

	const signOut = async () => {
		set({ status: "unsigned" });
		set({ user: undefined });
		OwnAxios.setAuthHeader();
		localStorage.removeItem(AUTHENTICATED_USER_LSK);
	};

	const tryRefresh = async () => {
		const storedUser = localStorage.getItem(AUTHENTICATED_USER_LSK);
		if (!storedUser) {
			get().signOut();
			return;
		}

		const { user: userData, jwt, expiresAt } = JSON.parse(storedUser);

		const isExpired = expiresAt && dayjs().isAfter(dayjs(expiresAt));
		if (isExpired) {
			alert("Your session expired, please log in again!");
			get().signOut();
			return;
		}

		set({ user: userData });
		set({ status: "authenticated" });
		OwnAxios.setAuthHeader(jwt);
	};

	return {
		user: undefined,
		status: "unsigned",
		signIn: signIn,
		signOut: signOut,
		tryRefresh: tryRefresh,
	};
});

// Facade Layer.
export const useUser = () => useUserSession(state => state.user);
export const useUserAuthStatus = () => useUserSession(state => state.status);
export const useSignIn = () => useUserSession(state => state.signIn);
export const useSignOut = () => useUserSession(state => state.signOut);
export const useTryRefreshUserAuth = () =>
	useUserSession(state => state.tryRefresh);
