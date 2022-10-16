import create from "zustand";
import { persist } from "zustand/middleware";
import * as yup from "yup";
import HashtagType from "../components/forms/types/HashtagType";
import STORAGE_KEYS from "./StorageKeys";

export type ArticleFormDataType = {
	[key: string]: any;
	id?: string;
	title?: string;
	excerpt?: string;
	category?: string;
	author?: string;
	hashtags?: string;
	hashtagsArr?: HashtagType[];
	colaborators?: string[];
	content?: string;
	thumbnail?: File;
};

export type ArticleFormOnSubmitHandler = (
	values: ArticleFormDataType
) => void | Promise<void>;

export type ArticleFormStatus = "creating" | "updating";

export type FormErrorType = Record<string, Array<string>>;

export type ArticleFormStorageType = {
	status?: ArticleFormStatus;

	initialValues: ArticleFormDataType;
	currentValues: ArticleFormDataType;

	errors: FormErrorType;

	onSubmitHandler: ArticleFormOnSubmitHandler;

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

	articleUpdateSetup: (values: ArticleFormDataType) => Promise<void> | void;
	articleCreationSetup: () => Promise<void> | void;
};

const articleSchema = yup.object({
	title: yup
		.string()
		.required("Você esqueceu de nomear sua publicação")
		.max(50, m => `O título não deve passar de ${m.max} caracteres`),
	excerpt: yup
		.string()
		.required("O resumo é essencial para chamar a atenção do público")
		.max(512, m => `O resumo não deve passar de ${m.max} caracteres`),
	content: yup.string().optional().default(""),
	category: yup.string().required("Selecione uma categoria"),
	hashtags: yup
		.string()
		.trim()
		.max(5, m => `Sua hashtag passa de ${m.max} caracteres`),
	hashtagsArr: yup.array().of(
		yup.object().shape({
			id: yup.string(),
			name: yup
				.string()
				.trim()
				.max(5, m => `A hashtag "${m.value}" passa de ${m.max} caracteres`),
		})
	),
});

const useArticleFormStorage = create<ArticleFormStorageType>()(
	persist(
		// @ts-ignore
		(set, get) => {
			const dftValues: ArticleFormDataType = {
				id: "",
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

			// Validators

			const validate = async (values?: ArticleFormDataType) => {
				try {
					await articleSchema.validate(values || get().currentValues, {
						abortEarly: false,
					});
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

					// console.log("error", {
					// 	cause: validationError.cause,
					// 	errors: validationError.errors,
					// 	inner: validationError.inner,
					// 	msg: validationError.message,
					// 	name: validationError.name,
					// 	path: validationError.path,
					// 	type: validationError.type,
					// });
				}
			};

			const validateField = async (fieldName: string) => {
				try {
					const isFieldValidatable = Object.keys(articleSchema.fields).includes(
						fieldName
					);

					if (!isFieldValidatable) {
						return;
					}

					await articleSchema.validateAt(fieldName, get().currentValues);

					const errorList = { ...get().errors };
					delete errorList[fieldName];

					set({ errors: errorList });
				} catch (error) {
					const validationError = error as yup.ValidationError;
					set({
						errors: { ...get().errors, [fieldName]: validationError.errors },
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
				const isValidField = Object.keys(currentValues).includes(field);

				let shouldValidate = validateOnChange;
				switch (typeof shouldValidate) {
					case "boolean":
						shouldValidate = validateOnChange;
						break;
					default:
						shouldValidate = true;
						break;
				}

				if (isValidField) {
					set({ currentValues: { ...currentValues, [field]: value } });
					if (shouldValidate) {
						await validateField(field);
					}
				}
			};

			const clearStorage = () =>
				set({
					status: "creating",
					initialValues: dftValues,
					currentValues: dftValues,
					errors: {},
					onSubmitHandler: onSubmitManager,
				});

			const resetForm = async () => {
				setCurrentValues(get().initialValues);
				await validate();
			};

			const articleUpdateSetup = (values: ArticleFormDataType) => {
				clearStorage();
				setInitialValues(values);
				setCurrentValues(values);
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

			// Handlers
			const createArticle: ArticleFormOnSubmitHandler = async values => {
				console.log(
					"[ArticleStore:createArticle] - Creating article...",
					values
				);
			};

			const updateArticle: ArticleFormOnSubmitHandler = async values => {
				console.log(
					"[ArticleStore:updateArticle] - Updating article...",
					values
				);
			};

			const onSubmitManager: ArticleFormOnSubmitHandler = async values => {
				await validate();

				const status = get()?.status;
				const errors = get()?.errors;
				const hasErrors = Object.keys(errors || {}).length > 0;

				console.log("[ArticleStore:onSubmitManager] - Forwarding submit...");

				if (hasErrors || !status) {
					console.log("[ArticleStore:onSubmitManager] - Submission failed!", {
						errors,
						status,
					});
					return;
				}

				switch (status) {
					case "creating":
						await createArticle(values);
						break;
					case "updating":
						await updateArticle(values);
						break;
					default:
						await createArticle(values);
						break;
				}

				console.log("[ArticleStore:onSubmitManager] - Operation complete!");
				await clearStorage();
			};

			// const publishArticle: ArticleFormOnSubmitHandler = async values => {
			// 	// await validate();
			// 	console.log("[ArticleStore:publishArticle] - Unpublishing article...", values);
			// };

			// const unpublishArticle: ArticleFormOnSubmitHandler = async values => {
			// 	// await validate();
			// 	console.log("[ArticleStore:unpublishArticle] - Publishing article...", values);
			// };

			return {
				status: "creating",
				initialValues: dftValues,
				currentValues: dftValues,
				errors: {},
				onSubmitHandler: onSubmitManager,
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
		}
	)
);

export default useArticleFormStorage;
