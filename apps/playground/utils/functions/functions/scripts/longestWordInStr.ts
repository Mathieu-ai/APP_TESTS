export function findLongestWord ( str: string ): string {
    const words=str.split( ' ' );
    let longestWord="";

    for( const word of words ) {
        if( word.length>longestWord.length ) {
            longestWord=word;
        }
    }

    return longestWord;
}