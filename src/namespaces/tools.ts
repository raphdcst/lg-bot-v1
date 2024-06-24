import ShortUniqueId from "short-unique-id"

export function genId(char: number): string {
    const id = new ShortUniqueId({ length: char })

    return id.rnd()
}