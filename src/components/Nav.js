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
      name: "Sign in/up",
      path: "/"
    }
  ];

  return (
    <nav className="mt-12">
      <ul className="flex flex-col gap-4 text-2xl select-none">
        {routes.map((route, i) => (
          <li className="flex" key={i}>
            <a href={route.path} className="flex-grow transition-all hover:opacity-70 hover:underline hover:pl-1">
              {route.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
