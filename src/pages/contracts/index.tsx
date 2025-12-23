import * as React from "react"

import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import ContractsTable, { type ContractStatusFilter } from "@/features/contracts/contracts-table"

import {
    IconCircleCheck,
    IconClock,
    IconFileText,
    IconCircleX,
} from "@tabler/icons-react"

import contractsData from "@/mocks/contracts.json"
import { normalize } from "@/lib/string"

type ContractRow = {
    id: string
    status: string
}

function statusFilterForRow(status: string): Exclude<ContractStatusFilter, "all"> | null {
    const normalized = normalize(status)
    if (normalized === "active") return "active"
    if (normalized === "expiring soon") return "expiring-soon"
    if (normalized === "inactive" || normalized === "expired") return "expired"
    return null
}

function Contracts() {
    const [statusFilter, setStatusFilter] = React.useState<ContractStatusFilter>("all")

    const counts = React.useMemo(() => {
        const rows = contractsData as ContractRow[]
        let active = 0
        let expiringSoon = 0
        let expired = 0

        for (const row of rows) {
            switch (statusFilterForRow(row.status)) {
                case "active":
                    active += 1
                    break
                case "expiring-soon":
                    expiringSoon += 1
                    break
                case "expired":
                    expired += 1
                    break
                default:
                    break
            }
        }

        return {
            all: rows.length,
            active,
            expiringSoon,
            expired,
        }
    }, [])

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                    <Card
                        className={
                            statusFilter === "all"
                                ? "@container/card cursor-pointer ring-2 ring-ring"
                                : "@container/card cursor-pointer"
                        }
                        onClick={() => setStatusFilter("all")}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") setStatusFilter("all")
                        }}
                    >
                        <CardHeader>
                            <CardDescription>All Contracts</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {counts.all}
                            </CardTitle>
                            <CardAction className="self-center">
                                <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                                    <IconFileText className="h-4 w-4" />
                                </div>
                            </CardAction>
                        </CardHeader>
                    </Card>

                    <Card
                        className={
                            statusFilter === "active"
                                ? "@container/card cursor-pointer ring-2 ring-ring"
                                : "@container/card cursor-pointer"
                        }
                        onClick={() => setStatusFilter("active")}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") setStatusFilter("active")
                        }}
                    >
                        <CardHeader>
                            <CardDescription>Active</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {counts.active}
                            </CardTitle>
                            <CardAction className="self-center">
                                <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                                    <IconCircleCheck className="h-4 w-4 text-chart-2" />
                                </div>
                            </CardAction>
                        </CardHeader>
                    </Card>

                    <Card
                        className={
                            statusFilter === "expiring-soon"
                                ? "@container/card cursor-pointer ring-2 ring-ring"
                                : "@container/card cursor-pointer"
                        }
                        onClick={() => setStatusFilter("expiring-soon")}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") setStatusFilter("expiring-soon")
                        }}
                    >
                        <CardHeader>
                            <CardDescription>Expiring Soon</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {counts.expiringSoon}
                            </CardTitle>
                            <CardAction className="self-center">
                                <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                                    <IconClock className="h-4 w-4 text-chart-3" />
                                </div>
                            </CardAction>
                        </CardHeader>
                    </Card>

                    <Card
                        className={
                            statusFilter === "expired"
                                ? "@container/card cursor-pointer ring-2 ring-ring"
                                : "@container/card cursor-pointer"
                        }
                        onClick={() => setStatusFilter("expired")}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") setStatusFilter("expired")
                        }}
                    >
                        <CardHeader>
                            <CardDescription>Inactive</CardDescription>
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                {counts.expired}
                            </CardTitle>
                            <CardAction className="self-center">
                                <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                                    <IconCircleX className="h-4 w-4  text-destructive" />
                                </div>
                            </CardAction>
                        </CardHeader>
                    </Card>
                </div>
                <ContractsTable statusFilter={statusFilter} />
            </div>
        </div>
    )
}

export default Contracts