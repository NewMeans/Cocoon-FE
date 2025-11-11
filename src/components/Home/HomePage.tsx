import React, { useState, useEffect, useRef } from "react";
import apiClient from "../../api";
import { FinalDiary } from "../../api/diary";
import Card from "../Calendar/Card";
import HomeCard from "./HomeCard";
import { EmotionLabels } from "../Calendar/EmotionLabels";
import logoImg from "../../assets/images/cocoon_logo.png";

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

	return (
		<div
			ref={containerRef}
			className="flex flex-col justify-start items-center w-full h-full overflow-y-auto bg-white-aneuk"
		>
			<div
				className={`flex flex-col w-full h-full ${
					randomDiary ? "justify-start" : "justify-center"
				} items-center bg-white-aneuk mt-8 mb-80`}
			>
				{!randomDiary && (
					<div className="font-pretendard-bold text-2xl text-black-aneuk mb-8">
						오늘의 일기를 뽑아보세요
					</div>
				)}
				{!isLoading && (
					<HomeCard
						key={randomDiary?.data.diary_id || Math.random()}
						curDiary={randomDiary}
						isFlipped={isFlipped}
						isFlipping={isFlipping}
						setIsFlipped={setIsFlipped}
					/>
				)}
				{isFlipped && (
					<EmotionLabels
						curDiary={randomDiary}
						selectedEmotionId={selectedEmotionId}
						setSelectedEmotionId={setSelectedEmotionId}
						descriptionRef={descriptionRef}
					/>
				)}
				{!isFlipped && (
					<div
						onMouseDown={handleMouseDown}
						onMouseUp={handleMouseUp}
						className={`mt-12 w-[20%] max-w-[220px] aspect-square rounded-2xl bg-white shadow-inner-strong flex items-center justify-center cursor-pointer transition-transform duration-150 overflow-hidden ${
							isImageClicked ? "scale-95" : "scale-100"
						}`}
					>
						<img
							src={logoImg}
							alt="오늘의 일기 카드 뽑기"
							className="w-full h-full object-cover"
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default HomePage;
