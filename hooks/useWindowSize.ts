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
    console.log("[useDisplayState] - Yahallo!");
    
    function handleResize() {
      // setWindowSize({
      //   width: window.innerWidth,
      //   height: window.innerHeight,
      // });
      setWindowSize((state) => {
        return {
          ...state,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}