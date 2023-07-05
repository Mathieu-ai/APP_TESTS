/**
    Parse a string to a number if possible
    * * 🟢 function is generic
    @param {String} str - the String
    @return {String} - The parsed string.
    @example
        const str1 = "2"
        const str2 = "two"
        number(str1)
        // 2
        number(str2)
        // 'two'
*/
export function number(input: string|number|(string|number)[]): number|string|(string|number)[] {
    const values=Array.isArray(input)? input:[input];
    const convertedValues=values.map(value => {
        const num=Number(value);
        return isNaN(num)? value:num;
    });
    return convertedValues.length===1? convertedValues[0]:convertedValues;
}