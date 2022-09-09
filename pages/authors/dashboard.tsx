import { NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const OwnCKEditor = dynamic(
	() => {
		return import("../../components/OwnCKEditor").then(m => m.default);
	},
	{ ssr: false, loading: () => <div>Loading Editor...</div> }
);

const Dashboard: NextPage = () => {
	const [data, setData] = useState("");

	useEffect(() => {}, []);

	return (
		<div className="grow">
			<div className="">
				<h1>{"I'm the writer's dashboard."}</h1>
				<h1>{"Writer Articles"}</h1>
				<h1>{"I'm the writer's information card."}</h1>
			</div>

			<OwnCKEditor
				value={data}
				name="editor"
				onChange={(data: any) => {
					setData(data);
				}}
			/>
		</div>
	);
};

export default Dashboard;
