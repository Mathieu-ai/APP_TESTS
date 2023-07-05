import {NamedCharacters,NamedCharacter} from "./types";

export function simplifyNamedCharacters(namedChars: NamedCharacters): Record<string,NamedCharacter> {
    const simplified: Record<string,NamedCharacter>={};

    for(const name in namedChars) {
        const {codepoints,characters}=namedChars[name];
        const code=codepoints[0];

        simplified[name]={code,name: characters[0]};
    }

    return simplified;
}
