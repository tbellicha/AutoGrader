import { useEffect, useState } from 'react';

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;

// useLocalStorage key value? -> [value, setValue]
// if value is set, then write to localStorage the object with key and value
const useLocalStorage = <T>(key: string): [T, SetValue<T>] => {
    const [value, setValue] = useState<T>(() => {
        let item = localStorage.getItem(key);
        if (!item) {
            return;
        }
        return JSON.parse(item);
    });

    useEffect(() => {
        if(value !== null) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value]);

    return [value, setValue];
};

export default useLocalStorage;