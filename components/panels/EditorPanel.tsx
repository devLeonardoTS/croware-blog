import { useEffect } from "react";
import useArticleFormStorage from "../../stores/ArticleFormStorage";
import ArticleForm from "../forms/ArticleForm";
import dftStyles from "./EditorPanel.module.css";

type EditorPanelProps = {};

const EditorPanel = ({}: EditorPanelProps) => {
	const articleFormStatus = useArticleFormStorage(s => s.status);

	const getHeaderText = () => {
		switch (articleFormStatus) {
			case "creating":
				return "Nova publicação";
			case "updating":
				return "Edite sua publicação";
			default:
				break;
		}
	};

	return (
		<div className={dftStyles.container}>
			<div className={dftStyles.content}>
				<div className={dftStyles.head}>
					<h2>{getHeaderText()}</h2>
				</div>
				<div className={dftStyles.body}>
					<ArticleForm />
				</div>
			</div>
		</div>
	);
};

export default EditorPanel;
