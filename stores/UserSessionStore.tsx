import dayjs from "dayjs";
import create from "zustand";
import { OwnAxios } from "../helpers/utilities/OwnAxios";
import * as yup from "yup";
import * as qs from "qs";
import { persist } from "zustand/middleware";
import STORAGE_KEYS, { STORAGE_VERSION } from "./StorageKeys";

// Types.
export type UserCredentials = {
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

export type SessionAuthor = {
	id: number;
	name: string;
	bio: string;
	picture: string;
	banner: string;
	slug: string;
};

type SessionStatus = "unsigned" | "loading" | "authenticated";
type SessionContextType = {
	status: SessionStatus;
	token: string;
	expiresAt: string;
	signIn(credentials: UserCredentials): Promise<void>;
	signOut(): Promise<void>;
	tryRefresh(): Promise<void>;

	user?: SessionUser;
	author?: SessionAuthor;
};

// Validation
export const localAuthSchema = yup.object().shape({
	identifier: yup.string().required("Por favor, digite seu e-mail."),
	password: yup.string().required("Por favor, digite a senha."),
});

// Store
const useUserSession = create<SessionContextType>()(
	persist(
		// @ts-ignore
		(set, get) => {
			const getUserDetails = async () => {
				const status = get().status;
				if (status !== "authenticated") {
					return;
				}

				const query = qs.stringify(
					{
						populate: {
							author: {
								populate: ["picture", "banner"],
							},
						},
					},
					{
						encodeValuesOnly: true,
					}
				);
				const endPoint = `/api/users/me?${query}`;
				const reqController = new AbortController();

				const data = await OwnAxios.client
					.get<any>(endPoint, {
						signal: reqController.signal,
					})
					.then(response => response.data)
					.catch(error => {
						reqController.abort();
						if (window) {
							alert(
								"Não foi possível recuperar os detalhes do autor. Tente novamente mais tarde."
							);
						}
					});

				// console.log("[UserSessionStorage:getUserDetails] - Details data...", data);

				set({
					author: {
						id: data?.author?.id || "",
						name: data?.author?.name || "",
						bio: data?.author?.bio || "",
						slug: data?.author?.slug || "",
						picture: data?.author?.picture?.url || "",
						banner: data?.author?.banner?.url || "",
					},
				});
			};

			const signIn = async ({
				identifier,
				password,
			}: UserCredentials) => {
				const status = get().status;

				set({ status: "loading" });

				const reqController = new AbortController();

				const endPoint = "/api/auth/local";

				const data = await OwnAxios.client
					.post<SignInResponse>(
						endPoint,
						{
							identifier: String(identifier).trim(),
							password: String(password).trim(),
						},
						{
							signal: reqController.signal,
						}
					)
					.then(response => response.data)
					.catch(error => {
						reqController.abort();
						const errorName = error?.response?.data?.error?.name;

						if (errorName === "ValidationError") {
							if (window) {
								alert(
									"A autenticação falhou, verifique suas credenciais."
								);
							}
							return;
						}

						if (window) {
							alert(
								"A autenticação falhou, tente novamente mais tarde."
							);
						}
					});

				if (!data) {
					get().signOut();
					return;
				}

				if (data) {
					// console.log("[UserSessionStorage:signIn] - Auth data...", data);

					set({
						user: {
							id: String(data.user.id),
							email: String(data.user.email),
						},
						status: "authenticated",
						token: String(data.jwt),
						expiresAt: dayjs(Date.now())
							.add(24, "hours")
							.toISOString(),
					});

					OwnAxios.setAuthHeader(data.jwt);

					await getUserDetails();
				}
			};

			const signOut = async () => {
				set({
					status: "unsigned",
					user: undefined,
					author: undefined,
					token: "",
					expiresAt: "",
				});
				OwnAxios.setAuthHeader();
			};

			const tryRefresh = async () => {
				// console.log("[UserSessionStorage:tryRefresh] - Trying refresh...");

				const token = get().token;
				const expiresAt = get().expiresAt;

				const isAuthenticated = get().status === "authenticated";

				if (!isAuthenticated) {
					return;
				}

				const isExpired =
					expiresAt && dayjs().isAfter(dayjs(expiresAt));

				if (isAuthenticated && isExpired) {
					alert("Sua sessão expirou, autentique-se novamente.");
					get().signOut();
					return;
				}

				if (isAuthenticated) {
					OwnAxios.setAuthHeader(token);
					await getUserDetails();
				}
			};

			return {
				user: undefined,
				author: undefined,
				status: "unsigned",
				token: "",
				expiresAt: "",
				signIn: signIn,
				signOut: signOut,
				tryRefresh: tryRefresh,
			};
		},
		{
			name: STORAGE_KEYS.USER_SESSION,
			getStorage: () => localStorage,
			version: STORAGE_VERSION,
		}
	)
);

export default useUserSession;
