import { IconButton, TextFieldProps } from "@mui/material";
import { nanoid } from "nanoid";
import { ReactNode } from "react";
import { IoClose } from "react-icons/io5";
import HashtagType from "../types/HashtagType";
import dftStyles from "./HashtagsField.module.css";
import OutlinedField from "./OutlinedField";

type HashtagsFieldProps = {
	inputProps: TextFieldProps;
	removeHashtag?: (id: string) => void | Promise<void>;
	hashtagList?: HashtagType[];
	helperText?: ReactNode;
	error?: boolean;
};

const HashtagsField = ({
	inputProps,
	hashtagList,
	removeHashtag,
	helperText,
	error,
}: HashtagsFieldProps) => {
	const getHashtagList = () => {
		return (
			<ul className={dftStyles.hashtagList}>
				{hashtagList?.map(hashtag => {
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
										if (removeHashtag) {
											removeHashtag(hashtag.id);
										}
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
			<OutlinedField error={error} {...inputProps} />
			<div className={dftStyles.listContainer}>
				{hashtagList && hashtagList.length > 0 && getHashtagList()}
				<p className={dftStyles.helperText}>
					<small>{helperText}</small>
				</p>
			</div>
		</div>
	);
};

export default HashtagsField;
