import React, { useEffect, useState } from "react";
import { FinalDiary } from "../../api/diary";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { getEmotionColor } from "../../utils/GetEmotionColor";

interface HomeCardProps {
	curDiary: FinalDiary | null;
	isFlipped: boolean;
	isFlipping: boolean;
	setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomeCard: React.FC<HomeCardProps> = ({
	curDiary,
	isFlipped,
	isFlipping,
	setIsFlipped,
}) => {
	const handleCardClick = () => {
		setIsFlipped(!isFlipped);
	};

	useEffect(() => {
		setIsFlipped(false);
	}, [curDiary]);

	const categories = curDiary?.data.emotionList.map(
		(emotion) => emotion.category
	);
	const uniqueCategories = categories
		? categories.filter(
				(value, index, self) => self.indexOf(value) === index
		  )
		: [];

	if (curDiary === null) {
		return (
			<div className="flex flex-1 justify-center items-center">
				<div className="font-pretendard-regular text-xl text-black-aneuk">
					이날은 일기가 없어요~
				</div>
			</div>
		);
	}

	return (
		<div
			className={`group flex flex-col w-[90%] aspect-[2/2.8] mt-[5%] [perspective:1000px] animate-flip cursor-pointer`}
			onClick={handleCardClick}
		>
			<div
				className={`relative h-full w-full rounded-[32px] shadow-custom-strong transition-all duration-500 [transform-style:preserve-3d] 
                    ${isFlipped ? "[transform:rotateY(-180deg)]" : ""}`}
			>
				<div
					className={`absolute inset-0 flex flex-col w-full h-full p-2 bg-white rounded-[32px] [backface-visibility:hidden]`}
				>
					<img
						src={curDiary.data.imageUrl}
						alt="Diary Image"
						className="flex flex-col justify-center items-center w-[100%] h-[80%] rounded-[24px] object-cover"
					/>
					<div className="flex flex-row flex-1 justify-start items-start p-2 space-x-2">
						{uniqueCategories.map((category, index) => (
							<div
								key={index}
								className={`aspect-square w-6 rounded-full ${getEmotionColor(
									category
								)}`}
							/>
						))}
					</div>
				</div>
				<div
					className={`absolute inset-0 flex flex-col justify-start items-start w-full h-full p-7 bg-white rounded-[32px] [transform:rotateY(-180deg)] [backface-visibility:hidden]`}
				>
					<div className="font-gowun-bold text-lg text-black-aneuk mb-2">
						{format(
							new Date(curDiary.data.date),
							"yyyy.MM.dd EEEE",
							{ locale: ko }
						)}
					</div>
					<div className="font-gowun-regular text-black-aneuk text-base text-start overflow-y-auto">
						{curDiary.data.content}
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomeCard;
