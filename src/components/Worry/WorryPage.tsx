import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { WORRY_SAMPLE_DATA, WorryCard, WorryStatus } from "./worrySamples";
import { IconProvider } from "../../utils/IconProvider";
import clsx from "clsx";

const STORAGE_KEY = "cocoon-worry-cards";

const WorryPage: React.FC = () => {
	const [worries, setWorries] = useState<WorryCard[]>([]);
	const [selectedWorry, setSelectedWorry] = useState<WorryCard | null>(null);
	const [newWorry, setNewWorry] = useState("");

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

	const pendingWorries = useMemo(
		() => worries.filter((w) => w.status === "pending"),
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
		if (selectedWorry) {
			const original = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = original;
			};
		}
	}, [selectedWorry]);

	return (
		<div className="flex flex-col w-full h-full overflow-y-auto bg-white-aneuk px-4 py-6 space-y-6">
			<section className="space-y-1">
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

			<section className="grid grid-cols-2 gap-2">
				<StatCard
					label="걱정한 횟수"
					value={`${stats.total}`}
					sub="누적 기록"
				/>
				<StatCard
					label="현실이 된 걱정"
					value={`${stats.realized}`}
					sub="예상보다 적어요"
				/>
				<StatCard
					label="해결된 걱정"
					value={`${stats.resolved}`}
					sub="스스로 이겨낸 순간"
				/>
				<StatCard
					label="현실이 될 확률"
					value={`${stats.probability}%`}
					sub="데이터로 확인하는 기우"
				/>
			</section>

			<section className="bg-white rounded-3xl border border-gray-100 p-5 space-y-4">
				<div className="space-y-1">
					<p className="text-base font-pretendard-bold text-black-aneuk">
						걱정되는 게 있나요?
					</p>
					<p className="text-xs text-gray-400">
						오늘 떠오른 걱정을 적어보세요.
					</p>
				</div>
				<textarea
					className="w-full h-28 rounded-2xl border border-gray-200 p-4 text-base focus:outline-none focus:ring-1 focus:ring-black-aneuk/40 resize-none bg-white"
					placeholder="요즘 머리가 너무 아픈데 혹시 큰 병이면 어쩌지?"
					value={newWorry}
					onChange={(e) => setNewWorry(e.target.value)}
				/>
				<div className="flex items-center justify-between text-xs text-gray-400">
					<div>요약 · {newWorry ? buildSummary(newWorry) : "-"}</div>
					<button
						onClick={handleAddWorry}
						className="px-4 py-2 rounded-2xl bg-black-aneuk text-white font-pretendard-medium disabled:opacity-30"
						disabled={!newWorry.trim()}
					>
						기록하기
					</button>
				</div>
			</section>

			<section className="flex-1">
				<div className="flex items-center justify-between mb-3">
					<div>
						<p className="text-base font-pretendard-bold text-black-aneuk">
							걱정 되돌아보기
						</p>
						<p className="text-xs text-gray-400">
							카드를 뽑아 과거의 걱정을 점검하세요.
						</p>
					</div>
					<div className="text-sm text-gray-500 font-pretendard-medium">
						남은 걱정 {pendingWorries.length}개
					</div>
				</div>
				<div className="relative h-64 overflow-y-auto">
					{pendingWorries.length === 0 ? (
						<div className="flex items-center justify-center h-full text-gray-400">
							모든 걱정을 정리했어요!
						</div>
					) : (
						<div className="relative pb-24">
							{pendingWorries.map((worry, index) => (
								<button
									key={worry.id}
									className={clsx(
										"w-full h-16 bg-white text-black-aneuk rounded-2xl flex items-center px-4 text-left mb-3 border border-gray-100 hover:border-black-aneuk transition-all duration-200",
										"overflow-hidden"
									)}
									style={{
										transform: `translateY(${
											index * -8
										}px)`,
										zIndex: pendingWorries.length - index,
									}}
									onClick={() => setSelectedWorry(worry)}
								>
									<div className="font-pretendard-medium text-sm truncate">
										{worry.summary}
									</div>
								</button>
							))}
						</div>
					)}
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
							<p className="font-pretendard-medium text-black-aneuk whitespace-pre-wrap text-sm leading-6 flex-1">
								{selectedWorry.content}
							</p>
							<div className="flex gap-3">
								<button
									className="flex-1 h-12 rounded-2xl border border-gray-200 text-sm font-pretendard-medium text-green-600"
									onClick={() => updateStatus("resolved")}
								>
									괜찮았어요
								</button>
								<button
									className="flex-1 h-12 rounded-2xl border border-gray-200 text-sm font-pretendard-medium text-green-600"
									onClick={() => updateStatus("realized")}
								>
									현실이 됐어요
								</button>
							</div>
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

const StatCard: React.FC<{
	label: string;
	value: string;
	sub: string;
}> = ({ label, value, sub }) => (
	<div className="bg-white rounded-2xl border border-gray-100 px-4 py-3 space-y-1">
		<div className="text-xs text-gray-400">{label}</div>
		<div className="text-xl font-pretendard-bold text-black-aneuk">
			{value}
		</div>
		<div className="text-[11px] text-gray-400">{sub}</div>
	</div>
);

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

export default WorryPage;
