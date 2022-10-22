import OutlinedButton from "../forms/buttons/OutlinedButton";
import dftStyles from "./DrawerUserInfo.module.css";

type DrawerUserInfoProps = {
	user: string;
	signOutHandler: () => Promise<void> | void;
};

const DrawerUserInfo = ({ user, signOutHandler }: DrawerUserInfoProps) => {
	return (
		<div className={dftStyles.container}>
			<div className={dftStyles.content}>
				<div className={dftStyles.info}>
					<p>{user}</p>
				</div>
				<div className={dftStyles.actions}>
					<a href={"/authors/profile"}>
						<OutlinedButton>{"Dashboard"}</OutlinedButton>
					</a>
					<OutlinedButton onClick={signOutHandler}>{"Sair"}</OutlinedButton>
				</div>
			</div>
		</div>
	);
};

export default DrawerUserInfo;
