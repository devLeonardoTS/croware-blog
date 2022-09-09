import dayjs from "dayjs";
import {
	createContext,
	FC,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
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
};

// Context.
const UserSessionCtx = createContext<SessionContextType | undefined>(undefined);

const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
	const [user, setUser] = useState<SessionUser | undefined>(undefined);
	const [status, setStatus] = useState<SessionStatus>("unsigned");

	const signIn = async ({ identifier, password }: UserCredentials) => {
		setStatus("loading");

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

		if (data) {
			// console.log("Auth data:", data);
			setUser({
				id: String(data.user.id),
				email: String(data.user.email),
			});
			setStatus("authenticated");
			OwnAxios.setAuthHeader(data.jwt);

			localStorage.setItem(
				AUTHENTICATED_USER_LSK,
				JSON.stringify({
					user: {
						id: data.user.id,
						email: data.user.email,
					},
					jwt: data.jwt,
					expiresAt: dayjs(Date.now()).add(1, "minutes").toISOString(),
				})
			);
		}
	};

	const signOut = async () => {
		setStatus("unsigned");
		setUser(undefined);
		OwnAxios.setAuthHeader();
		localStorage.removeItem(AUTHENTICATED_USER_LSK);
	};

	const tryRefresh = async () => {
		const storedUser = localStorage.getItem(AUTHENTICATED_USER_LSK);
		if (!storedUser) {
			return;
		}

		const { user: userData, jwt, expiresAt } = JSON.parse(storedUser);

		const isExpired = expiresAt && dayjs().isAfter(dayjs(expiresAt));
		if (isExpired) {
			console.log("Session expired, please log in again!");
			signOut();
			return;
		}

		setUser(userData);
		setStatus("authenticated");
		OwnAxios.setAuthHeader(jwt);
	};

	useEffect(() => {
		if (!user) {
			tryRefresh();
		}
	});

	return (
		<UserSessionCtx.Provider value={{ user, status, signIn, signOut }}>
			{children}
		</UserSessionCtx.Provider>
	);
};

const useSessionContext = () => {
	return useContext(UserSessionCtx);
};

export { SessionProvider, useSessionContext };
