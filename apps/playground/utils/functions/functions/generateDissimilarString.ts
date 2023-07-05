export function generateDissimilarString( s: string ): string {
    const alphabet='abcdefghijklmnopqrstuvwxyz123456789';
    const newString=[];
    for( const char of s ) {
        const index=alphabet.indexOf( char );
        const oppositeIndex=alphabet.length-index-1;
        newString.push( alphabet[ oppositeIndex ] );
    }
    return newString.join( '' );
}