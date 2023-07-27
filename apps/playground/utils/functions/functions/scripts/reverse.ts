export function reverseNumber ( num: number ): number {
    return parseInt( num.toString().split( '' ).reverse().join( '' ) );
}
