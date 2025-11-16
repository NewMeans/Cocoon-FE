import React, { useState, useEffect, useRef } from "react";
import apiClient from "../../api";
import { FinalDiary } from "../../api/diary";
import HomeCard from "./HomeCard";
import { EmotionLabels } from "../Calendar/EmotionLabels";
import logoImg from "../../assets/images/maltipoo.png";

const HomePage: React.FC = () => {
	const [randomDiary, setRandomDiary] = useState<FinalDiary | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isFlipped, setIsFlipped] = useState(false);
	const [isFlipping, setIsFlipping] = useState(false);
	const [isImageClicked, setIsImageClicked] = useState(false);
	const [selectedEmotionId, setSelectedEmotionId] = useState<number | null>(
		null
	);

	const containerRef = useRef<HTMLDivElement>(null);
	const descriptionRef = useRef<HTMLDivElement>(null);

	const handleRandomButton = () => {
		const getRandomDiary = async () => {
			try {
				setIsFlipping(true);
				const response = await apiClient.get("/home/random");

				setIsLoading(false);
				setIsFlipped(false);

				setIsFlipping(false);
				setSelectedEmotionId(null);
				setRandomDiary(response.data);
			} catch (error: any) {
				console.error("Error getting random diary:", error.message);
				setIsLoading(false);
				setIsFlipping(false);
				throw error;
			} finally {
			}
		};
		getRandomDiary();
	};

	useEffect(() => {
		setSelectedEmotionId(null);
	}, [isFlipped]);

	useEffect(() => {
		if (
			selectedEmotionId !== null &&
			descriptionRef.current &&
			containerRef.current
		) {
			const descriptionPosition = descriptionRef.current.offsetTop;
			const containerScrollPosition = containerRef.current.scrollTop;

			const extraScroll = 50;

			containerRef.current.scrollTo({
				top:
					descriptionPosition - containerScrollPosition + extraScroll,
				behavior: "smooth",
			});
		}
	}, [selectedEmotionId]);

	const handleMouseDown = () => {
		setIsImageClicked(true);
	};

	const handleMouseUp = () => {
		setIsImageClicked(false);
		handleRandomButton();
	};

	const drawButton = (
		<div
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			className={`w-[46%] max-w-[220px] aspect-square rounded-full bg-white shadow-inner-strong flex items-center justify-center cursor-pointer transition-transform duration-150 overflow-hidden ${
				isImageClicked ? "scale-95" : "scale-100"
			}`}
		>
			<img
				src={logoImg}
				alt="오늘의 일기 카드 뽑기"
				className="w-full h-full object-cover"
			/>
		</div>
	);

	return (
		<div
			ref={containerRef}
			className="flex flex-col w-full h-full overflow-y-auto bg-white-aneuk"
		>
			<div
				className={`flex flex-1 flex-col items-center w-full min-h-screen-dynamic max-w-[440px] mx-auto px-5 ${
					randomDiary
						? "pt-8 pb-24 gap-6 justify-start"
						: "pb-24 justify-center gap-6"
				}`}
			>
				{randomDiary ? (
					<>
						<HomeCard
							key={randomDiary.data.diary_id}
							curDiary={randomDiary}
							isFlipped={isFlipped}
							isFlipping={isFlipping}
							setIsFlipped={setIsFlipped}
						/>
						{isFlipped && (
							<EmotionLabels
								curDiary={randomDiary}
								selectedEmotionId={selectedEmotionId}
								setSelectedEmotionId={setSelectedEmotionId}
								descriptionRef={descriptionRef}
							/>
						)}
						{!isFlipped && drawButton}
					</>
				) : (
					<div className="flex flex-1 w-full flex-col items-center justify-center">
						<div className="flex w-full max-w-[360px] flex-col items-center text-center gap-4 px-2">
							{drawButton}
							<div className="font-pretendard-bold text-lg text-black-aneuk">
								콩이를 눌러 추억을 회상해보세요!
							</div>
							<div className="font-pretendard-regular text-xs text-[#9ea4aa] leading-relaxed max-w-[320px]">
								콩이는 코쿤팀에서 제공하는 샘플 페르소나에요.
								<br />
								나만의 페르소나 설정 기능을 기대해주세요!
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;
