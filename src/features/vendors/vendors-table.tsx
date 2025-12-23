import * as React from "react"

import { IconPlus } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

import { DataTable } from "@/components/data-table"
import { getSelectColumn } from "@/components/data-table-columns"
import { cn } from "@/lib/utils"

import { formatUsd } from "@/lib/format"
import { scoreBadgeClass, slaBreachesBadgeClass, statusBadgeClass } from "@/lib/badges"
import { normalize } from "@/lib/string"

import { type ColumnDef } from "@tanstack/react-table"

import vendorsData from "@/mocks/vendors.json"

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

type VendorCategoryFilter =
	| "all"
	| "on-ramp"
	| "off-ramp"
	| "cards"
	| "bank"
	| "exchange"
	| "custody"

const vendorCategoryOptions: Array<{ value: VendorCategoryFilter; label: string }> = [
	{ value: "all", label: "All" },
	{ value: "on-ramp", label: "On-ramp" },
	{ value: "off-ramp", label: "Off-ramp" },
	{ value: "cards", label: "Cards" },
	{ value: "bank", label: "Bank" },
	{ value: "exchange", label: "Exchange" },
	{ value: "custody", label: "Custody" },
]

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
		accessorKey: "accounts",
		header: "Accounts",
		cell: ({ row }) => (
			<div className="w-24 tabular-nums">{row.original.accounts.toLocaleString()}</div>
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

export default function VendorsTable() {
	const [category, setCategory] = React.useState<VendorCategoryFilter>("all")
	const [query, setQuery] = React.useState("")

	const filteredData = React.useMemo(() => {
		const rows = vendorsData as VendorRow[]
		const trimmedQuery = query.trim()
		const normalizedQuery = normalize(trimmedQuery)

		return rows.filter((row) => {
			const matchesCategory = category === "all" || normalize(row.category) === category
			if (!matchesCategory) return false
			if (!normalizedQuery) return true

			const haystack = [row.vendor, row.category, row.status].map(normalize).join(" ")
			return haystack.includes(normalizedQuery)
		})
	}, [category, query])

	const actions = (
		<Tabs value={category} onValueChange={(value) => setCategory(value as VendorCategoryFilter)}>
			<div className="flex flex-wrap items-center gap-2">
				<Label htmlFor="vendor-category-filter" className="sr-only">
					Category
				</Label>

				<Select value={category} onValueChange={(value) => setCategory(value as VendorCategoryFilter)}>
					<SelectTrigger className="flex w-fit md:hidden" size="sm" id="vendor-category-filter">
						<SelectValue placeholder="Select a category" />
					</SelectTrigger>
					<SelectContent>
						{vendorCategoryOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<TabsList className="hidden md:flex">
					{vendorCategoryOptions.map((option) => (
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
						<Label htmlFor="vendor-search" className="sr-only">
							Search
						</Label>
						<Input
							id="vendor-search"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search vendors..."
							className="h-9 w-full sm:w-72"
						/>
					</div>
			</div>
			<DataTable<VendorRow>
				actions={actions}
				endActions={
					<Button type="button" variant="outline" size="sm">
						<IconPlus />
						<span className="hidden lg:inline">Add new</span>
					</Button>
				}
				data={filteredData}
				columns={vendorColumns}
				getRowId={(row) => row.id}
			/>
		</div>
	)
}
