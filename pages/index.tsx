import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { useEffect } from "react";
import ArticleListItem from "../components/ArticleListItem";
import Carousel from "../components/Carousel";
import dftStyles from "../styles/Home.module.css";

type HomeProps = {
	articles: any;
};

export const getStaticProps: GetStaticProps = async () => {
	const url = "http://localhost:1337/api/articles?populate=*";

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
	if (!articles) {
		return <li>No articles available...</li>;
	}

	const articleItems = articles.map((article: any, index: number) => {
		return <ArticleListItem key={article.attributes.slug} article={article} />;
	});

	return articleItems;
};

const Home: NextPage<HomeProps> = ({ articles }) => {
	// console.log(articles);

	const articlesList = articles?.data;
	const articlesMeta = articles?.meta;

	return (
		<main className={dftStyles.container}>
			<section className={dftStyles.content}>
				<div id="articles-header">
					<h1>Publicações</h1>
					<hr />
				</div>
				<div id="articles-container">
					<ul id="articles-list" className="flex flex-col gap-4 py-4">
						{tempArticles(articlesList)}
					</ul>
				</div>
			</section>
			<br />

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
