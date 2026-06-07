/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        teal:  { DEFAULT:"#5DBFB0", dark:"#3d9e8f", light:"#a8ded7", pale:"#e4f7f5", deep:"#2a7068" },
        rose:  { DEFAULT:"#f29eab", dark:"#c47d8b", berry:"#9b4f60", blush:"#fde8ec", petal:"#f7bbc3" },
        gold:  { DEFAULT:"#f5c842", pale:"#fff8dc", deep:"#a07a10" },
        ink:   "#1a2e2b",
        mist:  "#557570",
        sand:  "#fdf8f2",
        pearl: "#fff9fb",
        lace:  "#f5eef0",
        dust:  "#ddd0d3",
      },
      fontFamily: {
        display: ["'Playfair Display'","Georgia","serif"],
        script:  ["'Sacramento'","cursive"],
        body:    ["'Quicksand'","ui-sans-serif","sans-serif"],
      },
      borderRadius: {
        "4xl":"2rem","5xl":"2.5rem","6xl":"3rem","blob":"30% 70% 70% 30%/30% 30% 70% 70%",
      },
      boxShadow: {
        teal:  "0 8px 32px rgba(93,191,176,.28)",
        rose:  "0 8px 32px rgba(196,125,139,.22)",
        gold:  "0 8px 32px rgba(245,200,66,.30)",
        card:  "0 2px 24px rgba(26,46,43,.07)",
        lift:  "0 16px 48px rgba(26,46,43,.14)",
      },
      keyframes: {
        fadeUp:     {"0%":{opacity:0,transform:"translateY(24px)"},"100%":{opacity:1,transform:"translateY(0)"}},
        fadeIn:     {"0%":{opacity:0},"100%":{opacity:1}},
        float:      {"0%,100%":{transform:"translateY(0)"},"50%":{transform:"translateY(-10px)"}},
        wiggle:     {"0%,100%":{transform:"rotate(-6deg)"},"50%":{transform:"rotate(6deg)"}},
        shimmer:    {"0%":{backgroundPosition:"200% center"},"100%":{backgroundPosition:"-200% center"}},
        scaleIn:    {"0%":{transform:"scale(0.92)",opacity:0},"100%":{transform:"scale(1)",opacity:1}},
        slideBow:   {"0%":{transform:"translateX(-8px)",opacity:0},"100%":{transform:"translateX(0)",opacity:1}},
        pulse_soft: {"0%,100%":{transform:"scale(1)"},"50%":{transform:"scale(1.04)"}},
      },
      animation: {
        "fade-up":   "fadeUp .6s ease both",
        "fade-in":   "fadeIn .5s ease both",
        "float":     "float 3.5s ease-in-out infinite",
        "wiggle":    "wiggle 1.5s ease-in-out infinite",
        "shimmer":   "shimmer 2.5s linear infinite",
        "scale-in":  "scaleIn .4s ease both",
        "slide-bow": "slideBow .4s ease both",
        "pulse-soft":"pulse_soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
