import { MenuItem } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import { stringify } from "qs";
import { useState } from "react";
import slugify from "slugify";
import { OwnAxios } from "../../helpers/utilities/OwnAxios";
import { ArticleData } from "../../pages";

import useArticleFormStorage, {
	ArticleFormDataType,
	ArticleFormOnSubmitHandler,
} from "../../stores/ArticleFormStorage";
import useUserSession from "../../stores/UserSessionStore";
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

type ArticleFormCategory = {
	id: number;
	attributes: {
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
		name: string;
	};
};

const getCategories = async () => {
	const endPoint = "/api/article-categories";

	// console.log("[articleForm:getCategories] - started...");

	const response = await OwnAxios.client.get<{
		data: Array<ArticleFormCategory>;
	}>(endPoint);
	const result = response.data.data;

	// console.log("[articleForm:getCategories] - done...", result);

	return result;
};

const getColaborators = async () => {
	const endPoint = "/api/authors";

	// console.log("[articleForm:getColaborators] - started...");

	const response = await OwnAxios.client.get<{
		data: Array<ArticleFormCategory>;
	}>(endPoint);
	const result = response.data.data;

	// console.log("[articleForm:getColaborators] - done...", result);

	return result;
};

type ArticleActionArgs = {
	authorId: number;
	values: ArticleFormDataType;
};

const createArticleHandler = async ({
	authorId,
	values,
}: ArticleActionArgs) => {
	// console.log("[ArticleForm:createArticleHandler] - Starting...", values);

	const query = stringify(
		{
			populate: "*",
		},
		{
			encodeValuesOnly: true,
		}
	);

	const endPoint = `/api/articles?${query}`;
	const result = await OwnAxios.client
		.post<any>(endPoint, {
			data: {
				author: authorId,
				title: values.title,
				slug: slugify(String(values?.title), {
					trim: true,
					lower: true,
					strict: true,
				}),
				content: {
					excerpt: values.excerpt,
					body: values.content,
				},
				article_category: values.categoryId,
				article_hashtags: (values.hashtagsArr || []).map(i => i.name),
				colaborators: values.colaboratorIds,
				publishedAt: null,
			},
		})
		.then(response => response.data);

	// console.log("[ArticleForm:createArticleHandler] - Done...", result);

	return result;
};

type ArticleUpdateArgs = {
	authorId: number;
	updated: ArticleFormDataType;
	initial?: ArticleData;
};

export const updateArticleHandler = async ({
	authorId,
	initial,
	updated,
}: ArticleUpdateArgs) => {
	console.log("[ArticleForm:updateArticleHandler] - Starting...", {
		authorId,
		initial,
		updated,
	});

	const handleSlug = (value: string) => {
		return slugify(value, {
			trim: true,
			lower: true,
			strict: true,
		});
	};

	if (updated?.title) {
		updated.slug = handleSlug(updated.title);
	}

	const query = stringify(
		{
			populate: "*",
		},
		{
			encodeValuesOnly: true,
		}
	);

	const endPoint = `/api/articles/${initial?.id || updated.id}?${query}`;
	const result = await OwnAxios.client
		.put<any>(endPoint, {
			data: {
				title: updated.title || undefined,
				slug: updated.slug || undefined,
				content:
					updated.excerpt || updated.content
						? {
								excerpt: updated.excerpt || undefined,
								body: updated.content || undefined,
						  }
						: undefined,
				article_category: updated.categoryId || undefined,
				article_hashtags: updated.hashtagsArr
					? updated.hashtagsArr.map(i => i.name)
					: undefined,
				picture: updated.picture || undefined,
				colaborators:
					updated.colaboratorIds && updated.colaboratorIds?.length > 0
						? updated.colaboratorIds
						: undefined,
				publishedAt:
					updated.publishedAt === null ? null : updated.publishedAt,
			},
		})
		.then(response => response.data);

	// console.log("[ArticleForm:updateArticleHandler] - Done...", result);

	return result;
};

type ImageUploadHandlerArgs = {
	file: File;
};

const uploadImageHandler = async ({ file }: ImageUploadHandlerArgs) => {
	// console.log("[ArticleForm:uploadImageHandler] - Starting...", file);

	const endPoint = `/api/upload`;

	const formData = new FormData();
	formData.append("files", file);

	const result = await OwnAxios.client
		.post<any>(endPoint, formData)
		.then(response => response.data);
	// array of files;

	// console.log("[ArticleForm:uploadImageHandler] - Done...", result);

	return result;
};

