import React from "react";
import { IconProvider } from "../../utils/IconProvider";

interface TopAppBarProps {
	onBack: () => void;
}

const TopAppBar: React.FC<TopAppBarProps> = ({ onBack }) => {
	return (
		<div className="w-full min-h-14 h-14 bg-white flex justify-center items-center px-4">
			<button
				onClick={() => {
					onBack();
				}}
				className="absolute left-4"
			>
				<IconProvider.LeftArrowIcon className="w-8 h-8" />
			</button>
			<h1 className="text-lg font-bold text-gray-800">코쿤</h1>
		</div>
	);
};

export default TopAppBar;
