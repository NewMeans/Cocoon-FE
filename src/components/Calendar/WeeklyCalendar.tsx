import * as React from "react";
import { DayPicker } from "react-day-picker";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { IconProvider } from "../../utils/IconProvider";
import { formatToYYYYMM, formatToYYYYMMDD } from "../../utils/TimeFormatter";
import { API_CALENDAR } from "../../api/calendar";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function WeeklyCalendar({
	className,
	classNames,
	showOutsideDays = false,
	diaryDates = [],
	setDiaryDates,
	selectedDate,
	onDateChange,
	...props
}: CalendarProps & {
	diaryDates?: string[];
	setDiaryDates: React.Dispatch<React.SetStateAction<string[]>>;
	selectedDate: Date | undefined;
	onDateChange: (date: Date) => void;
}) {
	const [currentWeek, setCurrentWeek] = React.useState<Date>(new Date());

	const startWeek = startOfWeek(currentWeek, { weekStartsOn: 0 });
	const endWeek = endOfWeek(currentWeek, { weekStartsOn: 0 });

	const weekDays: Date[] = [];
	for (
		let date = startWeek;
		date <= endWeek;
		date.setDate(date.getDate() + 1)
	) {
		weekDays.push(new Date(date));
	}

	const monthCounts: Record<number, number> = {};
	weekDays.forEach((day) => {
		const m = day.getMonth();
		monthCounts[m] = (monthCounts[m] || 0) + 1;
	});

	let displayedMonthIndex = weekDays[0].getMonth();
	let maxCount = 0;
	for (const [m, count] of Object.entries(monthCounts)) {
		if (count > maxCount) {
			maxCount = count;
			displayedMonthIndex = parseInt(m, 10);
		}
	}

	const displayedYear =
		weekDays
			.find((day) => day.getMonth() === displayedMonthIndex)
			?.getFullYear() || currentWeek.getFullYear();
	const displayedDate = new Date(displayedYear, displayedMonthIndex, 1);

	const headerText = `${format(displayedDate, "yyyy년 M월")}`;

	const handlePrevWeek = () => {
		const prevWeek = new Date(currentWeek);
		prevWeek.setDate(currentWeek.getDate() - 7);
		setCurrentWeek(prevWeek);
	};

	const handleNextWeek = () => {
		const nextWeek = new Date(currentWeek);
		nextWeek.setDate(currentWeek.getDate() + 7);
		setCurrentWeek(nextWeek);
	};

	React.useEffect(() => {
		const loadInitialData = async () => {
			const tempDate = new Date(
				currentWeek.getTime() - 9 * 60 * 60 * 1000
			);

			const currentYear = tempDate.getFullYear();
			const currentMonthIndex = tempDate.getMonth();

			const prevMonthDate = new Date(
				currentYear,
				currentMonthIndex - 1,
				1
			);
			const currentMonthDate = new Date(
				currentYear,
				currentMonthIndex,
				1
			);
			const nextMonthDate = new Date(
				currentYear,
				currentMonthIndex + 1,
				1
			);

			const prevMonthStr = formatToYYYYMM(prevMonthDate);
			const currentMonthStr = formatToYYYYMM(currentMonthDate);
			const nextMonthStr = formatToYYYYMM(nextMonthDate);

			try {
				const [prevMonthRes, currentMonthRes, nextMonthRes] =
					await Promise.all([
						API_CALENDAR.getMonthDiary(prevMonthStr),
						API_CALENDAR.getMonthDiary(currentMonthStr),
						API_CALENDAR.getMonthDiary(nextMonthStr),
					]);

				const allDiaries = [
					...(prevMonthRes.data.diaries_with_diary || []),
					...(currentMonthRes.data.diaries_with_diary || []),
					...(nextMonthRes.data.diaries_with_diary || []),
				];

				const newDiaryDates = allDiaries.map((diary: any) =>
					formatToYYYYMMDD(new Date(diary.month))
				);

				setDiaryDates(newDiaryDates);
			} catch (error: any) {
				console.error("Error loading initial data: ", error);
			}
		};

		loadInitialData();
	}, [currentWeek, setDiaryDates]);

	const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

	return (
		<div>
			<div className="flex justify-between h-14 items-center px-1">
				<span className="font-pretendard-bold text-xl">
					{headerText}
				</span>
				<div className="flex flex-row space-x-6">
					<button
						onClick={handlePrevWeek}
						className="flex justify-center items-center text-black-aneuk rounded-lg h-[28px] w-[28px]"
					>
						<IconProvider.LeftArrowIcon className="h-[28px] w-[28px]" />
					</button>
					<button
						onClick={handleNextWeek}
						className="flex justify-center items-center text-black-aneuk rounded-lg h-[28px] w-[28px]"
					>
						<IconProvider.RightArrowIcon className="h-[28px] w-[28px]" />
					</button>
				</div>
			</div>

			<div className="grid grid-cols-7 gap-x-2 place-items-center">
				{dayNames.map((dayName, index) => {
					const isCurrentMonth =
						weekDays[index].getMonth() === displayedDate.getMonth();
					return (
						<div
							key={index}
							className={`mb-0.5 font-pretendard-regular text-center text-xs 
              ${
					index === 0 || index === 6
						? "text-[#ED6A5B]"
						: "text-black-aneuk"
				}
              ${!isCurrentMonth ? "opacity-50" : ""}`}
						>
							{dayName}
						</div>
					);
				})}

				{weekDays.map((date, index) => {
					const isCurrentMonth =
						date.getMonth() === displayedDate.getMonth();
					const isSelected =
						selectedDate &&
						date.toDateString() === selectedDate.toDateString();

					return (
						<button
							key={index}
							onClick={() => onDateChange(date)}
							className={`mb-2 w-[90%] aspect-square rounded-xl
              ${
					isSelected
						? "bg-black-aneuk text-white"
						: index === 0 || index === 6
						? `bg-white text-[#ED6A5B] hover:bg-gray-100 ${
								!isCurrentMonth ? "opacity-50" : ""
						  }`
						: `bg-white text-black-aneuk hover:bg-gray-100 ${
								!isCurrentMonth ? "opacity-50" : ""
						  }`
				}`}
						>
							<span className="text-lg font-pretendard-light">
								{format(date, "d")}
							</span>
						</button>
					);
				})}

				{weekDays.map((date, index) => {
					const isCurrentMonth =
						date.getMonth() === displayedDate.getMonth();
					return (
						<div
							key={index}
							className={`w-1.5 h-1.5 ${
								!isCurrentMonth ? "opacity-50" : ""
							}`}
						>
							{diaryDates.includes(
								format(date, "yyyy-MM-dd")
							) && (
								<div className="w-1.5 h-1.5 bg-black-aneuk rounded-full mx-auto"></div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
