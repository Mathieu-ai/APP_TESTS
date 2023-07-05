export function createInitials(str: string): string {
    return str
        .trim()
        .split(/\s+/)
        .reduce((initials: string[],word: string) => {
            const firstLetter=word.charAt(0);
            if(/^[A-Za-z]$/.test(firstLetter)&&initials.length<4) {
                if(/^[A-Z]$/.test(firstLetter)) {
                    initials.push(firstLetter);
                } else if(initials.filter(c => /^[A-Z]$/.test(c)).length===0) {
                    initials.push(firstLetter.toUpperCase());
                }
            }
            return initials;
        },[])
        .join("");
}
