import HashtagType from "./HashtagType";

type ArticleFormDataType = {
	title: string;
	excerpt: string;
	category: string;
	author: string;
	hashtags: string;
	hashtagsArr: HashtagType[];
	colaborators: string[];
	content: string;
	thumbnail?: File;
};

export default ArticleFormDataType;
