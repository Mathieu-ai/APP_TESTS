import colors from 'colors'
import { log } from 'console';

interface Person {
    id: number;
    name: string;
}

class LinkedListNode<T> {
    constructor(
        public data: T,
        public prev?: LinkedListNode<T>|null,
        public next?: LinkedListNode<T>|null
    ) { }
}

export class LinkedList<T> {
    private head: LinkedListNode<T>|null=null;
    private tail: LinkedListNode<T>|null=null;
    private _size: number=0;

    insertFirst ( data: T ) {
        const newNode=new LinkedListNode( data,null,this.head );

        if( this.head ) {
            this.head.prev=newNode;
        } else {
            this.tail=newNode;
        }

        this.head=newNode;
        this._size++;
    }

    size (): number {
        return this._size;
    }

    getFirst (): LinkedListNode<T>|null {
        return this.head;
    }

    getLast (): LinkedListNode<T>|null {
        return this.tail;
    }

    clear () {
        this.head=null;
        this.tail=null;
        this._size=0;
    }

    removeFirst () {
        if( !this.head ) {
            return;
        }

        if( this.head.next ) {
            this.head.next.prev=null;
        } else {
            this.tail=null;
        }

        this.head=this.head.next;
        this._size--;
    }

    removeLast () {
        if( !this.tail ) {
            return;
        }

        if( this.tail.prev ) {
            this.tail.prev.next=null;
        } else {
            this.head=null;
        }

        this.tail=this.tail.prev;
        this._size--;
    }

    insertLast ( data: T ) {
        const newNode=new LinkedListNode( data,this.tail,null );

        if( this.tail ) {
            this.tail.next=newNode;
        } else {
            this.head=newNode;
        }

        this.tail=newNode;
        this._size++;
    }

    getAt ( index: number ): LinkedListNode<T>|null {
        if( index<0||index>=this._size ) {
            return null;
        }

        let node=this.head;
        let counter=0;

        while( node&&counter<index ) {
            node=node.next;
            counter++;
        }

        return node;
    }

    removeAt ( index: number ) {
        const nodeToRemove=this.getAt( index );

        if( !nodeToRemove ) {
            return;
        }

        if( nodeToRemove.prev ) {
            nodeToRemove.prev.next=nodeToRemove.next;
        } else {
            this.head=nodeToRemove.next;
        }

        if( nodeToRemove.next ) {
            nodeToRemove.next.prev=nodeToRemove.prev;
        } else {
            this.tail=nodeToRemove.prev;
        }

        this._size--;
    }

    insertAt ( data: T,index: number ) {
        if( index===0 ) {
            this.insertFirst( data );
            return;
        }

        const previousNode=this.getAt( index-1 )||this.tail;
        const newNode=new LinkedListNode( data,previousNode,previousNode.next );

        if( previousNode.next ) {
            previousNode.next.prev=newNode;
        }

        previousNode.next=newNode;
        this._size++;
    }

    toArray (): T[] {
        const result: T[]=[];
        let node=this.head;

        while( node ) {
            result.push( node.data );
            node=node.next;
        }

        return result;
    }
}

