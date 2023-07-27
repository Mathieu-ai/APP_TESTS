export function findSecondLowestAndGreatestNumbers ( numbers: number[] ): [ number,number ] {
    numbers.sort( ( a,b ) => a-b );
    const secondLowest=numbers[ 1 ];
    const secondGreatest=numbers[ numbers.length-2 ];
    return [ secondLowest,secondGreatest ];
}