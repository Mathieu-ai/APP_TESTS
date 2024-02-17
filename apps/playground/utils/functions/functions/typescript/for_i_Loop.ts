import { FunctionLoop } from "../../..";

// forIWithoutInterface function with interface support
export function forIWithInterface<I, IndexType>(arr: I[], func: FunctionLoop<I, IndexType>): void {
    for (let i: number = 0; i < arr.length; i++) {
        func(i as IndexType, arr[i]);
    }
}

export function forIWithoutInterface<I, IndexType>(arr: I[], func: (index: IndexType, item: I) => void): void {
    for (let i: number = 0; i < arr.length; i++) {
        func(i as IndexType, arr[i]);
    }
}

