import "../styles/globals.css";
import "../styles/ckContentStyles.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Head from "next/head";
import { SessionProvider } from "../components/providers/SessionProvider";
import { useEffect } from "react";
import {
	useTryRefreshUserAuth,
	useUser,
} from "../components/providers/ZUserSession";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const user = useUser();
	const tryRefreshUserAuth = useTryRefreshUserAuth();

	useEffect(() => {
		if (!user) {
			tryRefreshUserAuth();
		}
	}, [user, tryRefreshUserAuth]);

	return (
		<Layout>
			<Head>
				<title>Croware-Tech Blog</title>
				<meta
					name="description"
					content="Croware-tech Blog - All things digital technology."
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{/* <SessionProvider> */}
			<Component {...pageProps} />
			{/* </SessionProvider> */}
		</Layout>
	);
}

export default MyApp;
