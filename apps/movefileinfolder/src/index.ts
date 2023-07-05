import { access as acc, stat as stats, constants } from 'fs';
import chalk from 'colors';
import { promisify } from 'util';
import { readdir,mkdir,rename } from 'fs/promises';
import { join,basename } from 'path';
import inquirer from 'inquirer';
import InquirerSearchList from 'inquirer-search-list';

inquirer.registerPrompt( 'search-list',InquirerSearchList as any );

const access=promisify( acc );
const stat=promisify( stats );


interface LanguageOptions {
    [ key: string ]: string[];
}

interface QuestionObject {
    [ key: string ]: {
        path: string;
        nested: string;
        nonChar: string;
        options: string[];
        nonCharOptions: string[];
        language: string;
    };
}

const nonCharOptions: LanguageOptions={
    en: [ '1','2' ],
    fr: [ '1','2' ],
    es: [ '1','2' ],
    cn: [ '1','2' ],
    de: [ '1','2' ],
    jp: [ '1','2' ],
};

const affirmations: LanguageOptions={
    en: [ 'Yes','No' ],
    fr: [ 'Oui','Non' ],
    es: [ 'Sí','No' ],
    cn: [ '是','否' ],
    de: [ 'Ja','Nein' ],
    jp: [ 'はい','いいえ' ],
};

const questions: QuestionObject={
    en: {
        path: 'Please enter the folder path:',
        nested: 'Do you want to check in nested folders?',
        nonChar: 'For non-character files, would you like to use their first letter (option 1) or go into a "0" folder (option 2)?',
        options: affirmations.en,
        nonCharOptions: nonCharOptions.en,
        language: 'Please choose your language:',
    },
    // ... other languages
};

function isAffirmative ( response: string,language: string ): boolean {
    return response===affirmations[ language ][ 0 ];
}

function useFirstLetter ( option: string,language: string ): boolean {
    return option===nonCharOptions[ language ][ 0 ];
}

