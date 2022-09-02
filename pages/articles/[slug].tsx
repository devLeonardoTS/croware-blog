import dayjs from "dayjs";
import DOMPurify from "dompurify";
import type { GetServerSideProps, NextPage } from "next";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BsClockFill } from "react-icons/bs";
import { FaFeatherAlt } from "react-icons/fa";
import { IMG_ARTICLE_PLACEHOLDER } from "../../helpers/constants/assetUrls";
import { API_ARTICLES } from "../../helpers/constants/mainApiEndpoints";
import dftStyles from "../../styles/ArticlePage.module.css";

type ArticlePageProps = {
	article: any;
};

export const getServerSideProps: GetServerSideProps = async context => {
	const slug = context.params?.slug;
	const url = `${API_ARTICLES}?filters[slug]=${slug}&populate=*`;

	try {
		const res = await fetch(url);
		const jsonData = await res.json();
		const data = jsonData.data;

		if (!jsonData || !data || data.length < 1) {
			return { notFound: true };
		}

		return {
			props: { article: jsonData },
		};
	} catch {
		return {
			notFound: true,
		};
	}
};

const ArticlePage: NextPage<ArticlePageProps> = ({ article }) => {
	const artData = article?.data?.[0];
	const artMeta = article?.meta;

	const dftAttributes = {
		dataError: true,
	};

	const {
		title,
		slug,
		content,
		article_category,
		article_hashtags,
		picture,
		authors,
		publishedAt,
		updatedAt,
		dataError,
	} = artData?.attributes || dftAttributes; // "safe" destructuring - All destructures will be undefined if not available.

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
			setArticleBody(DOMPurify.sanitize(content.body));
		}
	}, [content]);

	if (dataError) {
		return (
			<main className={`${dftStyles.container} items-center justify-center`}>
				<h1>Loading...</h1>
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
							<p>{content?.excerpt}</p>
						</div>
						<div className={dftStyles.footer}>
							<div className={dftStyles.metaInfo}>
								<div className={dftStyles.author}>
									<div className={dftStyles.icon}>
										<FaFeatherAlt title="Autor(a)" />
									</div>
									<p>{authors?.data?.[0]?.attributes?.name || "Unknown"}</p>
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
									src={picture?.data?.attributes.url || IMG_ARTICLE_PLACEHOLDER}
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
