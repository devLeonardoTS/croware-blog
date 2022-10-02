import { Button } from "@mui/material";
import { useState } from "react";
import getOwnCKEditorDynamic from "../editor/getOwnCKEditorDynamic";
import dftStyles from "./EditorPanel.module.css";

type EditorPanelProps = {};

const EditorPanel = ({}: EditorPanelProps) => {
	const [editorContent, setEditorContent] = useState("");

	const OwnCkEditor = getOwnCKEditorDynamic(
		<div className="p-6">Loading the editor...</div>
	);

	return (
		<div className={dftStyles.container}>
			<div className={dftStyles.editorContainer}>
				<div className={dftStyles.head}>
					<h2>NOVA PUBLICAÇÃO</h2>
				</div>
				<div className={dftStyles.body}>
					<OwnCkEditor
						value={editorContent}
						name="editor"
						onChange={(data: any) => {
							setEditorContent(data);
						}}
					/>
				</div>
				<div className={dftStyles.actions}>
					<Button variant="outlined">Salvar</Button>
					<Button variant="outlined">Visualizar</Button>
				</div>
			</div>
		</div>
	);
};

export default EditorPanel;
