import { FinalDiary } from "../../api/diary";
import { getEmotionColor } from "../../utils/GetEmotionColor";

interface EmotionLabelsProps {
	curDiary: FinalDiary | null;
	selectedEmotionId: number | null;
	setSelectedEmotionId: React.Dispatch<React.SetStateAction<number | null>>;
	descriptionRef: React.RefObject<HTMLDivElement>;
}

export const EmotionLabels: React.FC<EmotionLabelsProps> = ({
	curDiary,
	selectedEmotionId,
	setSelectedEmotionId,
	descriptionRef,
}) => {
	const handleEmotionClick = (id: number) => {
		setSelectedEmotionId((prevId) => (prevId === id ? null : id));
	};

	return (
		<div className="flex flex-row flex-wrap justify-start items-start px-4 pt-4 w-full duration-500 ease-in-out animate-slide-up">
			{curDiary &&
				curDiary.data.emotionList.map((emotion) => {
					const isSelected = selectedEmotionId === emotion.id;
					return (
						<div
							key={emotion.id}
							className={`flex flex-col justify-start items-start ${
								isSelected && "w-full"
							}`}
						>
							<div
								onClick={() => handleEmotionClick(emotion.id)}
								className={`flex flex-row space-x-2 mr-2 mb-2 justify-start items-center py-0.5 pl-1 pr-2.5 bg-white border rounded-full cursor-pointer  ${
									isSelected
										? "text-black font-gowun-regular shadow-md h-9 text-lg"
										: "text-black-aneuk  font-gowun-regular text-base"
								} transition-all duration-300 ease-in-out`}
							>
								<div
									className={`${getEmotionColor(
										emotion.category
									)} rounded-full ${
										isSelected ? "w-7 h-7" : "w-5 h-5"
									}`}
								/>
								<div>{emotion.title}</div>
							</div>

							{isSelected && (
								<div
									ref={descriptionRef}
									className="flex flex-col justify-center items-center w-full mt-2 mb-4 text-black-aneuk"
								>
									<div className="font-pretendard-regular text-base text-black-aneuk mb-2 text-center">
										{emotion.description}
									</div>
									<div className="font-pretendard text-base text-[#AFAFAF] text-center">
										"{emotion.example}"
									</div>
								</div>
							)}
						</div>
					);
				})}
		</div>
	);
};
