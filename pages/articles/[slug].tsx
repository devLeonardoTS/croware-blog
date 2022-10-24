import dayjs from "dayjs";
import { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { stringify } from "qs";
import { useEffect, useState } from "react";
import { BsClockFill } from "react-icons/bs";
import { FaFeatherAlt } from "react-icons/fa";

import Assets from "../../helpers/constants/Assets";
import Endpoints from "../../helpers/constants/Endpoints";
import { API_ARTICLES } from "../../helpers/constants/mainApiEndpoints";
import { PageHrefs } from "../../helpers/constants/PageHrefs";
import ownDOMPurify from "../../helpers/ownDOMPurify";
import { ServerAxios } from "../../helpers/utilities/ServerAxios";
import useNavigationStorage from "../../stores/NavigationStorage";
import dftStyles from "../../styles/ArticlePage.module.css";

export type ArticleData = {
	id: number;
	attributes: {
		title: string;
		slug: string;
		createdAt: string;
		updatedAt: string;
		publishedAt: string;
		content?: {
			id: number;
			excerpt: string;
			body: string;
		};
		article_category?: {
			data: {
				id: number;
				attributes: {
					createdAt: string;
					updatedAt: string;
					publishedAt: string;
					name: string;
				};
			};
		};
		article_hashtags?: {
			data: Array<{
				id: number;
				attributes: {
					tag: string;
					createdAt: string;
					updatedAt: string;
					publishedAt: string;
				};
			}>;
		};
		picture?: {
			data: null | {
				id: number;
				attributes: {
					name: string;
					alternativeText: string;
					caption: string;
					width: number;
					height: number;
					formats: {
						small: {
							name: string;
							hash: string;
							ext: string;
							mime: string;
							path: string | null;
							width: number;
							height: number;
							size: number;
							url: string;
							provider_metadata: {
								public_id: string;
								resource_type: string;
							};
						};
						thumbnail: {
							name: string;
							hash: string;
							ext: string;
							mime: string;
							path: string | null;
							width: number;
							height: number;
							size: number;
							url: string;
							provider_metadata: {
								public_id: string;
								resource_type: string;
							};
						};
					};
					hash: string;
					ext: string;
					mime: string;
					size: number;
					url: string;
					previewUrl: string | null;
					provider: string;
					provider_metadata: {
						public_id: string;
						resource_type: string;
					};
					createdAt: string;
					updatedAt: string;
				};
			};
		};
		author?: {
			data: {
				id: number;
				attributes: {
					name: string;
					bio: string;
					createdAt: string;
					updatedAt: string;
					publishedAt: string;
					slug: string;
				};
			};
		};
		colaborators?: {
			data: Array<{
				id: number;
				attributes: {
					name: string;
					bio: string;
					createdAt: string;
					updatedAt: string;
					publishedAt: string;
					slug: string;
				};
			}>;
		};
	};
};

type ArticlePageProps = {
	article: ArticleData;
};

export const getServerSideProps: GetServerSideProps<
	ArticlePageProps
> = async context => {
	const slug = context.params?.slug;

	const query = stringify(
		{
			populate: "*",
			filters: {
				slug: {
					$eqi: slug,
				},
			},
		},
		{
			encodeValuesOnly: true,
		}
	);

	const url = `${Endpoints.articles}?${query}`;

	const result = await ServerAxios.client
		.get<{ data: Array<ArticleData> }>(url)
		.then(response => response.data?.data?.[0])
		.catch(error => {});

	// console.log("[articles:getSSProps] - Result...", result);

	if (!result) {
		return { notFound: true };
	}

	return {
		props: { article: result },
	};
};

const ArticlePage: NextPage<ArticlePageProps> = ({ article }) => {
	const setCurrentNavLink = useNavigationStorage(s => s.setCurrentNavLink);

	const {
		title,
		slug,
		content,
		article_category,
		article_hashtags,
		picture,
		author,
		publishedAt,
		updatedAt,
	} = article?.attributes || {}; // "safe" destructuring - All destructures will be undefined if article not available.

	// console.log("Article Data: ", article?.data);

	const hashTags =
		article_hashtags?.data?.map((tag: any, index: number) => {
			if (index > 3) {
				return;
			}
			return (
				<li key={`tag-${tag?.id}`}>
					<p>
						<small>{tag?.attributes?.tag}</small>
					</p>
				</li>
			);
		}) || undefined;

	const hashTagList = () => (
		<ul className={dftStyles.tagsContainer}>{hashTags}</ul>
	);

	const [publishedAtDisplay, setPublishedAtDisplay] =
		useState("00/00/0000 00:00");

	const [articleBody, setArticleBody] = useState("");

	useEffect(() => {
		if (publishedAt) {
			const formattedDate = dayjs(publishedAt).format("DD/MM/YYYY HH:mm");
			setPublishedAtDisplay(formattedDate);
		}
	}, [publishedAt]);

	useEffect(() => {
		if (content?.body) {
			setArticleBody(ownDOMPurify(content.body));
		}
	}, [content]);

	useEffect(() => {
		console.log("Artigle title", title);
		setCurrentNavLink("artigos", { title: title });
	}, [setCurrentNavLink, title]);

	if (!article?.attributes) {
		return (
			<main
				className={`${dftStyles.container} items-center justify-center`}
			>
				<h1>
					{
						"Não foi possível encontrar os dados do artigo, tente novamente mais tarde."
					}
				</h1>
			</main>
		);
	}

	return (
		<main className={dftStyles.container}>
			<div className={dftStyles.contentContainer}>
				<section className={dftStyles.articleContainer}>
					<div className={dftStyles.header}>
						<div className={dftStyles.head}>
							<h1>{title}</h1>
							{hashTagList()}
						</div>

						<div className={dftStyles.body}>
							<p>{content?.excerpt || "No content..."}</p>
						</div>
						<div className={dftStyles.footer}>
							<div className={dftStyles.metaInfo}>
								<div className={dftStyles.author}>
									<a
										className={dftStyles.link}
										href={
											`${PageHrefs.authors}/${author?.data.attributes.slug}` ||
											PageHrefs.home
										}
									>
										<span className={dftStyles.icon}>
											<FaFeatherAlt title="Autor(a)" />
										</span>
										{author?.data.attributes.name ||
											"Unknown"}
									</a>
								</div>
								<div className={dftStyles.time}>
									<div className={dftStyles.icon}>
										<BsClockFill title="Data de publicação" />
									</div>
									<p>{publishedAtDisplay}</p>
								</div>
							</div>
						</div>
					</div>
					<hr className={dftStyles.divider} />
					<div className={dftStyles.content}>
						<div className={dftStyles.head}>
							<div className={dftStyles.imageArea}>
								<Image
									src={
										picture?.data?.attributes.url ||
										Assets.placeholder.article.thumbnail
									}
									layout="fill"
									className={dftStyles.image}
									alt="An image representing the article context."
								/>
							</div>
						</div>
						<div
							className={`ck-content ${dftStyles.body}`}
							dangerouslySetInnerHTML={{
								__html: articleBody || "<p>No content...</p>",
							}}
						></div>
					</div>
				</section>
			</div>
		</main>
	);
};

export default ArticlePage;
