import { normalize } from "@/lib/string"

export function statusBadgeClass(status: string) {
    const normalized = normalize(status)

    if (normalized === "active") {
        return "border-transparent bg-chart-2/10 text-chart-2"
    }

    if (normalized === "expiring soon" || normalized === "paused") {
        return "border-transparent bg-chart-3/10 text-chart-3"
    }

    if (normalized === "inactive" || normalized === "archived") {
        return "border-transparent bg-destructive/10 text-destructive"
    }

    return "text-muted-foreground"
}

export function scoreBadgeClass(score: number) {
    if (score < 70) return "border-transparent bg-destructive/10 text-destructive"
    if (score < 90) return "border-transparent bg-chart-3/10 text-chart-3"
    return "border-transparent bg-chart-2/10 text-chart-2"
}

export function slaBreachesBadgeClass(count: number) {
    if (count > 0) return "border-transparent bg-destructive/10 text-destructive"
    return "border-transparent bg-chart-2/10 text-chart-2"
}

export function environmentBadgeClass(environment: string) {
    const normalized = normalize(environment)

    if (normalized === "production") {
        return "border-transparent bg-chart-2/10 text-chart-2"
    }

    if (normalized === "sandbox") {
        return "border-transparent bg-chart-3/10 text-chart-3"
    }

    return "text-muted-foreground"
}
