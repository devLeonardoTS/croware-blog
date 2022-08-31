import { nanoid } from "nanoid";
import Link from "next/link";
import React from "react";
import { OptStyles } from "../../@types/styling-types";
import { StyleHandler } from "../../helpers/styling-utils";

type NavlinksStyles = {
	[key: string]: string | undefined;
	linkList?: string;
};

type NavlinksProps = {
	dftStyles: NavlinksStyles;
	optStyles?: OptStyles<NavlinksStyles>;
};

function mkLink(name: string, path: string) {
	return {
		id: nanoid(),
		name,
		path,
	};
}

const data = [
	mkLink("Artigos", "/articles"),
	mkLink("Eventos", "/events"),
	mkLink("Projetos", "/projects"),
	mkLink("Sobre", "/about"),
];

const tempLinks = data.map(link => {
	return (
		<li key={link.id}>
			<Link href={link.path}>
				<a>{link.name}</a>
			</Link>
		</li>
	);
});

export default function NavLinks({ dftStyles, optStyles }: NavlinksProps) {
	const styles: NavlinksStyles = StyleHandler({
		default: dftStyles,
		optional: optStyles,
	});

	return <menu className={styles.linkList || undefined}>{tempLinks}</menu>;
}
