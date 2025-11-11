import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/cocoon_logo.png";
import Cookies from "js-cookie";
import { IconProvider } from "../../utils/IconProvider";

const ProfilePage: React.FC = () => {
	const navigate = useNavigate();
	const userEmail = Cookies.get("userEmail");

	const handleLogout = async () => {
		Cookies.remove("userEmail");
		Cookies.remove("userToken");
		navigate("/login");
	};

	return (
		<div className="flex flex-col justify-center items-center w-full h-full p-4 overflow-y-auto bg-white-aneuk">
			<div className="w-[80%] bg-white rounded-3xl shadow-lg p-4 flex flex-col items-center mb-20">
				<img
					src={logo}
					alt="Profile"
					className="w-32 h-32 rounded-full mb-4"
				/>

				<div className="text-lg font-pretendard-bold text-black-aneuk mb-4">
					{userEmail}
				</div>

				<button
					onClick={handleLogout}
					className="flex flex-row justify-center items-center space-x-2 w-full py-2 mt-4 bg-white border text-black-aneuk font-pretendard-medium rounded-xl hover:bg-gray-100 transition duration-300"
				>
					<IconProvider.ExitIcon className="mr-2" />
					로그아웃
				</button>
			</div>
		</div>
	);
};

export default ProfilePage;
