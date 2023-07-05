/**
    Verifies if a value is empty.
    @param {string | object | any[] } value The value to verify. Can be a string, array, or object.
    @param options {object} An optional options object. Use { props: true } to iterate through object properties and verify their values' length.
    @return true if the value is empty, false otherwise.
    @example
        const a = "";
        const b = { c: "", d: "" };
        console.log(isEmpty(a))
        // true
        console.log(isEmpty(b, { props: true }))
        // true
        console.log(isEmpty(b))
        // false
*/
export function isEmpty(
    value: string|object|any[],
    options: {props: boolean}={props: false},
): boolean {
    switch(typeof value) {
        case 'string':
            return value.length===0
        case 'object':
            if(Array.isArray(value)) {
                return value.every((item) => isEmpty(item,options))
            } else {
                if(options.props) {
                    return Object.values(value).every((prop) =>
                        isEmpty(prop,options),
                    )
                }
                return Object.keys(value).length===0
            }
        default:
            return true
    }
}



