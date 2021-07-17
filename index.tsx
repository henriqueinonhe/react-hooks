import React, { DependencyList, useEffect, useRef } from "react";

export function useIsMounted() : React.MutableRefObject<boolean> {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return isMounted;
}

export async function asyncCallback<T>(isMounted : ReturnType<typeof useRef>,
                                       asyncPart : () => Promise<T>,
                                       syncPart : (value : T) => void,
                                       setIsLoading ?: React.Dispatch<React.SetStateAction<boolean>> | 
                                                       Array<React.Dispatch<React.SetStateAction<boolean>>>) : Promise<void> {
  if(Array.isArray(setIsLoading)) {
    setIsLoading.forEach(setter => setter(true));
  }
  else if(setIsLoading) {
    setIsLoading(true);
  }

  const result = await asyncPart();
  if(isMounted.current) {
    syncPart(result);
  }

  if(Array.isArray(setIsLoading)) {
    setIsLoading.forEach(setter => setter(false));
  }
  else if(setIsLoading) {
    setIsLoading(false);
  }
}

export function useAsync<T>(isMounted : ReturnType<typeof useRef>,
                            asyncPart : () => Promise<T>,
                            syncPart : (value : T) => void,
                            deps ?: DependencyList,
                            setIsLoading ?: React.Dispatch<React.SetStateAction<boolean>> | 
                                            Array<React.Dispatch<React.SetStateAction<boolean>>>) : void {
  useEffect(() => {
    asyncCallback(isMounted, asyncPart, syncPart, setIsLoading);
  }, deps);
}