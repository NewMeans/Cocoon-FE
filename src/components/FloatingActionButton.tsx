import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconProvider } from "../utils/IconProvider";
import logoImg from "../assets/images/maltipoo.png";

type FloatingActionButtonProps = {};

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({}) => {
	const navigate = useNavigate();
	const [isFloating, setIsFloating] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsFloating(true), 500);
		return () => clearTimeout(timer);
	}, []);
	return (
		<button
			onClick={() => {
				navigate("/chat");
			}}
			className={`absolute bottom-20 right-4 w-16 h-16 shadow-custom-strong rounded-full bg-white flex items-center justify-center ${
				isFloating ? "animate-floating" : "animate-slide-up"
			}`}
		>
			<div className="w-full h-full rounded-full overflow-hidden">
				<img
					src={logoImg}
					alt="콩이 챗봇 아이콘"
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-white text-[11px] font-pretendard-bold flex items-center justify-center pointer-events-none">
				1
			</div>
		</button>
	);
};

export default FloatingActionButton;
