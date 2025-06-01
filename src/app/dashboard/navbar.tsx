import Link from "next/link"
import { Award, Bot, Menu, Ticket } from "lucide-react"
import { AuthMenu } from "../(auth)/auth-menu"

const pages = [
  {
    name: "Robots",
    href: "/dashboard/robots",
    icon: Bot
  },
  {
    name: "Competitions",
    href: "/dashboard/competitions",
    icon: Ticket
  },
  {
    name: "Awards",
    href: "/dashboard/awards",
    icon: Award
  },
]

export default function DashboardNavbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col overflow-hidden h-screen">
        {/* Navbar */}
        <div className="navbar bg-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </label>
          </div>
          <div className="mx-2 navbar-start px-2">Navbar Title</div>
          <div className="hidden navbar-center lg:block">
            <ul className="menu menu-horizontal">
              {/* Navbar menu content here */}
              {pages.map((page) => (
                <li key={page.name}>
                  <Link href={page.href}>
                    <page.icon className="h-5 w-5" aria-hidden="true" />
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="navbar-end px-2 mx-2">
            <AuthMenu />
          </div>
        </div>
        <div className="w-full h-full p-4 overflow-auto">
          {children}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          {pages.map((page) => (
            <li key={page.name}>
              <Link href={page.href}>
                <page.icon className="h-5 w-5" aria-hidden="true" />
                {page.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}