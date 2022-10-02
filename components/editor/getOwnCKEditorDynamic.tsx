import dynamic from "next/dynamic";

const getOwnCKEditorDynamic = (loadingElement?: JSX.Element) => {
	return dynamic(
		async () => {
			const m = await import("./OwnCKEditor");
			return m.default;
		},
		{
			ssr: false,
			loading: () => loadingElement || <div>Loading editor...</div>,
		}
	);
};

export default getOwnCKEditorDynamic;
