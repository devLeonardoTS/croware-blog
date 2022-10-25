import { SessionAuthor } from "../../stores/UserSessionStore";
import OutlinedButton from "../forms/buttons/OutlinedButton";
import dftStyles from "./DrawerUserInfo.module.css";

type DrawerUserInfoProps = {
	author: SessionAuthor;
	signOutHandler: () => Promise<void> | void;
};

const DrawerUserInfo = ({ author, signOutHandler }: DrawerUserInfoProps) => {
	return (
		<div className={dftStyles.container}>
			<div className={dftStyles.content}>
				<div className={dftStyles.info}>
					<p>{author.name}</p>
				</div>
				<div className={dftStyles.actions}>
					<a href={`/authors/${author.slug}`}>
						<OutlinedButton>{"Dashboard"}</OutlinedButton>
					</a>
					<OutlinedButton onClick={signOutHandler}>{"Sair"}</OutlinedButton>
				</div>
			</div>
		</div>
	);
};

export default DrawerUserInfo;
