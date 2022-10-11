import { IconButton, Divider, Modal } from "@mui/material";
import { MouseEvent, useState } from "react";
import { IoClose } from "react-icons/io5";
import dftStyles from "./ArticlePreviewModal.module.css";

export type ArticlePreviewCloseHandler = (args?: {
	ev?: MouseEvent<HTMLButtonElement>;
	reason?: string;
}) => Promise<void> | void;

type ArticlePreviewModalProps = {
	isOpen: boolean;
	articleContent: string;
	closeHandler: ArticlePreviewCloseHandler;
};

const ArticlePreviewModal = (props: ArticlePreviewModalProps) => {
	return (
		<Modal
			classes={{
				root: dftStyles.modal,
			}}
			open={props.isOpen}
			onClose={async (ev, reason) => await props.closeHandler({ reason })}
		>
			<div className={dftStyles.container}>
				<div className={dftStyles.content}>
					<div className={dftStyles.head}>
						<div className={dftStyles.title}>
							<h2>Pré visualização</h2>
						</div>
						<div className={dftStyles.buttons}>
							<IconButton
								classes={{
									root: dftStyles.headButton,
								}}
								onClick={async ev => {
									await props.closeHandler({
										ev,
									});
								}}
							>
								<IoClose />
							</IconButton>
						</div>
					</div>

					<Divider />

					<div
						className={`ck-content ${dftStyles.body || ""}`}
						dangerouslySetInnerHTML={{
							__html:
								props.articleContent ||
								"<p>Você ainda não escreveu nada...</p>",
						}}
					></div>
				</div>
			</div>
		</Modal>
	);
};

export default ArticlePreviewModal;
