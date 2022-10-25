import Button, { ButtonProps } from "@mui/material/Button";
import { MouseEventHandler, ReactNode } from "react";
import dftStyles from "./OutlinedButton.module.css";

type OutlinedButtonProps = {
	children?: ReactNode;
	buttonProps?: ButtonProps;
	onClick?: MouseEventHandler<HTMLButtonElement>;
};

const OutlinedButton = ({
	children,
	buttonProps,
	onClick,
}: OutlinedButtonProps) => {
	return (
		<Button
			classes={{
				root: dftStyles.button,
			}}
			variant="outlined"
			onClick={onClick}
			{...buttonProps}
		>
			{children}
		</Button>
	);
};

export default OutlinedButton;
