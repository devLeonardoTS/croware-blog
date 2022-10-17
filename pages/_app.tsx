import "../styles/globals.css";
import "../styles/ckContentStyles.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Head from "next/head";
import { useEffect } from "react";
import { useTryRefreshUserAuth, useUser } from "../stores/UserSessionStore";
import { StyledEngineProvider } from "@mui/material";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const user = useUser();
	const tryRefreshUserAuth = useTryRefreshUserAuth();

	useEffect(() => {
		if (!user) {
			tryRefreshUserAuth();
		}
	}, [user, tryRefreshUserAuth]);

	return (
		<StyledEngineProvider injectFirst>
			<Layout>
				<Head>
					<title>Croware-Tech Blog</title>
					<meta
						name="description"
						content="Croware-tech Blog - All things digital technology."
					/>
					<link rel="icon" href="/favicon.ico" />
				</Head>
				<Component {...pageProps} />
			</Layout>
		</StyledEngineProvider>
	);
}

export default MyApp;
