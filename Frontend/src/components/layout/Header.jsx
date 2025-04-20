import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, Moon, Sun, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/AuthContext" // Use context, not local state

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark")
  const { isAuthenticated, logout } = useAuth() // <- from context
  const navigate = useNavigate()

  // Handle theme toggle
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
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white">
          DataViz
        </Link>

        {/* Desktop Navigation */}
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

        {/* Desktop Right Side - Auth */}
        <div className="hidden md:flex gap-2 items-center">
          {isAuthenticated ? (
            <Button variant="ghost" onClick={() => navigate("/dashboard")}>
              <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Hamburger for Mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700 dark:text-gray-300">
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-6 shadow-lg space-y-6 rounded-b-lg">
          {/* Links */}
          <div className="flex flex-col gap-4">
            <Link
              to="/features"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </div>

          {/* Theme Toggle */}
          <div className="flex justify-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600"
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
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                  <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Button>
                <Button variant="outline" onClick={() => {
                  logout();
                  navigate("/"); // Optional: Redirect to home
                }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}

          </div>
        </div>
      )}
    </header>
  )
}