const specialCases: { [ key: string ]: string }={
    "-Merci-": "Merci",
    "chingyu": "chingyu",
    "CUUPID CORP": "CUUPID CORP",
    "midnitesim": "midnitesim",
    "NikV": "NikV",
    "BS": "BS",
    "1Z": "1Z",
    "kardofe": "kardofe",
    "Caroll91": "Caroll91",
    "Vixen": "Vixen",
    "5th": "5th",
    "909SIMS": "909SIMS",
    "ymAcc": "ymAcc",
    "ZykatekbCreations": "ZykatekbCreations",
    "acnassy": "acnassy",
    "Ade": "Ade",
    "Advaneye": "Advaneye",
    "Mydarling20": "Mydarling20",
    "Afra-k": "Afra-k",
    "afrodita": "afrodita",
    "Akaoma": "Akaoma",
    "Akna": "Akna",
    "Akogare": "Akogare",
    "Al Fresco": "Al Fresco",
    "Aldolce": "Aldolce",
    "AleNik": "AleNik",
    "AlexanderLiving": "AlexanderLiving",
    "Alf-si": "Alf-si",
    "ALFgray": "ALFgray",
    "ALGU": "ALGU",
    "AliraBed": "AliraBed",
    "altea127": "altea127",
    "CHEVALIAH": "CHEVALIAH",
    "katariinukka": "katariinukka",
    "ambracio": "ambracio",
    "Amnesiac": "Amnesiac",
    "amoebae": "amoebae",
    "Anders": "Anders",
    "andrew": "andrew",
    "AngeliveD": "AngeliveD",
    "ANGISSI": "ANGISSI",
    "AleNikSimmer": "AleNikSimmer",
    "Angela": "Angela",
    "Anonimux_Simmer": "Anonimux_Simmer",
    "Anto": "Anto",
    "arethabee": "arethabee",
    "Arltos": "Arltos",
    "ArtVitalex": "ArtVitalex",
    "ArwenKaboom": "ArwenKaboom",
    "asan333": "asan333",
    "AurumMusik": "AurumMusik",
    "autaki": "autaki",
    "BAkalia": "BAkalia",
    "Beto_ae0": "Beto_ae0",
    "Bill_Sims": "Bill_Sims",
    "Birba32": "Birba32",
    "Black_Lily": "Black_Lily",
    "Bobur2": "Bobur2",
    "bukovka": "bukovka",
    "busra-tr": "busra-tr",
    "Camuflaje": "Camuflaje",
    "Caroll912": "Caroll912",
    "Couquetts": "Couquetts",
    "comaron": "comaron",
    "carvin_captoor": "carvin_captoor",
    "Cazy": "Cazy",
    "ChordoftheRings": "ChordoftheRings",
    "chrimsimy": "chrimsimy",
    "christopher0672": "christopher0672",
    "coffeemoon": "coffeemoon",
    "cosimetic": "cosimetic",
    "Cyclonesue": "Cyclonesue",
    "Daisy-Sims": "Daisy-Sims",
    DanSimsFantasy: "DanSimsFantasy",
    Danuta720: "Danuta720",
    DarkNighTt: "DarkNighTt",
    DarkWave14: "DarkWave14",
    dasie22: "dasie22",
    David_Mtv2: "David_Mtv2",
    Dissia: "Dissia",
    divaka45: "divaka45",
    DOLilac: "DOLilac",
    ekinege: "ekinege",
    Enriques4: "Enriques4",
    evi: "evi",
    EvilQuinzel: "EvilQuinzel",
    feyona: "feyona",
    Flubs79: "Flubs79",
    Garfiel: "Garfiel",
    Glitterberryfly: "Glitterberryfly",
    GoAmazons: "GoAmazons",
    greyIS: "greyIS",
    Harmonia: "Harmonia",
    Helsoseira: "Helsoseira",
    IzzieMcFire: "IzzieMcFire",
    Jaru_Sims: "Jaru_Sims",
    JavaSims: "JavaSims",
    Joan: "Joan",
    jolanta2: "jolanta2",
    Jolea: "Jolea",
    jomsims: "jomsims",
    KareemZiSims2: "KareemZiSims2",
    KaTPurpura: "KaTPurpura",
    Kikuruacchi: "Kikuruacchi",
    KIMSimjo: "KIMSimjo",
    laupipi2: "laupipi2",
    Leah_Lillith: "Leah_Lillith",
    LEXEL_s: "LEXEL_s",
    Lhonna: "Lhonna",
    lillka: "lillka",
    LIN_DIAN: "LIN_DIAN",
    Lisaminicatsims: "Lisaminicatsims",
    LVNDRCC: "LVNDRCC",
    MagicHand: "MagicHand",
    magpiesan: "magpiesan",
    MahoCreations: "MahoCreations",
    marychabb: "marychabb",
    Mazero5: "Mazero5",
    McLayneSims: "McLayneSims",
    Merit_Selket: "Merit_Selket",
    mermaladesimtr: "mermaladesimtr",
    Mincsims: "Mincsims",
    Mini_Simmer: "Mini_Simmer",
    Moniamay72: "Moniamay72",
    MSQSIMS: "MSQSIMS",
    Mutske: "Mutske",
    MychQQQ: "MychQQQ",
    MysteriousOo: "MysteriousOo",
    Nadiafabulousflow: "Nadiafabulousflow",
    Natalis: "Natalis",
    Nessca: "Nessca",
    NICKNAME_sims4: "NICKNAME_sims4",
    Nilyn: "Nilyn",
    Nords: "Nords",
    Onyxium: "Onyxium",
    OranosTR: "OranosTR",
    Padre: "Padre",
    philo: "philo",
    Pilar: "Pilar",
    PinkyCustomWorld: "PinkyCustomWorld",
    Pipco: "Pipco",
    pixelette: "pixelette",
    pizazz: "pizazz",
    PlayersWonderland: "PlayersWonderland",
    Plumbobs_n_Fries: "Plumbobs_n_Fries",
    portev: "portev",
    Puresim: "Puresim",
    qicc: "qicc",
    RAVASHEEN: "RAVASHEEN",
    Ray_Sims: "Ray_Sims",
    Reevaly: "Reevaly",
    Reina_Dambi: "Reina_Dambi",
    remaron: "remaron",
    RemusSirion: "RemusSirion",
    Rirann: "Rirann",
    RobertaPLobo: "RobertaPLobo",
    RoyIMVU: "RoyIMVU",
    "S-Club": "S-Club",
    saliwa: "saliwa",
    sehablasimlish: "sehablasimlish",
    Seleng: "Seleng",
    Severinka_: "Severinka_",
    Sifix2: "Sifix2",
    ShakeProductions: "ShakeProductions",
    Shimydimsims: "Shimydimsims",
    simbishy: "simbishy",
    simcelebrity00: "simcelebrity00",
    simlasya: "simlasya",
    "SIMcredible": "SIMcredible",
    SimmieV: "SimmieV",
    SIMSBYLINEA: "SIMSBYLINEA",
    SimsDollhouse: "SimsDollhouse",
    simspaces: "simspaces",
    Sims_House: "Sims_House",
    simZmora: "simZmora",
    sim_man123: "sim_man123",
    starafanka: "starafanka",
    sugar_owl: "sugar_owl",
    Suzue: "Suzue",
    Suzz86: "Suzz86",
    Syboubou: "Syboubou",
    talarian: "talarian",
    tatygagg: "tatygagg",
    TheNumbersWoman: "TheNumbersWoman",
    thisisthem: "thisisthem",
    turksimmer: "turksimmer",
    TsminhSims: "TsminhSims",
    TwistedMexi: "TwistedMexi",
    ung999: "ung999",
    VirtualFairytales: "VirtualFairytales",
    Viy_Sims: "Viy_Sims",
    Willeekmer: "Willeekmer",
    wingssims: "wingssims",
    WisteriaSims: "WisteriaSims",
    wondymoon: "wondymoon",
    xogerardine: "xogerardine",
    ZENX: "ZENX",
    "1621": "1621",
    WistfulCastle: "WistfulCastle",
    Arcane: "Arcane",
    argunfutur: "argunfutur",
    Ariana: "Ariana",
    Arkane: "Arkane",
    ArwenK: "ArwenK",
    ARYA: "ARYA",
    Arzoza: "Arzoza",
    Ashen: "Ashen",
    "ASHwwa_Ningyou": "ASHwwa_Ningyou",
    Asilkan: "Asilkan",
    Asoxtane: "Asoxtane",
    Athena: "Athena",
    Atlas: "Atlas",
    ATrois: "ATrois",
    ATS4: "ATS4",
    attraction: "attraction",
    LorySims: "LorySims",
    Augustine: "Augustine",
    Aurum: "Aurum",
    AylinKitchen: "AylinKitchen",
    Azmodan22: "Azmodan22",
    BABY: "BABY",
    BakieGaming: "BakieGaming",
    Bathroom: "Bathroom",
    BathroomAloe: "BathroomAloe",
    BathroomGemini: "BathroomGemini",
    BA: "BA",
    BDSMPOSTERS: "BDSMPOSTERS",
    Garbelishe: "Garbelishe",
    BeatBBQ: "BeatBBQ",
    Bed: "Bed",
    Benevita: "Benevita",
    Benevolence: "Benevolence",
    BEO: "BEO",
    Besta: "Besta",
    "Mathcope&BetoSims": "Mathcope&BetoSims",
    L0unacutex: "L0unacutex",
    BlackCat27: "BlackCat27",
    Black: "Black",
    BlahberryPancake: "BlahberryPancake",
    BL: "BL",
    Bobur: "Bobur",
    bockman: "bockman",
    Bohemian: "Bohemian",
    BokchoiJo: "BokchoiJo",
    Bood: "Bood",
    AliraBedroom: "AliraBedroom",
    belaloallure: "belaloallure",
    Brick: "Brick",
    Brooklyn: "Brooklyn",
    Bruxel: "Bruxel",
    budgie: "budgie",
    BuffetTable: "BuffetTable",
    ItsMissCheekie: "ItsMissCheekie",
    BustierTop: "BustierTop",
    "By Beto": "By Beto",
    "by bukovka": "by bukovka",
    Caden: "Caden",
    CAMUFALJE: "CAMUFALJE",
    CandySims4: "CandySims4",
    Carissma: "Carissma",
    CarlosMG: "CarlosMG",
    beebee: "beebee",
    neinahpets: "neinahpets",
    CasualSims: "CasualSims",
    CATEMCPHEE: "CATEMCPHEE",
    CATE: "CATE",
    CC: "CC",
    Celestia: "Celestia",
    AcadiaLiving: "AcadiaLiving",
    Chair: "Chair",
    Charlotte: "Charlotte",
    Chateau: "Chateau",
    CB: "CB",
    CherryPie: "CherryPie",
    Chicklet: "Chicklet",
    Chisam: "Chisam",
    JCB: "JCB",
    ChloeM: "ChloeM",
    Chrimsimy: "Chrimsimy",
    christmas: "christmas",
    Christopher067: "Christopher067",
    CHROMEANGEL: "CHROMEANGEL",
    Citrine: "Citrine",
    CoastalLupine: "CoastalLupine",
    Spacesims: "Spacesims",
    Christina51: "Christina51",
    Cleotopia: "Cleotopia",
    Kya: "Kya",
    cmar: "cmar",
    CN: "CN",
    CM: "CM",
    Zwolle: "Zwolle",
    Zita: "Zita",
    Zerbu: "Zerbu",
    Zara: "Zara",
    ZAO: "ZAO",
    ZacHairKid: "ZacHairKid",
    Ye: "Ye",
    x_: "x_",
    Wyndham: "Wyndham",
    WW: "WW",
    Wuulm: "Wuulm",
    Wtrshpdwn: "Wtrshpdwn",
    ws: "ws",
    Worthington: "Worthington",
    Wood: "Wood",
    Women: "Women",
    Winner9: "Winner9",
    WINGS: "WINGS",
    wild: "wild",
    wellness: "wellness",
    WeeAlbet: "WeeAlbet",
    Wedgewood: "Wedgewood",
    Wazowski: "Wazowski",
    ViySims: "ViySims",
    "Viy Sims": "Viy Sims",
    VivianDang: "VivianDang",
    Vintage: "Vintage",
    vexic: "vexic",
    Veuli: "Veuli",
    Hayley: "Hayley",
    Veronica: "Veronica",
    SiomisVault: "SiomisVault",
    Pinzombiecupcake: "Pinzombiecupcake",
    vanaziana: "vanaziana",
    Valuka: "Valuka",
    Valentine: "Valentine",
    Uzux: "Uzux",
    Under: "Under",
    Ultra: "Ultra",
    Ullery: "Ullery",
    UBP: "UBP",
    Sylviemy: "Sylviemy",
    SYB: "SYB",
    Syberia: "Syberia",
    GossipGirl: "GossipGirl",
    VIC: "VIC",
    SV: "SV",
    "MR Design": "MR Design",
    Steampunked: "Steampunked",
    Stealthi: "Stealthi",
    SS: "SS",
    Spring: "Spring",
    SonyaSims: "SonyaSims",
    Sonoma: "Sonoma",
    so87g: "so87g",
    Karlie: "Karlie",
    SL: "SL",
    SLYD: "SLYD",
    Skysims: "Skysims",
    Sim: "Sim",
    Sifix: "Sifix",
    Shino: "Shino",
    sg5150: "sg5150",
    sezlestek: "sezlestek",
    Severinka: "Severinka",
    SET: "SET",
    serenity: "serenity",
    Sentate: "Sentate",
    Seimar: "Seimar",
    seeu1207: "seeu1207",
    SD: "SD",
    sclub: "sclub",
    SayaSims: "SayaSims",
    SARO: "SARO",
    Sarmarina: "Sarmarina",
    Sarawat: "Sarawat",
    samtuse963: "samtuse963",
    Samira: "Samira",
    Saliwa: "Saliwa",
    salem: "salem",
    SalarmoJs: "SalarmoJs",
    Saka: "Saka",
    Sagittariah: "Sagittariah",
    " SAD GIRLS": "SAD GIRLS",
    SAC: "SAC",
    s4: "s4",
    Ryllae: "Ryllae",
    RWDN: "RWDN",
    RVSN: "RVSN",
    Rustic: "Rustic",
    Rufia: "Rufia",
    Ruaan: "Ruaan",
    RSN: "RSN",
    RPLts4: "RPLts4",
    Rox: "Rox",
    Roob: "Roob",
    Romiere: "Romiere",
    RockChic: "RockChic",
    roBurky: "roBurky",
    RH: "RH",
    Revy: "Revy",
    Retro: "Retro",
    Remus: "Remus",
    ReMaron: "ReMaron",
    Relax: "Relax",
    Reina: "Reina",
    Reigot: "Reigot",
    Emerald: "Emerald",
    Raizonda: "Raizonda",
    Quentin: "Quentin",
    PZC: "PZC",
    PW: "PW",
    pulse: "pulse",
    PTS: "PTS",
    PS: "PS",
    Psychachu: "Psychachu",
    Katverse: "Katverse",
    Porter: "Porter",
    PopApartmentII: "PopApartmentII",
    Pn: "Pn",
    Plaxal: "Plaxal",
    Pizazz: "Pizazz",
    Pinkfizz: "Pinkfizz",
    Philo: "Philo",
    Pepka: "Pepka",
    Penelope: "Penelope",
    PC: "PC",
    Pazazz: "Pazazz",
    Paogae: "Paogae",
    PandaSama: "PandaSama",
    PaleGStone: "PaleGStone",
    padre: "padre",
    Simsloverxyz: "Simsloverxyz",
    Oranos: "Oranos",
    OLI: "OLI",
    AP: "AP",
    OhMyGoth: "OhMyGoth",
    ohmysims: "ohmysims",
    "Oh My Goth": "Oh My Goth",
    Odey92: "Odey92",
    LiKo: "LiKo",
    "Lucy Muni": "Lucy Muni",
    Ocarx: "Ocarx",
    obal: "obal",
    Oakes: "Oakes",
    Nzuza: "Nzuza",
    NynaeveDesign: "NynaeveDesign",
    NumbersWoman: "NumbersWoman",
    NRS: "NRS",
    NotEgain: "NotEgain",
    Norvedem: "Norvedem",
    Noresund: "Noresund",
    nolcanol: "nolcanol",
    NitroPanic: "NitroPanic",
    Ninkerbell19: "Ninkerbell19",
    Nilynhair: "Nilynhair",
    Nightcrawler: "Nightcrawler",
    NFL: "NFL",
    NFF: "NFF",
    Networksims: "Networksims",
    netsims: "netsims",
    Neptun: "Neptun",
    Nemesis: "Nemesis",
    Nekda: "Nekda",
    NEIDEN: "NEIDEN",
    Neferu: "Neferu",
    ND: "ND",
    Natural: "Natural",
    NataliS: "NataliS",
    Nae: "Nae",
    Myrasol: "Myrasol",
    MYOBI: "MYOBI",
    MUSAE: "MUSAE",
    MTS: "MTS",
    MSWD: "MSWD",
    MsBlue: "MsBlue",
    MSBEARY: "MSBEARY",
    Mr_S: "Mr_S",
    MP: "MP",
    Moicom: "Moicom",
    Modern: "Modern",
    modelsims4: "modelsims4",
    Yani: "Yani",
    MMSIMS: "MMSIMS",
    MizoreYukii: "MizoreYukii",
    Mixen: "Mixen",
    Missy: "Missy",
    Miramar: "Miramar",
    MinimalSim: "MinimalSim",
    Mingi: "Mingi",
    MInc: "MInc",
    Mimoto: "Mimoto",
    Mimilky: "Mimilky",
    Milla: "Milla",
    Milar: "Milar",
    miiko: "miiko",
    Annabe: "Annabe",
    MG: "MG",
    MFS: "MFS",
    MF: "MF",
    Meten: "Meten",
    MELDEANNE: "MELDEANNE",
    Mega_16_CAS: "Mega_16_CAS",
    MCCC: "MCCC",
    MCB: "MCB",
    mbb: "mbb",
    MB: "MB",
    Mazero: "Mazero",
    Mayhem: "Mayhem",
    MAUVEMORN: "MAUVEMORN",
    Lory: "Lory",
    Marithas: "Marithas",
    mandal: "mandal",
    makennz: "makennz",
    MahoC: "MahoC",
    Magnolia: "Magnolia",
    Madlen: "Madlen",
    M90: "M90",
    "M-Geo": "M-Geo",
    LYNX: "LYNX",
    LVNDR: "LVNDR",
    LUUMIA: "LUUMIA",
    Lumy: "Lumy",
    LS: "LS",
    LollaLeeloo: "LollaLeeloo",
    LMCS: "LMCS",
    LLSIMS: "LLSIMS",
    Living: "Living",
    Liverpool: "Liverpool",
    LittleMsSam: "LittleMsSam",
    Linavees: "Linavees",
    "LIN-DIAN": "LIN-DIAN",
    LimestoneWalls: "LimestoneWalls",
    lil: "lil",
    LEXEL: "LEXEL",
    Leonardo: "Leonardo",
    LEMINGSTONE: "LEMINGSTONE",
    LeahLillith: "LeahLillith",
    Laupipi: "Laupipi",
    Krajewski: "Krajewski",
    KP: "KP",
    Konat: "Konat",
    KOMUDESIGNS: "KOMUDESIGNS",
    KM: "KM",
    Kliekie: "Kliekie",
    kiwisims4: "kiwisims4",
    kitcoll: "kitcoll",
    Lucy: "Lucy",
    KisaFayd: "KisaFayd",
    KeyCamz: "KeyCamz",
    Katiuti: "Katiuti",
    Karla: "Karla",
    Karkos: "Karkos",
    KareemZiSims: "KareemZiSims",
    Kalkgrund: "Kalkgrund",
    jwofles: "jwofles",
    Curtain09: "Curtain09",
    "BeamCross1x1SW": "BeamCross1x1SW",
    marcorse: "marcorse",
    Alexander: "Alexander",
    Anastasia: "Anastasia",
    Aramiteus: "Aramiteus",
    Jomsims: "Jomsims",
    COSMETIC: "COSMETIC",
    JCTekkSims: "JCTekkSims",
    iyaS: "iyaS",
    Janette: "Janette",
    JamesHair: "JamesHair",
    JaccBurke: "JaccBurke",
    "J&E": "J&E",
    Izyum: "Izyum",
    ISKRAsims4: "ISKRAsims4",
    Irving: "Irving",
    Irishrose985: "Irishrose985",
    Devirose: "Devirose",
    Indigo: "Indigo",
    Hyora: "Hyora",
    huntstheremywant: "huntstheremywant",
    HSSR: "HSSR",
    MavisSneakers: "MavisSneakers",
    MrBASins: "MrBASins",
    SimMattically: "SimMattically",
    Hillsdale: "Hillsdale",
    Hemphill: "Hemphill",
    HB: "HB",
    GourmetKitchen: "GourmetKitchen",
    HQ: "HQ",
    GOLYHAWHAW: "GOLYHAWHAW",
    GlitterberrySims: "GlitterberrySims",
    GiuliettaSims: "GiuliettaSims",
    Scintille: "Scintille",
    GinkoSims: "GinkoSims",
    Gigiko: "Gigiko",
    ghextldkb: "ghextldkb",
    Genius: "Genius",
    Trillyke: "Trillyke",
    Gabrielle: "Gabrielle",
    Future: "Future",
    FSC: "FSC",
    FRS: "FRS",
    Frevi: "Frevi",
    fouyaya: "fouyaya",
    ForLima: "ForLima",
    FlyStone: "FlyStone",
    Fjell: "Fjell",
    IXIA: "IXIA",
    FatalRose47: "FatalRose47",
    FAEZ: "FAEZ",
    Tigerlilly: "Tigerlilly",
    ExteriorNeutralStucco: "ExteriorNeutralStucco",
    Evjki: "Evjki",
    Everett: "Everett",
    Eva: "Eva",
    Esyram: "Esyram",
    Escuda: "Escuda",
    Escondido: "Escondido",
    Erithronium: "Erithronium",
    ErinAOK: "ErinAOK",
    ercazia: "ercazia",
    EnriqueS4: "EnriqueS4",
    Enfield: "Enfield",
    Emyrld: "Emyrld-",
    elamia: "elamia",
    EkinegeTSR: "EkinegeTSR",
    Eastleigh: "Eastleigh",
    dx8seraph: "dx8seraph",
    Dussault: "Dussault",
    DSF: "DSF",
    drtkc: "drtkc",
    DRESS: "DRESS",
    DOT: "DOT",
    DN: "DN",
    dgandy: "dgandy",
    Devilicious: "Devilicious",
    DejaLiving: "DejaLiving",
    DbA: "DbA",
    Darte77: "Darte77",
    DarkNighTtSims: "DarkNighTtSims",
    DarkNighT: "DarkNighTt Sims",
    Dargez: "Dargez",
    DallasGirl: "DallasGirl",
    DaisySims: "DaisySims",
    Daina: "Daina",
    Daerilia: "Daerilia",
    D720: "D720",
    Lilac: "Lilac",
    CYFI: "CYFI",
    CYBERPUNK: "CYBERPUNK",
    "Cy-Fi": "Cy-Fi",
    Crybabies: "Crybabies",
    crwnsctfloors: "crwnsctfloors",
    Creptella: "Creptella",
    CREAEM: "CREAEM",
};

