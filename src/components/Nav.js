import Link from "next/link";

export default function Nav() {
  const routes = [
    {
      name: "Home",
      path: "/home"
    },
    {
      name: "Feed",
      path: "/feed"
    },
    {
      name: "My Profile",
      path: "/profile"
    },
    {
      name: "Sign in/up",
      path: "/"
    }
  ];

  return (
    <nav className="mt-12">
      <ul className="flex flex-col gap-4 text-2xl select-none">
        {routes.map((route, i) => (
          <li className="flex" key={i}>
            <Link href={route.path} className="flex-grow transition-all hover:opacity-70 hover:underline hover:pl-1">
              {route.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
