import {
	FormControl,
	InputLabel,
	Select,
	FormControlProps,
	InputLabelProps,
	SelectProps,
	FormHelperText,
} from "@mui/material";
import { nanoid } from "nanoid";
import { ReactNode, useState } from "react";
import dftStyles from "./SelectField.module.css";

type SelectFieldProps = {
	label: string;
	error?: boolean;
	helperTxt?: string;
	children?: ReactNode;
	formControlProps?: FormControlProps;
	inputLabelProps?: InputLabelProps;
	selectProps?: SelectProps;
};

const SelectField = ({
	label,
	error,
	helperTxt,
	children,
	formControlProps,
	inputLabelProps,
	selectProps,
}: SelectFieldProps) => {
	const [labelId, setLabelId] = useState(nanoid());

	return (
		<FormControl
			{...formControlProps}
			className={dftStyles.control}
			size="small"
			error={error}
		>
			<InputLabel
				{...inputLabelProps}
				id={labelId}
				className={dftStyles.label}
				classes={{
					outlined: dftStyles.label,
					focused: dftStyles.labelOnFocus,
					error: dftStyles.labelOnError,
					filled: dftStyles.labelFilled,
				}}
			>
				{label}
			</InputLabel>
			<Select
				{...selectProps}
				labelId={labelId}
				label={label}
				className={dftStyles.select}
				MenuProps={{
					MenuListProps: {
						classes: {
							root: dftStyles.selectMenuList,
						},
					},
				}}
			>
				{children}
			</Select>
			{helperTxt && (
				<FormHelperText
					classes={{
						root: dftStyles.helperText,
						error: dftStyles.helperTextOnError,
					}}
				>
					{helperTxt}
				</FormHelperText>
			)}
		</FormControl>
	);
};

export default SelectField;
