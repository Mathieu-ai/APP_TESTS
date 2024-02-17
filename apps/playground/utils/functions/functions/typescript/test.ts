async function getFromDb( id: string ): Promise<string> {
    return `this is a thing with id:${ id } that toook x seconds to fetch.`;
};

const cache: Map<string,any>=new Map();

type SetToCache<T>=( data: T,key: string ) => void;
type GetFromCache<T>=( key: string ) => T;

const getFromCache: GetFromCache<any>=( key ) => {
    return cache.get( key );
};

function setToCache<T>( data: T,key: string ): void {
    cache.set( key,data );
}

type AnyFn=( ...args: any[] ) => any;

function withCache<T extends AnyFn>( fn: T,cacheKey: string ): ( ...args: Parameters<T> ) => Promise<ReturnType<T>> {
    return async ( ...args: Parameters<T> ): Promise<ReturnType<T>> => {
        const cachedResult=getFromCache( cacheKey );
        if( cachedResult ) {
            return cachedResult;
        }

        const result=await fn( ...args );
        setToCache( result,cacheKey );
        return result;
    };
}

// NOTE - Case example
const getter=withCache( getFromDb,"thingKey" );
const thingId="someUniqueId";

( async () => {
    const thing=await getter( thingId );
    // NOTE - get from cache or database
    console.log( thing );
} )();