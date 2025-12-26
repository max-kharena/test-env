import { SidebarTrigger } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { routes } from "@/layout/navigation/routes"
import { normalize } from "@/lib/string"

import alertsData from "@/mocks/alerts.json"

import { IconBell } from "@tabler/icons-react"

import { useLocation, useNavigate } from "react-router"

function getHeaderMeta(pathname: string) {
  const normalized = pathname === "" ? "/" : pathname

  const active = routes.navMain.find((item) => {
    if (item.url === "/dashboard") {
      return normalized === "/" || normalized === "/dashboard"
    }

    return normalized === item.url || normalized.startsWith(`${item.url}/`)
  })

  const dashboard = routes.navMain.find((item) => item.url === "/dashboard")
  const meta = active ?? dashboard

  return {
    title: meta?.title ?? "Dashboard",
    subtitle: meta?.subtitle ?? "Overview",
  }
}

export function SiteHeader() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { title, subtitle } = getHeaderMeta(location.pathname)

  const alertCount = (alertsData as unknown[]).length
  const recentAlerts = (alertsData as Array<Record<string, unknown>>).slice(0, 4)

  function severityClass(severity: unknown) {
    const value = normalize(String(severity ?? ""))
    if (value === "high") return "border-transparent bg-destructive/10 text-destructive"
    if (value === "medium") return "border-transparent bg-chart-3/10 text-chart-3"
    if (value === "low") return "border-transparent bg-chart-2/10 text-chart-2"
    return "text-muted-foreground"
  }
  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col leading-tight">
          <h1 className="text-base font-medium">{title}</h1>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open alerts" className="relative">
                <IconBell />
                {alertCount > 0 ? (
                  <span className="bg-destructive text-destructive-foreground absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-medium tabular-nums">
                    {alertCount}
                  </span>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-96 pt-4">
              <div>
                {recentAlerts.length === 0 ? (
                  <div className="text-muted-foreground px-4 py-8 text-center text-sm">
                    No alerts.
                  </div>
                ) : (
                  <div className="max-h-80 overflow-auto">
                    {recentAlerts.map((alert, index) => {
                      const title = String(alert["Alert Title"] ?? "Alert")
                      const vendor = String(alert["Vendor"] ?? "")
                      const triggered = String(alert["Triggered"] ?? "")
                      const severity = alert["Severity"]

                      return (
                        <div
                          key={`${String(alert["id"] ?? title)}-${index}`}
                          className="hover:bg-muted/50 focus-within:bg-muted/50 flex items-start gap-3 px-4 py-2.5"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="line-clamp-1 text-sm font-medium">
                              {title}
                            </div>
                            <div className="text-muted-foreground line-clamp-1 text-xs">
                              {vendor}
                              {vendor && triggered ? " • " : ""}
                              {triggered}
                            </div>
                          </div>
                          {severity ? (
                            <span
                              className={`h-fit shrink-0 rounded-md px-2 py-0.5 text-xs ${severityClass(
                                severity
                              )}`}
                            >
                              {String(severity)}
                            </span>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="border-t px-4 py-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate("/alerts")}
                >
                  View all
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Switch
            aria-label="Toggle theme"
            checked={theme === "dark"}
            onCheckedChange={(checked) => {
              setTheme(checked ? "dark" : "light")
            }}
          />
        </div>
      </div>
    </header>
  )
}
