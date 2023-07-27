function generateCombinations ( str: string ): string[] {
    const combinations: string[]=[];

    for( let i=0;i<str.length;i++ ) {
        for( let j=i+1;j<=str.length;j++ ) {
            const substring=str.substring( i,j );
            combinations.push( substring );
        }
    }

    return combinations;
}
