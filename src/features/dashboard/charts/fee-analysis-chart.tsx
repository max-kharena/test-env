"use client"

// Global
import { useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

// Components
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

// Constants
import { chartData } from "@/features/dashboard/charts/mock"
import { rangeOptions } from "@/features/dashboard/charts/constants"

const chartConfig = {
  charged: {
    label: "Charged",
    color: "var(--muted-foreground)",
  },
  estimated: {
    label: "Estimated",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

function FeeAnalysisChart() {
  const [timeRange, setTimeRange] = useState("90d")

  const parseYmdToLocalDate = useMemo(() => {
    return (value: unknown) => {
      if (typeof value !== "string") return null
      const [year, month, day] = value.split("-").map((part) => Number(part))
      if (!year || !month || !day) return null
      return new Date(year, month - 1, day)
    }
  }, [])

  const formatUSDk = useMemo(() => {
    return (value: unknown) => {
      if (typeof value !== "number" || Number.isNaN(value)) return String(value)
      const k = Math.round(value / 1000)
      return `$${k}k`
    }
  }, [])

  const { filteredData, referenceDate } = useMemo(() => {
    const dates = chartData
      .map((item) => parseYmdToLocalDate(item.date))
      .filter((d): d is Date => Boolean(d))

    const maxDate = dates.length
      ? new Date(Math.max(...dates.map((d) => d.getTime())))
      : new Date()

    let days = 90
    if (timeRange === "30d") {
      days = 30
    } else if (timeRange === "7d") {
      days = 7
    }

    const daysToSubtract = Math.max(0, days - 1)

    const startDate = new Date(maxDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    return {
      referenceDate: maxDate,
      filteredData: chartData.filter((item) => {
        const date = parseYmdToLocalDate(item.date)
        return date ? date >= startDate : false
      }),
    }
  }, [parseYmdToLocalDate, timeRange])

  return (
    <Card className="@container/card flex h-80 w-full flex-col">
      <CardHeader>
        <CardTitle>Fee Analysis</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {`Total for the ${rangeOptions.find((option) => option.value === timeRange)?.label}`}
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            {rangeOptions.map((option) => (
              <ToggleGroupItem key={option.value} value={option.value}>
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {rangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-full w-full [&_.recharts-cartesian-axis-tick_text]:tabular-nums"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillCharged" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-charged)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-charged)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillEstimated"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-estimated)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-estimated)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 60000]}
              ticks={[0, 20000, 40000, 60000]}
              tickFormatter={(value) => formatUSDk(value)}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = parseYmdToLocalDate(value) ?? new Date(String(value))
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = parseYmdToLocalDate(value) ?? referenceDate
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                  valueFormatter={(value) => formatUSDk(value)}
                />
              }
            />
            <Area
              dataKey="estimated"
              type="natural"
              fill="url(#fillEstimated)"
              stroke="var(--color-estimated)"
            />
            <Area
              dataKey="charged"
              type="natural"
              fill="url(#fillCharged)"
              stroke="var(--color-charged)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export { FeeAnalysisChart }