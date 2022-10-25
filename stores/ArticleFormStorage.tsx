import * as yup from "yup";
import create from "zustand";
import { persist } from "zustand/middleware";

import HashtagType from "../components/forms/types/HashtagType";
import { ArticleData } from "../pages";
import STORAGE_KEYS, { STORAGE_VERSION } from "./StorageKeys";

export type ArticleFormDataType = {
	[key: string]: any;
	id?: number | null;
	authorId?: number | null;
	title?: string | null;
	excerpt?: string | null;
	categoryId?: number | null;
	hashtags?: string | null;
	hashtagsArr?: HashtagType[] | null;
	colaboratorIds?: number[] | null;
	content?: string | null;
	thumbnailFile?: File | null;
	thumbnailId?: number | null;
	thumbnailUrl?: string | null;
	publishedAt?: string | null;
};

export type ArticleFormOnSubmitHandler = (
	values: ArticleFormDataType,
	authorId: string
) => void | Promise<void>;

export type ActionStatus = "idle" | "loading" | "success" | "fail";

export type ArticleFormStatus = "creating" | "updating";

export type FormErrorType = Record<string, Array<string>>;

export type ArticleFormStorageType = {
	status: ArticleFormStatus;

	initialValues: ArticleFormDataType;
	currentValues: ArticleFormDataType;

	errors: FormErrorType;

	validate: () => Promise<FormErrorType> | FormErrorType;

	setInitialValues: (values: ArticleFormDataType) => Promise<void> | void;
	setCurrentValues: (values: ArticleFormDataType) => Promise<void> | void;
	setCurrentFieldValue: (
		fieldName: string,
		value: any,
		validateOnChange?: boolean
	) => Promise<void> | void;

	resetForm: () => Promise<void> | void;
	clearStorage: () => Promise<void> | void;

	articleUpdateSetup: (article: ArticleData) => Promise<void> | void;
	articleCreationSetup: () => Promise<void> | void;
};

const articleSchema = yup.object().shape({
	title: yup
		.string()
		.required("Você esqueceu de nomear sua publicação")
		.max(50, m => `O título não deve passar de ${m.max} caracteres`),
	excerpt: yup
		.string()
		.required("O resumo é essencial para chamar a atenção do público")
		.max(512, m => `O resumo não deve passar de ${m.max} caracteres`),
	content: yup.string().optional().default(""),
	categoryId: yup.number().required("Selecione uma categoria"),
	hashtags: yup
		.string()
		.trim()
		.max(25, m => `Sua hashtag passa de ${m.max} caracteres`),
	hashtagsArr: yup.array().of(
		yup.object().shape({
			id: yup.string(),
			name: yup
				.string()
				.trim()
				.max(
					25,
					m => `A hashtag "${m.value}" passa de ${m.max} caracteres`
				),
		})
	),
});

