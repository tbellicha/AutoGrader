import { useState } from 'react';

type StoredValue<T> = T | null;

const useLocalStorage = <T>(key: string, initialValue: T): [StoredValue<T>, (newValue:T) => void] => {
    const storedValue = JSON.parse(localStorage.getItem(key) ?? "null") || initialValue;
    const [value, setValue] = useState<T>(storedValue);

    const setLocalStorageValue = (newValue: T) => {
        setValue(newValue);
        localStorage.setItem(key, JSON.stringify(newValue));
    };

    return [value, setLocalStorageValue];
};

export default useLocalStorage;