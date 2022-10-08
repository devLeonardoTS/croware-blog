import {
	Button,
	Divider,
	FormHelperText,
	IconButton,
	MenuItem,
	Modal,
	TextField,
} from "@mui/material";
import { Formik, FormikHelpers, useFormik } from "formik";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import { ReactNode, useState, useEffect } from "react";
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
	hashtags: string;
	hashtagsArr: string[];
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

type HashtagsListProps = {
	hashtags?: string[];
	rmvTag: (tag: string) => Promise<void>;
};

const HashtagsList = ({ hashtags, rmvTag }: HashtagsListProps) => {
	return (
		<div className={dftStyles.hashtagsContainer}>
			<ul className={dftStyles.hashtagList}>
				{hashtags?.map(tag => (
					<li
						key={nanoid()}
						className={dftStyles.hashtag}
						onClick={() => rmvTag(tag)}
					>
						<p>
							<small>{tag}</small>
						</p>
					</li>
				))}
			</ul>
		</div>
	);
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
	hashtagsArr: Yup.array(
		Yup.string()
			.trim()
			.min(1, m => `Uma hashtag está vazia.`)
			.max(5, m => `A hashtag "${m.value}" passa de ${m.max} caracteres`)
	).nullable(),
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

	const handleHashtagsHelperTxt = () => {
		const hasValue = Boolean(formik.values?.hashtags);
		const hasError = Boolean(formik.errors?.hashtagsArr);
		if (hasError) {
			const errors = formik?.errors?.hashtagsArr;
			if (typeof errors === "string") {
				return (<sub>{errors}</sub>) as ReactNode;
			}
			if (Array.isArray(errors)) {
				return (<sub>{errors.at(-1)}</sub>) as ReactNode;
			}
		} else {
			return (<sub>{"Separe as tags com vírgulas"}</sub>) as ReactNode;
		}
	};

	useEffect(() => {
		console.log("hashtagsArr", formik.values.hashtagsArr);
		console.log("Any error?", formik.errors.hashtagsArr);
	}, [formik]);

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
								<div className={dftStyles.hashtagsField}>
									<OwnOutlinedField
										type="text"
										id="new-pub-hashtags"
										label="Hashtags"
										variant="outlined"
										classes={{
											root: dftStyles.field,
										}}
										{...formik.getFieldProps("hashtags")}
										onChange={async ev => {
											const value = ev.target.value;
											const isLastKeyAComma = value?.at(-1) === ",";
											if (isLastKeyAComma) {
												const hashtagsArr = formik.values.hashtagsArr;
												const newHashtag = value.replaceAll(",", "").trim();
												if (newHashtag) {
													await formik.setFieldValue("hashtagsArr", [
														...hashtagsArr,
														newHashtag,
													]);
												}
												await formik.setFieldValue("hashtags", "");
												return;
											}
											// console.log(value?.at(-1) === ",");
											await formik.setFieldValue("hashtags", value);
										}}
										// helperText={handleHashtagsHelperTxt()}
										error={
											(formik.errors?.hashtagsArr as Array<string>)?.length > 0
										}
									/>
									<HashtagsList
										hashtags={formik.values.hashtagsArr}
										rmvTag={async tag => {
											const hashtagsArr = formik.values.hashtagsArr;
											const withoutSelectedTag = hashtagsArr.filter(
												item => item !== tag
											);
											await formik.setFieldValue(
												"hashtagsArr",
												withoutSelectedTag
											);
										}}
									/>
									<p
										className={
											(formik.errors.hashtagsArr as Array<string>)?.length > 0
												? dftStyles.fieldOnError
												: "px-4"
										}
									>
										{handleHashtagsHelperTxt()}
									</p>
								</div>
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
