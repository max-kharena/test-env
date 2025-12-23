  import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle,
  } from "@/components/ui/item"
  import {TriangleAlert, CircleX, CircleAlert} from 'lucide-react'
  import { Badge } from "@/components/ui/badge"
  import { cn } from "@/lib/utils"

  type AlertType = "warning" | "error" | "info"
  type AlertItems= Array<{
    title: string
    vendor: string
    subtitle: string
    time: string
    type: AlertType
  }>

const alerts: AlertItems = [
    {
      title: "FX Markup Variance Detected",
      vendor: "Stripe",
      subtitle: "Stripe applied 2.1% markup instead of contracted 1.5%",
      time: "2 hours ago",
      type: "warning",
    },
    {
      title: "SLA Response Time Warning",
      vendor: "Adyen",
      subtitle: "Average API latency exceeded 200ms threshold",
      time: "5 hours ago",
      type: "error"
    },
    {
      title: "Contract Expiring Soon",
      vendor: "Checkout.com",
      subtitle: "MSA with Checkout.com expires in 30 days",
      time: "1 day ago",
      type: "info"
    },
  ]

  export function AlertItems() {
    const iconMap = {
      warning: <TriangleAlert className="text-yellow-500" />,
      error: <CircleX className="text-red-500" />,
      info: <CircleAlert className="text-blue-500" />,
    };

    const borderClassMap = {
      warning: "border-yellow-500/50",
      error: "border-red-500/50",
      info: "border-blue-500/50",
    } as const

    return (
      <div className="flex w-full flex-col gap-6">
        <ItemGroup className="gap-3">
          {alerts.map((alert) => (
            <Item
              key={alert.title}
              variant="outline"
              asChild
              role="listitem"
              className={cn(borderClassMap[alert.type])}
            >
              <a href="#" className="flex w-full flex-nowrap items-center">
                <ItemMedia
                  variant="image"
                  className="group-has-[[data-slot=item-description]]/item:self-center group-has-[[data-slot=item-description]]/item:translate-y-0"
                >
                  {iconMap[alert.type]}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="line-clamp-1">
                    {alert.title}
                  </ItemTitle>
                  <ItemDescription>{alert.subtitle}</ItemDescription>
                  <Badge variant="outline">{alert.vendor}</Badge>
                </ItemContent>
                <ItemContent className="flex-none self-center text-center">
                  <ItemDescription>{alert.time}</ItemDescription>
                </ItemContent>
              </a>
            </Item>
          ))}
        </ItemGroup>
      </div>
    )
  }
