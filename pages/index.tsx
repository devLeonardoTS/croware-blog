import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { Fragment, useEffect } from "react";
import ArticleListItem from "../components/ArticleListItem";
import Carousel from "../components/Carousel";
import { MAIN_API_BASEURL } from "../helpers/constants/getEnvironment";
import dftStyles from "../styles/Home.module.css";

type HomeProps = {
	articles: any;
};

export const getStaticProps: GetStaticProps = async () => {
	const url = `${MAIN_API_BASEURL}api/articles?populate=*`;

	try {
		const res = await fetch(url);
		const data = await res.json();

		return {
			props: {
				articles: data,
			},
		};
	} catch {
		return { props: {} };
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
			{/* <section className={dftStyles.carouselContainer}>
				<Carousel />
				<p className="text-center">
					<strong>This is where we begin</strong>
				</p>
			</section> */}
		</main>
	);
};

export default Home;