export const testLinkedList=async ( timeout: number ) => {
    let list=new LinkedList<number>();
    let logs: string[]=[];
    let operations=[
        { op: () => list.insertFirst( 1 ),desc: "Inserting 1 at the first" },
        { op: () => list.insertFirst( 2 ),desc: "Inserting 2 at the first" },
        { op: () => list.insertLast( 3 ),desc: "Inserting 3 at the last" },
        { op: () => list.insertAt( 4,1 ),desc: "Inserting 4 at index 1" },
        { op: () => list.getFirst()?.data,desc: "Getting the first element" },
        { op: () => list.getLast()?.data,desc: "Getting the last element" },
        { op: () => list.getAt( 2 )?.data,desc: "Getting the element at index 2" },
        { op: () => list.removeFirst(),desc: "Removing the first element" },
        { op: () => list.getFirst()?.data,desc: "Getting the first element" },
        { op: () => list.removeLast(),desc: "Removing the last element" },
        { op: () => list.getLast()?.data,desc: "Getting the last element" },
        { op: () => list.removeAt( 1 ),desc: "Removing the element at index 1" },
        { op: () => list.getAt( 0 )?.data,desc: "Getting the element at index 0" },
        { op: () => list.size(),desc: "Getting the size of the list" },
        { op: () => list.clear(),desc: "Clearing the list" },
        { op: () => list.size(),desc: "Getting the size of the list after clearing" }
    ];

    for( let i=0;i<operations.length;i++ ) {
        const logMessage=`Operation ${ i+1 }: ${ operations[ i ].desc }`;
        logs.push( logMessage );
        console.log( logMessage );

        const result: any=await Promise.resolve( operations[ i ].op() );
        await new Promise( resolve => setTimeout( resolve,timeout*1000 ) );

        const currentList=list.toArray();
        const listString=currentList.map( ( x: number ) => x===result? colors.green( x.toString() ):x.toString() ).join( ', ' );
        const stateMessage=`=> [${ listString }]`;

        if( result ) {
            const resultMessage=`${ colors.green( result.toString() ) } ${ stateMessage }`;
            logs.push( resultMessage );
            console.log( resultMessage );
        } else {
            logs.push( stateMessage );
            console.log( stateMessage );
        }
    }

    return logs;
}

export const testLinkedList2=async ( timeout: number ) => {
    let list=new LinkedList<Person>();
    let logs: string[]=[];

    const operations=[
        {
            op: () => list.insertFirst( { id: 1,name: 'Alice' } ),
            desc: 'Inserting Alice at the first',
        },
        {
            op: () => list.insertFirst( { id: 2,name: 'Bob' } ),
            desc: 'Inserting Bob at the first',
        },
        {
            op: () => list.insertLast( { id: 3,name: 'Charlie' } ),
            desc: 'Inserting Charlie at the last',
        },
        {
            op: () => list.insertAt( { id: 4,name: 'David' },1 ),
            desc: 'Inserting David at index 1',
        },
        {
            op: () => list.getFirst()?.data,
            desc: 'Getting the first element',
        },
        {
            op: () => list.getLast()?.data,
            desc: 'Getting the last element',
        },
        {
            op: () => list.getAt( 2 )?.data,
            desc: 'Getting the element at index 2',
        },
        {
            op: () => list.removeFirst(),
            desc: 'Removing the first element',
        },
        {
            op: () => list.getFirst()?.data,
            desc: 'Getting the first element',
        },
        {
            op: () => list.removeLast(),
            desc: 'Removing the last element',
        },
        {
            op: () => list.getLast()?.data,
            desc: 'Getting the last element',
        },
        {
            op: () => list.removeAt( 1 ),
            desc: 'Removing the element at index 1',
        },
        {
            op: () => list.getAt( 0 )?.data,
            desc: 'Getting the element at index 0',
        },
        {
            op: () => list.size(),
            desc: 'Getting the size of the list',
        },
        {
            op: () => list.clear(),
            desc: 'Clearing the list',
        },
        {
            op: () => list.size(),
            desc: 'Getting the size of the list after clearing',
        },
    ];

    for( let i=0;i<operations.length;i++ ) {
        const logMessage=`Operation ${ i+1 }: ${ operations[ i ].desc }`;
        logs.push( logMessage );
        console.log( logMessage );

        const result: any=await Promise.resolve( operations[ i ].op() );
        await new Promise( ( resolve ) => setTimeout( resolve,timeout*1000 ) );

        const currentList=list.toArray();
        const listString=currentList
            .map( ( person ) =>
                person===result
                    ? colors.green( JSON.stringify( person ) )
                    :JSON.stringify( person )
            )
            .join( ', ' );
        const stateMessage=`=> [${ listString }]`;

        if( result ) {
            const resultMessage=`${ colors.green(
                JSON.stringify( result )
            ) } ${ stateMessage }`;
            logs.push( resultMessage );
            console.log( resultMessage );
        } else {
            logs.push( stateMessage );
            console.log( stateMessage );
        }
    }

    return logs;
};