export function computeFactors ( num: number ): number[] {
    const factors: number[]=[];

    for( let i=1;i<=num;i++ ) {
        if( num%i===0 ) {
            factors.push( i );
        }
    }

    return factors;
}