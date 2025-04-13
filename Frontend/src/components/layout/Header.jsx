import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark")

  // Sync theme with localStorage and document class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  return (
    <header className="w-full border-b bg-white dark:bg-gray-900 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo as Home */}
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white">
          DataViz
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-6 items-center">
          <Link to="/features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
            Features
          </Link>
          <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">
            About
          </Link>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2">
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
          </button>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700 dark:text-gray-300">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-6 shadow-lg space-y-6 rounded-b-lg">

          {/* Navigation Links */}
          <div className="flex flex-col gap-4">
            <Link
              to="/features"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </div>

          {/* Theme Toggle - Centered */}
          <div className="flex justify-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              {darkMode ? (
                <>
                  <Sun className="w-4 h-4" /> Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" /> Dark Mode
                </>
              )}
            </button>
          </div>


          {/* Auth Buttons */}
          <div className="flex flex-col gap-3">
            <Button variant="outline" asChild className="text-sm font-medium w-full py-2">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild className="text-sm font-medium w-full py-2">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      )}


    </header>
  )
}
