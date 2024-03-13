import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            colors: {
                primary0: "var(--color-0)",
                primary100: "var(--color-100)",
                primary200: "var(--color-200)",
                primary300: "var(--color-300)",
                primary400: "var(--color-400)",
                primary500: "var(--color-500)",
                primary600: "var(--color-600)",
                primary700: "var(--color-700)",
                primary800: "var(--color-800)",
                primary900: "var(--color-900)",
                gradient: "var(--bg-gradient)",
            },
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
