import { LinkedList } from "../../../../utils";

class c_Person {
    constructor( public name: string,public age: number ) { }
}

export function testLinkListObj() {
    // Create a LinkedList of Person objects
    const personList=new LinkedList<c_Person>();

    // Create Person objects
    const person1=new c_Person( "Pierre",25 );
    const person2=new c_Person( "Mathieu",22 );
    const person3=new c_Person( "Marine",35 );

    // Insert elements
    personList.insertFirst( person1 );
    personList.insertLast( person2 );
    personList.insertAt( person3,1 );

    // Access elements
    // Output: LinkedListNode { data: Person { name: 'John', age: 25 }, prev: null, next: LinkedListNode }
    console.log( personList.getAt( 0 ) );
    // Output: LinkedListNode { data: Person { name: 'Alice', age: 30 }, prev: LinkedListNode, next: null }
    console.log( personList.getLast() ); 

    // Remove elements
    personList.removeFirst();
    personList.removeAt( 1 );

    // Get the size of the linked list
    console.log( personList.size() ); // Output: 1

    // Convert the linked list to an array
    console.log( personList.toArray() ); // Output: [ Person { name: 'Alice', age: 30 } ]
}