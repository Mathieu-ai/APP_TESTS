export function countVowels ( str: string ): number {
    const vowels=[ 'a','e','i','o','u' ];
    let count=0;

    for( const char of str.toLowerCase() ) {
        if( vowels.includes( char ) ) {
            count++;
        }
    }

    return count;
}