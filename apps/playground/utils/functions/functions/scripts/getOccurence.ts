export function countEachLetterOccurrences ( str: string ): Record<string,number> {
    const letterOccurrences: Record<string,number>={};

    for( const char of str ) {
        if( letterOccurrences[ char ] ) {
            letterOccurrences[ char ]++;
        } else {
            letterOccurrences[ char ]=1;
        }
    }

    return letterOccurrences;
}

export function countLetterOccurrences ( str: string,letter: string ): number {
    let count=0;

    for( const char of str ) {
        if( char===letter ) {
            count++;
        }
    }

    return count;
}