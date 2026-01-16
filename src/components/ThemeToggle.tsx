import { useTheme } from "../contexts/theme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-full border-2 border-retro-ink bg-retro-paper/95 px-3 py-1.5 text-xs font-black uppercase tracking-[0.22em] text-retro-ink shadow-[0_3px_0_rgba(0,0,0,0.7)] transition-all hover:-translate-y-[1px] hover:bg-retro-accent hover:text-retro-ink hover:shadow-[0_1px_0_rgba(0,0,0,0.7)] active:translate-y-[1px] active:shadow-none dark:border-retro-darkFrame dark:bg-retro-darkPaper dark:text-retro-paper dark:hover:bg-retro-accent dark:hover:text-retro-ink cursor-pointer"
      aria-label="Alternar tema"
      title={
        theme === "light" ? "Mudar para modo escuro" : "Mudar para modo claro"
      }
    >
      {theme === "light" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      )}
    </button>
  );
}
