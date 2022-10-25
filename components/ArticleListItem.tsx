import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { BsClockFill } from "react-icons/bs";
import { FaFeatherAlt } from "react-icons/fa";

import Assets from "../helpers/constants/Assets";
import { PageHrefs } from "../helpers/constants/PageHrefs";
import useBreakpoints from "../hooks/useBreakpoints";
import { ArticleData } from "../pages";
import dftStyles from "./ArticleListItem.module.css";

type ArticleListItem = {
	article: ArticleData;
};

const ArticleListItem = ({ article }: ArticleListItem) => {
	const [publishedAt, setPublishedAt] = useState<string>();

	const winBp = useBreakpoints();

	const {
		title,
		slug,
		content,
		article_category,
		article_hashtags,
		picture,
		author,
	} = article.attributes || {};

	const hashTags =
		article_hashtags?.data?.map((tag: any, index: number) => {
			if (index > 3) {
				return;
			}
			return (
				<li key={`tag-${tag.id}`}>
					<p>
						<small>{tag.attributes.tag}</small>
					</p>
				</li>
			);
		}) || undefined;

	const hashTagList = () => (
		<ul className={dftStyles.tagsContainer}>{hashTags}</ul>
	);

	useEffect(() => {
		if (article?.attributes?.publishedAt) {
			const formattedDate = dayjs(article.attributes.publishedAt).format(
				"DD/MM/YYYY HH:mm"
			);
			setPublishedAt(formattedDate);
		}
	}, [article]);

	return (
		<div className={dftStyles.container}>
			<Link
				href={
					PageHrefs.articles + "/" + article?.attributes?.slug ||
					PageHrefs.home
				}
			>
				<a className={dftStyles.imgContainer}>
					<Image
						src={
							picture?.data?.attributes.url ||
							Assets.placeholder.article.thumbnail
						}
						layout="fill"
						className={dftStyles.image}
						alt="An image representing the article context."
					/>
					{winBp.isBase && hashTagList()}
				</a>
			</Link>

			<div className={dftStyles.previewContainer}>
				<div className={dftStyles.previewHead}>
					<Link
						href={
							PageHrefs.articles +
								"/" +
								article?.attributes?.slug || PageHrefs.home
						}
					>
						<a className={dftStyles.titleLink}>
							<h2>
								{article?.attributes?.title || "Sem título..."}
							</h2>
						</a>
					</Link>
				</div>
				<div className={dftStyles.previewContent}>
					<p>
						{article?.attributes?.content?.excerpt ||
							"Sem resumo..."}
					</p>
				</div>
				<div className={dftStyles.previewFooter}>
					<div className={dftStyles.infoContainer}>
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
								{author?.data.attributes.name || "Unknown"}
							</a>
						</div>
						<div className={dftStyles.time}>
							<div className={dftStyles.icon}>
								<BsClockFill title="Data de publicação" />
							</div>
							{publishedAt ? <p>{publishedAt}</p> : null}
						</div>
					</div>
					{!winBp.isBase && !winBp.isSm && hashTagList()}
				</div>
			</div>
		</div>
	);
};

export default ArticleListItem;