const useArticleFormStorage = create<ArticleFormStorageType>()(
	persist(
		// @ts-ignore
		(set, get) => {
			const dftValues: ArticleFormDataType = {
				id: 0,
				title: "",
				excerpt: "",
				categoryId: undefined,
				authorId: 0,
				hashtags: "",
				hashtagsArr: [],
				colaboratorIds: [],
				content: "",
				thumbnailFile: undefined,
				thumbnailId: 0,
				thumbnailUrl: "",
				publishedAt: undefined,
			};

			// Validators

			const validate = async (values?: ArticleFormDataType) => {
				try {
					await articleSchema.validate(
						values || get().currentValues,
						{
							abortEarly: false,
						}
					);
					const cleanErrorList: FormErrorType = {};
					set({ errors: cleanErrorList });
					return cleanErrorList;
				} catch (error: any) {
					const validationError = error as yup.ValidationError;

					const errorList: FormErrorType = {};

					validationError.inner.forEach(item => {
						if (
							typeof item.path !== "undefined" &&
							typeof item.message === "string"
						) {
							const cleanPath = item.path.split("[")[0];
							errorList[cleanPath] = item.errors;
						}
					});

					set({ errors: errorList });
					return errorList;
				}
			};

			const validateField = async (fieldName: string) => {
				try {
					const isFieldValidatable = Object.keys(
						articleSchema.fields
					).includes(fieldName);

					if (!isFieldValidatable) {
						return;
					}

					await articleSchema.validateAt(
						fieldName,
						get().currentValues
					);

					const errorList = { ...get().errors };
					delete errorList[fieldName];

					set({ errors: errorList });
				} catch (error) {
					const validationError = error as yup.ValidationError;
					set({
						errors: {
							...get().errors,
							[fieldName]: validationError.errors,
						},
					});
				}
			};

			// Setters
			const setInitialValues = (values: ArticleFormDataType) => {
				set({ initialValues: { ...get().initialValues, ...values } });
			};

			const setCurrentValues = (values: ArticleFormDataType) =>
				set({ currentValues: { ...get().currentValues, ...values } });

			const setCurrentFieldValue = async (
				field: string,
				value: any,
				validateOnChange?: boolean
			) => {
				const currentValues = get().currentValues;

				let shouldValidate = validateOnChange;
				switch (typeof shouldValidate) {
					case "boolean":
						shouldValidate = validateOnChange;
						break;
					default:
						shouldValidate = true;
						break;
				}

				set({ currentValues: { ...currentValues, [field]: value } });
				if (shouldValidate) {
					await validateField(field);
				}
			};

			const clearStorage = () =>
				set({
					status: "creating",
					initialValues: dftValues,
					currentValues: dftValues,
					errors: {},
				});

			const resetForm = async () => {
				setCurrentValues(get().initialValues);
				await validate();
			};

			const articleUpdateSetup = (article: ArticleData) => {
				clearStorage();

				const articleToForm: ArticleFormDataType = {
					id: article.id,
					authorId:
						article.attributes.author?.data.id ||
						dftValues.authorId,
					title: article.attributes.title,
					excerpt:
						article.attributes.content?.excerpt ||
						dftValues.excerpt,
					categoryId:
						article.attributes.article_category?.data.id ||
						dftValues.categoryId,
					hashtags: dftValues.hashtags,
					hashtagsArr:
						article.attributes.article_hashtags?.data.map(i => {
							const tag: HashtagType = {
								id: String(i.id),
								name: i.attributes.tag,
							};
							return tag;
						}) || dftValues.hashtagsArr,
					colaboratorIds:
						article.attributes.colaborators?.data.map(i => i.id) ||
						dftValues.colaboratorIds,
					content:
						article.attributes.content?.body || dftValues.content,
					thumbnailFile: undefined,
					thumbnailId:
						article.attributes.picture?.data?.id ||
						dftValues.thumbnailId,
					thumbnailUrl:
						article.attributes.picture?.data?.attributes.url ||
						dftValues.thumbnailUrl,
					publishedAt: article.attributes.publishedAt,
				};

				setInitialValues(articleToForm);
				setCurrentValues(articleToForm);
				set({
					status: "updating",
				});
			};

			const articleCreationSetup = () => {
				clearStorage();
				setInitialValues(dftValues);
				setCurrentValues(dftValues);
				set({
					status: "creating",
				});
			};

			return {
				status: "creating",
				initialValues: dftValues,
				currentValues: dftValues,
				errors: {},
				validate,
				setInitialValues,
				setCurrentValues,
				setCurrentFieldValue,
				resetForm,
				clearStorage,
				articleCreationSetup,
				articleUpdateSetup,
			};
		},
		{
			name: STORAGE_KEYS.ARTICLE_FORM,
			getStorage: () => localStorage,
			partialize: s => ({
				status: s.status,
				initialValues: {
					...s.initialValues,
					thumbnailFile: undefined,
					publishedAt: undefined,
				},
				currentValues: {
					...s.currentValues,
					thumbnailFile: undefined,
					publishedAt: undefined,
				},
				errors: s.errors,
			}),
			version: STORAGE_VERSION,
		}
	)
);

export default useArticleFormStorage;
