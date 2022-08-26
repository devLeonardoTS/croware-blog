import React from "react";
import dftStyles from "./ArticleListItem.module.css";
import Image from "next/image";
import { BsClockFill } from "react-icons/bs";
import { FaFeatherAlt } from "react-icons/fa";

interface ArticleListItem {
	article: any;
}

const ArticleListItem = ({ article }: ArticleListItem) => {
	const {
		title,
		slug,
		content,
		article_category,
		article_hashtags,
		picture,
		authors,
	} = article.attributes;

	return (
		<li key={slug + "-" + article.id}>
			<div className={dftStyles.container}>
				<div className={dftStyles.imgContainer}>
					<Image
						src={picture.data.attributes.url}
						width={picture.data.attributes.width}
						height={picture.data.attributes.height}
						className={dftStyles.image}
					/>
				</div>
				<div className={dftStyles.previewContainer}>
					<div className={dftStyles.previewHead}>
						<h2>Lua o único satélite natural da Terra</h2>
					</div>
					<div className={dftStyles.previewContent}>
						<p>
							Descoberta recente feita pela Embrace, confirma que a lua é o
							único satélite natural da terra eles tem total convicção de que o
							planeta não é plano, veja o comentários dos terra-planis...
						</p>
					</div>
					<div className={dftStyles.previewFooter}>
						<div className={dftStyles.infoContainer}>
							<p className={dftStyles.author}>
								<FaFeatherAlt /> {`Alice Hirotaka`}
							</p>
							<p className={dftStyles.time}>
								<BsClockFill /> 25/08/2022 21:57
							</p>
						</div>
						<ul className={dftStyles.tagsContainer}>
							<li>
								<small>Notícias</small>
							</li>
							<li>
								<small>Descobertas</small>
							</li>
							<li>
								<small>Ciência</small>
							</li>
							<li>
								<small>Espaço</small>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</li>
	);
};

export default ArticleListItem;
