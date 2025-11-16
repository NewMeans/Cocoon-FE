import React from "react";
import { getEmotionTextColor } from "../../utils/GetEmotionColor";

interface CollectionData {
	totalEmotionCount: number;
	usedEmotionCount: number;
	categoryStats: {
		[key: string]: {
			totalCount: number;
			usedCount: number;
		};
	};
}

interface CollectionProgressProps {
	data: CollectionData;
}

const Collection: React.FC<CollectionProgressProps> = ({ data }) => {
	const { totalEmotionCount, usedEmotionCount, categoryStats } = data;

	const percentageFilled = Math.round(
		(usedEmotionCount / totalEmotionCount) * 100
	);

	const emotionOrder = [
		"기쁨",
		"흥미",
		"놀람",
		"중성",
		"슬픔",
		"지루",
		"공포",
		"분노",
		"통증",
		"혐오",
		"기타",
	];

	const sortedCategoryStats = emotionOrder
		.filter((emotion) => categoryStats[emotion])
		.map((emotion) => ({
			category: emotion,
			stats: categoryStats[emotion],
		}));

	const getFractionTextColor = (percentage: number) => {
		if (percentage == 100) return "text-green-500";
		if (percentage < 33) return "text-gray-500";
		if (percentage < 66) return "text-yellow-500";
		return "text-blue-500";
	};

	return (
		<div className="w-full bg-white rounded-2xl shadow-md p-6">
			<div className="flex flex-row justify-between items-center">
				<div className="font-pretendard-bold text-xl text-black-aneuk mb-4">
					감정 도감
				</div>
				<div
					className={`font-pretendard-bold text-xl mb-4 flex flex-row justify-start items-end`}
				>
					<div className="text-black-aneuk">
						<span
							className={getFractionTextColor(percentageFilled)}
						>
							{usedEmotionCount}
						</span>
						<span
							className={`${
								percentageFilled === 100 && "text-green-500"
							}`}
						>
							{" "}
							/ {totalEmotionCount}
						</span>
					</div>
				</div>
			</div>
			<div className="w-full bg-gray-100 rounded-full h-4 mb-8">
				<div
					className="bg-black-aneuk h-4 rounded-full transition-all duration-500"
					style={{ width: `${percentageFilled}%` }}
				></div>
			</div>
			<div>
				<div className="grid grid-cols-2 gap-3">
					{sortedCategoryStats.map(({ category, stats }, index) => (
						<div
							key={index}
							className={`bg-white shadow-inner-strong rounded-lg p-4 text-center`}
						>
							<div
								className={`${getEmotionTextColor(
									category as string
								)} font-pretendard-bold text-xl`}
							>
								{category}
							</div>
							<div className="font-pretendard-regular text-xl text-black-aneuk mt-2">
								<span
									className={getFractionTextColor(
										(stats.usedCount / stats.totalCount) *
											100
									)}
								>
									{stats.usedCount}
								</span>
								<span
									className={`${
										stats.usedCount / stats.totalCount ===
											1 && "text-green-500"
									}`}
								>
									{" "}
									/ {stats.totalCount}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Collection;
