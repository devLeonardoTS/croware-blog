import { NextPage } from "next";
import NotFound from "../components/NotFound";
import dftStyles from "../styles/NotFoundPage.module.css";

const NotFoundPage: NextPage = () => {
	return (
		<div className={dftStyles.container}>
			<NotFound />
		</div>
	);
};

export default NotFoundPage;
