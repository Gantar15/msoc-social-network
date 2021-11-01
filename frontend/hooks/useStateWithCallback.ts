import { useState, useEffect, useCallback, useRef } from "react";

const useStateWithCallback = <T = any>(initState: T): [T, typeof updateState] => {
    type callbackType = (state: T) => any;
    type setStateFncType = (oldState: T) => T;

    const [state, setState] = useState<T>(initState);
    const callbackRef = useRef<callbackType|null>(null);

    const updateState = useCallback((newState: setStateFncType|T, callback?: callbackType) => {
        if(callback)
            callbackRef.current = callback;
            
        //@ts-expect-error
        setState(() => typeof newState == 'function' ? newState(state) : newState);
    }, []);

    useEffect(() => {
        if(callbackRef.current)
            callbackRef.current(state);
            callbackRef.current = null;
    }, [state])

    return [state, updateState];
};

export default useStateWithCallback;