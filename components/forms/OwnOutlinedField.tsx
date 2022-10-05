import { TextField, TextFieldProps } from "@mui/material";
import dftStyles from "./OwnOutlinedField.module.css";

const OwnOutlinedField = (props: TextFieldProps) => {
	return (
		<TextField
			{...props}
			variant="outlined"
			size="small"
			className={dftStyles.control}
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
		/>
	);
};

export default OwnOutlinedField;
