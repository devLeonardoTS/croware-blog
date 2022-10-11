import { MenuItem, Button, Modal } from "@mui/material";
import { nanoid } from "nanoid";
import HashtagsField from "./fields/HashtagsField";
import ImageField from "./fields/ImageField";
import OutlinedField from "./fields/OutlinedField";
import SelectField from "./fields/SelectField";
import dftStyles from "./ArticleForm.module.css";
import HashtagType from "./types/HashtagType";
import ArticleFormDataType from "./types/ArticleFormDataType";
import * as Yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import dynamic from "next/dynamic";
import { ReactNode, useState } from "react";
import ArticlePreviewModal, {
	ArticlePreviewCloseHandler,
} from "../modals/ArticlePreviewModal";
import OutlinedButton from "./buttons/OutlinedButton";

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

type ArticleFormProps = {
	initialValues?: ArticleFormDataType;
	onSubmit?: (values: ArticleFormDataType) => void | Promise<void>;
};

const dftValues: ArticleFormDataType = {
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

const articleValidationSchema = Yup.object({
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

const dftOnSubmit = async (
	values: ArticleFormDataType,
	formikHelpers: FormikHelpers<ArticleFormDataType>
) => {
	console.log("[ArticleForm] - Values:", values);
};

const ArticleForm = (props: ArticleFormProps) => {
	const formik = useFormik<ArticleFormDataType>({
		initialValues: dftValues,
		onSubmit: async (values, formikHelpers) => {
			if (typeof props.onSubmit === "function") {
				// Forward values to received onSubmitProp.
				await props.onSubmit(values);
				return;
			}
			dftOnSubmit(values, formikHelpers);
		},
		validationSchema: articleValidationSchema,
	});

	const getHashtagsHelperText = () => {
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

	const [isArticlePreviewOpen, setIsArticlePreviewOpen] = useState(false);

	const openArticlePreview = () => {
		setIsArticlePreviewOpen(true);
	};

	const closeArticlePreview: ArticlePreviewCloseHandler = args => {
		setIsArticlePreviewOpen(false);
	};

	return (
		<div className={dftStyles.container}>
			<div className={dftStyles.content}>
				<form className={dftStyles.form}>
					<div className={dftStyles.inputGroup}>
						<div className={dftStyles.row}>
							<ImageField
								name="thumbnail"
								file={formik.values.thumbnail}
								inputProps={{
									onChange: ev => {
										const file = ev.target.files?.[0];
										formik.setFieldValue("thumbnail", file);
									},
								}}
								controlStyles={dftStyles.imageInput}
								legend="Thumbnail"
							/>
						</div>
						<div className={dftStyles.row}>
							<OutlinedField
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
						</div>
						<div className={dftStyles.row}>
							<OutlinedField
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
						</div>
						<div className={dftStyles.row}>
							<HashtagsField
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
								helperText={getHashtagsHelperText()}
								error={Boolean(formik.errors.hashtags)}
							/>
						</div>

						<div className={dftStyles.row}>
							<SelectField
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
							</SelectField>

							<SelectField
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
							</SelectField>
						</div>

						<div className={dftStyles.row}>
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
					</div>
					<div className={dftStyles.actions}>
						<OutlinedButton onClick={() => formik.handleSubmit()}>
							Salvar
						</OutlinedButton>
						<OutlinedButton onClick={openArticlePreview}>
							Visualizar
						</OutlinedButton>
						<OutlinedButton
							onClick={() => {
								formik.resetForm();
								formik.setFieldValue("thumbnail", undefined);
							}}
						>
							Limpar
						</OutlinedButton>
					</div>
				</form>
			</div>
			<div className={dftStyles.modalContainer}>
				<ArticlePreviewModal
					isOpen={isArticlePreviewOpen}
					articleContent={formik.values.content}
					closeHandler={closeArticlePreview}
				/>
			</div>
		</div>
	);
};

export default ArticleForm;
