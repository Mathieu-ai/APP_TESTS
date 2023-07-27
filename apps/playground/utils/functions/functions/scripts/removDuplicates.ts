export function removeDuplicateCharacters ( str: string ): string {
    const uniqueChars: string[]=[];

    for( const char of str ) {
        if( !uniqueChars.includes( char ) ) {
            uniqueChars.push( char );
        }
    }

    return uniqueChars.join( '' );
}