import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import dftStyles from "./NotFound.module.css";

const NotFound = () => {
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
			<h1>Uh oh...</h1>
			<h2>That page cannot be found.</h2>
			<p>
				Go back to the{" "}
				<Link href="/">
					<a>Homepage</a>
				</Link>
			</p>
		</div>
	);
};

export default NotFound;
