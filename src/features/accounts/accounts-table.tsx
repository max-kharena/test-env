import * as React from "react"

import { DataTable } from "@/components/data-table"
import { getSelectColumn } from "@/components/data-table-columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { IconChevronDown, IconPlus } from "@tabler/icons-react"

import { environmentBadgeClass, statusBadgeClass } from "@/lib/badges"
import { formatCurrency } from "@/lib/format"
import { normalize } from "@/lib/string"
import { cn } from "@/lib/utils"

import { type ColumnDef } from "@tanstack/react-table"

import accountsData from "@/mocks/accounts.json"

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

function formatPercent(value: number | null) {
	if (value === null) return "—"
	return `${value.toFixed(2)}%`
}

function downloadTextFile(filename: string, content: string, mimeType: string) {
	const blob = new Blob([content], { type: mimeType })
	const url = URL.createObjectURL(blob)

	const anchor = document.createElement("a")
	anchor.href = url
	anchor.download = filename
	anchor.click()

	URL.revokeObjectURL(url)
}

function escapeCsvCell(value: unknown) {
	if (value === null || value === undefined) return ""
	const text = String(value)
	if (/[",\n\r]/.test(text)) {
		return `"${text.replace(/"/g, '""')}"`
	}
	return text
}

function accountsToCsv(rows: AccountRow[]) {
	const headers: Array<keyof AccountRow> = [
		"accountName",
		"accountId",
		"vendor",
		"environment",
		"currency",
		"balance",
		"pendingAmount",
		"transactions",
		"successRate",
		"status",
	]

	const lines = [headers.join(",")]
	for (const row of rows) {
		lines.push(headers.map((key) => escapeCsvCell(row[key])).join(","))
	}
	return lines.join("\n")
}

const accountColumns: ColumnDef<AccountRow>[] = [
	getSelectColumn<AccountRow>(),
	{
		accessorKey: "accountName",
		header: "Account",
		enableHiding: false,
	},
	{
		accessorKey: "accountId",
		header: "Account ID",
		cell: ({ row }) => (
			<div className="w-40 tabular-nums text-muted-foreground">{row.original.accountId}</div>
		),
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
		cell: ({ row }) => (
			<div className="w-16 tabular-nums text-muted-foreground">{row.original.currency}</div>
		),
	},
	{
		accessorKey: "balance",
		header: "Balance",
		cell: ({ row }) => (
			<div className="w-32 tabular-nums">
				{formatCurrency(row.original.balance, row.original.currency)}
			</div>
		),
	},
	{
		accessorKey: "pendingAmount",
		header: "Pending",
		cell: ({ row }) => (
			<div
				className={cn(
					"w-32 tabular-nums",
					row.original.pendingAmount === null ? "text-muted-foreground" : undefined
				)}
			>
				{row.original.pendingAmount === null
					? "—"
					: formatCurrency(row.original.pendingAmount, row.original.currency)}
			</div>
		),
	},
	{
		accessorKey: "transactions",
		header: "Transactions",
		cell: ({ row }) => (
			<div className="w-28 tabular-nums">{row.original.transactions.toLocaleString()}</div>
		),
	},
	{
		accessorKey: "successRate",
		header: "Success Rate",
		cell: ({ row }) => (
			<div
				className={cn(
					"w-28 tabular-nums",
					row.original.successRate === null ? "text-muted-foreground" : undefined
				)}
			>
				{formatPercent(row.original.successRate)}
			</div>
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

export default function AccountsTable() {
	const [query, setQuery] = React.useState("")

	const filteredData = React.useMemo(() => {
		const rows = accountsData as AccountRow[]
		const normalizedQuery = normalize(query.trim())
		if (!normalizedQuery) return rows

		return rows.filter((row) => {
			const haystack = [
				row.accountName,
				row.accountId,
				row.vendor,
				row.environment,
				row.currency,
				row.status,
			]
				.map(normalize)
				.join(" ")

			return haystack.includes(normalizedQuery)
		})
	}, [query])

	const handleExportCsv = React.useCallback(() => {
		const csv = accountsToCsv(filteredData)
		downloadTextFile("accounts.csv", csv, "text/csv;charset=utf-8")
	}, [filteredData])

	const handleExportExcel = React.useCallback(() => {
		// Excel opens CSV reliably; we serve it with an .xls extension for convenience.
		const csv = accountsToCsv(filteredData)
		downloadTextFile("accounts.xls", csv, "application/vnd.ms-excel;charset=utf-8")
	}, [filteredData])

	return (
		<DataTable<AccountRow>
            actions={
                <div className="w-full sm:w-auto">
                    <Label htmlFor="accounts-search" className="sr-only">
                        Search
                    </Label>
                    <Input
                        id="accounts-search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search accounts..."
                        className="h-9 w-full sm:w-72"
                    />
                </div>
            }
			endActions={
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type="button" variant="outline" size="sm">
                                <span className="hidden lg:inline">Export</span>
                                <IconChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onSelect={(event) => {
                                    event.preventDefault()
                                    handleExportExcel()
                                }}
                            >
                                Excel
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={(event) => {
                                    event.preventDefault()
                                    handleExportCsv()
                                }}
                            >
                                CSV
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button type="button" variant="outline" size="sm">
                        <IconPlus />
                        <span className="hidden lg:inline">Add new</span>
                    </Button>
                </>
			}
			data={filteredData}
			columns={accountColumns}
			getRowId={(row) => row.id}
		/>
	)
}
