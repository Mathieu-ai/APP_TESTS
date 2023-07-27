export function findFirstNonRepeatedCharacter ( str: string ): string|undefined {
    const charOccurrences: Record<string,number>={};

    for( const char of str ) {
        if( charOccurrences[ char ] ) {
            charOccurrences[ char ]++;
        } else {
            charOccurrences[ char ]=1;
        }
    }

    for( const char of str ) {
        if( charOccurrences[ char ]===1 ) {
            return char;
        }
    }

    return undefined;
}