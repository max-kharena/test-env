// Components
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Types
type TotalsCardItem = {
  title: string
  value: string
  deltaText: string
  deltaDirection: "up" | "down"
  footerTitle: string
  footerSubtitle: string
}

// Constants
const totalsCardsMock: TotalsCardItem[] = [
  {
    title: "Total Fees Charged",
    value: "$1,250.00",
    deltaText: "+12.5%",
    deltaDirection: "up",
    footerTitle: "Trending up this month",
    footerSubtitle: "Total fees charged for the last months",
  },
  {
    title: "Fee Variance Detected",
    value: "$4,230",
    deltaText: "-20%",
    deltaDirection: "down",
    footerTitle: "Down 20% this period",
    footerSubtitle: "Total fee variance detected for the last months",
  },
  {
    title: "Active Contracts",
    value: "12",
    deltaText: "+2%",
    deltaDirection: "up",
    footerTitle: "Strong contracts retention",
    footerSubtitle: "Total active contracts for the last month",
  },
  {
    title: "Transaction Processed",
    value: "1.2M",
    deltaText: "+4.5%",
    deltaDirection: "up",
    footerTitle: "Steady performance increase",
    footerSubtitle: "Total transactions processed for the last month",
  },
]

function TotalsCard({ item }: { item: TotalsCardItem }) {
  const isUp = item.deltaDirection === "up"
  const TrendIcon = isUp ? IconTrendingUp : IconTrendingDown
  const trendClass = isUp ? "text-green-600" : "text-red-600"

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{item.title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {item.value}
        </CardTitle>
        <CardAction>
          <Badge className={trendClass} variant="outline">
            <TrendIcon />
            {item.deltaText}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {item.footerTitle} <TrendIcon className={`size-4 ${trendClass}`} />
        </div>
        <div className="text-muted-foreground">{item.footerSubtitle}</div>
      </CardFooter>
    </Card>
  )
}

export function TotalsSectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {totalsCardsMock.map((item) => (
        <TotalsCard key={item.title} item={item} />
      ))}
    </div>
  )
}
