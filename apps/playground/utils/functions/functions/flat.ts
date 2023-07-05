import {FlatOptions} from "./types";

/**
    Flatten an object and return the values of the specified keys as a string.
    * * 🟢 Function is generic
    * * 🟠 can't take parent object or array ( c.f example below, ex: family )
    @param {any} data - The object to flatten.
    @param {string[]} [options.props] - The keys to extract from the data
    @return {string} - The values of the specified keys as a string, separated by a comma.
    @example
        const data = [
            {
                "id": 1,
                "name": "John",
                "lastName": "Doe",
                "isAlive": false,
                "coor": {
                    "state": "France",
                    "city": "Paris",
                    "zip": null,
                    "lat": true,
                    "long": 784.542,
                },
                "family": {
                    "parents": [
                        { "name": "Pierre", "lastName": "Doe", "role": "father" },
                        { "name": "Blanche", "lastName": "Doe", "role": "mother" }
                    ],
                    "broAndSis": [
                        { "name": "Jean", "lastName": "Doe", "role": "brother" },
                        { "name": "Clementine", "lastName": "Doe", "role": "sister" }
                    ]
                },
                "moneyPerTrim": [1500, 1521, 1521]
            }
        ]
        console.log(flat(data, {acceptALl: true}));
        // "1, John, Doe, false, France, Paris, null, true, 784.542, Pierre, Doe, father, Blanche, Doe, mother, Jean, Doe, brother, Clementine, Doe, sister, 1500, 1521, 1521"
        flat(data, { props: ["city"] });
        // "Paris"
 */
export function flat(data: any,options: FlatOptions={}): string {
    const {props=[]}=options;
    const result: string[]=[];

    const traverse=(obj: any) => {
        for(const key in obj) {
            const val=obj[key];

            if(typeof val==="object"&&val) {
                traverse(val);
            } else if(!props.length||props.includes(key)) {
                if(Array.isArray(val)) {
                    result.push(...val.filter(item => item));
                } else if(val) {
                    result.push(val);
                }
            }
        }
    };

    traverse(data);
    return [...new Set(result)].join(', ')
}