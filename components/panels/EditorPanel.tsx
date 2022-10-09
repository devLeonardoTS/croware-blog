import { Button, Divider, IconButton, MenuItem, Modal } from "@mui/material";
import { FormikHelpers, useFormik } from "formik";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import { ReactNode, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import * as Yup from "yup";
import HashtagsInput from "../forms/HashtagsInput";

import OwnImageInput from "../forms/OwnImageInput";
import OwnOutlinedField from "../forms/OwnOutlinedField";
import OwnSelectField from "../forms/OwnSelectField";
import HashtagType from "../forms/types/HashtagType";
import dftStyles from "./EditorPanel.module.css";

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
	hashtags: string;
	hashtagsArr: HashtagType[];
	colaborators: string[];
	content: string;
	thumbnail?: File;
};

const newPubInit: NewPublicationType = {
	title: "",
	excerpt: "",
	category: "",
	author: "",
	hashtags: "",
	hashtagsArr: [],
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
	hashtags: Yup.string()
		.trim()
		.max(5, m => `Sua hashtag passa de ${m.max} caracteres`),
	hashtagsArr: Yup.array().of(
		Yup.object().shape({
			id: Yup.string(),
			name: Yup.string()
				.trim()
				.max(5, m => `A hashtag "${m.value}" passa de ${m.max} caracteres`),
		})
	),
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

	const handleHashtagsHelperTxt = () => {
		const hasValue = formik.values?.hashtagsArr.length > 0;
		const hasError = Boolean(formik.errors.hashtags);
		if (hasError) {
			const error = formik.errors.hashtags;
			return error;
		}

		if (!hasValue) {
			return "Separe as tags com vírgulas";
		}
	};

	// useEffect(() => {
	// 	console.log("hashtagsArr", formik.values.hashtagsArr);
	// 	console.log("Any error?", formik.errors.hashtags);
	// }, [formik]);

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
								name="title"
								label="Título"
								variant="outlined"
								classes={{
									root: dftStyles.field,
								}}
								value={formik.values.title}
								onChange={formik.handleChange}
							/>
							<OwnOutlinedField
								type="text"
								id="new-pub-excerpt"
								name="excerpt"
								label="Resumo"
								variant="outlined"
								classes={{
									root: dftStyles.field,
								}}
								value={formik.values.excerpt}
								onChange={formik.handleChange}
							/>

							<div className={dftStyles.fieldsRow}>
								<HashtagsInput
									inputProps={{
										type: "text",
										id: "new-pub-hashtags",
										name: "hashtags",
										label: "Hashtags",
										variant: "outlined",
										classes: {
											root: dftStyles.field,
										},
										value: formik.values.hashtags,
										onChange: ev => {
											const value = ev.target.value;
											const isLastKeyAComma = value?.at(-1) === ",";
											const isValid = !formik.errors.hashtags;
											if (isLastKeyAComma && isValid) {
												const hashtagsArr = formik.values.hashtagsArr;
												const cleanValue = value.replaceAll(",", "").trim();

												const isDuplicate = hashtagsArr.find(
													i => i.name === cleanValue
												);

												formik.setFieldValue("hashtags", "");

												if (isDuplicate) {
													return;
												}

												if (cleanValue.length > 0) {
													const newHashtag: HashtagType = {
														id: nanoid(),
														name: cleanValue,
													};

													formik.setFieldValue(
														"hashtagsArr",
														[...hashtagsArr, newHashtag],
														false
													);

													return;
												}
											}

											formik.setFieldValue("hashtags", value);
										},
									}}
									hashtagList={formik.values.hashtagsArr}
									removeHashtag={id => {
										const hashtagsArr = formik.values.hashtagsArr;
										const withoutSelectedTag = hashtagsArr.filter(
											item => item.id !== id
										);
										formik.setFieldValue(
											"hashtagsArr",
											withoutSelectedTag,
											false
										);
									}}
									helperText={handleHashtagsHelperTxt()}
									error={Boolean(formik.errors.hashtags)}
								/>
							</div>

							<div className={dftStyles.fieldsRow}>
								<OwnSelectField
									label="Categoria"
									formControlProps={{
										variant: "outlined",
									}}
									selectProps={{
										id: "new-pub-category",
										name: "category",
										value: formik.values.category,
										onChange: formik.handleChange,
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
										id: "new-pub-colaborators",
										name: "colaborators",
										multiple: true,
										value: formik.values.colaborators,
										onChange: formik.handleChange,
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
								formik.setFieldValue("content", data, false);
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
