import { useFormik } from "formik";
import { useEffect } from "react";

import {
	localAuthSchema,
	UserCredentials,
} from "../../stores/UserSessionStore";
import OutlinedButton from "../forms/buttons/OutlinedButton";
import OutlinedField from "../forms/fields/OutlinedField";
import dftStyles from "./DrawerSignInForm.module.css";

type DrawerSignInFormProps = {
	signInHandler: (credentials: UserCredentials) => Promise<void> | void;
};

const DrawerSignInForm = ({ signInHandler }: DrawerSignInFormProps) => {
	const formik = useFormik<UserCredentials>({
		initialValues: {
			identifier: "",
			password: "",
		},
		validationSchema: localAuthSchema,
		onSubmit: (values, fHelpers) => {
			signInHandler({
				identifier: values.identifier,
				password: values.password,
			});
		},
	});

	return (
		<form onSubmit={formik.handleSubmit} className={dftStyles.container}>
			<div className={dftStyles.fieldGroup}>
				<OutlinedField
					type="text"
					id="txtIdentifier"
					name="identifier"
					label="E-mail *"
					variant="outlined"
					value={formik.values.identifier}
					onChange={formik.handleChange}
					error={Boolean(formik.errors?.["identifier"])}
					helperText={formik.errors?.["identifier"]}
					classes={{
						root: dftStyles.field,
					}}
				/>
			</div>
			<div className={dftStyles.fieldGroup}>
				<OutlinedField
					type="password"
					id="txtPassword"
					name="password"
					label="Senha *"
					variant="outlined"
					value={formik.values.password}
					onChange={formik.handleChange}
					error={Boolean(formik.errors?.["password"])}
					helperText={formik.errors?.["password"]}
					classes={{
						root: dftStyles.field,
					}}
				/>
			</div>
			<div className={dftStyles.actionGroup}>
				<OutlinedButton
					buttonProps={{
						type: "submit",
					}}
				>
					{"Entrar"}
				</OutlinedButton>
			</div>
		</form>
	);
};

export default DrawerSignInForm;
