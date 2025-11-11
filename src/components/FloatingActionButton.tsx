import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconProvider } from "../utils/IconProvider";
import logoImg from "../assets/images/cocoon_logo.png";

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
			className={`absolute bottom-20 right-4 w-20 h-20 rounded-3xl bg-white flex items-center justify-center border border-gray-100 overflow-hidden ${
				isFloating ? "animate-floating" : "animate-slide-up"
			}`}
		>
			<img
				src={logoImg}
				alt="걱정카드 이동"
				className="w-full h-full object-cover"
			/>
		</button>
	);
};

export default FloatingActionButton;
