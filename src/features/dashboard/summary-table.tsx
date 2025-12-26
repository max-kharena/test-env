
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { normalize } from "@/lib/string"
import { cn } from "@/lib/utils"

import {
    formatCurrency,
    formatDate,
    formatDateTime,
    formatMoneyString,
    formatUsd,
} from "@/lib/format"
import {
    environmentBadgeClass,
    scoreBadgeClass,
    slaBreachesBadgeClass,
    statusBadgeClass,
} from "@/lib/badges"

import { type ColumnDef } from "@tanstack/react-table"

// Data
import vendorsData from "@/mocks/vendors.json"
import contractsData from "@/mocks/contracts.json"
import accountsData from "@/mocks/accounts.json"
import transactionsData from "@/mocks/transactions.json"
import alertRulesData from "@/mocks/alertRules.json"
import { DataTable } from "@/components/data-table"
import { getSelectColumn } from "@/components/data-table-columns"

type VendorRow = {
    id: string
    vendor: string
    category: string
    status: string
    accounts: number
    volumeMtd: number
    feeMtd: number
    feeLeakage: number | null
    slaBreaches: number
    alerts: number | null
    score: number
}

type ContractRow = {
    id: string
    contract: string
    vendor: string
    type: string
    activeFrom: string
    activeUntil: string
    renewal: string | null
    status: string
}

type AccountRow = {
    id: string
    accountName: string
    accountId: string
    vendor: string
    environment: string
    currency: string
    balance: number
    pendingAmount: number | null
    transactions: number
    successRate: number | null
    status: string
}

type TransactionRow = {
    id: string
    dateTime: string
    vendor: string
    type: string
    amountOriginal: string
    amountUsd: number
    feeOriginal: string
    feeUsd: number
    varianceUsd: number | null
    variancePercent: number | null
}

type AlertRuleRowBase = {
    id?: string
    "Alert Name": string
    Status: "Active" | "Disabled" | string
    Vendors: "All Vendors" | string[] | string
    Condition: string
    Channels: string[]
}

type AlertRuleRow = AlertRuleRowBase & { id: string }

function alertRuleStatusBadgeClass(status: string) {
    const value = normalize(status)
    if (value === "active") return "border-transparent bg-chart-2/10 text-chart-2"
    if (value === "disabled") return "border-transparent bg-chart-3/10 text-chart-3"
    return "text-muted-foreground"
}

function vendorsToText(vendors: AlertRuleRow["Vendors"]) {
    if (Array.isArray(vendors)) return vendors.join(", ")
    return vendors
}


