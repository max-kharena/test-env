import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import FeeAnalysisChat from "@/features/reporting/fee-analysis-chat"
import StandardReports from "@/features/reporting/standard-reports"

function ReportingPage() {
	return (
		<div className="@container/main flex flex-1 flex-col gap-2">
			<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
				<div className="px-4 lg:px-6">
					<Tabs defaultValue="fee-analysis" className="w-full">
						<TabsList>
							<TabsTrigger value="fee-analysis">Fee Analysis</TabsTrigger>
							<TabsTrigger value="standard-reports">Standard Reports</TabsTrigger>
						</TabsList>

						<TabsContent value="fee-analysis" className="mt-4">
							<FeeAnalysisChat />
						</TabsContent>

						<TabsContent value="standard-reports" className="mt-4">
							<StandardReports />
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	)
}

export default ReportingPage
