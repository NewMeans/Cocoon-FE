import React from "react";
import ApexCharts from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const emotionColors: Record<
	| "공포"
	| "기쁨"
	| "기타"
	| "놀람"
	| "분노"
	| "슬픔"
	| "중성"
	| "지루"
	| "통증"
	| "혐오"
	| "흥미",
	string
> = {
	기쁨: "#F4ABE2",
	흥미: "#FFEF93",
	놀람: "#F6B567",
	중성: "#B0E0E6",
	슬픔: "#7D8FF1",
	지루: "#B08AF1",
	공포: "#5F36DA",
	분노: "#CD5D5D",
	통증: "#F08080",
	혐오: "#6B8E23",
	기타: "#808080",
};

interface LastMonthData {
	[key: string]: number;
}

interface DonutChartProps {
	data: LastMonthData;
}
const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
	const labels = Object.keys(emotionColors) as (keyof typeof emotionColors)[];
	const series = labels.map((label) => data[label] || 0);
	const colors = labels.map((label) => emotionColors[label]);

	const chartOptions: ApexOptions = {
		chart: {
			type: "donut",
			fontFamily: "Pretendard-Bold",
			foreColor: "#333333",
		},
		labels: labels,
		colors: colors,
		plotOptions: {
			pie: {
				expandOnClick: false,

				donut: {
					size: "70%",
					labels: {
						show: true,
						total: {
							showAlways: true,
							show: true,
							label: "총 감정단어 사용 횟수",
							fontFamily: "Pretendard-Bold",
							formatter: function () {
								return `${series.reduce((a, b) => a + b, 0)}`;
							},
						},
					},
				},
			},
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			position: "bottom",
			fontFamily: "Inter, sans-serif",
		},
	};

	return (
		<div className="w-full bg-white rounded-2xl shadow-md p-4">
			<div className="font-pretendard-bold text-xl text-black-aneuk mb-4 ml-1">
				최근 30일 감정 추이
			</div>
			<div className="w-full">
				<ApexCharts
					options={chartOptions}
					series={series}
					type="donut"
					height={320}
					width="100%"
				/>
			</div>
		</div>
	);
};

export default DonutChart;
