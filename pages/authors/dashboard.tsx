import { NextPage } from "next";
import dynamic from "next/dynamic";
import { MouseEventHandler, useState } from "react";
import { useSessionContext } from "../../components/providers/SessionProvider";

const OwnCKEditor = dynamic(
	async () => {
		const m = await import("../../components/OwnCKEditor");
		return m.default;
	},
	{ ssr: false, loading: () => <div>Loading Editor...</div> }
);

const Dashboard: NextPage = () => {
	const [editorContent, setEditorContent] = useState("");

	const [email, setEmail] = useState("");
	const [pwd, setPwd] = useState("");

	const session = useSessionContext();

	const handleClickSignIn: MouseEventHandler<HTMLButtonElement> = async e => {
		e.preventDefault();
		await session?.signIn({ identifier: email, password: pwd });
	};

	const handleClickSignOut: MouseEventHandler<HTMLButtonElement> = async e => {
		e.preventDefault();
		await session?.signOut();
	};

	const handleClickCheckUser: MouseEventHandler<
		HTMLButtonElement
	> = async e => {
		e.preventDefault();
		console.log("Data:", session?.user);
		console.log("status:", session?.status);
	};

	return (
		<div className="grow">
			<div className="">
				<h1>{"I'm the writer's dashboard."}</h1>
				<h1>{"Writer Articles"}</h1>
				<h1>{"I'm the writer's information card."}</h1>
			</div>
			<div className="flex gap-4">
				<div>
					<p>Email</p>
					<input
						className="text-black"
						type="text"
						name="email"
						value={email}
						onChange={ev => setEmail(ev.target.value)}
					/>
				</div>
				<div>
					<p>Password</p>
					<input
						className="text-black"
						type="password"
						name="password"
						value={pwd}
						onChange={ev => setPwd(ev.target.value)}
					/>
				</div>
				<button onClick={handleClickSignIn}>Sign-in</button>
				<button onClick={handleClickSignOut}>Sign-out</button>
				<button onClick={handleClickCheckUser}>Check</button>
			</div>

			{session?.status === "authenticated" ? (
				<div className="flex flex-col gap-4">
					<OwnCKEditor
						value={editorContent}
						name="editor"
						onChange={(data: any) => {
							setEditorContent(data);
						}}
					/>
				</div>
			) : (
				<div className="p-6">
					<p>Authenticated resource. Please sign-in</p>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
