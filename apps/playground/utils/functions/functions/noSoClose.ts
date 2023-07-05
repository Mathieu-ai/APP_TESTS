import { generateDissimilarString } from "./generateDissimilarString";
import { levenshteinDistance } from "./levenshtein";

export function noSoClose( param1: string,param2: string ): { percent: number,propositions: string[] } {
    const levDist=levenshteinDistance( param1,param2 );
    const percent=1-levDist/Math.max( param1.length,param2.length );
    const propositions=[
        generateDissimilarString( param1 ),
        generateDissimilarString( param2 )
    ];
    return { percent: percent*100,propositions };
}
