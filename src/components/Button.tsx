const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={`
        px-4 py-2 rounded-lg
        transform transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500
        active:scale-95
        md:hover:scale-105
        touch-manipulation
      `}
    >
      {children}
    </button>
  );
};