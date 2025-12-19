/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          cyan: "#00f6ff",
          magenta: "#ff00ff",
          green: "#0f0",
          red: "#f00",
        },
        bg: {
          black: "#050505",
          dark: "#0a0a0a",
        }
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        neon: "0 0 10px #00f6ff, 0 0 20px #00f6ff",
        "neon-gold": "0 0 10px #ffaa00, 0 0 20px #ffaa00",
        "neon-red": "0 0 10px #f00, 0 0 20px #f00",
      },
      animation: {
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glitch": "glitch 2.5s infinite",
        "glitch-fast": "glitch 0.5s infinite",
        "scanline": "scanline 8s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "33%": { transform: "translate(-5px, 2px) skew(0deg)" },
          "34%": { transform: "translate(5px, -2px) skew(10deg)", filter: "blur(2px)" },
          "35%": { transform: "translate(0) skew(0deg)", filter: "none" },
          "70%": { transform: "translate(2px, 0)" },
          "71%": { transform: "translate(-2px, 0)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        }
      }
    },
  },
  plugins: [],
}
