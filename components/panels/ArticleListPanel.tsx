import { useEffect } from "react";
import useArticleFormStorage from "../../stores/ArticleFormStorage";
import OutlinedButton from "../forms/buttons/OutlinedButton";

type ArticleListPanelProps = {};
const ArticleListPanel = (props: ArticleListPanelProps) => {
	const articleUpdateSetup = useArticleFormStorage(s => s.articleUpdateSetup);
	const articleCreationSetup = useArticleFormStorage(
		s => s.articleCreationSetup
	);

	return (
		<div className="p-4">
			<p>{"Artigos do autor."}</p>
			<div className="">
				<OutlinedButton
					onClick={ev => {
						articleUpdateSetup({
							id: "um-titulo-bem-legal",
							title: "Um titulo bem legal",
							excerpt: "Um resumo bem maneiro",
						});
					}}
				>
					Editar Publicação
				</OutlinedButton>
				<OutlinedButton
					onClick={ev => {
						articleCreationSetup();
					}}
				>
					Criar Publicação
				</OutlinedButton>
			</div>
		</div>
	);
};

export default ArticleListPanel;
