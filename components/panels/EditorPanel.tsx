import { Button, Divider, IconButton, Modal, TextField } from "@mui/material";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import { ReactNode, useState } from "react";
import { IoClose } from "react-icons/io5";
import * as Yup from "yup";
import OwnOutlinedField from "../forms/OwnOutlinedField";
import dftStyles from "./EditorPanel.module.css";

type EditorPanelProps = {};

type ViewPublicationModalProps = {
	editorContent: string;
	closeHandler: () => void;
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

	const formik = useFormik({
		initialValues: {
			title: "",
		},
		onSubmit: (values, helpers) => {},
		validationSchema: Yup.object({
			title: Yup.string(),
		}),
	});

	return (
		<div className={dftStyles.container}>
			<div className={dftStyles.editorContainer}>
				<div className={dftStyles.head}>
					<h2>NOVA PUBLICAÇÃO</h2>
				</div>

				<div className={dftStyles.body}>
					<form className={dftStyles.form} onSubmit={formik.handleSubmit}>
						<OwnOutlinedField
							type="text"
							id="pub-title"
							name="title"
							label="Título"
							onChange={formik.handleChange}
							value={formik.values.title}
							variant="outlined"
							helperText="I'm trying to make this work for more than 6 hours! Welp!"
							error
						/>
						<p>title</p>
						<p>picture</p>
						<p>slug</p>
						<p>excerpt</p>
						<p>content</p>
						<p>category</p>
						<p>hashtags</p>
						<p>author</p>
						<p>colaborators</p>
					</form>
					<div className={dftStyles.editor}>
						<OwnCkEditor
							value={editorContent}
							name="editor"
							onChange={(data: any) => {
								setEditorContent(data);
							}}
						/>
					</div>
				</div>
				<div className={dftStyles.actions}>
					<Button variant="outlined">Salvar</Button>
					<Button
						onClick={() =>
							handleOpenModal(
								<ViewPublicationModal
									editorContent={editorContent}
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
