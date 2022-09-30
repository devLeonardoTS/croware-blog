import { NextPage } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import dftStyles from "../../styles/AuthorsProfile.module.css";

const OwnCKEditor = dynamic(
	async () => {
		const m = await import("../../components/OwnCKEditor");
		return m.default;
	},
	{ ssr: false, loading: () => <div>Loading Editor...</div> }
);

const Profile: NextPage = () => {
	const [editorContent, setEditorContent] = useState("");

	return (
		<main className={dftStyles.container}>
			<div className={dftStyles.contentContainer}>
				<div className={dftStyles.profileContainer}>
					<div className={dftStyles.banner}>
						<img
							src={"https://wallpaperaccess.com/full/859076.jpg"}
							width={"100%"}
							height={"100%"}
							alt="User profile's banner"
						/>
					</div>
					<div className={dftStyles.content}>
						<div className={dftStyles.userPictureContainer}>
							<img
								src={
									"https://pm1.narvii.com/7700/9900de90d3598fd01f7b009aefed860e824b9a24r1-750-783v2_hq.jpg"
								}
								width={"100%"}
								height={"100%"}
								alt="User profile's picture"
							/>
						</div>
						<div className={dftStyles.userDetailsContainer}>
							<div className={dftStyles.head}>
								<h1>{"MENHERA-KUN"}</h1>
							</div>
							<div className={dftStyles.body}>
								<p>
									{
										"THE NAME IS MENHERA, I'M 18. RIGHT NOW I'M TRYING TO GET THIS WEB PAGE TOGETHER AND MAKE IT WORK FLAWLESSLY ON MOBILE DEVICES."
									}
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className={dftStyles.tabsContainer}>
					<button>{"Tab: PUBLICAÇÕES"}</button>
					<button>{"Tab: COLABORAÇÕES"}</button>
				</div>
				<div className={dftStyles.tabPanel}>
					<div className={dftStyles.panelHead}>
						<p>{"Panel header"}</p>
					</div>
				</div>
				<div className={dftStyles.editorContainer}>
					<OwnCKEditor
						value={editorContent}
						name="editor"
						onChange={(data: any) => {
							setEditorContent(data);
						}}
					/>
				</div>
			</div>
		</main>
	);
};

// const Dashboard: NextPage = () => {
// 	const [editorContent, setEditorContent] = useState("");

// 	const [email, setEmail] = useState("");
// 	const [pwd, setPwd] = useState("");

// 	const user = useUser();
// 	const userAuthStatus = useUserAuthStatus();
// 	const signIn = useSignIn();
// 	const signOut = useSignOut();

// 	const handleClickSignIn: MouseEventHandler<HTMLButtonElement> = async e => {
// 		e.preventDefault();
// 		await signIn({ identifier: email, password: pwd });
// 	};

// 	const handleClickSignOut: MouseEventHandler<HTMLButtonElement> = async e => {
// 		e.preventDefault();
// 		await signOut();
// 	};

// 	const handleClickCheckUser: MouseEventHandler<
// 		HTMLButtonElement
// 	> = async e => {
// 		e.preventDefault();
// 		console.log("Data:", user);
// 		console.log("status:", userAuthStatus);
// 	};

// 	return (
// 		<div className="grow">
// 			<div className="">
// 				<h1>{"I'm the writer's dashboard."}</h1>
// 				<h1>{"Writer Articles"}</h1>
// 				<h1>{"I'm the writer's information card."}</h1>
// 			</div>
// 			<div className="flex gap-4">
// 				<div>
// 					<p>Email</p>
// 					<input
// 						className="text-black"
// 						type="text"
// 						name="email"
// 						value={email}
// 						onChange={ev => setEmail(ev.target.value)}
// 					/>
// 				</div>
// 				<div>
// 					<p>Password</p>
// 					<input
// 						className="text-black"
// 						type="password"
// 						name="password"
// 						value={pwd}
// 						onChange={ev => setPwd(ev.target.value)}
// 					/>
// 				</div>
// 				<button onClick={handleClickSignIn}>Sign-in</button>
// 				<button onClick={handleClickSignOut}>Sign-out</button>
// 				<button onClick={handleClickCheckUser}>Check</button>
// 			</div>

// 			{userAuthStatus === "authenticated" ? (
// 				<div className="flex flex-col gap-4">
// 					<OwnCKEditor
// 						value={editorContent}
// 						name="editor"
// 						onChange={(data: any) => {
// 							setEditorContent(data);
// 						}}
// 					/>
// 				</div>
// 			) : (
// 				<div className="p-6">
// 					<p>Authenticated resource. Please sign-in</p>
// 				</div>
// 			)}
// 		</div>
// 	);
// };

export default Profile;
