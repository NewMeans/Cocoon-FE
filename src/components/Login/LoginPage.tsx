import React, { useState, useEffect } from "react";
import axios from "axios";
import naverImg from "../../assets/images/naver.png";
import kakaoImg from "../../assets/images/kakao.png";
import googleImg from "../../assets/images/google.png";
import aneukImg from "../../assets/images/aneuk_profile.png";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import logo from "../../assets/images/cocoon_logo.png";

const OAUTH_BASE_URL =
	process.env.REACT_APP_OAUTH_BASE_URL ??
	"https://aneuk-api.dev-lr.com/oauth2/authorization";
const API_BASE_URL =
	process.env.REACT_APP_API_BASE_URL ?? "https://aneuk-api.dev-lr.com";
const ENABLE_DEV_LOGIN =
	(process.env.REACT_APP_ENABLE_DEV_LOGIN ?? "false").toLowerCase() ===
	"true";

const LoginPage = () => {
	const [searchParams] = useSearchParams();
	const email = searchParams.get("email");
	const accessToken = searchParams.get("accessToken");

	const navigate = useNavigate();
	const { setAuth } = useAuth();
	const [isGuestLoading, setIsGuestLoading] = useState(false);

	const handleGuestLogin = async () => {
		if (isGuestLoading) return;
		setIsGuestLoading(true);
		try {
			const response = await axios.post(`${API_BASE_URL}/token/guest`);
			if (response.data?.status !== 200 || !response.data?.data) {
				throw new Error("게스트 계정 발급에 실패했습니다.");
			}
			const guest = response.data.data;
			setAuth(guest.accessToken, guest.email);
			navigate("/calendar", { replace: true });
		} catch (error) {
			console.error("Guest login failed:", error);
			alert("게스트 로그인에 실패했어요. 잠시 후 다시 시도해주세요.");
		} finally {
			setIsGuestLoading(false);
		}
	};

	useEffect(() => {
		if (email && accessToken) {
			setAuth(accessToken, email);
			navigate("/calendar", { replace: true });
		}
	}, [email, accessToken, navigate, setAuth]);

	return (
		<div className="absolute inset-0 z-50 bg-white flex flex-col justify-center items-center w-full h-full p-8">
			<img
				src={logo}
				alt="Profile"
				className="w-[35%] mr-0.5 object-contain rounded-[40%] mb-4"
			></img>
			<div className="font-pretendard-bold text-2xl mb-36">코쿤</div>
			<div className="font-pretendard-light text-gray-400 text-base mb-4">
				- 로그인하여 나의 감정 알아보러 가기 -
			</div>
			<div className="flex flex-col w-full space-y-2">
				<SocialLoginButton
					handleLogin={() => {
						window.location.href = `${OAUTH_BASE_URL}/kakao`;
					}}
					img={kakaoImg}
					label="Kakao로 로그인"
					labelColor="text-black"
					bgColor="bg-[#FEE500]"
				/>
				{/* <SocialLoginButton
					handleLogin={() => {
						window.location.href = `${OAUTH_BASE_URL}/google`;
					}}
					img={googleImg}
					label="Google 로그인"
					labelColor="text-black"
					bgColor="bg-white border"
				/> */}
			</div>
			{ENABLE_DEV_LOGIN && (
				<button
					onClick={() => {
						setAuth("design-mode-token", "designer@local");
						navigate("/calendar", { replace: true });
					}}
					className="mt-4 w-full h-11 rounded-[12px] bg-black-aneuk text-white font-pretendard-medium"
				>
					디자인 모드로 바로 들어가기
				</button>
			)}
			<button
				onClick={handleGuestLogin}
				disabled={isGuestLoading}
				className={`mt-4 w-full h-11 rounded-[12px] border border-gray-aneuk font-pretendard-medium transition ${
					isGuestLoading
						? "bg-gray-aneuk/20 text-gray-aneuk cursor-not-allowed"
						: "bg-white text-black-aneuk"
				}`}
			>
				{isGuestLoading
					? "게스트 계정 발급 중..."
					: "게스트로 둘러보기"}
			</button>
			<div className="mt-2 text-center text-xs text-gray-400 font-pretendard-regular leading-relaxed">
				게스트 로그인으로 코쿤을 편하게 체험해보세요.
				<br /> 게스트는 쿠키를 삭제하면 작성한 일기를 다시 볼 수 없어요.
			</div>
		</div>
	);
};

interface SocialLoginButtonProps {
	handleLogin: () => void;
	img: string;
	label: string;
	labelColor: string;
	bgColor: string;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
	handleLogin,
	img,
	label,
	labelColor,
	bgColor,
}) => {
	return (
		<button
			className={`flex justify-center items-center ${labelColor} ${bgColor} w-full h-11 rounded-[12px] px-4`}
			onClick={handleLogin}
		>
			<div className="flex flex-row justify-start items-center">
				<img src={img} className="w-10" />
				<div className="w-28 font-pretendard-regular text-base">
					{label}
				</div>
			</div>
		</button>
	);
};

export default LoginPage;
