import { Menu, MenuItem, Divider } from "@mui/material";
import { FaFeatherAlt, FaUserEdit } from "react-icons/fa";
import { RiPagesFill } from "react-icons/ri";
import { MouseEvent } from "react";
import { GoSignOut } from "react-icons/go";
import EditorPanel from "../panels/EditorPanel";
import dftStyles from "./AuthorMenuDialog.module.css";
import useArticleFormStorage from "../../stores/ArticleFormStorage";

export type AuthorMenuDialogCloseHandler = (args?: {
	ev?: MouseEvent<HTMLButtonElement>;
	reason?: string;
}) => Promise<void> | void;

type AuthorMenuDialogProps = {
	isOpen: boolean;
	onClose: AuthorMenuDialogCloseHandler;
	customPanelSetter: React.Dispatch<React.SetStateAction<React.ReactNode>>;
	anchorEl?: HTMLElement;
};

const AuthorMenuDialog = (props: AuthorMenuDialogProps) => {
	const articleFormStatus = useArticleFormStorage(s => s.status);
	const articleCreationSetup = useArticleFormStorage(
		s => s.articleCreationSetup
	);

	return (
		<Menu
			id="author-menu-dialog"
			anchorEl={props.anchorEl}
			open={props.isOpen}
			onClose={(ev, reason) => props.onClose()}
			// MenuListProps={{
			// 	"aria-labelledby": "basic-button",
			// }}
			anchorOrigin={{
				vertical: "center",
				horizontal: "left",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "right",
			}}
			classes={{
				paper: dftStyles.dialogMenuPaper,
			}}
			disableScrollLock
		>
			<MenuItem
				onClick={async () => {
					props.onClose();

					const isAllowed = confirm("Iniciar uma nova publicação?");
					if (!isAllowed) {
						return;
					}

					await articleCreationSetup();
					props.customPanelSetter(<EditorPanel />);
				}}
			>
				<FaFeatherAlt />
				Nova publicação
			</MenuItem>

			<Divider />

			<MenuItem
				onClick={() => {
					props.onClose();
					props.customPanelSetter(<EditorPanel />);
				}}
			>
				<RiPagesFill />
				Abrir editor
			</MenuItem>

			<MenuItem
				onClick={() => {
					props.onClose();
				}}
			>
				<FaUserEdit />
				Editar perfil
			</MenuItem>

			<Divider />

			<MenuItem
				onClick={() => {
					props.onClose();
				}}
			>
				<GoSignOut />
				Sign out
			</MenuItem>
		</Menu>
	);
};

export default AuthorMenuDialog;
