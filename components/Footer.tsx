import React from "react";
import dftStyles from "./Footer.module.css";

export default function Footer() {
	return (
		<footer className={dftStyles.container}>
			<div className={dftStyles.content}>
				<small
					style={{
						fontWeight: "bold",
					}}
				>
					© 2022 -{" "}
					<a href="https://github.com/devLeonardoTS/croware-blog">
						<small>Croware-tech</small>
					</a>
					.
				</small>
			</div>
		</footer>
	);
}
