import * as React from "react"

import { DataTable } from "@/components/data-table"
import { getSelectColumn } from "@/components/data-table-columns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

import { IconPlus } from "@tabler/icons-react"

import { type ColumnDef } from "@tanstack/react-table"

import alertRulesData from "@/mocks/alertRules.json"
import alertsData from "@/mocks/alerts.json"


type AlertRuleRowBase = {
	"Alert Name": string
	Status: "Active" | "Disabled" | string
	Vendors: "All Vendors" | string[] | string
	Condition: string
	Channels: string[]
}

type AlertRuleRow = AlertRuleRowBase & { id: string }

type AlertHistoryRowBase = {
	"Alert Title": string
	Description: string
	Vendor: string
	Triggered: string
	Status: "Open" | "Resolved" | string
	Severity: "Low" | "Medium" | "High" | string
	Category: string
}

type AlertHistoryRow = AlertHistoryRowBase & { id: string }

type View = "rules" | "history"

type StatusFilter = "all" | "active" | "disabled"


function statusBadgeClass(status: string) {
	const value = normalize(status)
	if (value === "active") return "border-transparent bg-chart-2/10 text-chart-2"
	if (value === "disabled") return "border-transparent bg-chart-3/10 text-chart-3"
	return "text-muted-foreground"
}

function severityBadgeClass(severity: string) {
	const value = normalize(severity)
	if (value === "high") return "border-transparent bg-destructive/10 text-destructive"
	if (value === "medium") return "border-transparent bg-chart-3/10 text-chart-3"
	if (value === "low") return "border-transparent bg-chart-2/10 text-chart-2"
	return "text-muted-foreground"
}

function vendorsToText(vendors: AlertRuleRow["Vendors"]) {
	if (Array.isArray(vendors)) return vendors.join(", ")
	return vendors
}

export default function AlertsTable() {
	const [view, setView] = React.useState<View>("rules")
	const [statusFilter] = React.useState<StatusFilter>("all")
	const [query] = React.useState("")

	const rules = React.useMemo(() => {
		const rows = alertRulesData as AlertRuleRowBase[]
		return rows.map((row) => ({ ...row, id: row["Alert Name"] }))
	}, [])

	type RawAlertHistoryRow = AlertHistoryRowBase
	const history = React.useMemo(() => {
		const rows = alertsData as RawAlertHistoryRow[]
		return rows.map((row) => ({ ...row, id: `${row["Alert Title"]}::${row.Triggered}` }))
	}, [])

	const [ruleEnabled, setRuleEnabled] = React.useState<Record<string, boolean>>(() => {
		const initial: Record<string, boolean> = {}
		for (const rule of rules) {
			initial[rule.id] = normalize(rule.Status) === "active"
		}
		return initial
	})

	const filteredRules = React.useMemo(() => {
		const normalizedQuery = normalize(query.trim())

		return rules.filter((row) => {
			const enabled = !!ruleEnabled[row.id]
			const matchesStatus =
				statusFilter === "all" ||
				(statusFilter === "active" ? enabled : !enabled)
			if (!matchesStatus) return false
			if (!normalizedQuery) return true

			const haystack = [
				row["Alert Name"],
				enabled ? "Active" : "Disabled",
				vendorsToText(row.Vendors),
				row.Condition,
				...(row.Channels ?? []),
			]
				.map((v) => normalize(String(v)))
				.join(" ")

			return haystack.includes(normalizedQuery)
		})
	}, [query, ruleEnabled, rules, statusFilter])

	const filteredHistory = React.useMemo(() => {
		const normalizedQuery = normalize(query.trim())
		if (!normalizedQuery) return history

		return history.filter((row) => {
			const haystack = [
				row["Alert Title"],
				row.Description,
				row.Vendor,
				row.Triggered,
				row.Status,
				row.Severity,
				row.Category,
			]
				.map((v) => normalize(String(v)))
				.join(" ")

			return haystack.includes(normalizedQuery)
		})
	}, [history, query])

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
					className={cn("px-1.5", statusBadgeClass(value))}
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
						<Badge key={channel} variant="outline" className="px-1.5 text-muted-foreground">
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

	const historyColumns: ColumnDef<AlertHistoryRow>[] = [
		getSelectColumn<AlertHistoryRow>(),
		{
			accessorKey: "Alert Title",
			header: "Alert Title",
			enableHiding: false,
		},
		{
			accessorKey: "Vendor",
			header: "Vendor",
		},
		{
			accessorKey: "Category",
			header: "Category",
			cell: ({ row }) => (
				<Badge variant="outline" className="px-1.5 text-muted-foreground">
					{row.original.Category}
				</Badge>
			),
		},
		{
			accessorKey: "Severity",
			header: "Severity",
			cell: ({ row }) => (
				<Badge
					variant="outline"
					className={cn("px-1.5", severityBadgeClass(row.original.Severity))}
				>
					{row.original.Severity}
				</Badge>
			),
		},
		{
			accessorKey: "Status",
			header: "Status",
			cell: ({ row }) => (
				<Badge variant="outline" className="px-1.5 text-muted-foreground">
					{row.original.Status}
				</Badge>
			),
		},
		{
			accessorKey: "Triggered",
			header: "Triggered",
			cell: ({ row }) => <div className="text-muted-foreground">{row.original.Triggered}</div>,
		},
		{
			accessorKey: "Description",
			header: "Description",
			cell: ({ row }) => (
				<div className="max-w-[520px] truncate text-muted-foreground">
					{row.original.Description}
				</div>
			),
		},
	]

	const actions = (
		<Tabs value={view} onValueChange={(value) => setView(value as View)}>
			<div className="flex flex-wrap items-center gap-2">
				<Label htmlFor="alerts-view" className="sr-only">
					View
				</Label>

				<Select value={view} onValueChange={(value) => setView(value as View)}>
					<SelectTrigger className="flex w-fit md:hidden" size="sm" id="alerts-view">
						<SelectValue placeholder="Select a view" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="rules">Alert Rules</SelectItem>
						<SelectItem value="history">Alert History</SelectItem>
					</SelectContent>
				</Select>

				<TabsList className="hidden md:flex">
					<TabsTrigger value="rules">Alert Rules</TabsTrigger>
					<TabsTrigger value="history">Alert History</TabsTrigger>
				</TabsList>
			</div>
		</Tabs>
	)

	const endActions =
		view === "rules" ? (
			<Button type="button" variant="outline" size="sm">
				<IconPlus />
				<span className="hidden lg:inline">Add new</span>
			</Button>
		) : null

	return (
		<div className="flex flex-col gap-4">
			{view === "rules" ? (
				<DataTable<AlertRuleRow>
					actions={actions}
					endActions={endActions}
					data={filteredRules}
					columns={ruleColumns}
					getRowId={(row) => row.id}
				/>
			) : (
				<DataTable<AlertHistoryRow>
					actions={actions}
					data={filteredHistory}
					columns={historyColumns}
					getRowId={(row) => row.id}
				/>
			)}
		</div>
	)
}
