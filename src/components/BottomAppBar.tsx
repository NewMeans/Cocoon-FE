import React, { useState, useEffect } from "react";
import IconButton from "./IconButton";
import { IconProvider } from "../utils/IconProvider";
import { useLocation, useNavigate } from "react-router-dom";

const BottomAppBar: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

	useEffect(() => {
		const path = location.pathname;
		if (path.includes("calendar")) {
			setSelectedIcon("calendar");
		} else if (path.includes("worry")) {
			setSelectedIcon("worry");
		} else if (path.includes("chart")) {
			setSelectedIcon("chart");
		} else if (path.includes("profile")) {
			setSelectedIcon("profile");
		} else {
			setSelectedIcon("home");
		}
	}, [location.pathname]);

	return (
		<div className="absolute bottom-0 w-full h-16 bg-white text-black-aneuk flex flex-shrink-0 justify-around items-center">
			<IconButton
				icon={<IconProvider.HomeIcon />}
				label="Home"
				selected={selectedIcon === "home"}
				onClick={() => {
					navigate("/home");
				}}
			/>
			<IconButton
				icon={<IconProvider.FileEditIcon />}
				label="Worry"
				selected={selectedIcon === "worry"}
				onClick={() => navigate("/worry")}
			/>
			<IconButton
				icon={<IconProvider.CalendarIcon />}
				label="Calendar"
				selected={selectedIcon === "calendar"}
				onClick={() => {
					navigate("/calendar");
				}}
			/>
			<IconButton
				icon={<IconProvider.ChartIcon />}
				label="Chart"
				selected={selectedIcon === "chart"}
				onClick={() => {
					navigate("/chart");
				}}
			/>
			<IconButton
				icon={<IconProvider.UserIcon />}
				label="Profile"
				selected={selectedIcon === "profile"}
				onClick={() => {
					navigate("/profile");
				}}
			/>
		</div>
	);
};

export default BottomAppBar;
