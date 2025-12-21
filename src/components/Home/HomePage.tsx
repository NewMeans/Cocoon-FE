import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconProvider } from "../../utils/IconProvider";

/*
기존 홈 기능(랜덤 일기 카드, 감정 라벨) 요청에 따라 삭제하지 않고 주석으로 보관합니다.
아래 코드는 참고용이며, 현재 렌더는 페르소나 체험 카드로 대체되었습니다.

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
  const [selectedEmotionId, setSelectedEmotionId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const handleRandomButton = () => { ... };
  useEffect(() => { ... }, []);
  return (
    <div ref={containerRef}> ... 기존 홈 UI ... </div>
  );
};
export default HomePage;
*/

const HomePage: React.FC = () => {
	const navigate = useNavigate();
	const phrases = useMemo(
		() => [
			"우리집 강아지와",
			"우리집 고양이와",
			"최애 아이돌과",
			"최애 캐릭터와",
		],
		[]
	);
	const ticker = useMemo(() => [...phrases, phrases[0]], [phrases]);
	const [tickerIndex, setTickerIndex] = useState(0);
	const [instant, setInstant] = useState(false);
	const ROW_HEIGHT = 30; // px, tighter line height for ticker

	useEffect(() => {
		let intervalId: number | undefined;
		let resetId: number | undefined;
		let instantOffId: number | undefined;

		intervalId = window.setInterval(() => {
			setTickerIndex((prev) => {
				const next = prev + 1;
				if (next >= ticker.length) {
					return ticker.length - 1;
				}
				// If we're about to land on the duplicate (last item), schedule a snap reset after the slide.
				if (next === ticker.length - 1) {
					resetId = window.setTimeout(() => {
						setInstant(true);
						setTickerIndex(0);
						instantOffId = window.setTimeout(
							() => setInstant(false),
							10
						);
					}, 650); // slightly longer than the transition
				}
				return next;
			});
		}, 2000);

		return () => {
			if (intervalId) clearInterval(intervalId);
			if (resetId) clearTimeout(resetId);
			if (instantOffId) clearTimeout(instantOffId);
		};
	}, [ticker.length]);

	return (
		<div className="flex h-full w-full items-center justify-center bg-white px-6">
			<div className="relative w-full max-w-[440px] overflow-hidden rounded-[28px] border border-gray-100 bg-gradient-to-br from-[#F9FAFF] via-white to-[#F4F6FF] p-6 shadow-sm">
				<div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(49,130,246,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(240,68,82,0.06),transparent_35%)]" />
				<div className="relative flex flex-col gap-5">
					<div className="flex items-center gap-2 text-xs font-pretendard-medium text-[#8B95A1]">
						<span>Persona Studio · Beta</span>
					</div>
					<div className="space-y-1.5">
						<div className="text-2xl font-pretendard-bold text-black-aneuk leading-[1.15]">
							페르소나 설정하고
						</div>
						<div className="flex items-baseline gap-1.5 text-2xl font-pretendard-bold text-black-aneuk leading-[1.15]">
							<span
								className="relative inline-block align-bottom overflow-hidden"
								style={{
									height: `${ROW_HEIGHT}px`,
									minWidth: "150px",
									perspective: "700px",
								}}
							>
								<div
									className="flex flex-col"
									style={{
										transform: `translateY(-${
											tickerIndex * ROW_HEIGHT
										}px)`,
										transition: instant
											? "none"
											: "transform 0.6s cubic-bezier(0.25, 0.8, 0.4, 1)",
									}}
								>
									{ticker.map((phrase, idx) => (
										<div
											key={`${phrase}-${idx}`}
											className="flex items-center text-left"
											style={{
												backfaceVisibility: "hidden",
												height: `${ROW_HEIGHT}px`,
											}}
										>
											{phrase}
										</div>
									))}
								</div>
							</span>
							<span className="leading-snug">대화하기</span>
						</div>
						<p className="text-sm text-[#6B7684] leading-relaxed whitespace-pre-line">
							간편하게 설계된 페르소나 설정 플로우를 체험해보세요.
							{"\n"}말투, 성격, 시그니처 버릇까지 한 번에
							완성해요.
						</p>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<BadgeStat label="말투 프리셋" value="4종" />
						<BadgeStat label="성격 키워드" value="9개" />
					</div>
					<button
						onClick={() => navigate("/persona")}
						className="mt-2 flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#191F28] text-white font-pretendard-bold text-base hover:brightness-110 transition"
					>
						<IconProvider.FileEditIcon className="h-5 w-5" />
						페르소나 설정 시작하기
					</button>
					<div className="text-xs text-gray-400 text-center leading-relaxed">
						페르소나 설정은 베타버전으로 결과가 챗봇에 적용되지
						않습니다.
					</div>
				</div>
			</div>
		</div>
	);
};

const BadgeStat: React.FC<{ label: string; value: string }> = ({
	label,
	value,
}) => {
	return (
		<div className="rounded-2xl border border-[#EEF1F5] bg-white/90 px-3 py-3 shadow-[0_6px_18px_rgba(0,0,0,0.04)]">
			<div className="text-xs text-[#8B95A1] font-pretendard-medium">
				{label}
			</div>
			<div className="text-lg font-pretendard-bold text-[#191F28]">
				{value}
			</div>
		</div>
	);
};

export default HomePage;
