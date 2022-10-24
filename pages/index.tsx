import type { GetServerSideProps, NextPage } from "next";
import { Fragment, useEffect } from "react";
import ArticleListItem from "../components/ArticleListItem";
import { SS_MAIN_API_BASEURL } from "../helpers/constants/getEnvVars";
import useNavigationStorage from "../stores/NavigationStorage";
import dftStyles from "../styles/Home.module.css";

type HomeProps = {
	articles: any;
};

export const getServerSideProps: GetServerSideProps = async context => {
	const url = `${SS_MAIN_API_BASEURL}/api/articles?populate=*&sort=publishedAt:desc`;

	try {
		const res = await fetch(url);
		const data = await res.json();

		if (!data) {
			return { props: {} };
		}

		return {
			props: { articles: data },
		};
	} catch {
		return {
			props: {},
		};
	}
};

const tempArticles = (articles: any) => {
	if (!articles || articles?.length < 1) {
		return <li key="no-article-0">No articles available...</li>;
	}

	const articleItems = articles.map((article: any, index: number) => {
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

	const articlesList = articles?.data;
	const articlesMeta = articles?.meta;
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
						{tempArticles(articlesList)}
					</ul>
				</section>
			</div>
		</main>
	);
};

export default Home;