const ArticleForm = (props: ArticleFormProps) => {
	const currentValues = useArticleFormStorage(s => s.currentValues);
	const formErrors = useArticleFormStorage(s => s.errors);
	const setCurrentFieldValue = useArticleFormStorage(
		s => s.setCurrentFieldValue
	);
	// const onSubmitHandler = useArticleFormStorage(s => s.onSubmitHandler);
	const validateForm = useArticleFormStorage(s => s.validate);
	const resetForm = useArticleFormStorage(s => s.resetForm);
	const clearForm = useArticleFormStorage(s => s.clearStorage);
	const formStatus = useArticleFormStorage(s => s.status);

	const author = useUserSession(s => s.author);

	const getHashtagsHelperText = () => {
		const hasValue = (currentValues.hashtagsArr?.length || []) > 0;
		const hasError = formErrors["hashtags"]?.length > 0;
		if (hasError) {
			return formErrors["hashtags"][0];
		}
		if (!hasValue) {
			return "Separe as tags com v??rgulas";
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
				return confirm("Tem certeza que deseja salvar a publica????o?");
			case "reset":
				return confirm(
					"Tem certeza que deseja reiniciar os campos da publica????o?"
				);
			default:
				return false;
		}
	};

	const queryCategories = useQuery(
		["get:article-form:categories"],
		getCategories,
		{
			staleTime: 10 * 1000,
		}
	);

	const queryColaborators = useQuery(
		["get:article-form:colaborators"],
		getColaborators,
		{
			staleTime: 10 * 1000,
		}
	);

	const articleMaker = useMutation(createArticleHandler);
	const articleUpdater = useMutation(updateArticleHandler);
	const imageUploader = useMutation(uploadImageHandler);

	// useEffect(() => {
	// 	// console.log("[ArticleForm:initialValues]", initialValues);
	// 	console.log("[ArticleForm:currentValues]", currentValues);
	// 	console.log("[ArticleForm:errors]", formErrors);
	// });

	const isFormLoading =
		queryCategories.isLoading || queryColaborators.isLoading;
	const hasFormLoadFailed =
		queryCategories.isError || queryColaborators.isError;

	if (isFormLoading) {
		return <div>{"Carregando formul??rio..."}</div>;
	}

	if (hasFormLoadFailed) {
		return (
			<div>
				{
					"N??o foi poss??vel carregar o formul??rio, tente novamente mais tarde."
				}
			</div>
		);
	}

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
								file={currentValues.thumbnailFile || undefined}
								imgUrl={currentValues.thumbnailUrl || ""}
								inputProps={{
									onChange: ev => {
										const file = ev.target.files?.[0];
										if (file) {
											setCurrentFieldValue(
												"thumbnailFile",
												file
											);
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
								label="T??tulo *"
								variant="outlined"
								classes={{
									root: dftStyles.field,
								}}
								value={currentValues.title}
								onChange={ev => {
									setCurrentFieldValue(
										"title",
										ev.target.value
									);
								}}
								helperText={
									Boolean(formErrors["title"]) &&
									formErrors["title"][0]
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
									setCurrentFieldValue(
										"excerpt",
										ev.target.value
									)
								}
								helperText={
									Boolean(formErrors["excerpt"]) &&
									formErrors["excerpt"][0]
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
										const isLastKeyAComma =
											value?.at(-1) === ",";
										const isValid = !formErrors["hashtags"];
										if (isLastKeyAComma && isValid) {
											setCurrentFieldValue(
												"hashtags",
												""
											);

											const hashtagsArr =
												currentValues.hashtagsArr;
											if (!hashtagsArr) {
												return;
											}

											const cleanValue = value
												.replaceAll(",", "")
												.trim();

											const isDuplicate =
												hashtagsArr.find(
													i => i.name === cleanValue
												);

											if (isDuplicate) {
												return;
											}

											if (cleanValue.length > 0) {
												const newHashtag: HashtagType =
													{
														id: nanoid(),
														name: cleanValue,
													};

												setCurrentFieldValue(
													"hashtagsArr",
													[...hashtagsArr, newHashtag]
												);

												return;
											}
										}

										setCurrentFieldValue("hashtags", value);
									},
								}}
								hashtagList={currentValues.hashtagsArr || []}
								removeHashtag={id => {
									const hashtagsArr =
										currentValues.hashtagsArr;
									if (!hashtagsArr) {
										return;
									}
									const withoutSelectedTag =
										hashtagsArr.filter(
											item => item.id !== id
										);

									setCurrentFieldValue(
										"hashtagsArr",
										withoutSelectedTag
									);
								}}
								helperText={getHashtagsHelperText()}
								error={Boolean(
									formErrors["hashtags"] ||
										formErrors["hashtagsArr"]
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
									value: currentValues.categoryId,
									disabled: queryCategories.isLoading,
									// onFocus: async ev => await fetchCategories(),
									onChange: ev => {
										setCurrentFieldValue(
											"categoryId",
											ev.target.value
										);
									},
								}}
								helperText={
									Boolean(formErrors["categoryId"]) &&
									formErrors["categoryId"][0]
								}
								error={Boolean(formErrors["categoryId"])}
							>
								<MenuItem
									key={nanoid()}
									onClick={() =>
										setCurrentFieldValue("categoryId", "")
									}
								></MenuItem>
								{queryCategories.data?.map(item => (
									<MenuItem key={nanoid()} value={item.id}>
										{item.attributes.name}
									</MenuItem>
								))}
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
									value: currentValues.colaboratorIds,
									disabled: queryColaborators.isLoading,
									maxRows: 4,
									// onFocus: ev => fetchColaborators(),
									onChange: ev => {
										setCurrentFieldValue(
											"colaboratorIds",
											ev.target.value
										);
									},
								}}
								helperText={
									Boolean(formErrors["colaboratorIds"]) &&
									formErrors["colaboratorIds"][0]
								}
								error={Boolean(formErrors["colaboratorIds"])}
							>
								<MenuItem
									key={nanoid()}
									onClick={() =>
										setCurrentFieldValue(
											"colaboratorIds",
											[]
										)
									}
								></MenuItem>
								{queryColaborators.data?.map(item => (
									<MenuItem key={nanoid()} value={item.id}>
										{item.attributes.name}
									</MenuItem>
								))}
							</SelectField>
						</div>

						<div className={dftStyles.row}>
							<div className={dftStyles.editor}>
								<OwnCkEditor
									name="editor"
									onChange={(data: any) => {
										setCurrentFieldValue(
											"content",
											data,
											false
										);
									}}
									value={currentValues.content || ""}
								/>
							</div>
						</div>
					</div>
					<div className={dftStyles.actions}>
						<OutlinedButton
							onClick={async () => {
								const isAllowed = askPermission("submit");
								if (!isAllowed) {
									return;
								}

								const errorsObj = await validateForm();
								console.log("hasErrors?", errorsObj);
								if (Object.keys(errorsObj).length > 0) {
									return;
								}

								if (formStatus === "creating") {
									if (!author?.id) {
										return;
									}

									const newArticle = await articleMaker
										.mutateAsync({
											authorId: author.id,
											values: currentValues,
										})
										.catch(error => {
											if (window) {
												alert(
													"N??o foi poss??vel salvar sua publica????o. Tente novamente mais tarde."
												);
											}
										});

									if (!newArticle?.data) {
										return;
									}

									if (currentValues?.thumbnailFile) {
										const uploadedImageData =
											await imageUploader
												.mutateAsync({
													file: currentValues.thumbnailFile,
												})
												.catch(() => {
													// Do nothing...
												});

										const imageData =
											uploadedImageData?.[0];

										if (imageData) {
											await articleUpdater
												.mutateAsync({
													authorId: author.id,
													initial: newArticle.data,
													updated: {
														picture: imageData,
													},
												})
												.catch(error => {
													// Do nothing again...
												});
										}
									}

									await clearForm();

									if (window) {
										alert(
											`Artigo salvo com sucesso! Verifique os "artigos armazenados" para torn??-la p??blica.`
										);

										window.location.reload();
									}
								}

								if (formStatus === "updating") {
									let imageData = undefined;

									if (currentValues?.thumbnailFile) {
										const uploadedImageData =
											await imageUploader
												.mutateAsync({
													file: currentValues.thumbnailFile,
												})
												.catch(() => {
													// Do nothing...
												});

										imageData = uploadedImageData?.[0];
									}

									await articleUpdater
										.mutateAsync({
											authorId: author?.id || -1,
											updated: {
												...currentValues,
												picture: imageData,
											},
										})
										.catch(error => {
											// Do nothing again...
										});

									await clearForm();

									if (window) {
										alert(`Artigo atualizado com sucesso!`);

										window.location.reload();
									}
								}
							}}
						>
							{formStatus === "creating" ? "Salvar" : "Atualizar"}
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
					articleContent={currentValues.content || ""}
					closeHandler={closeArticlePreview}
				/>
			</div>
		</div>
	);
};

export default ArticleForm;
