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

import { statusBadgeClass } from "@/lib/badges"
import { formatDate } from "@/lib/format"
import { normalize } from "@/lib/string"
import { cn } from "@/lib/utils"

import { type ColumnDef } from "@tanstack/react-table"

import { IconChevronDown, IconPlus } from "@tabler/icons-react"

import contractsData from "@/mocks/contracts.json"

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

export type ContractStatusFilter = "all" | "active" | "expiring-soon" | "expired"

function statusFilterForRow(status: string): Exclude<ContractStatusFilter, "all"> | null {
	const normalized = normalize(status)
	if (normalized === "active") return "active"
	if (normalized === "expiring soon") return "expiring-soon"
	if (normalized === "inactive" || normalized === "expired") return "expired"
	return null
}

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
		cell: ({ row }) => (
			<div className="w-40">
				<Badge variant="outline" className="px-1.5 text-muted-foreground">
					{row.original.type}
				</Badge>
			</div>
		),
	},
	{
		accessorKey: "activeFrom",
		header: "Active From",
		cell: ({ row }) => <div className="tabular-nums">{formatDate(row.original.activeFrom)}</div>,
	},
	{
		accessorKey: "activeUntil",
		header: "Active Until",
		cell: ({ row }) => <div className="tabular-nums">{formatDate(row.original.activeUntil)}</div>,
	},
	{
		accessorKey: "renewal",
		header: "Renewal",
		cell: ({ row }) => (
			<div className={cn("tabular-nums", row.original.renewal ? undefined : "text-muted-foreground")}>
				{row.original.renewal ? formatDate(row.original.renewal) : "—"}
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

function contractsToCsv(rows: ContractRow[]) {
	const headers: Array<keyof ContractRow> = [
		"contract",
		"vendor",
		"type",
		"activeFrom",
		"activeUntil",
		"renewal",
		"status",
	]

	const lines = [headers.join(",")]
	for (const row of rows) {
		lines.push(headers.map((key) => escapeCsvCell(row[key])).join(","))
	}
	return lines.join("\n")
}

export default function ContractsTable({ statusFilter }: { statusFilter: ContractStatusFilter }) {
	const [query, setQuery] = React.useState("")

	const filteredData = React.useMemo(() => {
		const rows = contractsData as ContractRow[]
		const normalizedQuery = normalize(query.trim())

		const byStatus =
			statusFilter === "all"
				? rows
				: rows.filter((row) => statusFilterForRow(row.status) === statusFilter)

		if (!normalizedQuery) return byStatus

		return byStatus.filter((row) => {
			const haystack = [
				row.contract,
				row.vendor,
				row.type,
				row.activeFrom,
				row.activeUntil,
				row.renewal ?? "",
				row.status,
			]
				.map(normalize)
				.join(" ")

			return haystack.includes(normalizedQuery)
		})
	}, [statusFilter, query])

	const handleExportCsv = React.useCallback(() => {
		const csv = contractsToCsv(filteredData)
		downloadTextFile("contracts.csv", csv, "text/csv;charset=utf-8")
	}, [filteredData])

	const handleExportExcel = React.useCallback(() => {
		// Excel opens CSV reliably; we serve it with an .xls extension for convenience.
		const csv = contractsToCsv(filteredData)
		downloadTextFile("contracts.xls", csv, "application/vnd.ms-excel;charset=utf-8")
	}, [filteredData])

	return (
		<DataTable<ContractRow>
			actions={
				<div className="w-full sm:w-auto">
					<Label htmlFor="contracts-search" className="sr-only">
						Search
					</Label>
					<Input
						id="contracts-search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search contracts..."
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
			columns={contractColumns}
			getRowId={(row) => row.id}
		/>
	)
}
