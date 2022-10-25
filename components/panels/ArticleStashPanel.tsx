import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

import { ArticleData } from "../../pages";
import useArticleFormStorage from "../../stores/ArticleFormStorage";
import useUserSession, { SessionAuthor } from "../../stores/UserSessionStore";
import ArticleListItem from "../ArticleListItem";
import { updateArticleHandler } from "../forms/ArticleForm";
import OutlinedButton from "../forms/buttons/OutlinedButton";

type ArticleStashPanelProps = {
	articles: Array<ArticleData>;
	changeToEditor: () => Promise<void> | void;
};

const ArticleStashPanel = ({
	articles,
	changeToEditor,
}: ArticleStashPanelProps) => {
	const stashedArticles = articles
		.filter(
			item =>
				item.attributes.publishedAt === null ||
				item.attributes.publishedAt === undefined
		)
		.sort(
			(itemA, itemB) =>
				Number(new Date(itemB.attributes.updatedAt)) -
				Number(new Date(itemA.attributes.updatedAt))
		);

	const userAuthorData = useUserSession(s => s.author);
	const [userAuthor, setUserAuthor] = useState<SessionAuthor>();

	const updateArticleSetup = useArticleFormStorage(s => s.articleUpdateSetup);

	const articleUpdater = useMutation(updateArticleHandler);

	useEffect(() => {
		// Fix for conflict between SSR & CSR.
		setUserAuthor(userAuthorData);
	}, [userAuthorData]);

	return (
		<div>
			<ul className="flex flex-col gap-4">
				{stashedArticles.map(article => {
					return (
						<li key={nanoid()} className="border rounded">
							<div className="flex flex-col gap-2 m-2">
								<ArticleListItem article={article} />
								{userAuthor?.id ===
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
													"Tem certeza que deseja publicar o artigo?"
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
																	new Date().toISOString(),
															},
														}
													);

												if (result) {
													if (window) {
														alert(
															"Seu artigo foi publicado com sucesso!"
														);
														window.location.reload();
													}
												}
											}}
										>
											Publicar
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

export default ArticleStashPanel;
