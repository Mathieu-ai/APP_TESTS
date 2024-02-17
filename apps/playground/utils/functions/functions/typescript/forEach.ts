import { FunctionForEach } from "../../../../utils";

export function forEachWithInterface<I>( arr: I[],func: FunctionForEach<I,void> ): void {
    arr.forEach( func );
}

export function forEachWithoutInterface<I>( arr: I[],func: ( arg: I ) => void ): void {
    arr.forEach( func );
}