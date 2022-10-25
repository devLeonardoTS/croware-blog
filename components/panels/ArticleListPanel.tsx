import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

import { ArticleData } from "../../pages";
import useArticleFormStorage from "../../stores/ArticleFormStorage";
import useUserSession, { SessionAuthor } from "../../stores/UserSessionStore";
import ArticleListItem from "../ArticleListItem";
import { updateArticleHandler } from "../forms/ArticleForm";
import OutlinedButton from "../forms/buttons/OutlinedButton";

type ArticleListPanelProps = {
	articles: Array<ArticleData>;
	changeToEditor: () => Promise<void> | void;
};

const ArticleListPanel = ({
	articles,
	changeToEditor,
}: ArticleListPanelProps) => {
	const publishedArticles = articles
		.filter(item => item.attributes.publishedAt !== null)
		.sort(
			(itemA, itemB) =>
				Number(new Date(itemB.attributes.publishedAt)) -
				Number(new Date(itemA.attributes.publishedAt))
		);

	const updateArticleSetup = useArticleFormStorage(s => s.articleUpdateSetup);

	const userAuthorData = useUserSession(s => s.author);
	const [userAuthor, setUserAuthor] = useState<SessionAuthor>();
	const userAuthorStatus = useUserSession(s => s.status);
	const [isAuthenticated, setAuthenticated] = useState(false);

	const articleUpdater = useMutation(updateArticleHandler);

	useEffect(() => {
		// Fix for conflict between SSR & CSR.
		if (userAuthorStatus === "authenticated") {
			setUserAuthor(userAuthorData);
			setAuthenticated(true);
			return;
		}

		setUserAuthor(undefined);
		setAuthenticated(false);
	}, [userAuthorStatus, userAuthorData]);

	return (
		<div>
			<ul className="flex flex-col gap-4">
				{publishedArticles.map(article => {
					return (
						<li key={nanoid()} className="border rounded">
							<div className="flex flex-col gap-2 m-2">
								<ArticleListItem article={article} />
								{isAuthenticated &&
								userAuthor?.id ===
									article.attributes.author?.data.id ? (
									<div className="flex justify-end gap-4">
										<OutlinedButton
											onClick={() => {
												const isAllowed = confirm(
													"Tem certeza que deseja atualizar os dados desse artigo?"
												);
												if (!isAllowed) {
													return;
												}
												updateArticleSetup(article);
												changeToEditor();
											}}
										>
											Editar
										</OutlinedButton>
										<OutlinedButton
											onClick={async () => {
												const isAllowed = confirm(
													"Tem certeza que deseja armazenar o artigo?"
												);
												if (!isAllowed) {
													return;
												}
												const result =
													await articleUpdater.mutateAsync(
														{
															authorId:
																userAuthor?.id ||
																-1,
															initial: article,
															updated: {
																publishedAt:
																	null,
															},
														}
													);

												if (result) {
													if (window) {
														alert(
															"Seu artigo foi armazendo com sucesso!"
														);
														window.location.reload();
													}
												}
											}}
										>
											Armazenar
										</OutlinedButton>
									</div>
								) : null}
							</div>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default ArticleListPanel;
