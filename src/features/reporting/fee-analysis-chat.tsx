import * as React from "react"

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

type ChatMessage = {
	id: string
	role: "user" | "assistant"
	content: string
}

const SUGGESTED_QUERIES = [
	"What was my total fee variance last month?",
	"Show me Stripe's fee breakdown by currency",
	"Which vendor has the highest FX markup?",
] as const

const CANNED_RESPONSES: Record<string, string> = {
	"What was my total fee variance last month?":
		"I can calculate your total fee variance for last month once I know which dataset (transactions vs invoices) you want to use and what date field defines “last month” (e.g., settlement date vs created date).",
	"Show me Stripe's fee breakdown by currency":
		"I can break down Stripe fees by currency by grouping transactions for Stripe and summarizing total fees per currency. Tell me if you want gross fees, net fees, or both.",
	"Which vendor has the highest FX markup?":
		"I can identify the vendor with the highest FX markup by comparing FX fees or markup rates across vendors. Confirm whether “FX markup” is a % rate, a fee line item, or derived from spread.",
}

function makeId() {
	return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function messageClass(role: ChatMessage["role"]) {
	return role === "user"
		? "bg-primary/10 text-foreground"
		: "bg-muted text-foreground"
}

export default function FeeAnalysisChat() {
	const [messages, setMessages] = React.useState<ChatMessage[]>([])
	const [input, setInput] = React.useState("")
	const listRef = React.useRef<HTMLDivElement | null>(null)

	const send = React.useCallback((raw: string) => {
		const content = raw.trim()
		if (!content) return

		const userMessage: ChatMessage = {
			id: makeId(),
			role: "user",
			content,
		}

		const assistantMessage: ChatMessage = {
			id: makeId(),
			role: "assistant",
			content:
				CANNED_RESPONSES[content] ??
				"I can help with that. Share what report scope and timeframe you want, and I’ll format it like a fee analysis summary.",
		}

		setMessages((prev) => [...prev, userMessage, assistantMessage])
		setInput("")
	}, [])

	React.useEffect(() => {
		const el = listRef.current
		if (!el) return
		el.scrollTop = el.scrollHeight
	}, [messages.length])

	return (
		<div className="flex flex-1 flex-col px-4 lg:px-6">
			<Card className="mx-auto flex w-full max-w-3xl flex-1 flex-col" size="sm">
				<CardHeader className="pb-0">
					<CardTitle>Fee Analysis</CardTitle>
					<CardDescription>
						Ask fee questions and get report-style answers.
					</CardDescription>
				</CardHeader>

				<CardContent className="flex min-h-[60vh] flex-1 flex-col pt-4">
					<div ref={listRef} className="flex-1 overflow-auto">
						{messages.length === 0 ? (
							<div className="flex flex-col gap-4">
								<div className="text-sm text-muted-foreground">Try these queries:</div>
								<div className="grid grid-cols-1 gap-2">
									{SUGGESTED_QUERIES.map((query) => (
										<Button
											key={query}
											variant="outline"
											className="justify-start"
											onClick={() => send(query)}
										>
											{query}
										</Button>
									))}
								</div>
							</div>
						) : (
							<div className="flex flex-col gap-4">
								{messages.map((m) => (
									<div
										key={m.id}
										className={
											m.role === "user"
												? "flex justify-end"
												: "flex justify-start"
										}
									>
										<div
											className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${messageClass(
												m.role
											)}`}
										>
											{m.content}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</CardContent>

				<Separator />

				<CardFooter className="flex w-full flex-col items-stretch gap-2">
					<form
						onSubmit={(e) => {
							e.preventDefault()
							send(input)
						}}
						className="flex w-full items-end gap-2"
					>
						<Textarea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask a fee analysis question…"
							className="min-h-11 flex-1 resize-none"
							rows={1}
						/>
						<Button type="submit" disabled={!input.trim()} className="h-11">
							Send
						</Button>
					</form>
					<div className="text-xs text-muted-foreground">
						Responses are placeholders until data wiring is added.
					</div>
				</CardFooter>
			</Card>
		</div>
	)
}
