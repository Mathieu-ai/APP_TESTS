export interface FunctionMap<I,O> {
    ( arg: I ): O;
}

export interface FunctionForEach<I, O> {
    (arg: I): O;
}

export interface FunctionLoop<I, IndexType> {
    (index: IndexType, item: I): void;
}

export namespace a {
    export interface a {
        a: number
    }
    export interface a {
        b: string
        c?: number | string
    }
    export type b = number | string
}

export interface b {
    a: a.b
}