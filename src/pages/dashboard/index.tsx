// Components
import { FeeAnalysisChart } from "@/features/dashboard/charts/fee-analysis-chart"
import { TotalsSectionCards } from "@/features/dashboard/cards/total-section-cards"
import { RecentAlerts } from "@/features/dashboard/alerts/recent-alerts"
import SummaryTable from "@/features/dashboard/summary-table"

function Dashboard() {
    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <TotalsSectionCards />
                <div className="grid grid-cols-1 items-stretch gap-4 px-4 lg:px-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <FeeAnalysisChart />
                    </div>
                    <div className="lg:col-span-1">
                        <RecentAlerts />
                    </div>
                </div>
                <SummaryTable />
            </div>
        </div>
    )
}

export default Dashboard