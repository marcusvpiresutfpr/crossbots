import { Menu } from "lucide-react";
import { AuthServer } from "./(auth)/auth.server";

const links = [
  { name: "About", href: "/about" },
  { name: "Robots", href: "/robots" },
  { name: "Members", href: "/members" },
  { name: "Shop", href: "/shop" },
  { name: "Competitions", href: "/competitions" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm px-4 fixed top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <Menu />
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links.map((link) => (
              <li key={link.name}>
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">daisyUI</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {links.map((link) => (
            <li key={link.name}>
              <a href={link.href}>{link.name}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        <AuthServer />
      </div>
    </div>
  );
}
