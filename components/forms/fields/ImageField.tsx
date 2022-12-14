import { Button } from "@mui/material";
import { TouchRippleActions } from "@mui/material/ButtonBase/TouchRipple";
import { nanoid } from "nanoid";
import {
	DetailedHTMLProps,
	HTMLAttributes,
	ImgHTMLAttributes,
	InputHTMLAttributes,
	useEffect,
	useRef,
	useState,
} from "react";

import Assets from "../../../helpers/constants/Assets";
import dftStyles from "./ImageField.module.css";

type ImageFieldProps = {
	name: string;
	legend?: string;
	file?: File;
	imgUrl?: string;
	controlStyles?: string;
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

const ImageField = ({
	name,
	legend,
	file,
	imgUrl,
	controlStyles,
	figureProps,
	imageProps,
	inputProps,
}: ImageFieldProps) => {
	const [inputId, setInputId] = useState(nanoid());
	const [previewFile, setPreviewFile] = useState<any>();
	const touchRippleRef = useRef<TouchRippleActions>(null);

	useEffect(() => {
		if (file && file instanceof File) {
			setPreviewFile(URL.createObjectURL(file));
			return;
		}

		if (file) {
			setPreviewFile(file);
			return;
		}

		setPreviewFile(undefined);
	}, [file]);

	return (
		<div
			className={`${dftStyles.formControl}${
				controlStyles ? " " + controlStyles : ""
			}`}
		>
			<Button
				touchRippleRef={touchRippleRef}
				onMouseEnter={ev => touchRippleRef.current?.start(ev)}
				onMouseLeave={ev => touchRippleRef.current?.stop(ev)}
			>
				<label htmlFor={inputId}>
					<figure {...figureProps}>
						<img
							src={
								previewFile ||
								imgUrl ||
								Assets.placeholder.article.thumbnail
							}
							alt={imageProps?.alt || legend}
							{...imageProps}
						/>
						{legend && (
							<legend>
								<span>{legend}</span>
							</legend>
						)}
					</figure>
				</label>
			</Button>
			<input
				type="file"
				name={name}
				id={inputId}
				accept="image/*"
				hidden
				{...inputProps}
			/>
		</div>
	);
};

export default ImageField;
