import { FunctionMap } from "../../../../utils";

export function mapWithInterface<I,O>( arr: I[],func: FunctionMap<I,O> ): O[] {
    return arr.map( func );
}

export function mapWithoutInterface<I,O>( arr: I[],func: ( arg: I ) => O ): O[] {
    return arr.map( func );
}
