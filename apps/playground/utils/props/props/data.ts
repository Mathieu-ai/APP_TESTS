export const arr = [
    {
        type: "success",
        color: "teal-3",
        icon: "alpha-a-circle",
        state: "Active member",
    },
    {
        type: "warning",
        color: "blue-4",
        icon: "alpha-a-circle",
        state: "Affiliate member",
    }
]
export const data = [
    {
        info: {
            name: {
                firstName: "Daniel",
                lastName: "Barber",
                fullName: "Jerry Barber",
            },
            location: {
                city: "Bawcomville",
                country: "Armenia",
            }
        },
        details: {
            dates: {
                ddeb: "2023/03/21",
                dfin: null,
            },
            lastDay: 14
        }
    }
]
export const data2 = [
    data[0].info.name.firstName,
    data[0].info.name.lastName,
    arr.map((k: { state: string }) => k.state),
    data[0].details.dates.ddeb,
    data[0].details.lastDay,
]
export const data3 = [1, "hello", { name: "John", age: 30 }, true, { name: "Jane", age: 25 }]
export const data4 = [
    { id: 1, name: 'John', state: [{ name: "One", color: "red" }] },
    { id: 2, name: 'Pierre', state: [{ name: "Two", color: "blue" }] },
    { id: 3, name: 'Kate', state: [{ name: "One", color: "red" }] }
];
export const data5 = ["a", "b", "a"];
export const data6 = [
    { id: 1, name: 'John', state: { name: "One" } },
    { id: 2, name: 'Pierre', state: { name: "Two" } },
    { id: 3, name: 'Kate', state: { name: "One" } }
];
export const data7 = {
    "&AElig": { "codepoints": [198], "characters": "\u00C6" },
    "&AElig;": { "codepoints": [198], "characters": "\u00C6" },
    "&AMP": { "codepoints": [38], "characters": "\u0026" },
    "&AMP;": { "codepoints": [38], "characters": "\u0026" },
    "&Aacute": { "codepoints": [193], "characters": "\u00C1" },
    "&Aacute;": { "codepoints": [193], "characters": "\u00C1" },
    "&Abreve;": { "codepoints": [258], "characters": "\u0102" },
    "&Acirc": { "codepoints": [194], "characters": "\u00C2" },
    "&Acirc;": { "codepoints": [194], "characters": "\u00C2" },
    "&Acy;": { "codepoints": [1040], "characters": "\u0410" },
    "&Afr;": { "codepoints": [120068], "characters": "\uD835\uDD04" },
}
export const data8 = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Alice' },
    { id: 4, name: 'Charlie' },
];
export const data9 = {
    id: 1,
    name: 'John',
    lastName: 'Doe',
    coor: {
        lat: 23.56,
        long: 784.542
    },
    family: {
        parents: [
            { name: 'Pierre', lastName: 'Doe', role: 'father' },
            { name: 'Blanche', lastName: 'Doe', role: 'mother' }
        ],
        broAndSis: [
            { name: 'Jean', lastName: 'Doe', role: 'brother' },
            { name: 'Clementine', lastName: 'Doe', role: 'sister' }
        ]
    },
    moneyPerTrim: [1500, 1521, 1521]
};
export const data10 = [
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