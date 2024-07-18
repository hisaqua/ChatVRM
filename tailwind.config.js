const { light, dark } = require("@charcoal-ui/theme");
const { createTailwindConfig } = require("@charcoal-ui/tailwind-config");
/**
 * @type {import('tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  darkMode: true,
  content: ["./src/**/*.tsx", "./src/**/*.html"],
  presets: [
    createTailwindConfig({
      version: "v3",
      theme: {
        ":root": light,
      },
    }),
  ],
  theme: {
    extend: {
      colors: {
        primary: "#856292",
        "primary-hover": "#8E76A1",
        "primary-press": "#988BB0",
        "primary-disabled": "#6F48694D",
        secondary: "#81A385",
        "secondary-hover": "#8BAB91",
        "secondary-press": "#94B39D",
        "secondary-disabled": "#67836D4D",
        base: "#FBE2CA",
        "text-primary": "#514062",
      },
      fontFamily: {
        M_PLUS_2: ["Montserrat", "M_PLUS_2", "sans-serif"],
        Montserrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
