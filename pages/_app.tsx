import "../styles/globals.css";
import "../styles/ckContentStyles.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import Head from "next/head";
import { useEffect } from "react";
import { StyledEngineProvider } from "@mui/material";
import useUserSession from "../stores/UserSessionStore";
import useNavigationStorage from "../stores/NavigationStorage";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const currentPage = useNavigationStorage(s => s.current);
	const tryUserRefresh = useUserSession(s => s.tryRefresh);

	useEffect(() => {
		tryUserRefresh();
	}, [tryUserRefresh]);

	return (
		<StyledEngineProvider injectFirst>
			<Layout>
				<Head>
					<title>{`Croware-Tech Blog - ${currentPage.name}`}</title>
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
