import {
    IconArrowsExchange,
    IconBell,
    IconBuildingBank,
    IconBuildingStore,
    IconCamera,
    IconChartBar,
    IconDashboard,
    IconFileAi,
    IconFileDescription,
    IconHelp,
    IconSettings,
} from "@tabler/icons-react"

export const routes = {
    user: {
        name: "Max Kharena",
        email: "max@bluefin.ai",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: IconDashboard,
            subtitle: "Overview",
        },
        {
            title: "Vendors",
            url: "/vendors",
            icon: IconBuildingStore,
            subtitle: "Manage vendors",
        },
        {
            title: "Accounts",
            url: "/accounts",
            icon: IconBuildingBank,
            subtitle: "Manage accounts",
        },
        {
            title: "Transactions",
            url: "/transactions",
            icon: IconArrowsExchange,
            subtitle: "Review activity",
        },
        {
            title: "Contracts",
            url: "/contracts",
            icon: IconFileDescription,
            subtitle: "Manage contracts",
        },
        {
            title: "Alerts",
            url: "/alerts",
            icon: IconBell,
            subtitle: "Alerting",
        },
        {
            title: "Reporting",
            url: "/reporting",
            icon: IconChartBar,
            subtitle: "Analytics and insights across your vendor ecosystem",
        },
    ],
    navClouds: [
        {
            title: "Capture",
            icon: IconCamera,
            isActive: true,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Proposal",
            icon: IconFileDescription,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
        {
            title: "Prompts",
            icon: IconFileAi,
            url: "#",
            items: [
                {
                    title: "Active Proposals",
                    url: "#",
                },
                {
                    title: "Archived",
                    url: "#",
                },
            ],
        },
    ],
    navSecondary: [
        {
            title: "Settings",
            url: "#",
            icon: IconSettings,
        },
        {
            title: "Get Help",
            url: "#",
            icon: IconHelp,
        },
    ],
}