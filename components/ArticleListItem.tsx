import React, { useEffect, useState } from "react";
import dftStyles from "./ArticleListItem.module.css";
import Image from "next/image";
import { BsClockFill } from "react-icons/bs";
import { FaFeatherAlt } from "react-icons/fa";
import useBreakpoints from "../hooks/useBreakpoints";
import dayjs from "dayjs";
import Link from "next/link";
import { BASE_URL_ARTICLES } from "../helpers/constants/baseUrls";

interface ArticleListItem {
	article: any;
}

const ArticleListItem = ({ article }: ArticleListItem) => {
	const [publishedAt, setPublishedAt] = useState("00/00/0000 00:00");

	useEffect(() => {
		if (article?.attributes?.publishedAt) {
			const formattedDate = dayjs(article.attributes.publishedAt).format(
				"DD/MM/YYYY HH:mm"
			);
			setPublishedAt(formattedDate);
		}
	}, [article]);

	const winBp = useBreakpoints();

	const {
		title,
		slug,
		content,
		article_category,
		article_hashtags,
		picture,
		authors,
	} = article.attributes;

	const hashTags =
		article_hashtags?.data?.map((tag: any, index: number) => {
			if (index > 3) {
				return;
			}
			return (
				<li key={`tag-${tag.id}`}>
					<small>{tag.attributes.tag}</small>
				</li>
			);
		}) || undefined;

	const hashTagList = () => (
		<ul className={dftStyles.tagsContainer}>{hashTags}</ul>
	);

	// const hashTagList = () => (
	// 	<ul className={dftStyles.tagsContainer}>
	// 		<li>
	// 			<small>Notícias</small>
	// 		</li>
	// 		<li>
	// 			<small>Descobertas</small>
	// 		</li>
	// 		<li>
	// 			<small>Ciência</small>
	// 		</li>
	// 		<li>
	// 			<small>Espaço</small>
	// 		</li>
	// 	</ul>
	// );

	return (
		<div className={dftStyles.container}>
			<div className={dftStyles.imgContainer}>
				<Link
					href={
						BASE_URL_ARTICLES + article?.attributes?.slug || BASE_URL_ARTICLES
					}
				>
					<a>
						<Image
							src={
								picture.data?.attributes.url ||
								"https://res.cloudinary.com/devlts/image/upload/v1661625433/desk-gd5513cf43_1920_v66cdr.jpg"
							}
							layout="fill"
							className={dftStyles.image}
							alt="An image representing the article context."
						/>
					</a>
				</Link>
				{winBp.isBase && hashTagList()}
			</div>
			<div className={dftStyles.previewContainer}>
				<div className={dftStyles.previewHead}>
					<h2>{article?.attributes?.title || "Sem título..."}</h2>
				</div>
				<div className={dftStyles.previewContent}>
					<p>{article?.attributes?.content?.excerpt || "Sem resumo..."}</p>
				</div>
				<div className={dftStyles.previewFooter}>
					<div className={dftStyles.infoContainer}>
						<div className={dftStyles.author}>
							<div className={dftStyles.icon}>
								<FaFeatherAlt />
							</div>
							<p>{authors?.data?.[0]?.attributes?.name || "Unknown"}</p>
						</div>
						<div className={dftStyles.time}>
							<div className={dftStyles.icon}>
								<BsClockFill />
							</div>
							<p>
								{publishedAt}
								{/* {dayjs(
									article?.attributes?.publishedAt || "00/00/0000 00:00"
								).format("DD/MM/YYYY HH:mm")} */}
							</p>
						</div>
					</div>
					{!winBp.isBase && !winBp.isSm && hashTagList()}
				</div>
			</div>
		</div>
	);
};

export default ArticleListItem;
