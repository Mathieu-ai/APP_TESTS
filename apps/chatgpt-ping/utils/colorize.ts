import colors from 'colors';

export function colorize(str: string,colorList: string): string {
    const colorNames=colorList.split(',');
    let result=str;
    for(const colorName of colorNames) {
        result=(colors as any)[colorName](result);
    }
    return result;
}

