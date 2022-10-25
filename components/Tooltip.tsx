import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import {
	Tooltip as MuiTooltip,
	TooltipProps as MuiTooltipProps,
} from "@mui/material";
import dftStyles from "./Tooltip.module.css";

type TooltipProps = {
	children: ReactJSXElement;
	muiTooltipProps: Omit<MuiTooltipProps, "children">;
};

const Tooltip = ({ children, muiTooltipProps }: TooltipProps) => {
	return (
		<MuiTooltip
			classes={{
				tooltip: dftStyles.tooltip,
				arrow: dftStyles.tooltipArrow,
			}}
			{...muiTooltipProps}
		>
			{children}
		</MuiTooltip>
	);
};

export default Tooltip;
