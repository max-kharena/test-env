export function formatDate(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date)
}

export function formatDateTime(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date)
}

export function formatCurrency(amount: number, currency: string) {
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
            currencyDisplay: "narrowSymbol",
        }).format(amount)
    } catch {
        return `${currency} ${amount.toLocaleString()}`
    }
}

export function formatUsd(amount: number) {
    return formatCurrency(amount, "USD")
}

export function parseMoneyString(value: string): { currency: string; amount: number } | null {
    const trimmed = value.trim()
    const match = /^([A-Z]{3})\s+([\d,]+(?:\.\d+)?)$/.exec(trimmed)
    if (!match) return null

    const currency = match[1]
    const amount = Number(match[2].replace(/,/g, ""))
    if (Number.isNaN(amount)) return null

    return { currency, amount }
}

export function formatMoneyString(value: string) {
    const parsed = parseMoneyString(value)
    if (!parsed) return value
    return formatCurrency(parsed.amount, parsed.currency)
}
