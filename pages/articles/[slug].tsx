import type { NextPage } from "next";
import dftStyles from "../../styles/ArticlePage.module.css";

type ArticlePageProps = {
	article: any;
};

const ArticlePage: NextPage<ArticlePageProps> = ({ article }) => {
	const aData = article?.data;
	const aMeta = article?.meta;

	return (
		<main className={dftStyles.container}>
			<div className={dftStyles.contentContainer}>
				<section className={dftStyles.articleContainer}>
					<div className={dftStyles.articleHeader}>
						<h2>{aData?.title || "Article Title"}</h2>
					</div>

					<hr className={dftStyles.divider} />
				</section>
			</div>
		</main>
	);
};

export default ArticlePage;
