import type { GetServerSideProps, NextPage } from "next";
import { stringify } from "qs";
import { Fragment, useEffect } from "react";
import ArticleListItem from "../components/ArticleListItem";
import Endpoints from "../helpers/constants/Endpoints";
import { ServerAxios } from "../helpers/utilities/ServerAxios";
import useNavigationStorage from "../stores/NavigationStorage";
import dftStyles from "../styles/Home.module.css";

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

type HomeProps = {
	articles: Array<ArticleData>;
};

export const getServerSideProps: GetServerSideProps<
	HomeProps
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
			sort: ["publishedAt:desc"],
		},
		{
			encodeValuesOnly: true,
		}
	);

	const url = `${Endpoints.articles}?${query}`;

	const result = await ServerAxios.client
		.get<{ data: Array<ArticleData> }>(url)
		.then(response => response.data?.data)
		.catch(error => {
			return [];
		});

	return {
		props: { articles: result },
	};
};

const tempArticles = (articles?: Array<ArticleData>) => {
	if (!articles || articles?.length < 1) {
		return <li key="no-article-0">No articles available...</li>;
	}

	const articleItems = articles.map((article, index) => {
		const lastIndex = articles.length > 0 ? articles.length - 1 : 0;
		const isLastItem = index === lastIndex;

		return (
			<Fragment key={article.attributes.slug + " " + article.id}>
				<li>
					<ArticleListItem article={article} />
				</li>
				{!isLastItem && <hr className={dftStyles.divider} />}
			</Fragment>
		);
	});

	return articleItems;
};

const Home: NextPage<HomeProps> = ({ articles }) => {
	// console.log(articles);

	const setCurrentNavLink = useNavigationStorage(s => s.setCurrentNavLink);

	useEffect(() => {
		setCurrentNavLink("artigos");
	}, [setCurrentNavLink]);

	return (
		<main className={dftStyles.container}>
			<div className={dftStyles.contentContainer}>
				<section className={dftStyles.articlesContainer}>
					<div className={dftStyles.articlesHeader}>
						<h2>ÚLTIMAS POSTAGENS</h2>
					</div>

					<hr className={dftStyles.divider} />

					<ul className={dftStyles.articlesList}>
						{tempArticles(articles)}
					</ul>
				</section>
			</div>
		</main>
	);
};

export default Home;