const authorRegexList=[
    /^_[\w]*_([A-Za-z\d-]+)/,
    /^!\__*([A-Za-z\d-]+)/,
    /^\(\(([A-Za-z\d-]+)/,
    /^\(([A-Za-z\d\s]+)\)/,
    /^\[\s*([A-Za-z\d\s]+)\s*\]/,
    /^#\s*_([A-Za-z\d\s]+)_/,
    /^\[\s*([A-Za-z\d\s]+)\s*\]/,
    /^_\[([A-Za-z\d-]+)_/,
    /^\[([A-Za-z\d-]+)\]/,
    /^\{([A-Za-z\d-]+)\}/,
    /^&#\d+;\s*([A-Za-z\d-]+)/,
    /^\!\w*_([A-Za-z\d-]+)/, // for !chingyu_FaithfulnessMod.ts4script
    /^(\d+)\./, // for 1621.package
    /^(\w+)_/, // for 1Z_dress_businessstyle_2D.package, Mutske_ThePerfectNight_Bolton_Window_SmallCornerRight.package
    /_by(\w+)/, // for 2008gloves_byWistfulCastle.package
    /^\d+_([A-Za-z]+)_/, // for 20160801_BS_Mila_Easel.package
    /^([A-Za-z]+)\d+\./, // for ACN24.package
    /^([A-Za-z]+)_/, // for BedroomLynn_PlantSmall.package
    /^([A-Za-z]+)\s/, // for JH [COSMETICS] [TSR] EYELiner #95.package
    /^([A-Za-z]+)_\d+/, // for NynaeveDesign_075 - Altara - Bed.package
    /^([A-Za-z]+)\s/, // for Paogae - CutOutDress.package
    /^([A-Za-z]+)_/, // for PS_MaleNailsN05_Stiletto.package
    /^!\__*([A-Za-z\d-]+)/, // Added for !chingyu_FaithfulnessMod.ts4script
    /^(\d+)\./, // Added for 1621.package
    /^([A-Za-z\d]+)_/, // Added for 1Z_dress_businessstyle_2D.package
    /^([A-Za-z]+)_/, // Added for PS_MaleNailsN05_Stiletto.package
    /^([A-Za-z\d]+)_/,
    /^([A-Za-z\d]+)by/,
    /^([A-Za-z\d]+)/,
    /^([A-Za-z\d\s]+) -/,
    /^([A-Za-z\d-]+)/,
    /^_[\w]*_([\w-]+)/,
    /^!\__*([\w-]+)/,
    /\(\((\([\w-]+)/,
    /^\(([\w\s]+)\)/,
    /^\[\s*([\w\s]+)\s*\]/,
    /^#\s*_([\w\s]+)_/,
    /^\[\s*([\w\s]+)\s*\]/,
    /^_\[([\w-]+)_/,
    /^\[([\w-]+)\]/,
    /^\{([\w-]+)\}/,
    /^&#\d+;\s*([\w-]+)/,
    /^([\w]+)_/,
    /^([\w]+)by/,
    /^([\w]+)/,
    /^([\w\s]+) -/,
    /^([\w-]+)/,
];

// Convert keys of specialCases to lowercase and create regex for case-insensitive matching
const lowerCaseSpecialCases: { [ key: string ]: RegExp }={};
for( const key in specialCases ) {
    lowerCaseSpecialCases[ key.toLowerCase().replace( / /g,'' ) ]=new RegExp( key,'i' );
}

function getAuthorName ( fileName: string ): string {
    // Normalize input
    let normalizedFileName=fileName.toLowerCase();

    // Iterate over the lowerCaseSpecialCases to find a match in the filename
    for( const authorName in lowerCaseSpecialCases ) {
        const match=normalizedFileName.match( lowerCaseSpecialCases[ authorName ] );
        if( match ) {
            let matchedAuthorName=match[ 0 ].toUpperCase();
            // Check for 'package' word at the end and remove it
            if( matchedAuthorName.endsWith( 'PACKAGE' ) ) {
                matchedAuthorName=matchedAuthorName.replace( /PACKAGE$/,'' );
            }
            return matchedAuthorName;
        }
    }

    // Try to match with authorRegexList and return first match
    for( const regex of authorRegexList ) {
        const matches=normalizedFileName.match( regex );
        if( matches&&matches.length>1 ) {
            // Return as soon as match is found
            return matches[ 1 ].trim().replace( /[^\w-]/g,'' ).toUpperCase();
        }
    }

    // Check for 'package' word at the end (not case-insensitive) and remove it
    if( normalizedFileName.endsWith( 'package' ) ) {
        normalizedFileName=normalizedFileName.replace( /package$/,'' );
    }

    // Return '0' if no match found in lowerCaseSpecialCases and authorRegexList
    return '0';
}

// Additional game choices
const gameChoices: LanguageOptions={
    en: [ 'SIMS 4' ],
    // ... other languages
};


// Method for validating directory existence
const validateDirectory=async ( input: string ) => {
    try {
        await access( input,constants.F_OK );
        const stats=await stat( input );
        if( !stats.isDirectory() ) {
            throw new Error( "Not a directory" );
        }
        return true;
    } catch( error ) {
        return `${ input } is not a valid directory. Please enter a valid directory path.`;
    }
};


( async () => {
    const errorMessages=[]; // Store error messages

    try {
        const { language }=await inquirer.prompt( [
            {
                type: 'search-list',
                name: 'language',
                message: 'Please choose your language:',
                choices: Object.keys( questions ),
            },
        ] );

        const { folderPath }=await inquirer.prompt( [
            {
                type: 'input',
                name: 'folderPath',
                message: questions[ language ].path,
                validate: validateDirectory, // Added directory validation
            },
        ] );

        const { gameOption }=await inquirer.prompt( [
            {
                type: 'search-list',
                name: 'gameOption',
                message: 'Do you want to organize game files?',
                choices: affirmations[ language ],
            },
        ] );

        let nonCharOption=false;
        let gameName='';

        if( isAffirmative( gameOption,language ) ) {
            const { gameNameOption }=await inquirer.prompt( [
                {
                    type: 'search-list',
                    name: 'gameNameOption',
                    message: 'Which game do you want to sort?',
                    choices: gameChoices[ language ],
                },
            ] );
            gameName=gameNameOption;
        } else {
            const { nonChar }=await inquirer.prompt( [
                {
                    type: 'search-list',
                    name: 'nonChar',
                    message: questions[ language ].nonChar,
                    choices: questions[ language ].nonCharOptions,
                },
            ] );
            nonCharOption=useFirstLetter( nonChar,language );
        }

        const { nested }=await inquirer.prompt( [
            {
                type: 'search-list',
                name: 'nested',
                message: questions[ language ].nested,
                choices: questions[ language ].options,
            },
        ] );

        const checkNested: boolean=isAffirmative( nested,language );

        // Updated function call with gameName
        await moveFiles( folderPath,checkNested,nonCharOption,gameName,language );
    } catch( err: any ) {
        errorMessages.push( err.message );
    } finally {
        if( errorMessages.length ) {
            console.error( chalk.bgRed.black( errorMessages.join( "\n" ) ) );
        }
    }
} )();

// Update moveFiles to check gameName before using getAuthorName
async function moveFiles (
    dirPath: string,
    checkNested: boolean,
    nonCharOption: boolean,
    gameName: string,
    language: string
): Promise<void> {
    try {
        const files=await readdir( dirPath,{ withFileTypes: true } );
        for( const file of files ) {
            const filePath: string=join( dirPath,file.name );
            const stats=await stat( filePath );

            if( stats.isDirectory() ) {
                if( checkNested ) {
                    await moveFiles( filePath,checkNested,nonCharOption,gameName,language );
                }
            } else {
                let folderName: string='0'; // default to '0'

                // Only call getAuthorName for SIMS 4 game
                if( gameName==='SIMS 4' ) {
                    folderName=getAuthorName( file.name );
                }

                if( folderName!==basename( dirPath )||gameName!=='' ) {
                    const targetDir: string=join( dirPath,folderName );
                    await mkdir( targetDir,{ recursive: true } ).catch( ( err ) => {
                        if( err.code!=='EEXIST' ) {
                            throw err;
                        }
                    } );

                    const targetPath: string=join( targetDir,file.name );
                    await rename( filePath,targetPath );
                    console.log( `Moved ${ file.name } to ${ targetDir }` );
                }
            }
        }
    } catch( err: any ) {
        console.error( `Error: ${ err.message }` );
    }
}