const vendorColumns: ColumnDef<VendorRow>[] = [
    getSelectColumn<VendorRow>(),
    {
        accessorKey: "vendor",
        header: "Vendor",
        enableHiding: false,
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
            <div className="w-40">
                <Badge variant="outline" className="text-muted-foreground px-1.5">
                    {row.original.category}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <div className="w-32">
                <Badge
                    variant="outline"
                    className={cn("px-1.5", statusBadgeClass(row.original.status))}
                >
                    {row.original.status}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "volumeMtd",
        header: "Volume (MTD)",
        cell: ({ row }) => (
            <div className="w-32 tabular-nums">{formatUsd(row.original.volumeMtd)}</div>
        ),
    },
    {
        accessorKey: "accounts",
        header: "Accounts",
        cell: ({ row }) => (
            <div className="w-24">
                <Badge variant="outline" className="px-1.5 tabular-nums text-muted-foreground">
                    {row.original.accounts.toLocaleString()}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "feeMtd",
        header: "Fees (MTD)",
        cell: ({ row }) => (
            <div className="w-28 tabular-nums">{formatUsd(row.original.feeMtd)}</div>
        ),
    },
    {
        accessorKey: "feeLeakage",
        header: "Fee Leakage",
        cell: ({ row }) => (
            <div
                className={cn(
                    "w-28 tabular-nums",
                    row.original.feeLeakage === null
                        ? "text-muted-foreground"
                        : "text-destructive"
                )}
            >
                {row.original.feeLeakage === null ? "—" : formatUsd(row.original.feeLeakage)}
            </div>
        ),
    },
    {
        accessorKey: "slaBreaches",
        header: "SLA Breaches",
        cell: ({ row }) => (
            <div className="w-28">
                <Badge
                    variant="outline"
                    className={cn(
                        "px-1.5 tabular-nums",
                        slaBreachesBadgeClass(row.original.slaBreaches)
                    )}
                >
                    {row.original.slaBreaches.toLocaleString()}
                </Badge>
            </div>
        ),
    },
    {
        accessorKey: "alerts",
        header: "Alerts",
        cell: ({ row }) => (
            <div className="w-20">
                {row.original.alerts === null ? (
                    <div className="text-muted-foreground tabular-nums">—</div>
                ) : (
                    <Badge
                        variant="outline"
                        className="border-transparent bg-destructive/10 px-1.5 tabular-nums text-destructive"
                    >
                        {row.original.alerts.toLocaleString()}
                    </Badge>
                )}
            </div>
        ),
    },
    {
        accessorKey: "score",
        header: "Score",
        cell: ({ row }) => (
            <div className="w-16">
                <Badge
                    variant="outline"
                    className={cn("px-1.5 tabular-nums", scoreBadgeClass(row.original.score))}
                >
                    {row.original.score}
                </Badge>
            </div>
        ),
    },
]

const contractColumns: ColumnDef<ContractRow>[] = [
    getSelectColumn<ContractRow>(),
    {
        accessorKey: "contract",
        header: "Contract",
        enableHiding: false,
    },
    {
        accessorKey: "vendor",
        header: "Vendor",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "activeUntil",
        header: "Active Until",
        cell: ({ row }) => (
            <div className="tabular-nums">{formatDate(row.original.activeUntil)}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className={cn("px-1.5", statusBadgeClass(row.original.status))}
            >
                {row.original.status}
            </Badge>
        ),
    },
]

const accountColumns: ColumnDef<AccountRow>[] = [
    getSelectColumn<AccountRow>(),
    {
        accessorKey: "accountName",
        header: "Account",
        enableHiding: false,
    },
    {
        accessorKey: "vendor",
        header: "Vendor",
    },
    {
        accessorKey: "environment",
        header: "Enviroment",
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className={cn("px-1.5", environmentBadgeClass(row.original.environment))}
            >
                {row.original.environment}
            </Badge>
        ),
    },
    {
        accessorKey: "currency",
        header: "Currency",
    },
    {
        accessorKey: "balance",
        header: "Balance",
        cell: ({ row }) => (
            <div className="tabular-nums">{formatCurrency(row.original.balance, row.original.currency)}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className={cn("px-1.5", statusBadgeClass(row.original.status))}
            >
                {row.original.status}
            </Badge>
        ),
    },
]

const transactionColumns: ColumnDef<TransactionRow>[] = [
    getSelectColumn<TransactionRow>(),
    {
        accessorKey: "dateTime",
        header: "Date",
        cell: ({ row }) => <div className="tabular-nums">{formatDateTime(row.original.dateTime)}</div>,
        enableHiding: false,
    },
    {
        accessorKey: "vendor",
        header: "Vendor",
    },
    {
        accessorKey: "type",
        header: "Type",
    },
    {
        accessorKey: "amountOriginal",
        header: "Amount",
        cell: ({ row }) => <div className="tabular-nums">{formatMoneyString(row.original.amountOriginal)}</div>,
    },
    {
        accessorKey: "feeOriginal",
        header: "Fee",
        cell: ({ row }) => <div className="tabular-nums">{formatMoneyString(row.original.feeOriginal)}</div>,
    },
]

