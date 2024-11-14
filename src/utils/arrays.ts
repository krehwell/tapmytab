export const arraySwap = <T>(array: T[], indexA: number, indexB: number) => {
    const tmp = array[indexA]
    array[indexA] = array[indexB]
    array[indexB] = tmp
    return array
}
