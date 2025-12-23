"use client"

import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "@/components/ui/chart"

import { FeeAnalysisChart } from "@/features/dashboard/charts/fee-analysis-chart"

const feesChargedMonthlyData = [
	{ month: "Jul", fees: 186 },
	{ month: "Aug", fees: 305 },
	{ month: "Sep", fees: 237 },
	{ month: "Oct", fees: 173 },
	{ month: "Nov", fees: 209 },
	{ month: "Dec", fees: 214 },
]

const feesChargedMonthlyConfig = {
	fees: {
		label: "Fees",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig

function FeesChargedMonthlyChart() {
	return (
		<Card className="flex h-full flex-col">
			<CardHeader>
				<CardTitle>Fees Charged Monthly</CardTitle>
				<CardDescription>Total fees across all vendors</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-1 flex-col">
				<ChartContainer config={feesChargedMonthlyConfig} className="aspect-auto h-[260px]">
					<BarChart accessibilityLayer data={feesChargedMonthlyData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="month"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent labelFormatter={(value) => String(value)} />}
						/>
						<Bar dataKey="fees" fill="var(--color-fees)" radius={8} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

const feeDistributionData = [
	{ vendor: "stripe", share: 45, fill: "var(--color-stripe)" },
	{ vendor: "adyen", share: 25, fill: "var(--color-adyen)" },
	{ vendor: "checkout", share: 20, fill: "var(--color-checkout)" },
	{ vendor: "wise", share: 10, fill: "var(--color-wise)" },
]

const feeDistributionConfig = {
	share: {
		label: "Share",
	},
	stripe: {
		label: "Stripe",
		color: "var(--chart-1)",
	},
	adyen: {
		label: "Adyen",
		color: "var(--chart-2)",
	},
	checkout: {
		label: "Checkout.com",
		color: "var(--chart-3)",
	},
	wise: {
		label: "Wise",
		color: "var(--chart-4)",
	},
} satisfies ChartConfig

function FeeDistributionByVendorChart() {
	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>Fee Distribution by Vendor</CardTitle>
				<CardDescription>Percentage of total fees per vendor</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={feeDistributionConfig}
					className="mx-auto aspect-square max-h-[300px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={
								<ChartTooltipContent
									labelFormatter={(value) => String(value)}
									valueFormatter={(value) => `${Number(value).toFixed(0)}%`}
								/>
							}
						/>
						<Pie data={feeDistributionData} dataKey="share" nameKey="vendor" />
						<ChartLegend
							content={<ChartLegendContent nameKey="vendor" />}
							className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

export default function StandardReports() {
	return (
		<div className="flex flex-col gap-4">
			<div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2">
				<FeesChargedMonthlyChart />
				<FeeDistributionByVendorChart />
			</div>
			<div className="h-[420px]">
				<FeeAnalysisChart />
			</div>
		</div>
	)
}
