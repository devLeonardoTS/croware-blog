import { IconButton, TextFieldProps } from "@mui/material";
import { nanoid } from "nanoid";
import { ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import dftStyles from "./HashtagsInput.module.css";
import OwnOutlinedField from "./OwnOutlinedField";
import HashtagType from "./types/HashtagType";

type HashtagsInputProps = {
	inputProps: TextFieldProps;
	hashtagList: HashtagType[];
	removeHashtag: (id: string) => void | Promise<void>;
	helperText?: ReactNode;
	error?: boolean;
};

const HashtagsInput = ({
	inputProps,
	hashtagList,
	removeHashtag,
	helperText,
	error,
}: HashtagsInputProps) => {
	const getHashtagList = () => {
		return (
			<ul className={dftStyles.hashtagList}>
				{hashtagList.map(hashtag => {
					return (
						<li key={nanoid()} className={dftStyles.hashtagContainer}>
							<div className={dftStyles.hashtag}>
								<div className={dftStyles.text}>
									<p>
										<small>{hashtag.name}</small>
									</p>
								</div>
								<IconButton
									onClick={() => {
										removeHashtag(hashtag.id);
									}}
									className={dftStyles.btnClose}
								>
									<IoClose />
								</IconButton>
							</div>
						</li>
					);
				})}
			</ul>
		);
	};

	return (
		<div className={dftStyles.container} {...(error && { "data-error": true })}>
			<OwnOutlinedField error={error} {...inputProps} />
			<div className={dftStyles.listContainer}>
				{hashtagList.length > 0 && getHashtagList()}
				<p className={dftStyles.helperText}>
					<small>{helperText}</small>
				</p>
			</div>
		</div>
	);
};

export default HashtagsInput;
