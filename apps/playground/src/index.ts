import {config as getEnv} from "dotenv";
import {env} from 'process'
getEnv( {path: './config/.env'} );

import {
    compareTypes,
    createInitials,
    data,
    data10,
    data2,
    data3,
    data4,
    data5,
    data6,
    data7,
    data8,
    data9,
    flat,
    getUnique,
    noSoClose,
    number,
    pdf2json,
    simplifyNamedCharacters,
    str1,
    str2,
    str3,
    str4,
    str5,
    str6,
    str7,
    str8,
    readFileUrl,
    request,
    LinkedList,
    testLinkedList,
    testLinkedList2,
    mapWithInterface,
    mapWithoutInterface,
    testLinkListObj,
    data11,
    b,
    getMessage,
    getMessage2,
    forEachWithInterface,
    data12,
    forEachWithoutInterface,
    forIWithInterface,
    forIWithoutInterface
} from "../utils";
import {mlProp} from "functions/props";
import {log} from "console";

const test1=compareTypes( data3, "number", {getKeys: true} )
const test2=flat( data, {props: [ "firstName" ]} )
const test3=flat( data2 )
const test4=flat( data );
const test5=createInitials( str1 )
const test6=createInitials( str2 )
const test7=createInitials( str3 )
const test8=createInitials( str4 )
const test9=createInitials( str5 )
const test10=createInitials( str6 )
const test11=getUnique( {data: data5} )
const test12=getUnique( {data: data4, field: str7} )
const test13=getUnique( {data: data6, field: str7} )
const test14=number( [ "4" ] )
const test15=number( [ "4", "four" ] )
const test16=number( "5" )
const test17=simplifyNamedCharacters( data7 )
const test18=getUnique( {data: data8, field: str8} )
const test19=flat( data9, {props: [ 'lastName' ]} );
const test20=flat( data9 );
const test21=flat( data10, {props: [ "city" ]} )
const test22=noSoClose( 'user', 'user' );
const test23=noSoClose( '123456789', 'abcdefghi' );
const test24=noSoClose( 'helloworld', 'jello9orld' );
const test25=request( env.ONEDRIVE_URI, {}, 'GET' )
// const test26=async () => {
//     await testLinkedList( 0.1 );
// }
// const test27=async () => {
//     await testLinkedList2( 0.1 );
// }
// const test28=testLinkListObj()

const test29=mapWithInterface( [ "1", "2", "3" ], ( n ) => parseInt( n ) );
const test30=mapWithoutInterface<b, number>( [ {a: 1} ], ( n ) => Number( n.a ) );
const test31=data11
const test32=forEachWithInterface( data12, ( n ) => Number( n ) );
const test33=forIWithInterface( data12, ( i, n ) => console.log( `Index: ${i}, Value: ${n}` ) );

// const test32=async ( str="Hello, World!",iterations=5,timeout=2 ) => {
//     await getMessage( str,iterations,timeout );
// }
// const test33=getMessage2( "Hello, World!",5,2 );
// test26();
// test27()
// fs.writeFileSync('result.json', test17);
//console.log(pdf2json(env.PDF))
// for( let i=1;i<=31;i++ ) {
//     try {
//         console.log( eval( `test${ i }` ) );
//     } catch( error ) {
//         continue;
//     }
// }

log( test22 )