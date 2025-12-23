import { SidebarTrigger } from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/components/theme-provider"
import { routes } from "@/layout/navigation/routes"
import { useLocation } from "react-router"

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
  const { title, subtitle } = getHeaderMeta(location.pathname)
  
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-col leading-tight">
          <h1 className="text-base font-medium">{title}</h1>
          <p className="text-muted-foreground text-xs">{subtitle}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
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
