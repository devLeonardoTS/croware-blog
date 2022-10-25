import { NextPage } from "next";
import defautstilo from "../styles/About.module.css";

const About: NextPage = () => {
	return (
		<span>
			<div className={defautstilo.main}>
				<h1>Autores(as)</h1>
				<div className={defautstilo.profileContainer}>
					<div className={defautstilo.perfil}>
						{/* perfil 1 */}
						<img
							src="https://i.pinimg.com/originals/f9/b0/0f/f9b00f4b4eb4becb49897daacaa6e4bf.jpg"
							alt=""
						/>
						<div className={defautstilo.context}>
							<h2>King gomes</h2>
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Delectus id tenetur non voluptatum placeat molestiae, eos, odit
								magni accusamus temporibus corrupti veritatis eveniet porro
								aliquam atque consequatur, quis reiciendis iure!
							</p>
						</div>
					</div>

					<div className={defautstilo.perfil}>
						{/* perfil 2 */}
						<img
							src="https://i.pinimg.com/originals/f9/b0/0f/f9b00f4b4eb4becb49897daacaa6e4bf.jpg"
							alt=""
						/>
						<div className={defautstilo.context}>
							<h2>King gomes</h2>
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Delectus id tenetur non voluptatum placeat molestiae, eos, odit
								magni accusamus temporibus corrupti veritatis eveniet porro
								aliquam atque consequatur, quis reiciendis iure!
							</p>
						</div>
					</div>

					<div className={defautstilo.perfil}>
						{/* perfil 3 */}
						<img
							src="https://i.pinimg.com/originals/f9/b0/0f/f9b00f4b4eb4becb49897daacaa6e4bf.jpg"
							alt=""
						/>
						<div className={defautstilo.context}>
							<h2>King gomes</h2>
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Delectus id tenetur non voluptatum placeat molestiae, eos, odit
								magni accusamus temporibus corrupti veritatis eveniet porro
								aliquam atque consequatur, quis reiciendis iure!
							</p>
						</div>
					</div>

					<div className={defautstilo.perfil}>
						{/* perfil 4 */}
						<img
							src="https://i.pinimg.com/originals/f9/b0/0f/f9b00f4b4eb4becb49897daacaa6e4bf.jpg"
							alt=""
						/>
						<div className={defautstilo.context}>
							<h2>King gomes</h2>
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Delectus id tenetur non voluptatum placeat molestiae, eos, odit
								magni accusamus temporibus corrupti veritatis eveniet porro
								aliquam atque consequatur, quis reiciendis iure!
							</p>
						</div>
					</div>

					<div className={defautstilo.perfil}>
						{/* perfil 5 */}
						<img
							src="https://i.pinimg.com/originals/f9/b0/0f/f9b00f4b4eb4becb49897daacaa6e4bf.jpg"
							alt=""
						/>
						<div className={defautstilo.context}>
							<h2>King gomes</h2>
							<p>
								Lorem ipsum, dolor sit amet consectetur adipisicing elit.
								Delectus id tenetur non voluptatum placeat molestiae, eos, odit
								magni accusamus temporibus corrupti veritatis eveniet porro
								aliquam atque consequatur, quis reiciendis iure!
							</p>
						</div>
					</div>
				</div>
				<div className={defautstilo.sobre}>
					<h1>Sobre o Curso de TI</h1>
					<p>
						Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem et
						corrupti voluptates sunt nostrum libero totam, exercitationem
						laborum vero obcaecati officiis, quis cupiditate temporibus,
						asperiores aut quas dolore ex ipsa!
					</p>
					<p>
						Lorem ipsum dolor, sit amet consectetur adipisicing elit.
						Consequuntur porro dignissimos maiores dolorem magnam temporibus
						tempore qui pariatur assumenda, recusandae placeat soluta. Itaque
						consequatur recusandae, ullam aliquam dignissimos facere vitae.
					</p>
					<img
						src="https://dogemuchwow.com/wp-content/uploads/2019/03/orang-man-attak.jpg"
						alt=""
					/>
				</div>
			</div>
		</span>
	);
};

export default About;
