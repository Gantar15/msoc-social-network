
export function asyncIteratorWithCancel<T>(asyncIterator: AsyncIterator<T | undefined>, cancelCallbcak: Function): AsyncIterator<T | undefined> {
    return {
        ...asyncIterator,
        return() {
            cancelCallbcak();
            return asyncIterator.return ? asyncIterator.return() : Promise.resolve({ value: undefined, done: true });
        }
    };
}