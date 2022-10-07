import { Button } from "@mui/material";
import { nanoid } from "nanoid";
import {
	ChangeEventHandler,
	DetailedHTMLProps,
	HTMLAttributes,
	ImgHTMLAttributes,
	InputHTMLAttributes,
	useState,
} from "react";
import { IMG_ARTICLE_PLACEHOLDER } from "../../helpers/constants/assetUrls";
import dftStyles from "./OwnImageInput.module.css";

type OwnImageInputProps = {
	name: string;
	legend?: string;
	file?: File;
	controlClasses?: string;
	figureProps?: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
	imageProps?: DetailedHTMLProps<
		ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	>;
	inputProps: DetailedHTMLProps<
		InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>;
};

const OwnImageInput = ({
	name,
	legend,
	file,
	controlClasses,
	figureProps,
	imageProps,
	inputProps,
}: OwnImageInputProps) => {
	const [inputId, setInputId] = useState(nanoid());
	const [preview, setPreview] = useState<any>();

	if (file) {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			setPreview(reader.result);
		};
	}

	return (
		<div
			className={`${dftStyles.formControl}${
				controlClasses ? " " + controlClasses : ""
			}`}
		>
			<Button>
				<label htmlFor={inputId}>
					<figure {...figureProps}>
						<img
							src={preview || IMG_ARTICLE_PLACEHOLDER}
							alt={imageProps?.alt || legend}
							{...imageProps}
						/>
						{legend && <legend>{legend}</legend>}
					</figure>
				</label>
			</Button>
			<input
				{...inputProps}
				type="file"
				name={name}
				id={inputId}
				accept="image/*"
				hidden
			/>
		</div>
	);
};

export default OwnImageInput;
