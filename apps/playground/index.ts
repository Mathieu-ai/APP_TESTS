import { config as getEnv } from "dotenv";
import { env } from 'process'
getEnv( { path: './config/.env' } );

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
    request
} from "./utils";
import { mlProp } from "functions/props";

const test1=compareTypes( data3,"number",{ getKeys: true } )
const test2=flat( data,{ props: [ "firstName" ] } )
const test3=flat( data2 )
const test4=flat( data );
const test5=createInitials( str1 )
const test6=createInitials( str2 )
const test7=createInitials( str3 )
const test8=createInitials( str4 )
const test9=createInitials( str5 )
const test10=createInitials( str6 )
const test11=getUnique( { data: data5 } )
const test12=getUnique( { data: data4,field: str7 } )
const test13=getUnique( { data: data6,field: str7 } )
const test14=number( [ "4" ] )
const test15=number( [ "4","four" ] )
const test16=number( "5" )
const test17=simplifyNamedCharacters( data7 )
const test18=getUnique( { data: data8,field: str8 } )
const test19=flat( data9,{ props: [ 'lastName' ] } );
const test20=flat( data9 );
const test21=flat( data10,{ props: [ "city" ] } )
const test22=noSoClose( 'user','user' );
const test23=noSoClose( '123456789','abcdefghi' );
const test24=noSoClose( 'helloworld','jello9orld' );
const test25=request( env.ONEDRIVE_URI,{},'GET' )
// fs.writeFileSync('result.json', test17);
//console.log(pdf2json('C:/Users/mathie_l/OneDrive - Union Internationale des Chemins de Fer U.I.C/Documents/UIC/PDF/IA.pdf'))
console.log( test25 );