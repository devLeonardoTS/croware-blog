import type { NextPage } from "next";
import Carousel from "../components/Carousel";
import dftStyles from "../styles/Home.module.css";

const Home: NextPage = () => {
	return (
		<main className={dftStyles.container}>
			<article className={dftStyles.content}>
				<h1>Hello world!</h1>
			</article>
			<br />

			<section className={dftStyles.carouselContainer}>
				<Carousel />
				<p className="text-center">
					<strong>This is where we begin</strong>
				</p>
			</section>
		</main>
	);
};

export default Home;
