import { useState, useEffect } from "react";

type UseWindowSizeState = {
  width: number | undefined;
  height: number | undefined;
}

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState<UseWindowSizeState>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // console.log("[useDisplayState] - Yahallo!");

    function handleResize() {
      setWindowSize((state) => {
        return {
          ...state,
          width: window.outerWidth,
          height: window.outerHeight,
        }
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}