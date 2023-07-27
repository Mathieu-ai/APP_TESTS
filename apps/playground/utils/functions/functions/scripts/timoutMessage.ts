export async function getMessage( str: string,iterations: number,timeout: number ) {
    async function logMessage( message: string,currentIteration: number ) {
        console.log( `${ currentIteration+1 }: ${ message }` );
        await new Promise( resolve => setTimeout( resolve,timeout*1000 ) );
    }

    for( let i=0;i<iterations;i++ ) {
        await logMessage( str,i );
    }
}

export function getMessage2( str: string,iterations: number,timeout: number ) {
    function logMessage( message: string,currentIteration: number ) {
        console.log( `${ currentIteration+1 }: ${ message }` );
    }

    for( let i=0;i<iterations;i++ ) {
        setTimeout( () => logMessage( str,i ),i*timeout*1000 );
    }
}
