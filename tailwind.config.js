/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				"black-aneuk": "#28292A",
				"white-aneuk": "#F5F5F5",
				"text-aneuk": "#2c3e50",
				"gray-aneuk": "#cccccc",
				horror: "#5F36DA",
				joy: "#F4ABE2",
				surprise: "#F6B567",
				anger: "#CD5D5D",
				sadness: "#7D8FF1",
				neutral: "#B0E0E6",
				boredom: "#B08AF1",
				pain: "#F08080",
				disgust: "#6B8E23",
				interest: "#FFEF93",
				other: "#808080",
			},
			keyframes: {
				"slide-up": {
					"0%": { transform: "translateY(100%)" },
					"100%": { transform: "translateY(0)" },
				},
				floating: {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-5px)" },
				},
				spinner: {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
				"small-spin-l": {
					"0%": { transform: "rotateZ(3deg)", opacity: "0" },
					"50%": { transfrom: "rotateZ(3deg)", opacity: "1" },
					"100%": { transform: "rotateZ(0deg)" },
				},
				"small-spin-r": {
					"0%": { transform: "rotateZ(-3deg)", opacity: "0" },
					"50%": { transfrom: "rotateZ(-3deg)", opacity: "1" },
					"100%": { transform: "rotateZ(0deg)" },
				},
				flip: {
					"0%": {
						transform: "rotateZ(0deg)",
					},
					"100%": {
						transform: "rotateZ(360deg)",
					},
				},
			},
			animation: {
				"slide-up": "slide-up 0.5s ease-out",
				floating: "floating 2.5s ease-in-out infinite",
				spinner: "spinner 1.3s ease-in-out infinite",
				flip: "flip 0.2s ease-in-out",
				"small-spin-l": "small-spin-l 0.5s ease-in-out",
				"small-spin-r": "small-spin-r 0.5s ease-in-out",
			},
			boxShadow: {
				"custom-strong": "0 4px 8px rgba(0, 0, 0, 0.2)",
				"inner-strong": "inset 0 3px 8px rgba(0, 0, 0, 0.05)",
			},
			height: {
				"screen-dynamic": "calc(var(--vh, 1vh) * 100)",
			},
			fontFamily: {
				"pretendard-light": ["Pretendard-Light", "sans-serif"],
				"pretendard-regular": ["Pretendard-Regular", "sans-serif"],
				"pretendard-medium": ["Pretendard-Medium", "sans-serif"],
				"pretendard-bold": ["Pretendard-Bold", "sans-serif"],
				"gowun-regular": ["gowun-regular", "sans-serif"],
				"gowun-bold": ["gowun-bold", "sans-serif"],
			},
		},
	},
	plugins: [
		require("tailwind-scrollbar-hide"),
		require("@tailwindcss/forms"),
	],
};
