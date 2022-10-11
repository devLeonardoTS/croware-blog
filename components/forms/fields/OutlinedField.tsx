import { TextField, TextFieldProps } from "@mui/material";
import dftStyles from "./OutlinedField.module.css";

const OutlinedField = (props: TextFieldProps) => {
	return (
		<TextField
			{...props}
			variant="outlined"
			size="small"
			className={dftStyles.control}
			SelectProps={{
				MenuProps: {
					PopoverClasses: {
						root: dftStyles.selectMenuPopover,
					},
				},
			}}
			InputLabelProps={{
				classes: {
					outlined: dftStyles.label,
					focused: dftStyles.labelOnFocus,
					error: dftStyles.labelOnError,
				},
			}}
			InputProps={{
				classes: {
					input: dftStyles.input,
					notchedOutline: dftStyles.inputOutlined,
					focused: dftStyles.inputOnFocus,
					error: dftStyles.inputOnError,
				},
			}}
			FormHelperTextProps={{
				classes: {
					root: dftStyles.helper,
					error: dftStyles.helperOnError,
				},
			}}
		>
			{props.children}
		</TextField>
	);
};

export default OutlinedField;
