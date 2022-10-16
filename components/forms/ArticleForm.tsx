import { MenuItem } from "@mui/material";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import useArticleFormStorage, {
	ArticleFormDataType,
	ArticleFormOnSubmitHandler,
} from "../../stores/ArticleFormStorage";
import ArticlePreviewModal, {
	ArticlePreviewCloseHandler,
} from "../modals/ArticlePreviewModal";
import dftStyles from "./ArticleForm.module.css";
import OutlinedButton from "./buttons/OutlinedButton";
import HashtagsField from "./fields/HashtagsField";
import ImageField from "./fields/ImageField";
import OutlinedField from "./fields/OutlinedField";
import SelectField from "./fields/SelectField";
import HashtagType from "./types/HashtagType";

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
	currentValues?: ArticleFormDataType;
	formErrors?: Record<string, Array<string>>;
	validate?: () => Promise<void> | void;
	onSubmit?: ArticleFormOnSubmitHandler;
	resetForm?: () => Promise<void> | void;
	setCurrentFieldValue?: (
		fieldName: string,
		value: any,
		validateOnChange?: boolean
	) => Promise<void> | void;
};

// let renders = 0;

const ArticleForm = (props: ArticleFormProps) => {
	const currentValues = useArticleFormStorage(s => s.currentValues);
	const formErrors = useArticleFormStorage(s => s.errors);
	const setCurrentFieldValue = useArticleFormStorage(
		s => s.setCurrentFieldValue
	);
	const onSubmitHandler = useArticleFormStorage(s => s.onSubmitHandler);
	const resetForm = useArticleFormStorage(s => s.resetForm);

	const getHashtagsHelperText = () => {
		const hasValue = (currentValues.hashtagsArr?.length || []) > 0;
		const hasError = formErrors["hashtags"]?.length > 0;
		if (hasError) {
			return formErrors["hashtags"][0];
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

	const askPermission = (actionName: "submit" | "reset") => {
		switch (actionName) {
			case "submit":
				return confirm("Tem certeza que deseja salvar a publicação?");
			case "reset":
				return confirm(
					"Tem certeza que deseja reiniciar os campos da publicação?"
				);
			default:
				return false;
		}
	};

	// useEffect(() => {
	// 	console.log("[ArticleForm:initialValues]", initialValues);
	// 	console.log("[ArticleForm:currentValues]", currentValues);
	// 	console.log("[ArticleForm:errors]", formErrors);
	// });

	return (
		<div className={dftStyles.container}>
			<div className={dftStyles.content}>
				<form className={dftStyles.form}>
					<div className={dftStyles.inputGroup}>
						{/* <div className={dftStyles.row}>
							<p>Renders: {renders++}</p>
						</div> */}
						<div className={dftStyles.row}>
							<ImageField
								name="thumbnail"
								file={currentValues.thumbnail}
								inputProps={{
									onChange: ev => {
										const file = ev.target.files?.[0];
										if (file) {
											setCurrentFieldValue("thumbnail", file);
										}
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
								label="Título *"
								variant="outlined"
								classes={{
									root: dftStyles.field,
								}}
								value={currentValues.title}
								onChange={ev => {
									setCurrentFieldValue("title", ev.target.value);
								}}
								helperText={
									Boolean(formErrors["title"]) && formErrors["title"][0]
								}
								error={Boolean(formErrors["title"])}
							/>
						</div>
						<div className={dftStyles.row}>
							<OutlinedField
								type="text"
								id="new-pub-excerpt"
								name="excerpt"
								label="Resumo *"
								variant="outlined"
								classes={{
									root: dftStyles.field,
								}}
								value={currentValues.excerpt}
								onChange={ev =>
									setCurrentFieldValue("excerpt", ev.target.value)
								}
								helperText={
									Boolean(formErrors["excerpt"]) && formErrors["excerpt"][0]
								}
								error={Boolean(formErrors["excerpt"])}
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
									value: currentValues.hashtags,
									onChange: ev => {
										const value = ev.target.value;
										const isLastKeyAComma = value?.at(-1) === ",";
										const isValid = !formErrors["hashtags"];
										if (isLastKeyAComma && isValid) {
											setCurrentFieldValue("hashtags", "");

											const hashtagsArr = currentValues.hashtagsArr;
											if (!hashtagsArr) {
												return;
											}

											const cleanValue = value.replaceAll(",", "").trim();

											const isDuplicate = hashtagsArr.find(
												i => i.name === cleanValue
											);

											if (isDuplicate) {
												return;
											}

											if (cleanValue.length > 0) {
												const newHashtag: HashtagType = {
													id: nanoid(),
													name: cleanValue,
												};

												setCurrentFieldValue("hashtagsArr", [
													...hashtagsArr,
													newHashtag,
												]);

												return;
											}
										}

										setCurrentFieldValue("hashtags", value);
									},
								}}
								hashtagList={currentValues.hashtagsArr}
								removeHashtag={id => {
									const hashtagsArr = currentValues.hashtagsArr;
									if (!hashtagsArr) {
										return;
									}
									const withoutSelectedTag = hashtagsArr.filter(
										item => item.id !== id
									);

									setCurrentFieldValue("hashtagsArr", withoutSelectedTag);
								}}
								helperText={getHashtagsHelperText()}
								error={Boolean(
									formErrors["hashtags"] || formErrors["hashtagsArr"]
								)}
							/>
						</div>

						<div className={dftStyles.row}>
							<SelectField
								label="Categoria *"
								formControlProps={{
									variant: "outlined",
								}}
								selectProps={{
									id: "new-pub-category",
									name: "category",
									value: currentValues.category,
									onChange: ev =>
										setCurrentFieldValue("category", ev.target.value),
								}}
								helperText={
									Boolean(formErrors["category"]) && formErrors["category"][0]
								}
								error={Boolean(formErrors["category"])}
							>
								<MenuItem
									onClick={() => setCurrentFieldValue("category", "")}
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
									value: currentValues.colaborators,
									onChange: ev => {
										setCurrentFieldValue("colaborators", ev.target.value);
									},
								}}
								helperText={
									Boolean(formErrors["colaborators"]) &&
									formErrors["colaborators"][0]
								}
								error={Boolean(formErrors["colaborators"])}
							>
								<MenuItem
									onClick={() => setCurrentFieldValue("colaborators", [])}
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
										setCurrentFieldValue("content", data, false);
									}}
									value={currentValues.content}
								/>
							</div>
						</div>
					</div>
					<div className={dftStyles.actions}>
						<OutlinedButton
							onClick={() => {
								const isAllowed = askPermission("submit");
								if (isAllowed) {
									onSubmitHandler(currentValues);
								}
							}}
						>
							Salvar
						</OutlinedButton>
						<OutlinedButton onClick={openArticlePreview}>
							Visualizar
						</OutlinedButton>
						<OutlinedButton
							onClick={() => {
								const isAllowed = askPermission("reset");
								if (isAllowed) {
									resetForm();
								}
							}}
						>
							Reiniciar
						</OutlinedButton>
					</div>
				</form>
			</div>
			<div className={dftStyles.modalContainer}>
				<ArticlePreviewModal
					isOpen={isArticlePreviewOpen}
					articleContent={currentValues.content}
					closeHandler={closeArticlePreview}
				/>
			</div>
		</div>
	);
};

export default ArticleForm;
