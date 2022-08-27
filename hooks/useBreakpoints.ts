import { useEffect, useState } from "react";
import useWindowSize from "./useWindowSize";

type UseBreakpointsState = {
    isBase: boolean | undefined,
    isSm: boolean | undefined,
    isMd: boolean | undefined,
    isLg: boolean | undefined,
    isXl: boolean | undefined,
}

const initialState: UseBreakpointsState = {
    isBase: undefined,
    isSm: undefined,
    isMd: undefined,
    isLg: undefined,
    isXl: undefined
}

enum BP_MIN_WIDTH {
    SM = 425,
    MD = 768,
    LG = 1024,
    XL = 1440
}

function isNumberBetween(value: number, min: number, max: number) {
    return value >= min && value <= max;
}

export default function useBreakpoints() {

    const { width } = useWindowSize();

    const [breakpoints, setBreakpoints] = useState<UseBreakpointsState>({
        isBase: undefined,
        isSm: undefined,
        isMd: undefined,
        isLg: undefined,
        isXl: undefined,
    })

    useEffect(() => {

        function handleBreakpoints(width: number | undefined) {

            // console.log(width);
            // console.log(breakpoints);

            if (typeof (width) === "undefined") {
                setBreakpoints(initialState);
                return;
            }

            setBreakpoints((state) => {
                return {
                    ...state,
                    isBase: isNumberBetween(width, 0, BP_MIN_WIDTH.SM - 1),
                    isSm: isNumberBetween(width, BP_MIN_WIDTH.SM, BP_MIN_WIDTH.MD - 1),
                    isMd: isNumberBetween(width, BP_MIN_WIDTH.MD, BP_MIN_WIDTH.LG - 1),
                    isLg: isNumberBetween(width, BP_MIN_WIDTH.LG, BP_MIN_WIDTH.XL - 1),
                    isXl: width >= BP_MIN_WIDTH.XL
                }
            });

        }

        handleBreakpoints(width);

    }, [width]);

    return breakpoints;

}
