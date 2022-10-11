import ArticleForm from "../forms/ArticleForm";
import dftStyles from "./EditorPanel.module.css";

type EditorPanelProps = {};

const EditorPanel = ({}: EditorPanelProps) => {
	return (
		<div className={dftStyles.container}>
			<div className={dftStyles.content}>
				<div className={dftStyles.head}>
					<h2>{"Nova publicação"}</h2>
				</div>
				<div className={dftStyles.body}>
					<ArticleForm
						onSubmit={values => {
							console.log("[EditorPanel] - Values:", values);
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default EditorPanel;
