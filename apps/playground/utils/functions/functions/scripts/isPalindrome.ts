export function isPalindrome ( str: string ): boolean {
    const reversedStr=str.split( '' ).reverse().join( '' );
    return str===reversedStr;
}