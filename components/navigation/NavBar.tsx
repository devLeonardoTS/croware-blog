import React, { useEffect, useState } from "react";
import dftStyles from "./NavBar.module.css";
import { BiMenu } from "react-icons/bi";
import Image from "next/image";
import { IconButton, SwipeableDrawer } from "@mui/material";
import { IMG_CROWARE_LOGO } from "../../helpers/constants/assetUrls";
import LinksBar from "./LinksBar";
import useNavigationStorage from "../../stores/NavigationStorage";
import NavDrawer from "./NavDrawer";

type NavbarProps = {};

const NavBar = ({}: NavbarProps) => {
	const navLinks = useNavigationStorage(s => s.mainLinks);
	const currentLink = useNavigationStorage(s => s.current);
	const previousLink = useNavigationStorage(s => s.previous);

	const [isDrawerOpen, setIsDrawerOpen] = useState(false);

	useEffect(() => {
		console.log("[NavBar:links]", navLinks);
		console.log("[NavBar:currentLink]", currentLink);
		console.log("[NavBar:previousLink]", previousLink);
	});

	return (
		<nav className={dftStyles.container}>
			<div className={dftStyles.logo}>
				<a href={"/"} className={dftStyles.link}>
					<Image
						src={IMG_CROWARE_LOGO}
						width={"100%"}
						height={28}
						className={dftStyles.image}
						alt="Croware's Logo"
					/>
				</a>
			</div>
			<div className={dftStyles.linksGroup}>
				<LinksBar
					links={navLinks}
					current={currentLink}
					rootProps={{
						className: dftStyles.linksBar,
					}}
					listItemProps={{
						className: dftStyles.linksBarItems,
					}}
				/>
				<a href={currentLink.path} className={dftStyles.current}>
					{currentLink.name}
				</a>
				<div className={dftStyles.buttons}>
					<IconButton
						onClick={() => setIsDrawerOpen(true)}
						className={dftStyles.btnDrawer}
					>
						<BiMenu />
					</IconButton>
				</div>
				<div className={dftStyles.drawer}>
					<NavDrawer
						drawerProps={{
							open: isDrawerOpen,
							onOpen: () => setIsDrawerOpen(true),
							onClose: () => setIsDrawerOpen(false),
						}}
					/>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;

/** Requisitos.
 *
 * UI - Mobile.
 *
 * 1. Contém o Logo.
 * 		1.1. Ao clicar: Redireciona o usuário para Home.
 * 2. Contém o nome do contexto de página atual (Home, Artigos, Eventos).
 * 3. Contém o botão para abrir menu de navegação (Drawer).
 * 		3.1. Conteúdos do menu de navegação (Drawer).
 * 			3.1.1. Botão para fechar.
 * 			3.1.2. Área de autenticação do autor. (Sign-in/out).
 * 			3.1.3. Accordion aberto, contém links para as páginas: Artigos, Eventos, Projetos.
 * 			3.1.4. Seção para links institucionais: Sobre.
 *
 * UI - Tablet / Desktop.
 *
 * 1. Exibe alguns links principais contidos no drawer de navegação.
 * 		1.1. Links importantes: Artigos, Eventos, Projetos e Sobre.
 *
 * Funcionalidades.
 *
 * 1. Autenticação do autor.
 * 		1.1. O autor continuará autenticado por 24 horas.
 * 		1.2. A autenticação deve persistir ao navegar pela página (JWT - localstorage).
 * 		1.3. Ao desconectar os dados de autenticação devem ser removidos.
 * 2. Gerenciamento da navegação.
 * 		2.1. Dado o acesso a uma página, o link na barra de navegação deve possuir destaque.
 * 			2.1.1. Se "/artigos" - O link para "Artigos" deve possuir destaque.
 **/
