import {compareTypes_t,compareTypes_o} from './types'
import {number} from './number'

/**
    Returns an array of keys from given object whose corresponding values have the specified type
    @template T - The type of values in the input object
    @param {Record<string, T>} obj - The input
    @param {string} type - The type
    @returns {string[]} - Array of keys from the input object whose corresponding values have the specified type
    @example
        const obj = {
            name: "John",
            age: 30,
            email: "john@example.com"
        };
        const keys = getObjectKeysByType(obj, "string");
        // ["name", "email"]
*/
export function getObjectKeysByType(obj: object,type: string): string[] {
    return Object.entries(obj)
        .filter(([_,value]) => typeof value===type)
        .map(([key,_]) => key);
}

/**
    Returns the type of a given value.
    @param value - The value to get the type of
    @returns The type of the given value
    @example
        getValueType(42);
        // "number"
        getValueType("hello world");
        // "string"
*/
export function getValueType(value: any): compareTypes_t {
    return typeof value as compareTypes_t;
}

/**
    Compares the types of elements in an array against a given type and returns an array of indices or keys that match
    @param data - The array to compare
    @param type - The type
    @param options - Optional configuration
    @param options.getKeys - returns the keys of the objects that match the type. Defaults to false.
    @returns Array of indices or keys that match the type.
    @example
        const data = [1, "hello", { name: "John", age: 30 }, true, { name: "Jane", age: 25 }];
        compareTypes(data, "number", { getKeys: true });
        // Returns [0, "age", "age"]
*/
export function compareTypes(
    data: (any)[],
    type: string,
    options: compareTypes_o={}
): any[] {
    const notType=type.startsWith('!');

    const {getKeys=false}=options;

    return data.reduce((result: (any)[],value,index) => {
        const valueType=getValueType(value);

        const typeMatches=
            !notType&&(valueType===type.toLowerCase()||
                (valueType==='object'&&getObjectKeysByType(value,type).length>0));

        const notTypeMatches=
            notType&&(valueType.toLowerCase()!==type.substring(1).toLowerCase());

        if(typeMatches||notTypeMatches) {
            if(getKeys&&valueType==='object') {
                const keys=getObjectKeysByType(value,type);
                result.push(...keys);
            } else {
                result.push(getKeys? number(index):index);
            }
        }

        return result;
    },[]);
}