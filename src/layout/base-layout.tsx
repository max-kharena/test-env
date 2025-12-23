
import { AppSidebar } from "@/layout/navigation/app-sidebar"
import { SiteHeader } from "@/layout/navigation/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router"

function BaseLayout() {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                  <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default BaseLayout
