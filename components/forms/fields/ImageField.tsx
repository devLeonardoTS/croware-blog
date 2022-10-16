import { Button } from "@mui/material";
import { TouchRippleActions } from "@mui/material/ButtonBase/TouchRipple";
import { nanoid } from "nanoid";
import {
	ChangeEventHandler,
	DetailedHTMLProps,
	HTMLAttributes,
	ImgHTMLAttributes,
	InputHTMLAttributes,
	useEffect,
	useRef,
	useState,
} from "react";
import { IMG_ARTICLE_PLACEHOLDER } from "../../../helpers/constants/assetUrls";
import dftStyles from "./ImageField.module.css";

type ImageFieldProps = {
	name: string;
	legend?: string;
	file?: File;
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
	controlStyles,
	figureProps,
	imageProps,
	inputProps,
}: ImageFieldProps) => {
	const [inputId, setInputId] = useState(nanoid());
	const [preview, setPreview] = useState<any>();
	const touchRippleRef = useRef<TouchRippleActions>(null);

	useEffect(() => {
		// if (file) {
		// 	const reader = new FileReader();
		// 	reader.readAsDataURL(file);
		// 	reader.onload = () => {
		// 		setPreview(reader.result);
		// 	};
		// } else {
		// 	setPreview(undefined);
		// }
		if (file) {
			setPreview(URL.createObjectURL(file));
		} else {
			setPreview(undefined);
		}
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
							src={preview || IMG_ARTICLE_PLACEHOLDER}
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
