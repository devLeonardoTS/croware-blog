import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import dftStyles from "../styles/NotFound.module.css";

const ServerError: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		const timerId = setTimeout(() => {
			// ToDo: Add all page paths to a TypeScript ENUM or Constants.
			router.push("/");
		}, 5000);

		return () => clearTimeout(timerId);
	}, [router]);

	return (
		<div className={dftStyles.container}>
			<h1>Oh no, something went wrong...</h1>
			<h2>That page cannot be served.</h2>
			<p>
				Go back to the{" "}
				<Link href="/">
					<a>Homepage</a>
				</Link>
			</p>
		</div>
	);
};

export default ServerError;
