import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AccountsTable from "@/features/accounts/accounts-table"
import {
    IconChartBar,
    IconPlugConnected,
    IconPercentage,
    IconUsers,
} from "@tabler/icons-react"

function Account() {
    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Active Accounts</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            6
                        </CardTitle>
                        <CardAction className="self-center">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                                <IconUsers className="h-4 w-4" />
                            </div>
                        </CardAction>
                    </CardHeader>
                </Card>

                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Total Volume (30d)</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            $5.6M
                        </CardTitle>
                        <CardAction className="self-center">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                                <IconChartBar className="h-4 w-4" />
                            </div>
                        </CardAction>
                    </CardHeader>
                </Card>
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Avg Success Rate</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            99.4%
                        </CardTitle>
                        <CardAction className="self-center">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                                <IconPercentage className="h-4 w-4" />
                            </div>
                        </CardAction>
                    </CardHeader>
                </Card>
                <Card className="@container/card">
                    <CardHeader>
                        <CardDescription>Vendors Connected</CardDescription>
                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                            5
                        </CardTitle>
                        <CardAction className="self-center">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md border bg-background">
                                <IconPlugConnected className="h-4 w-4" />
                            </div>
                        </CardAction>
                    </CardHeader>
                </Card>
                </div>

                <AccountsTable />
            </div>
        </div>
    )
}

export default Account