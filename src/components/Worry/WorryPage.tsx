import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { WORRY_SAMPLE_DATA, WorryCard, WorryStatus } from "./worrySamples";
import { IconProvider } from "../../utils/IconProvider";
import clsx from "clsx";

const STORAGE_KEY = "cocoon-worry-cards";
type ComposePhase = "rest" | "out" | "in-start" | "in-end";

const WorryPage: React.FC = () => {
	const [worries, setWorries] = useState<WorryCard[]>([]);
	const [selectedWorry, setSelectedWorry] = useState<WorryCard | null>(null);
	const [newWorry, setNewWorry] = useState("");
	const [isDeckOpen, setIsDeckOpen] = useState(false);
	const [isCompactWidth, setIsCompactWidth] = useState(false);
	const [animatedProbability, setAnimatedProbability] = useState(0);
	const [gradientShift, setGradientShift] = useState(false);
	const [isComposeOpen, setIsComposeOpen] = useState(false);
	const [composePhase, setComposePhase] = useState<ComposePhase>("rest");
	const [sessionCount, setSessionCount] = useState(0);

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				setWorries(JSON.parse(stored));
				return;
			} catch (error) {
				console.error("Failed to parse worry cards:", error);
			}
		}
		setWorries(WORRY_SAMPLE_DATA);
	}, []);

	useEffect(() => {
		if (worries.length > 0) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(worries));
		}
	}, [worries]);

	const stats = useMemo(() => {
		const total = worries.length;
		const realized = worries.filter((w) => w.status === "realized").length;
		const resolved = worries.filter((w) => w.status === "resolved").length;
		const pending = worries.filter((w) => w.status === "pending").length;
		const probability = total ? Math.round((realized / total) * 100) : 0;
		return { total, realized, resolved, pending, probability };
	}, [worries]);

	useEffect(() => {
		let frame: number;
		const from = 0;
		const to = stats.probability;
		const duration = 1200;
		const start = performance.now();

		const tick = (now: number) => {
			const progress = Math.min((now - start) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setAnimatedProbability(Math.round(from + (to - from) * eased));
			if (progress < 1) {
				frame = requestAnimationFrame(tick);
			}
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [stats.probability]);

	useEffect(() => {
		const interval = setInterval(
			() => setGradientShift((prev) => !prev),
			9000
		);
		return () => clearInterval(interval);
	}, []);

	const sortedWorries = useMemo(
		() =>
			[...worries].sort(
				(a, b) =>
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime()
			),
		[worries]
	);

	const handleAddWorry = () => {
		if (!newWorry.trim()) {
			return;
		}
		const summary = buildSummary(newWorry);
		const freshWorry: WorryCard = {
			id: generateId(),
			summary,
			content: newWorry.trim(),
			createdAt: new Date().toISOString(),
			status: "pending",
		};
		setWorries((prev) => [freshWorry, ...prev]);
		setNewWorry("");
	};

	const removeWorry = (id: string) => {
		setWorries((prev) => prev.filter((w) => w.id !== id));
		setSelectedWorry(null);
	};

	const updateStatus = (status: WorryStatus) => {
		if (!selectedWorry) return;
		setWorries((prev) =>
			prev.map((w) => (w.id === selectedWorry.id ? { ...w, status } : w))
		);
		setSelectedWorry(null);
	};

	useEffect(() => {
		const updateCompact = () => setIsCompactWidth(window.innerWidth < 420);
		updateCompact();
		window.addEventListener("resize", updateCompact);
		return () => window.removeEventListener("resize", updateCompact);
	}, []);

	useEffect(() => {
		const hasModal = selectedWorry || isComposeOpen;
		if (hasModal) {
			const original = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = original;
			};
		}
	}, [selectedWorry, isComposeOpen]);

	useEffect(() => {
		let rafId: number | undefined;
		let safetyId: number | undefined;
		if (isComposeOpen) {
			setSessionCount(0);
			setComposePhase("in-start");
			rafId = requestAnimationFrame(() => setComposePhase("in-end"));
			safetyId = window.setTimeout(() => setComposePhase("in-end"), 200);
		} else {
			setComposePhase("rest");
			setSessionCount(0);
		}
		return () => {
			if (rafId) cancelAnimationFrame(rafId);
			if (safetyId) clearTimeout(safetyId);
		};
	}, [isComposeOpen]);

	const composeCardStyle = useMemo(() => {
		const base: React.CSSProperties = {
			aspectRatio: isCompactWidth ? undefined : "4 / 3",
			maxWidth: "min(420px, calc(100vw - 48px))",
			transform: "translateY(0)",
			opacity: 1,
		};

		if (composePhase === "out") {
			return {
				...base,
				transition: "transform 0.35s ease, opacity 0.35s ease",
				transform: "translateY(-24px)",
				opacity: 0,
			};
		}

		if (composePhase === "in-start") {
			return {
				...base,
				transition: "none",
				transform: "translateY(48px)",
				opacity: 0,
			};
		}

		if (composePhase === "in-end") {
			return {
				...base,
				transition: "transform 0.35s ease, opacity 0.35s ease",
				transform: "translateY(0)",
				opacity: 1,
			};
		}

		return { ...base, transition: "none" };
	}, [composePhase, isCompactWidth]);

	return (
		<div className="flex flex-col w-full h-full overflow-y-auto bg-white px-4 py-6 pb-32 space-y-4">
			<section className="space-y-1 px-4">
				<div className="flex items-center space-x-2">
					<h1 className="text-xl font-pretendard-bold text-black-aneuk">
						걱정카드
					</h1>
					<span className="text-xs text-purple-500 font-gowun-bold tracking-wide">
						Beta
					</span>
				</div>
				<p className="text-xs text-gray-400">
					현재는 베타버전이라 샘플 걱정이 채워져 있어요.
				</p>
			</section>

			<section className="pt-2">
				<div className="grid grid-cols-3 rounded-2xl border border-[#F2F4F6] bg-white divide-x divide-[#F2F4F6] shadow-sm">
					<FlatStat
						label="지금까지 한 걱정"
						value={`${stats.total}`}
					/>
					<FlatStat
						label="괜찮았던 걱정"
						value={`${stats.resolved}`}
					/>
					<FlatStat
						label="현실이 된 걱정"
						value={`${stats.realized}`}
					/>
				</div>
			</section>

			<section className="w-full">
				<ProbabilityCard
					probability={animatedProbability}
					comparison={buildComparisonText(stats.probability)}
					shifted={gradientShift}
				/>
			</section>

			<section className="w-full">
				<button
					onClick={() => setIsComposeOpen(true)}
					className="w-full h-14 rounded-2xl bg-[#191F28] text-white font-pretendard-bold text-base hover:brightness-110 transition flex items-center justify-center gap-2"
				>
					<IconProvider.FileEditIcon className="w-5 h-5" />새 카드
					작성하기
				</button>
			</section>

			<section className="flex-1 w-full">
				<button
					type="button"
					onClick={() => setIsDeckOpen((prev) => !prev)}
					className="w-full flex items-center justify-between bg-white rounded-2xl border border-gray-100 px-4 py-3"
				>
					<div className="text-left">
						<p className="text-base font-pretendard-bold text-black-aneuk">
							걱정 되돌아보기
						</p>
						<p className="text-xs text-gray-400">
							카드를 뽑아 과거의 걱정을 점검하세요.
						</p>
					</div>
					<div className="flex items-center space-x-2 text-sm text-gray-500 font-pretendard-medium">
						<span>총 {worries.length}개</span>
						<IconProvider.DownArrowIcon
							className={clsx(
								"w-5 h-5 transition-transform",
								isDeckOpen && "rotate-180"
							)}
						/>
					</div>
				</button>
				<div
					className={clsx(
						"transition-[max-height] duration-300 overflow-hidden",
						isDeckOpen ? "max-h-[1200px] mt-4" : "max-h-0"
					)}
				>
					<div className="relative space-y-3 pb-8">
						{sortedWorries.length === 0 ? (
							<div className="flex items-center justify-center h-full text-gray-400">
								모든 걱정을 정리했어요!
							</div>
						) : (
							sortedWorries.map((worry) => (
								<button
									key={worry.id}
									className={clsx(
										"w-full min-h-16 bg-white text-black-aneuk rounded-2xl flex justify-between items-center px-4 text-left border border-gray-100 hover:border-black-aneuk transition-all duration-200",
										"overflow-hidden"
									)}
									onClick={() => setSelectedWorry(worry)}
								>
									<div className="font-pretendard-medium text-sm truncate">
										{worry.summary}
									</div>
									<StatusBadge status={worry.status} />
								</button>
							))
						)}
					</div>
				</div>
			</section>

			{selectedWorry &&
				createPortal(
					<div className="fixed inset-0 bg-black/40 flex flex-col items-center justify-center px-4 z-50">
						<div
							className="bg-white rounded-[28px] border border-gray-100 px-5 py-5 w-full flex flex-col gap-4"
							style={{
								aspectRatio: "4 / 3",
								maxWidth: "min(360px, calc(100vw - 48px))",
							}}
						>
							<div className="space-y-1">
								<p className="text-base font-pretendard-bold text-black-aneuk">
									이 걱정이 현실이 되었나요?
								</p>
								<p className="text-xs text-gray-400">
									{formatRelative(selectedWorry.createdAt)}
								</p>
							</div>
							<StatusBadge
								status={selectedWorry.status}
								dense
								className="self-start"
							/>
							<p className="font-pretendard-medium text-black-aneuk whitespace-pre-wrap text-sm leading-6 flex-1">
								{selectedWorry.content}
							</p>
							{selectedWorry.status === "pending" ? (
								<div className="flex gap-3">
									<button
										className="flex-1 h-12 rounded-2xl border border-gray-200 text-sm font-pretendard-medium text-green-600"
										onClick={() => updateStatus("resolved")}
									>
										괜찮았어요
									</button>
									<button
										className="flex-1 h-12 rounded-2xl border border-gray-200 text-sm font-pretendard-medium text-black-aneuk"
										onClick={() => updateStatus("realized")}
									>
										현실이 됐어요
									</button>
								</div>
							) : (
								<p className="text-xs text-gray-500">
									이미 기록된 걱정이에요. 필요하면 삭제할 수
									있어요.
								</p>
							)}
						</div>
						<button
							onClick={() => removeWorry(selectedWorry.id)}
							className="mt-4 px-6 py-2 rounded-full border text-xs border-red-300 text-red-500 font-pretendard-medium bg-white"
						>
							걱정 삭제하기
						</button>
						<button
							className="mt-3 text-xs text-gray-200 underline"
							onClick={() => setSelectedWorry(null)}
						>
							닫기
						</button>
					</div>,
					document.body
				)}

			{isComposeOpen &&
				createPortal(
					<div
						className="fixed inset-0 bg-black/65 flex flex-col items-center justify-center px-4 z-50"
						onClick={() => setIsComposeOpen(false)}
					>
						<div className="text-center text-white mb-4 text-lg font-pretendard-bold drop-shadow-sm pointer-events-none">
							{sessionCount}개의 걱정이 기록됐어요
						</div>
						<div
							className="bg-white rounded-[24px] border border-gray-100 px-5 py-5 mb-12 w-full flex flex-col gap-2"
							style={composeCardStyle}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="space-y-1">
								<p className="ml-2 text-xl font-pretendard-bold text-black-aneuk">
									새 걱정카드
								</p>
								<p className="ml-2 text-sm font-pretendard-light text-black-aneuk">
									머리 속 걱정을 하나씩 적어보세요
								</p>
							</div>
							<textarea
								id="new-worry"
								name="new-worry"
								className="w-full min-h-[140px] flex-1 placeholder-gray-400 rounded-2xl border border-gray-200 p-4 text-base focus:outline-none focus:ring-1 focus:ring-black-aneuk/40 resize-none bg-white"
								placeholder="요즘 머리가 너무 아픈데 혹시 큰 병이면 어쩌지?"
								value={newWorry}
								onChange={(e) => setNewWorry(e.target.value)}
							/>
							<div className="flex items-center gap-2">
								<button
									onClick={() => setIsComposeOpen(false)}
									className="h-12 flex-1 rounded-2xl border border-gray-200 text-sm font-pretendard-medium text-black-aneuk"
								>
									닫기
								</button>
								<button
									onClick={() => {
										if (!newWorry.trim()) return;
										setComposePhase("out");
										setTimeout(() => {
											handleAddWorry();
											setSessionCount((prev) => prev + 1);
											setComposePhase("in-start");
											requestAnimationFrame(() =>
												requestAnimationFrame(() =>
													setComposePhase("in-end")
												)
											);
											setTimeout(
												() => setComposePhase("rest"),
												450
											);
										}, 280);
									}}
									className="h-12 flex-1 rounded-2xl bg-black-aneuk text-sm text-white font-pretendard-bold disabled:opacity-30"
									disabled={!newWorry.trim()}
								>
									기록하기
								</button>
							</div>
						</div>
					</div>,
					document.body
				)}
		</div>
	);
};

const buildSummary = (content: string) => {
	const trimmed = content.trim();
	if (!trimmed) return "걱정";
	const base = trimmed.slice(0, 8).replace(/\n/g, " ");
	const summary = `${base}에 관한 걱정`;
	return summary.length > 15 ? `${summary.slice(0, 15)}…` : summary;
};

const FlatStat: React.FC<{
	label: string;
	value: string;
}> = ({ label, value }) => (
	<div className="flex flex-col items-center justify-center bg-white py-3 px-2">
		<div className="text-[12px] text-[#8B95A1] font-pretendard-regular">
			{label}
		</div>
		<div className="mt-1 text-[20px] font-pretendard-bold text-[#191F28] leading-none">
			{value}
		</div>
	</div>
);

const ProbabilityCard: React.FC<{
	probability: number;
	comparison: string;
	shifted: boolean;
}> = ({ probability, comparison, shifted }) => {
	return (
		<div
			className="relative overflow-hidden rounded-3xl border border-[#EEF1F5] shadow-sm p-5 transition-[background-position]"
			style={{
				background:
					"linear-gradient(135deg, #F9FAFF 0%, #FCF9FF 50%, #F9FAFF 100%)",
				backgroundSize: "200% 200%",
				backgroundPosition: shifted ? "100% 0%" : "0% 100%",
				transition: "background-position 10s ease-in-out",
			}}
		>
			<div className="flex flex-col gap-3 min-h-[140px]">
				<div className="flex flex-col">
					<div className="text-sm font-pretendard-bold text-black-aneuk">
						걱정이 현실이 될 확률
					</div>
					<div className="mt-1 text-xl text-gray-500 font-gowun-bold leading-relaxed whitespace-pre-line">
						{comparison}
					</div>
				</div>
				<div className="flex-1 flex items-end justify-end">
					<div className="text-[48px] font-pretendard-bold text-[#3182F6] leading-none">
						{probability}%
					</div>
				</div>
			</div>
		</div>
	);
};

const buildComparisonText = (probability: number) => {
	if (probability < 1) {
		return "벼락을 두 번 맞을 \n확률보다 낮아요.";
	}
	if (probability <= 5) {
		return "굴을 먹다가 \n진주를 발견할 확률보다 낮아요.";
	}
	if (probability <= 15) {
		return "비행기가 비행 중 \n번개에 맞을 확률보다 낮아요.";
	}
	if (probability <= 25) {
		return "자판기에서 \n다른 음료가 나올 확률보다 낮아요.";
	}
	if (probability <= 50) {
		return "세탁기에서 \n양말 한 짝이 사라질 확률보다 낮아요.";
	}
	return "꼭 필요한 걱정만 골라서 하고 계시네요!";
};

const formatRelative = (createdAt: string) => {
	const date = new Date(createdAt);
	const diff = Date.now() - date.getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));
	if (days <= 0) {
		return "오늘 기록한 걱정이에요.";
	}
	return `${days}일 전에 했던 고민이에요.`;
};

const generateId = () =>
	`worry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const StatusBadge: React.FC<{
	status: WorryStatus;
	dense?: boolean;
	className?: string;
}> = ({ status, dense = false, className }) => {
	const config: Record<WorryStatus, { label: string; classes: string }> = {
		pending: {
			label: "진행 중",
			classes: "bg-gray-100 text-gray-600",
		},
		resolved: {
			label: "괜찮았어요",
			classes: "bg-green-100 text-green-600",
		},
		realized: {
			label: "현실이 됐어요",
			classes: "bg-red-100 text-red-600",
		},
	};

	const { label, classes } = config[status];
	return (
		<div
			className={clsx(
				"px-3 rounded-full font-pretendard-medium",
				dense ? "py-0.5 text-xs" : "py-1 text-sm",
				classes,
				className
			)}
		>
			{label}
		</div>
	);
};

export default WorryPage;
