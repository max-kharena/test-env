
// Components
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import {AlertItems} from "@/features/dashboard/alerts/alert-items"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"

function RecentAlerts() {
    return (<Card className="@container/card flex h-full flex-col">
        <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardAction>
                <Button asChild variant="outline" size="sm">
                    <Link to="/alerts">View all</Link>
                </Button>
            </CardAction>
        </CardHeader>
        <CardContent>
            <AlertItems />         
        </CardContent>
    </Card>);

}
export { RecentAlerts }