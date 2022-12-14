import { IconButton } from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiMenu } from "react-icons/bi";

import Assets from "../../helpers/constants/Assets";
import useNavigationStorage, {
	MainNavStateType,
} from "../../stores/NavigationStorage";
import Tooltip from "../Tooltip";
import LinksBar from "./LinksBar";
import dftStyles from "./NavBar.module.css";
import NavDrawer from "./NavDrawer";

type NavbarProps = {};

const NavBar = ({}: NavbarProps) => {
	const navLinks = useNavigationStorage(s => s.mainLinks);
	const currentLink = useNavigationStorage(s => s.current);
	const previousLink = useNavigationStorage(s => s.previous);

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [navData, setNavData] = useState<MainNavStateType>();

	useEffect(() => {
		// Conflict fix for SSR x CSR.
		setNavData({
			mainLinks: navLinks,
			current: currentLink,
			previous: previousLink,
		});
	}, [currentLink, navLinks, previousLink]);

	return (
		<nav className={dftStyles.container}>
			<div className={dftStyles.logo}>
				<a href={"/"} className={dftStyles.link}>
					<Image
						src={Assets.app.logotype}
						width={"100%"}
						height={28}
						className={dftStyles.image}
						alt="Croware's Logo"
					/>
				</a>
			</div>
			<div className={dftStyles.linksGroup}>
				<LinksBar
					links={navData?.mainLinks}
					current={navData?.current}
					rootProps={{
						className: dftStyles.linksBar,
					}}
					listItemProps={{
						className: dftStyles.linksBarItems,
					}}
				/>
				<Tooltip
					muiTooltipProps={{
						title: navData?.current.name,
						placement: "bottom-start",
						arrow: true,
					}}
				>
					<a href={navData?.current.path} className={dftStyles.current}>
						{navData?.current.name}
					</a>
				</Tooltip>
				<div className={dftStyles.buttons}>
					<IconButton
						onClick={() => setIsDrawerOpen(true)}
						className={dftStyles.btnDrawer}
					>
						<BiMenu />
					</IconButton>
				</div>
			</div>
			<NavDrawer
				isOpen={isDrawerOpen}
				toggleDrawer={setIsDrawerOpen}
				links={navLinks}
				currentLink={currentLink}
			/>
		</nav>
	);
};

export default NavBar;

/** Requisitos.
 *
 * UI - Mobile.
 *
 * 1. Cont??m o Logo.
 * 		1.1. Ao clicar: Redireciona o usu??rio para Home.
 * 2. Cont??m o nome do contexto de p??gina atual (Home, Artigos, Eventos).
 * 3. Cont??m o bot??o para abrir menu de navega????o (Drawer).
 * 		3.1. Conte??dos do menu de navega????o (Drawer).
 * 			3.1.1. Bot??o para fechar.
 * 			3.1.2. ??rea de autentica????o do autor. (Sign-in/out).
 * 			3.1.3. Accordion aberto, cont??m links para as p??ginas: Artigos, Eventos, Projetos.
 * 			3.1.4. Se????o para links institucionais: Sobre.
 *
 * UI - Tablet / Desktop.
 *
 * 1. Exibe alguns links principais contidos no drawer de navega????o.
 * 		1.1. Links importantes: Artigos, Eventos, Projetos e Sobre.
 *
 * Funcionalidades.
 *
 * 1. Autentica????o do autor.
 * 		1.1. O autor continuar?? autenticado por 24 horas.
 * 		1.2. A autentica????o deve persistir ao navegar pela p??gina (JWT - localstorage).
 * 		1.3. Ao desconectar os dados de autentica????o devem ser removidos.
 * 2. Gerenciamento da navega????o.
 * 		2.1. Dado o acesso a uma p??gina, o link na barra de navega????o deve possuir destaque.
 * 			2.1.1. Se "/artigos" - O link para "Artigos" deve possuir destaque.
 **/
