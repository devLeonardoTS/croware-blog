//@ts-nocheck
import React from "react";
import { Editor as CustomEditor } from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor as MyCKEditor } from "@ckeditor/ckeditor5-react";
import dftStyles from "./OwnCKEditor.module.css";

class CustomUploadAdapter {
	private requestController;
	private loader;
	private user;

	constructor(loader, user) {
		// The file loader instance to use during the upload.
		this.loader = loader;
		this.user = user;
	}

	upload() {
		return this.loader.file.then(
			file =>
				new Promise(async (resolve, reject) => {
					{
						const uploadUrl = `${process.env.NEXT_PUBLIC_MAIN_API_BASE_URL}/api/upload/`;

						const response = await this._initUploadRequest(
							uploadUrl,
							file
						).catch(err => reject(err.message));

						const uploadedItemUrl = response?.[0]?.url;

						if (!uploadedItemUrl) {
							const noImgUrlErrorText =
								"Ops, failed to upload image. Try uploading the image somewhere else and using it's url to add it to the document.";
							reject(noImgUrlErrorText);
						}

						// console.log("uploadUrl?", uploadUrl);
						// console.log("Response?", response);

						resolve({
							default: response?.url,
						});
					}
				})
		);
	}

	abort() {
		this.requestController?.abort();
	}

	async _initUploadRequest(uploadUrl, file) {
		const formData = new FormData();
		formData.append("files", file);

		this.requestController = new AbortController();
		const { signal } = this.requestController;

		return await fetch(uploadUrl, {
			method: "POST",
			body: formData,
			signal: signal,
		})
			.then(res => this._handleUploadResponse(res))
			.catch(err => this._handleUploadError(err, file));
	}

	_handleUploadResponse(response) {
		return response.json();
	}

	_handleUploadError(err, file) {
		const genericErrorText = `Couldn't upload file: ${file.name}.`;
		let specificErrorText = "";

		console.log(error);

		if (err.name == "AbortError") {
			specificErrorText = `Uploaded aborted for ${file.name}.`;
		}

		throw new Error(specificErrorText || genericErrorText);
	}
}

const configs = () => {
	const plugins = CustomEditor.builtinPlugins.map(plugin => plugin);

	return {
		plugins: plugins,
		removePlugins: ["MediaEmbedToolbar"],
		toolbar: {
			shouldNotGroupWhenFull: true,
		},
		mediaEmbed: {
			previewsInData: true,
		},
		image: {
			styles: ["alignLeft", "alignCenter", "alignRight"],
			resizeOptions: [
				{
					name: "resizeImage:original",
					value: null,
					icon: "original",
				},
				{
					name: "resizeImage:50",
					value: "50",
					icon: "medium",
				},
				{
					name: "resizeImage:75",
					value: "75",
					icon: "large",
				},
			],
			toolbar: [
				"imageStyle:alignLeft",
				"imageStyle:alignCenter",
				"imageStyle:alignRight",
				"|",
				"imageTextAlternative",
				"|",
				"resizeImage:50",
				"resizeImage:75",
				"resizeImage:original",
				"|",
				"linkImage",
			],
		},
	};
};

type OwnCkEditorStyles = {
	container: string;
};

type OwnCkEditorProps = {
	name: string;
	value?: string;
	styles?: OwnCkEditorStyles;
	onReady?: (editor: CustomEditor) => void;
	onChange?: (event: Event, editor: CustomEditor) => void;
	onBlur?: (event: Event, editor: CustomEditor) => void;
	onFocus?: (event: Event, editor: CustomEditor) => void;
	onError?: (event: Event, editor: CustomEditor) => void;
};

function OwnCKEditor({ onChange, name, value, styles }: OwnCkEditorProps) {
	return (
		<div
			className={`${dftStyles.container}${
				styles ? " " + styles.container : ""
			}`}
		>
			<MyCKEditor
				type=""
				name={name}
				editor={CustomEditor}
				data={value || ""}
				config={configs()}
				onReady={editor => {
					if (!editor) {
						// console.log("[Editor]: Failed to load.");
						return;
					}

					editor.plugins.get("FileRepository").createUploadAdapter =
						loader => {
							return new CustomUploadAdapter(loader);
						};
					// console.log("[Editor]: Ready to roll!", editor);
				}}
				onChange={(event, editor) => {
					// console.log(editor);
					const data = editor.getData();
					// console.log({ event, editor, data })
					onChange(data);
				}}
			/>
		</div>
	);
}

export default OwnCKEditor;
