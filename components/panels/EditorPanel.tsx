import {
	Button,
	Divider,
	IconButton,
	MenuItem,
	Modal,
	TextField,
} from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import dynamic from "next/dynamic";
import { ReactNode, useState } from "react";
import { IoClose } from "react-icons/io5";
import * as Yup from "yup";
import OwnImageInput from "../forms/OwnImageInput";
import OwnOutlinedField from "../forms/OwnOutlinedField";
import OwnSelectField from "../forms/OwnSelectField";
import dftStyles from "./EditorPanel.module.css";

type EditorPanelProps = {};

type ViewPublicationModalProps = {
	editorContent: string;
	closeHandler: () => void;
};

type NewPublicationType = {
	title: string;
	excerpt: string;
	category: string;
	author: string;
	hashtags: string[];
	colaborators: string[];
	content: string;
	thumbnail?: File;
};

const OwnCkEditor = dynamic(
	async () => {
		const m = await import("../editor/OwnCKEditor");
		return m.default;
	},
	{
		ssr: false,
		loading: () => <div>Loading the editor...</div>,
	}
);

const newPubInit: NewPublicationType = {
	title: "",
	excerpt: "",
	category: "",
	author: "",
	hashtags: [],
	colaborators: [],
	content: "",
	thumbnail: undefined,
};
const newPubOnSubmit = (
	values: NewPublicationType,
	helpers: FormikHelpers<NewPublicationType>
) => {
	console.log("Submitted values:", values);
};

const newPubValidationSchema = Yup.object({
	title: Yup.string(),
});

const ViewPublicationModal = ({
	editorContent,
	closeHandler,
}: ViewPublicationModalProps) => {
	return (
		<div className={dftStyles.previewModalContainer}>
			<div className={dftStyles.modalContent}>
				<div className={dftStyles.head}>
					<div className={dftStyles.title}>
						<h2>Pré visualização</h2>
					</div>
					<div className={dftStyles.buttons}>
						<IconButton
							classes={{
								root: dftStyles.headButton,
							}}
							onClick={() => closeHandler()}
						>
							<IoClose />
						</IconButton>
					</div>
				</div>

				<Divider />

				<div
					className={`ck-content${dftStyles.body ? " " + dftStyles.body : ""}`}
					dangerouslySetInnerHTML={{
						__html: editorContent || "<p>Você ainda não escreveu nada...</p>",
					}}
				></div>
			</div>
		</div>
	);
};

const EditorPanel = ({}: EditorPanelProps) => {
	const [editorContent, setEditorContent] = useState("");

	const [modal, setModal] = useState<ReactNode>(null);

	const handleCloseModal = () => {
		setModal(null);
	};

	const handleOpenModal = (element: JSX.Element) => {
		setModal(element);
	};

	const formik = useFormik<NewPublicationType>({
		initialValues: newPubInit,
		onSubmit: newPubOnSubmit,
		validationSchema: newPubValidationSchema,
	});

	return (
		<div className={dftStyles.container}>
			<div className={dftStyles.contentContainer}>
				<div className={dftStyles.head}>
					<h2>NOVA PUBLICAÇÃO</h2>
				</div>

				<div className={dftStyles.body}>
					<form className={dftStyles.form}>
						<div className={dftStyles.inputGroup}>
							<div className={dftStyles.fieldsRow}>
								<OwnImageInput
									name="thumbnail"
									file={formik.values.thumbnail}
									inputProps={{
										onChange: ev => {
											const file = ev.target.files?.[0];
											formik.setFieldValue("thumbnail", file);
										},
									}}
									controlClasses={dftStyles.imageInput}
									legend="Thumbnail"
								/>
							</div>
							<OwnOutlinedField
								type="text"
								id="new-pub-title"
								label="Título"
								variant="outlined"
								classes={{
									root: dftStyles.field,
								}}
								{...formik.getFieldProps("title")}
							/>
							<OwnOutlinedField
								type="text"
								id="new-pub-excerpt"
								label="Resumo"
								variant="outlined"
								classes={{
									root: dftStyles.field,
								}}
								{...formik.getFieldProps("excerpt")}
							/>

							<div className={dftStyles.fieldsRow}>
								{/* <OwnSelectField
									label="Hashtags"
									formControlProps={{
										variant: "outlined",
									}}
									selectProps={{
										...formik.getFieldProps("hashtags"),
										id: "new-pub-hashtags",
										multiple: true,
									}}
								>
									<MenuItem
										onClick={() => formik.setFieldValue("hashtags", [])}
									></MenuItem>
									<MenuItem value="Curiosidade">Curiosidade</MenuItem>
									<MenuItem value="Evento">Evento</MenuItem>
								</OwnSelectField> */}

								<OwnOutlinedField
									type="text"
									id="new-pub-hashtags"
									label="Hashtags"
									variant="outlined"
									classes={{
										root: dftStyles.field,
									}}
									{...formik.getFieldProps("hashtags")}
								/>
							</div>

							<div className={dftStyles.fieldsRow}>
								<OwnSelectField
									label="Categoria"
									formControlProps={{
										variant: "outlined",
									}}
									selectProps={{
										...formik.getFieldProps("category"),
										id: "new-pub-category",
									}}
								>
									<MenuItem
										onClick={() => formik.setFieldValue("category", "")}
									></MenuItem>
									<MenuItem value="Tecnologia">Tecnologia</MenuItem>
									<MenuItem value="Evento">Evento</MenuItem>
								</OwnSelectField>

								<OwnSelectField
									label="Colaboradores"
									formControlProps={{
										variant: "outlined",
									}}
									selectProps={{
										...formik.getFieldProps("colaborators"),
										id: "new-pub-colaborators",
										multiple: true,
									}}
								>
									<MenuItem
										onClick={() => formik.setFieldValue("colaborators", [])}
									></MenuItem>
									<MenuItem value="Riko">Riko</MenuItem>
									<MenuItem value="Reg">Reg</MenuItem>
									<MenuItem value="Nanachi">Nanachi</MenuItem>
								</OwnSelectField>
							</div>
						</div>
					</form>
					<div className={dftStyles.editor}>
						<OwnCkEditor
							name="editor"
							onChange={(data: any) => {
								// setEditorContent(data);
								formik.setFieldValue("content", data);
							}}
							value={formik.values.content}
						/>
					</div>
				</div>
				<div className={dftStyles.actions}>
					<Button variant="outlined" onClick={() => formik.handleSubmit()}>
						Salvar
					</Button>
					<Button
						onClick={() =>
							handleOpenModal(
								<ViewPublicationModal
									editorContent={formik.values.content}
									closeHandler={handleCloseModal}
								/>
							)
						}
						variant="outlined"
					>
						Visualizar
					</Button>
				</div>
			</div>
			<div className={dftStyles.modalContainer}>
				<Modal
					classes={{
						root: dftStyles.muiModal,
					}}
					open={Boolean(modal)}
					onClose={(ev, reason) => handleCloseModal()}
					aria-labelledby="actions-popup"
					aria-describedby="Selected action popup"
				>
					<>{modal}</>
				</Modal>
			</div>
		</div>
	);
};

export default EditorPanel;
