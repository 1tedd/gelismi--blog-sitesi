const NavigationItem = ({ href, label, icon: Icon }) => {
  return (
    <a
      href={href}
      className="group flex flex-col items-center p-2 md:p-4"
      role="menuitem"
      aria-label={label}
    >
      <Icon className="w-6 h-6 md:w-5 md:h-5" />
      <span className="text-sm mt-1 hidden md:block">
        {label}
      </span>
      <span className="text-xs mt-1 md:hidden">
        {label}
      </span>
    </a>
  );
};