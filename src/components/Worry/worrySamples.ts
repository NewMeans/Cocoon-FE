export type WorryStatus = "pending" | "resolved" | "realized";

export interface WorryCard {
	id: string;
	summary: string;
	content: string;
	createdAt: string;
	status: WorryStatus;
}

export const WORRY_SAMPLE_DATA: WorryCard[] = [
	{
		id: "sample-1",
		summary: "건강검진에 관한 걱정",
		content: "머리가 자주 아픈데 큰 병이면 어떡하지?",
		createdAt: new Date(
			Date.now() - 1000 * 60 * 60 * 24 * 15
		).toISOString(),
		status: "pending",
	},
	{
		id: "sample-2",
		summary: "회의발표에 관한 걱정",
		content: "내 프레젠테이션에서 말이 막히면 어떡하지?",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
		status: "resolved",
	},
	{
		id: "sample-3",
		summary: "야근 일정에 관한 걱정",
		content: "이번 주에 야근이 많아서 체력이 버틸까 걱정돼.",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
		status: "pending",
	},
	{
		id: "sample-4",
		summary: "친구 관계에 관한 걱정",
		content: "답장을 늦게 보내서 친구가 서운해할까 봐 신경 쓰여.",
		createdAt: new Date(
			Date.now() - 1000 * 60 * 60 * 24 * 10
		).toISOString(),
		status: "resolved",
	},
	{
		id: "sample-5",
		summary: "주식 투자에 관한 걱정",
		content: "이번에 산 주식이 계속 떨어지면 어쩌지?",
		createdAt: new Date(
			Date.now() - 1000 * 60 * 60 * 24 * 21
		).toISOString(),
		status: "realized",
	},
	{
		id: "sample-6",
		summary: "출장 발표에 관한 걱정",
		content: "처음 만나는 고객 앞에서 실수하면 어쩌지?",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
		status: "pending",
	},
	{
		id: "sample-7",
		summary: "계약 연장에 대한 걱정",
		content: "이번 계약이 갱신되지 않으면 어쩌지?",
		createdAt: new Date(
			Date.now() - 1000 * 60 * 60 * 24 * 30
		).toISOString(),
		status: "resolved",
	},
	{
		id: "sample-8",
		summary: "부모님 건강에 대한 걱정",
		content: "부모님 건강검진 결과가 안 좋게 나오면 어떡하지?",
		createdAt: new Date(
			Date.now() - 1000 * 60 * 60 * 24 * 18
		).toISOString(),
		status: "resolved",
	},
	{
		id: "sample-9",
		summary: "이사 일정에 대한 걱정",
		content: "이사 날짜까지 짐을 다 못 싸면 어떻게 하지?",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
		status: "pending",
	},
	{
		id: "sample-10",
		summary: "동물병원 검사에 대한 걱정",
		content: "강아지가 요즘 밥을 잘 안 먹는데 아프면 어떡하지?",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
		status: "pending",
	},
	{
		id: "sample-11",
		summary: "휴가 일정에 대한 걱정",
		content: "휴가 가기 전에 일이 너무 쌓이면 못 쉬지 않을까?",
		createdAt: new Date(
			Date.now() - 1000 * 60 * 60 * 24 * 12
		).toISOString(),
		status: "resolved",
	},
	{
		id: "sample-12",
		summary: "주말 모임에 대한 걱정",
		content: "주말에 모임이 있는데 어색할까 봐 걱정돼.",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
		status: "pending",
	},
];
