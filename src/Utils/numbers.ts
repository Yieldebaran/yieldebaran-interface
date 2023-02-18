export function validateInput(input: string, max: string): string {
    if (input === "") {
        return ""
    }
    if (isNaN(+input) || isNaN(parseFloat(input))) {
        return "Amount must be a number"
    }
    const inputNum = Number(input)
    const maxNum = Number(max)
    if (maxNum <= 0) {
        return "No balance to stake"
    }
    if (inputNum <= 0) {
        return "Amount must be > 0"
    }
    if (bnFromInput(input, 18) > bnFromInput(max, 18)) {
        return `Not enough balance`
    }
    return ""
}

export function bnFromInput(x: string, d: number): bigint {
    if (x.trim() === "" || isNaN(+x) || isNaN(parseFloat(x))) return 0n
    const dotIndex = x.indexOf('.')
    if (dotIndex === -1) {
        return BigInt(x) * 10n ** BigInt(d)
    }
    const beforeDot = x.substring(0, dotIndex)
    const afterDot = x.substring(dotIndex + 1).padEnd(d, '0')
    return BigInt(beforeDot + afterDot)
}

export function formatBN(bn: bigint, decimals: number) {
    const decDelimeter = 10n ** BigInt(decimals)
    const afterDot = String(bn % decDelimeter).padStart(decimals, '0')
    const beforeDot = bn < decDelimeter ? 0n : bn / decDelimeter
    return `${String(beforeDot)}.${afterDot}`
}