function SummaryTable() {
    const [view, setView] = React.useState<
        "vendors" | "contracts" | "accounts" | "transactions" | "alertRules"
    >("vendors")

    const rules = React.useMemo(() => {
        const rows = alertRulesData as AlertRuleRowBase[]
        return rows.map((row) => ({ ...row, id: row.id ?? row["Alert Name"] }))
    }, [])

    const [ruleEnabled, setRuleEnabled] = React.useState<Record<string, boolean>>(() => {
        const initial: Record<string, boolean> = {}
        for (const rule of rules) {
            initial[rule.id] = normalize(rule.Status) === "active"
        }
        return initial
    })

    const ruleColumns: ColumnDef<AlertRuleRow>[] = [
        getSelectColumn<AlertRuleRow>(),
        {
            accessorKey: "Alert Name",
            header: "Alert Name",
            enableHiding: false,
        },
        {
            accessorKey: "Status",
            header: "Status",
            cell: ({ row }) => {
                const enabled = !!ruleEnabled[row.original.id]
                const value = enabled ? "Active" : "Disabled"
                return (
                    <Badge
                        variant="outline"
                        className={cn("px-1.5", alertRuleStatusBadgeClass(value))}
                    >
                        {value}
                    </Badge>
                )
            },
        },
        {
            id: "vendors",
            header: "Vendors",
            cell: ({ row }) => (
                <div className="max-w-[320px] truncate text-muted-foreground">
                    {vendorsToText(row.original.Vendors)}
                </div>
            ),
        },
        {
            accessorKey: "Condition",
            header: "Condition",
            cell: ({ row }) => (
                <div className="max-w-[360px] truncate">{row.original.Condition}</div>
            ),
        },
        {
            id: "channels",
            header: "Channels",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.Channels.map((channel) => (
                        <Badge
                            key={channel}
                            variant="outline"
                            className="px-1.5 text-muted-foreground"
                        >
                            {channel}
                        </Badge>
                    ))}
                </div>
            ),
        },
        {
            id: "enabled",
            header: "Enabled",
            cell: ({ row }) => {
                const checked = !!ruleEnabled[row.original.id]

                return (
                    <div className="flex justify-end">
                        <Switch
                            checked={checked}
                            onCheckedChange={(value) =>
                                setRuleEnabled((prev) => ({ ...prev, [row.original.id]: value }))
                            }
                            aria-label={`Toggle ${row.original["Alert Name"]}`}
                        />
                    </div>
                )
            },
        },
    ]

    const actions = (
        <Tabs value={view} onValueChange={(value) => setView(value as typeof view)}>
            <div className="flex items-center gap-2">
                <Label htmlFor="summary-view-selector" className="sr-only">
                    View
                </Label>

                <Select value={view} onValueChange={(value) => setView(value as typeof view)}>
                    <SelectTrigger
                        className="flex w-fit @4xl/main:hidden"
                        size="sm"
                        id="summary-view-selector"
                    >
                        <SelectValue placeholder="Select a view" />
                    </SelectTrigger>
                    <SelectContent>
                            <SelectItem value="alertRules">Alert Rules</SelectItem>
                        <SelectItem value="vendors">Vendors</SelectItem>
                        <SelectItem value="contracts">Contracts</SelectItem>
                        <SelectItem value="accounts">Accounts</SelectItem>
                        <SelectItem value="transactions">Transactions</SelectItem>
                    </SelectContent>
                </Select>

                <TabsList className="hidden @4xl/main:flex">
                        <TabsTrigger value="alertRules">Alert Rules</TabsTrigger>
                    <TabsTrigger value="vendors">Vendors</TabsTrigger>
                    <TabsTrigger value="contracts">Contracts</TabsTrigger>
                    <TabsTrigger value="accounts">Accounts</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
            </div>
        </Tabs>
    )

    if (view === "contracts") {
        return (
            <DataTable<ContractRow>
                actions={actions}
                data={contractsData as ContractRow[]}
                columns={contractColumns}
                getRowId={(row) => row.id}
            />
        )
    }

    if (view === "accounts") {
        return (
            <DataTable<AccountRow>
                actions={actions}
                data={accountsData as AccountRow[]}
                columns={accountColumns}
                getRowId={(row) => row.id}
            />
        )
    }

    if (view === "transactions") {
        return (
            <DataTable<TransactionRow>
                actions={actions}
                data={transactionsData as TransactionRow[]}
                columns={transactionColumns}
                getRowId={(row) => row.id}
            />
        )
    }

    if (view === "alertRules") {
        return (
            <DataTable<AlertRuleRow>
                actions={actions}
                data={rules}
                columns={ruleColumns}
                getRowId={(row) => row.id}
            />
        )
    }

    return (
        <DataTable<VendorRow>
            actions={actions}
            data={vendorsData as VendorRow[]}
            columns={vendorColumns}
            getRowId={(row) => row.id}
        />
    )
}

export default SummaryTable;