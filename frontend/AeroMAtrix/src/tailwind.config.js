import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{html,ts}", "./src/index.html"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3498db",
          dark: "#2980b9",
          light: "#e3f2fd",
        },
        secondary: {
          DEFAULT: "#2ecc71",
          dark: "#27ae60",
          light: "#e8f5e9",
        },
        accent: {
          DEFAULT: "#f39c12",
          dark: "#d35400",
          light: "#fff8e1",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#eeeeee",
          300: "#e0e0e0",
          400: "#bdbdbd",
          500: "#9e9e9e",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
        },
        success: "#2ecc71",
        warning: "#f39c12",
        error: "#e74c3c",
        info: "#3498db",
        drone: {
          active: "#2ecc71",
          idle: "#3498db",
          error: "#e74c3c",
          charging: "#f39c12",
        },
        matrix: {
          grid: "#e0e0e0",
          occupied: "rgba(52, 152, 219, 0.2)",
          highlight: "rgba(46, 204, 113, 0.3)",
          path: "rgba(243, 156, 18, 0.4)",
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "card-hover":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        button:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        "button-hover":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
