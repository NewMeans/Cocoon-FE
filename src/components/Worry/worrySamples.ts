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
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
		status: "pending",
	},
	{
		id: "sample-2",
		summary: "회의발표에 관한 걱정",
		content: "내 프레젠테이션에서 말이 막히면 어떡하지?",
		createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
		status: "pending",
	},
];
