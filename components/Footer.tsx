import Link from "next/link";
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
					<Link href="https://github.com/croware-tech">
						<a>
							<small
								style={{
									color: "blue",
									fontWeight: "bold",
								}}
							>
								Croware-tech
							</small>
						</a>
					</Link>
					.
				</small>
			</div>
		</footer>
	);
}
