import React, { useMemo, useRef, useState } from "react";
import {
	Camera,
	ChevronLeft,
	ChevronRight,
	Sparkles,
	Wand2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type ToneOption = {
	id: string;
	title: string;
	example: string;
	accentFrom: string;
	accentTo: string;
};

type PersonaState = {
	name: string;
	relationship: string;
	toneId: string;
	personality: string[];
	signatureEnding: string;
	signatureLine: string;
};

const toneOptions: ToneOption[] = [
	{
		id: "friendly",
		title: "다정하고 친근하게",
		example: "오늘 어땠어? 밥은 먹었고?",
		accentFrom: "#A6C8FF",
		accentTo: "#F1E4FF",
	},
	{
		id: "polite",
		title: "예의 바르고 공손하게",
		example: "오늘 하루는 어떠셨나요?",
		accentFrom: "#C9D9FF",
		accentTo: "#DAF2FF",
	},
	{
		id: "tsundere",
		title: "조금은 까칠하게",
		example: "야, 일기는 썼냐?",
		accentFrom: "#FFC7E3",
		accentTo: "#FFE3C7",
	},
	{
		id: "cute",
		title: "애교 넘치고 귀엽게",
		example: "오늘 뭐 했어? 나 너무 궁금해!",
		accentFrom: "#FFD7E8",
		accentTo: "#FFF4E8",
	},
];

const personalityPool = [
	"애교 많은",
	"시크한",
	"엉뚱한",
	"진지한",
	"위로해주는",
	"장난꾸러기",
	"감성적인",
	"논리적인",
	"열정적인",
];

const steps = [
	{ key: "identity", label: "정체성 정의" },
	{ key: "relationship", label: "호칭 설정" },
	{ key: "tone", label: "말투 선택" },
	{ key: "personality", label: "성격 키워드" },
	{ key: "signature", label: "시그니처 말버릇" },
	{ key: "preview", label: "미리보기" },
];

const PersonaSetupPage: React.FC = () => {
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(0);
	const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
	const [persona, setPersona] = useState<PersonaState>({
		name: "",
		relationship: "",
		toneId: "",
		personality: [],
		signatureEnding: "",
		signatureLine: "",
	});
	const [tonePolish, setTonePolish] = useState(50);
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const activeTone = useMemo(
		() => toneOptions.find((tone) => tone.id === persona.toneId),
		[persona.toneId]
	);

	const accentColor = useMemo(
		() => activeTone?.accentFrom ?? "#E5E7EB",
		[activeTone?.accentFrom]
	);

	const canProceed = useMemo(() => {
		if (currentStep === 0) return persona.name.trim().length > 0;
		if (currentStep === 1) return persona.relationship.trim().length > 0;
		if (currentStep === 2) return persona.toneId.length > 0;
		if (currentStep === 3) return persona.personality.length > 0;
		if (currentStep === 4)
			return (
				persona.signatureEnding.trim().length > 0 ||
				persona.signatureLine.trim().length > 0
			);
		return true;
	}, [
		currentStep,
		persona.name,
		persona.relationship,
		persona.toneId,
		persona.personality.length,
		persona.signatureEnding,
		persona.signatureLine,
	]);

	const handleNext = () => {
		if (!canProceed) return;
		if (currentStep === steps.length - 1) {
			navigate("/chat");
			return;
		}
		setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
	};

	const handlePrevious = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 0));
	};

	const togglePersonality = (trait: string) => {
		setPersona((prev) => {
			const exists = prev.personality.includes(trait);
			if (exists) {
				return {
					...prev,
					personality: prev.personality.filter((t) => t !== trait),
				};
			}
			if (prev.personality.length >= 3) return prev;
			return { ...prev, personality: [...prev.personality, trait] };
		});
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onloadend = () => {
			if (typeof reader.result === "string") {
				setAvatarPreview(reader.result);
			}
		};
		reader.readAsDataURL(file);
	};

	const nameLabel = persona.name || "???";
	const userLabel = persona.relationship || "당신";

	const generatedPreviewLine = useMemo(() => {
		if (persona.signatureLine.trim()) return persona.signatureLine.trim();
		const base = activeTone?.example ?? "오늘 하루는 어땠어?";
		const suffix = persona.signatureEnding.trim();
		const polished =
			tonePolish > 50
				? " 조금 더 부드럽게"
				: tonePolish < 50
				? " 살짝 직설적으로"
				: "";
		return `${userLabel}! ${base.replace("?", "")}${
			polished ? polished : ""
		}${suffix ? ` ${suffix}` : ""}`;
	}, [
		activeTone?.example,
		persona.signatureEnding,
		persona.signatureLine,
		tonePolish,
		userLabel,
	]);

	const systemPromptPreview = useMemo(() => {
		const traitsText =
			persona.personality.length > 0
				? persona.personality.join(", ")
				: "아직 고르지 않음";
		const toneText = activeTone?.title ?? "친근하게";
		const ending = persona.signatureEnding.trim();
		const endingText = ending
			? `모든 문장의 끝에 '${ending}'을 붙인다.`
			: "사용자가 입력한 말투를 유지한다.";
		return [
			`당신은 '${nameLabel}'입니다.`,
			`사용자를 '${userLabel}'이라고 부르세요.`,
			`말투는 ${toneText}를 기본으로 합니다.`,
			`성격 키워드: ${traitsText}.`,
			endingText,
			"사용자의 일기를 듣고 맞춤형 리액션을 보여주세요.",
		].join("\n");
	}, [
		activeTone?.title,
		nameLabel,
		persona.personality,
		persona.signatureEnding,
		userLabel,
	]);

	const renderStepContent = () => {
		switch (currentStep) {
			case 0:
				return (
					<div className="w-full max-w-[440px] bg-white p-5">
						<div className="mt-2 text-2xl font-pretendard-bold text-black-aneuk whitespace-pre-line">
							{`오늘부터 매일\n대화할 상대는 누구인가요?`}
						</div>
						<div className="mt-4 space-y-3">
							<input
								value={persona.name}
								onChange={(e) =>
									setPersona((prev) => ({
										...prev,
										name: e.target.value,
									}))
								}
								placeholder="이름을 입력해주세요"
								className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 text-base font-pretendard-medium text-black-aneuk shadow-inner focus:border-black-aneuk focus:outline-none"
							/>
						</div>
					</div>
				);
			case 1:
				return (
					<div className="w-full max-w-[440px] bg-white p-5">
						<div className="text-2xl font-pretendard-bold text-black-aneuk whitespace-pre-line">
							{`${nameLabel}는 당신을\n뭐라고 부르면 될까요?`}
						</div>
						<div className="mt-4 space-y-3">
							<input
								maxLength={10}
								value={persona.relationship}
								onChange={(e) =>
									setPersona((prev) => ({
										...prev,
										relationship: e.target.value,
									}))
								}
								placeholder="누나, 형, 주인님, [이름]아, 자네"
								className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 text-base font-pretendard-medium text-black-aneuk shadow-inner focus:border-black-aneuk focus:outline-none"
							/>
							{persona.relationship && (
								<div className="flex items-start gap-2 px-3 text-sm text-black-aneuk">
									<div className="flex flex-col gap-1">
										<span className="text-xs text-slate-500">
											호칭은 언제든 다시 바꿀 수 있어요.
										</span>
									</div>
								</div>
							)}
						</div>
					</div>
				);
			case 2:
				return (
					<div className="w-full max-w-[440px] bg-white p-5">
						<div className="text-2xl font-pretendard-bold text-black-aneuk whitespace-pre-line">
							{`${nameLabel}는 당신에게\n어떤 말투를 쓰나요?`}
						</div>
						<div className="mt-4 grid grid-cols-1 gap-3">
							{toneOptions.map((tone) => {
								const selected = persona.toneId === tone.id;
								return (
									<button
										key={tone.id}
										onClick={() => {
											setPersona((prev) => ({
												...prev,
												toneId: tone.id,
											}));
											setTimeout(() => handleNext(), 120);
										}}
										className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
											selected
												? "border-black-aneuk bg-black-aneuk/5 shadow-sm"
												: "border-black-aneuk/10 bg-white hover:border-black-aneuk/20"
										}`}
									>
										<div className="flex items-center justify-between">
											<span className="text-xs font-pretendard-medium text-slate-500">
												말투 선택
											</span>
											<div
												className="h-2.5 w-2.5 rounded-full"
												style={{
													background: `linear-gradient(135deg, ${tone.accentFrom}, ${tone.accentTo})`,
													boxShadow: `0 0 0 4px ${tone.accentFrom}20`,
												}}
											/>
										</div>
										<div className="mt-1 text-lg font-pretendard-bold text-black-aneuk">
											{tone.title}
										</div>
										<p className="mt-1 text-sm font-pretendard-regular text-slate-600">
											"{tone.example}"
										</p>
									</button>
								);
							})}
						</div>
					</div>
				);
			case 3:
				return (
					<div className="w-full max-w-[440px] bg-white p-5">
						<div className="text-2xl font-pretendard-bold text-black-aneuk whitespace-pre-line">
							{`${nameLabel}의 성격을\n가장 잘 나타내는 단어를 골라주세요.`}
						</div>
						<p className="mt-2 text-sm text-slate-500">
							최대 3개까지 선택할 수 있어요.
						</p>
						<div className="mt-3 flex flex-wrap gap-2">
							{personalityPool.map((trait) => {
								const selected =
									persona.personality.includes(trait);
								return (
									<button
										key={trait}
										onClick={() => togglePersonality(trait)}
										className={`rounded-full border px-4 py-2 text-sm font-pretendard-medium transition ${
											selected
												? "border-black-aneuk bg-black-aneuk text-white shadow-sm"
												: "border-black-aneuk/10 bg-white text-black-aneuk hover:border-black-aneuk/30"
										}`}
									>
										{trait}
									</button>
								);
							})}
						</div>
						<div className="mt-3 flex items-center gap-2 rounded-2xl border border-dashed border-black-aneuk/15 bg-white px-3 py-2">
							<Wand2 size={18} className="text-black-aneuk" />
							<input
								placeholder="직접 입력하기"
								className="w-full bg-transparent text-sm font-pretendard-medium text-black-aneuk outline-none border-0 focus:border-0 focus:outline-none"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										const value =
											e.currentTarget.value.trim();
										if (!value) return;
										if (persona.personality.length >= 3)
											return;
										if (
											persona.personality.includes(value)
										) {
											e.currentTarget.value = "";
											return;
										}
										setPersona((prev) => ({
											...prev,
											personality: [
												...prev.personality,
												value,
											],
										}));
										e.currentTarget.value = "";
									}
								}}
							/>
						</div>
					</div>
				);
			case 4:
				return (
					<div className="w-full max-w-[440px] bg-white p-5">
						<div className="text-2xl font-pretendard-bold text-black-aneuk whitespace-pre-line">
							{`가장 중요한 거예요.\n${nameLabel}만의 특별한 말버릇이 있나요?`}
						</div>
						<div className="mt-4 space-y-3">
							<div className="rounded-2xl border border-black-aneuk/10 bg-white px-4 py-3 shadow-inner">
								<label className="text-xs font-pretendard-medium text-slate-600">
									A. 말끝 맺음
								</label>
								<input
									value={persona.signatureEnding}
									onChange={(e) =>
										setPersona((prev) => ({
											...prev,
											signatureEnding: e.target.value,
										}))
									}
									placeholder="~멍, ~하오, ~옵소서, ~용"
									className="mt-1 w-full bg-transparent text-base font-pretendard-medium text-black-aneuk focus:outline-none"
								/>
							</div>
							<div className="rounded-2xl border border-black-aneuk/10 bg-white px-4 py-3 shadow-inner">
								<label className="text-xs font-pretendard-medium text-slate-600">
									B. 따라해보기
								</label>
								<textarea
									rows={3}
									value={persona.signatureLine}
									onChange={(e) =>
										setPersona((prev) => ({
											...prev,
											signatureLine: e.target.value,
										}))
									}
									placeholder="평소 할 법한 말을 한 문장 적어주세요."
									className="mt-1 w-full resize-none bg-transparent text-base font-pretendard-medium text-black-aneuk focus:outline-none"
								/>
							</div>
							<div className="flex items-center gap-3 rounded-2xl bg-black-aneuk/5 px-3 py-2 text-sm text-black-aneuk">
								<Sparkles
									size={16}
									className="text-amber-500"
								/>
							</div>
						</div>
					</div>
				);
			case 5:
				return (
					<div className="w-full max-w-[440px] space-y-3">
						<div className="bg-white p-5">
							<div className="mt-2 flex items-center gap-2 text-lg font-pretendard-bold text-black-aneuk">
								<Sparkles size={18} className="text-sky-500" />
								{nameLabel}
							</div>
							<div className="mt-3 flex flex-col gap-2 bg-white p-3">
								<div className="text-sm text-slate-500">
									첫 인사
								</div>
								<div className="rounded-2xl bg-black-aneuk text-white px-4 py-3 text-base font-pretendard-medium shadow-sm">
									{generatedPreviewLine}
								</div>
							</div>
						</div>
						<div className="bg-white p-5">
							<div className="flex items-center justify-between text-sm font-pretendard-medium text-slate-600">
								<span>말투 다듬기</span>
								<span className="text-xs text-slate-500">
									{tonePolish > 50
										? "더 부드럽게"
										: tonePolish < 50
										? "조금 차갑게"
										: "기본"}
								</span>
							</div>
							<input
								type="range"
								min={0}
								max={100}
								value={tonePolish}
								onChange={(e) =>
									setTonePolish(Number(e.target.value))
								}
								className="mt-2 w-full accent-black-aneuk"
							/>
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="relative flex h-full w-full flex-col overflow-hidden bg-white">
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleFileChange}
			/>
			<header className="relative z-10 flex items-center justify-between px-5 pt-4">
				<div className="flex items-center gap-2">
					<button
						onClick={() => navigate(-1)}
						className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:-translate-x-0.5"
					>
						<ChevronLeft size={18} className="text-black-aneuk" />
					</button>
					<div className="flex flex-col">
						<span className="text-lg font-pretendard-bold text-black-aneuk">
							페르소나 설정
						</span>
					</div>
				</div>
			</header>
			<main className="relative z-10 flex-1 overflow-y-auto pb-28 pt-2">
				<div className="px-5">
					<div className="mt-3 flex items-center gap-2">
						{steps.map((step, idx) => (
							<div
								key={step.key}
								className={`h-1.5 flex-1 rounded-full transition-all ${
									idx <= currentStep
										? "bg-black-aneuk"
										: "bg-black-aneuk/10"
								}`}
							/>
						))}
					</div>
					<div className="mt-12 flex flex-col items-center gap-4">
						<div
							className="relative flex h-40 w-40 items-center justify-center rounded-full border"
							style={{
								borderColor: accentColor,
								boxShadow: `0 12px 28px ${accentColor}33`,
								backgroundColor: "#fafafa",
							}}
						>
							<div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-black-aneuk/10 bg-white shadow-inner">
								{avatarPreview ? (
									<img
										src={avatarPreview}
										alt="avatar"
										className="h-full w-full object-cover"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center text-center text-sm font-pretendard-medium text-black-aneuk/70">
										{nameLabel}
									</div>
								)}
							</div>
							<button
								onClick={() => fileInputRef.current?.click()}
								className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black-aneuk text-white shadow-md transition hover:scale-105"
								aria-label="사진 업로드"
							>
								<Camera size={16} />
							</button>
						</div>
						<div className="w-full">{renderStepContent()}</div>
					</div>
				</div>
			</main>
			<footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-white px-5 pb-5 pt-6">
				<div className="pointer-events-auto flex items-center justify-between gap-2 rounded-2xl border border-black-aneuk/10 bg-white px-3 py-2 shadow-sm">
					<button
						onClick={handlePrevious}
						disabled={currentStep === 0}
						className={`flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-pretendard-bold transition ${
							currentStep === 0
								? "text-slate-400"
								: "text-black-aneuk hover:-translate-x-0.5"
						}`}
					>
						<ChevronLeft size={16} />
						이전
					</button>
					<div className="flex-1 text-center text-xs font-pretendard-medium text-slate-500">
						{currentStep + 1} / {steps.length}
					</div>
					<button
						onClick={handleNext}
						disabled={!canProceed}
						className={`flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-pretendard-bold text-white transition ${
							canProceed
								? "bg-black-aneuk hover:translate-x-0.5"
								: "bg-black-aneuk/30"
						}`}
					>
						{currentStep === steps.length - 1 ? "완료" : "다음"}
						<ChevronRight size={16} />
					</button>
				</div>
			</footer>
		</div>
	);
};

export default PersonaSetupPage;
