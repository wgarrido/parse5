export default function mergeOptions<T extends U, U>(defaults: T, options: U = Object.create(null)) {
    return [defaults, options].reduce<T>((merged, optObj) => {
        Object.keys(optObj).forEach(key => {
            (merged as any)[key] = (optObj as any)[key];
        });

        return merged;
    }, Object.create(null));
}
