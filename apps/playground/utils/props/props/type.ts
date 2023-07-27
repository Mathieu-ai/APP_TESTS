export interface FunctionMap<Input,Output> {
    ( arg: Input ): Output;
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