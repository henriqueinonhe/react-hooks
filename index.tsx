import { useEffect, useRef } from "react";

export function useIsMounted() : ReturnType<typeof useRef> {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}