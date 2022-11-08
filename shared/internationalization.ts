import { stringsLanguage } from "./config";

export interface InternationalizedStringSource {
    [key: string]: { [key: string]: string } | string
}

export interface InternationalizedStringsSource {
    [key: string]: InternationalizedStringSource
}


export class InternationalizedString {
    constructor(source: InternationalizedStringSource, options: { defaultLang?: string, defaultValue?: string }) {
        const lang = options.defaultLang ?? stringsLanguage
        for (const key in source) {
            const value = source[key]
            if (typeof value === 'string') {
                this.strings.set(key, value as string);
            }
        }
        this.defaultValue = options.defaultValue ?? this.strings.get(lang) as string;
    }

    private strings = new Map<string, string>()

    private defaultValue: string;

    get(lang: string): string {
        return this.strings.get(lang) ?? this.defaultValue;
    }

    getDefault(): string {
        return this.defaultValue;
    }
}

export class AppStrings {
    constructor(source: InternationalizedStringsSource, lang?: string) {
        this.defaultLanguage = lang || stringsLanguage
        for (const key in source) {
            this.strings.set(key, new InternationalizedString(source[key], { defaultLang: this.defaultLanguage }))
        }
    }

    private defaultLanguage: string;

    private strings = new Map<string, InternationalizedString>();

    get(name: string, languaje?: string): string {
        const value = this.strings.get(name)?.get(languaje || this.defaultLanguage);
        if (!value) {
            throw Error("String named " + name + " not found")
        }
        return value
    }
}
