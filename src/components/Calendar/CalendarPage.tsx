import React, { useEffect, useState, useRef } from "react";
import { WeeklyCalendar } from "./WeeklyCalendar";
import Card from "./Card";
import { API_CALENDAR } from "../../api/calendar";
import { formatToYYYYMM, formatToYYYYMMDD } from "../../utils/TimeFormatter";
import { FinalDiary } from "../../api/diary";
import { EmotionLabels } from "./EmotionLabels";

const CalendarPage: React.FC = () => {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [diaryDates, setDiaryDates] = useState<string[]>([]);
	const [curDiary, setCurDiary] = useState<FinalDiary | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isFlipped, setIsFlipped] = useState(false);
	const [selectedEmotionId, setSelectedEmotionId] = useState<number | null>(
		null
	);

	const containerRef = useRef<HTMLDivElement>(null);
	const descriptionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const loadInitialData = async () => {
			if (!date) return;
			const tempDate = new Date(date.getTime() - 9 * 60 * 60 * 1000);
			try {
				const formattedMonth = formatToYYYYMM(tempDate);
				const monthResponse = await API_CALENDAR.getMonthDiary(
					formattedMonth
				);
				const diaries = monthResponse.data.diaries_with_diary || [];
				const diaryDates = diaries.map((diary: any) =>
					formatToYYYYMMDD(new Date(diary.month))
				);
				setDiaryDates(diaryDates);

				const formattedDate = formatToYYYYMMDD(tempDate);
				if (diaryDates.includes(formattedDate)) {
					const dateResponse = await API_CALENDAR.getDateDiary(
						formattedDate
					);
					setCurDiary(dateResponse);
				}

				setIsLoading(false);
			} catch (error: any) {
				console.error("Error loading initial data: ", error);
				setIsLoading(false);
			}
		};

		loadInitialData();
	}, []);

	useEffect(() => {
		const loadDateDiary = async () => {
			if (!date) return;
			const tempDate = new Date(date.getTime() - 9 * 60 * 60 * 1000);

			const formattedDate = formatToYYYYMMDD(tempDate);
			if (!diaryDates.includes(formattedDate)) {
				if (curDiary != null) setCurDiary(null);
				return;
			}

			try {
				const response = await API_CALENDAR.getDateDiary(formattedDate);
				setCurDiary(response);
			} catch (error: any) {
				console.error("Error loading date diary: ", error);
			}
		};

		if (diaryDates.length > 0) {
			loadDateDiary();
		}
	}, [date, diaryDates]);

	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTo({
				top: 0,
				behavior: "smooth",
			});
		}
		setSelectedEmotionId(null);
	}, [date]);

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

			const extraScroll = 100;

			containerRef.current.scrollTo({
				top:
					descriptionPosition - containerScrollPosition + extraScroll,
				behavior: "smooth",
			});
		}
	}, [selectedEmotionId]);

	return (
		<div className="flex flex-col w-full h-full bg-white-aneuk">
			<div className="flex-shrink-0 w-full p-4 z-20 rounded-b-xl bg-white shadow-md">
				<WeeklyCalendar
					mode="single"
					selectedDate={date}
					onDateChange={setDate}
					className="w-full"
					diaryDates={diaryDates}
					setDiaryDates={setDiaryDates}
				/>
			</div>
			<div
				ref={containerRef}
				className="flex flex-col flex-grow min-h-0 justify-start items-center bg-white-aneuk overflow-y-auto"
			>
				<div className="flex flex-col items-center w-full px-2 pb-20 gap-4">
					{!isLoading && (
						<Card
							curDiary={curDiary}
							isFlipped={isFlipped}
							setIsFlipped={setIsFlipped}
						/>
					)}
					{isFlipped && (
						<EmotionLabels
							curDiary={curDiary}
							selectedEmotionId={selectedEmotionId}
							setSelectedEmotionId={setSelectedEmotionId}
							descriptionRef={descriptionRef}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default CalendarPage;
