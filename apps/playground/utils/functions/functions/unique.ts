import objectHash from 'object-hash';

/**
 * Get the value of an object by its path.
 *
 * @param obj - The object to traverse.
 * @param path - The path to the value.
 * @returns The value at the specified path, or null if it doesn't exist.
 *
 * @example
 * const obj = { foo: { bar: 'baz' } };
 * const path = ['foo', 'bar'];
 * const value = getObjectValueByPath(obj, path); // 'baz'
 */
export function getObjectValueByPath(obj: any,path: string[]): any {
    return path.reduce((o,key) => {
        if(o&&Array.isArray(o)) {
            return o.map((item) => getObjectValueByPath(item,[key])).flat();
        }
        return (o&&o[key])? o[key]:null;
    },obj);
}

/**
    * Get an array of unique values from an array of strings or objects.
    *
    * @param data - The array of strings or objects to filter.
    * @param field - Optional. If specified, only unique values for the specified field will be returned.
    * @returns An array of unique values.
    *
    * @example
        const data = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Alice' },
            { id: 4, name: 'Charlie' },
        ];
        const uniqueByName = getUnique(data, 'name'); 
        // [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 4, name: 'Charlie' }]
 */
/* export function getUnique(data: (string | object)[], field?: string) {
const fieldPath = field ? field.split('.') : [];
const uniqueValues: (string | object)[] = [];
const seen = new Set<string>();

for (const value of data) {
    const uniqueValue = getObjectValueByPath(value, fieldPath);
    if (Array.isArray(uniqueValue)) {
        const uniqueValueHashes = uniqueValue.map((uv) => objectHash(uv));
        if (!uniqueValueHashes.some((hash) => seen.has(hash))) {
            uniqueValueHashes.forEach((hash) => seen.add(hash));
            uniqueValues.push(value);
        }
    } else {
        const uniqueValueHash = objectHash(uniqueValue);
        if (uniqueValue && !seen.has(uniqueValueHash)) {
            seen.add(uniqueValueHash);
            uniqueValues.push(value);
        }
    }
}

return uniqueValues;
}
*/
export function getUnique({data,field}: {data: (string|object)[],field?: string}) {
    const fieldPath=field? field.split('.'):[];
    const uniqueValues: (string|object)[]=[];
    const seen=new Set<string>();

    for(const value of data) {
        const uniqueValue=getObjectValueByPath(value,fieldPath);
        if(Array.isArray(uniqueValue)) {
            const uniqueValueHashes=uniqueValue.map((uv) => objectHash(uv));
            if(!uniqueValueHashes.some((hash) => seen.has(hash))) {
                uniqueValueHashes.forEach((hash) => seen.add(hash));
                uniqueValues.push(value);
            }
        } else {
            const uniqueValueHash=objectHash(uniqueValue);
            if(uniqueValue&&!seen.has(uniqueValueHash)) {
                seen.add(uniqueValueHash);
                uniqueValues.push(value);
            }
        }
    }

    return uniqueValues;
}