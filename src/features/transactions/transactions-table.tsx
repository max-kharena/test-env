import * as React from "react"

import { IconChevronDown } from "@tabler/icons-react"

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { cn } from "@/lib/utils"

import { formatCurrency, formatDateTime, formatMoneyString } from "@/lib/format"
import { normalize } from "@/lib/string"

import { type ColumnDef } from "@tanstack/react-table"

import transactionsData from "@/mocks/transactions.json"

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

type TransactionTypeFilter = "all" | "payin" | "payout" | "transfer" | "fx"

const transactionTypeOptions: Array<{ value: TransactionTypeFilter; label: string }> = [
	{ value: "all", label: "All" },
	{ value: "payin", label: "Payin" },
	{ value: "payout", label: "Payout" },
	{ value: "transfer", label: "Transfer" },
	{ value: "fx", label: "FX" },
]

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

function transactionsToCsv(rows: TransactionRow[]) {
	const headers: Array<keyof TransactionRow> = [
		"dateTime",
		"vendor",
		"type",
		"amountOriginal",
		"amountUsd",
		"feeOriginal",
		"feeUsd",
		"varianceUsd",
		"variancePercent",
	]

	const lines = [headers.join(",")]
	for (const row of rows) {
		lines.push(headers.map((key) => escapeCsvCell(row[key])).join(","))
	}
	return lines.join("\n")
}

const transactionColumns: ColumnDef<TransactionRow>[] = [
	getSelectColumn<TransactionRow>(),
	{
		accessorKey: "dateTime",
		header: "Date",
		cell: ({ row }) => (
			<div className="w-44 tabular-nums">{formatDateTime(row.original.dateTime)}</div>
		),
		enableHiding: false,
	},
	{
		accessorKey: "vendor",
		header: "Vendor",
		enableHiding: false,
	},
	{
		accessorKey: "type",
		header: "Type",
		cell: ({ row }) => (
			<div className="w-28">
				<Badge variant="outline" className="px-1.5 text-muted-foreground">
					{row.original.type}
				</Badge>
			</div>
		),
	},
	{
		accessorKey: "amountOriginal",
		header: "Amount",
		cell: ({ row }) => (
			<div className="w-32 tabular-nums">{formatMoneyString(row.original.amountOriginal)}</div>
		),
	},
	{
		accessorKey: "amountUsd",
		header: "Amount (USD)",
		cell: ({ row }) => (
			<div className="w-32 tabular-nums">{formatCurrency(row.original.amountUsd, "USD")}</div>
		),
	},
	{
		accessorKey: "feeOriginal",
		header: "Fee",
		cell: ({ row }) => (
			<div className="w-28 tabular-nums">{formatMoneyString(row.original.feeOriginal)}</div>
		),
	},
	{
		accessorKey: "feeUsd",
		header: "Fee (USD)",
		cell: ({ row }) => (
			<div className="w-24 tabular-nums">{formatCurrency(row.original.feeUsd, "USD")}</div>
		),
	},
	{
		accessorKey: "varianceUsd",
		header: "Variance (USD)",
		cell: ({ row }) => (
			<div
				className={cn(
					"w-32 tabular-nums",
					row.original.varianceUsd === null
						? "text-muted-foreground"
						: "text-destructive"
				)}
			>
				{row.original.varianceUsd === null
					? "—"
					: formatCurrency(row.original.varianceUsd, "USD")}
			</div>
		),
	},
	{
		accessorKey: "variancePercent",
		header: "Variance %",
		cell: ({ row }) => (
			<div
				className={cn(
					"w-24 tabular-nums",
					row.original.variancePercent === null
						? "text-muted-foreground"
						: "text-destructive"
				)}
			>
				{formatPercent(row.original.variancePercent)}
			</div>
		),
	},
]

export default function TransactionsTable() {
	const [typeFilter, setTypeFilter] = React.useState<TransactionTypeFilter>("all")
	const [query, setQuery] = React.useState("")

	const filteredData = React.useMemo(() => {
		const rows = transactionsData as TransactionRow[]
		const normalizedQuery = normalize(query.trim())

		return rows.filter((row) => {
			const matchesType =
				typeFilter === "all" || normalize(row.type) === normalize(typeFilter)
			if (!matchesType) return false
			if (!normalizedQuery) return true

			const haystack = [row.vendor, row.type, row.amountOriginal, row.feeOriginal]
				.map(normalize)
				.join(" ")
			return haystack.includes(normalizedQuery)
		})
	}, [typeFilter, query])

	const handleExportCsv = React.useCallback(() => {
		const csv = transactionsToCsv(filteredData)
		downloadTextFile("transactions.csv", csv, "text/csv;charset=utf-8")
	}, [filteredData])

	const handleExportExcel = React.useCallback(() => {
		const csv = transactionsToCsv(filteredData)
		downloadTextFile("transactions.xls", csv, "application/vnd.ms-excel;charset=utf-8")
	}, [filteredData])

	const actions = (
		<Tabs
			value={typeFilter}
			onValueChange={(value) => setTypeFilter(value as TransactionTypeFilter)}
		>
			<div className="flex flex-wrap items-center gap-2">
				<Label htmlFor="transaction-type-filter" className="sr-only">
					Type
				</Label>

				<Select
					value={typeFilter}
					onValueChange={(value) => setTypeFilter(value as TransactionTypeFilter)}
				>
					<SelectTrigger
						className="flex w-fit md:hidden"
						size="sm"
						id="transaction-type-filter"
					>
						<SelectValue placeholder="Select a type" />
					</SelectTrigger>
					<SelectContent>
						{transactionTypeOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<TabsList className="hidden md:flex">
					{transactionTypeOptions.map((option) => (
						<TabsTrigger key={option.value} value={option.value}>
							{option.label}
						</TabsTrigger>
					))}
				</TabsList>
			</div>
		</Tabs>
	)

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 px-4 lg:px-6">
				<div className="w-full sm:w-auto">
					<Label htmlFor="transaction-search" className="sr-only">
						Search
					</Label>
					<Input
						id="transaction-search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search transactions..."
						className="h-9 w-full sm:w-72"
					/>
				</div>
			</div>

			<DataTable<TransactionRow>
				actions={actions}
				endActions={
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
				}
				data={filteredData}
				columns={transactionColumns}
				getRowId={(row) => row.id}
			/>
		</div>
	)
}
