import React, { useState } from "react";
import { IconProvider } from "../../utils/IconProvider";
import { formatTime } from "../../utils/TimeFormatter";
import { useChatPage } from "./ChatPageContext";
import profileImg from "../../assets/images/cocoon_logo.png";
import heic2any from "heic2any";

const ImageReceiver: React.FC = () => {
	const formattedTime = formatTime(new Date().toISOString());
	const { userImage, setUserImage } = useChatPage();

	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const MAX_FILE_SIZE = 1 * 1024 * 1024;
	const handleImageChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		if (event.target.files && event.target.files[0]) {
			const file = event.target.files[0];
			const fileExtension = file.name.split(".").pop()?.toLowerCase();

			const isLargeFile = file.size > MAX_FILE_SIZE;
			const quality = isLargeFile ? 0.1 : 0.5;

			if (fileExtension === "heic" || fileExtension === "heif") {
				try {
					const convertedBlob = await heic2any({
						blob: file,
						toType: "image/jpeg",
						quality,
					});
					let blobParts: BlobPart[];
					if (Array.isArray(convertedBlob)) {
						blobParts = convertedBlob;
					} else {
						blobParts = [convertedBlob];
					}
					const convertedFile = new File(
						blobParts,
						file.name.replace(/\.(heic|heif)$/i, ".jpg"),
						{
							type: "image/jpeg",
						}
					);
					setUserImage(convertedFile);
					setPreviewUrl(URL.createObjectURL(convertedFile));
				} catch (error) {
					console.error("HEIC 변환 오류:", error);
				}
				return;
			}

			const reader = new FileReader();
			reader.onload = (e: ProgressEvent<FileReader>) => {
				if (!e.target || !e.target.result) return;

				const img = new Image();
				img.onload = () => {
					const canvas = document.createElement("canvas");
					canvas.width = img.width;
					canvas.height = img.height;

					const ctx = canvas.getContext("2d");
					if (!ctx) return;

					ctx.drawImage(img, 0, 0);

					canvas.toBlob(
						(blob) => {
							if (blob) {
								const convertedFile = new File(
									[blob],
									file.name.replace(
										/\.(png|jpg|jpeg)$/i,
										".jpg"
									),
									{
										type: "image/jpeg",
									}
								);
								setUserImage(convertedFile);
								setPreviewUrl(
									URL.createObjectURL(convertedFile)
								);
							}
						},
						"image/jpeg",
						quality
					);
				};
				img.src = e.target.result as string;
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className="flex flex-row justify-start items-end mb-4 ml-0.5">
			<img
				src={profileImg}
				alt="Profile"
				className="self-start w-12 mr-0.5 object-contain"
			></img>
			<div className="flex flex-col min-w-60">
					<div className="ml-1.5 mb-1 mt-0.5 text-black-aneuk text-sm">
						코쿤
					</div>
				<div
					className={`pt-2 pb-2.5 px-4 mb-2 rounded-3xl break-words whitespace-pre-wrap box-border bg-black-aneuk text-white`}
				>
					일기에 오늘의 사진을 추가해줘~!
				</div>
				<div className="min-w-60 min-h-80 pt-2 px-2 rounded-2xl break-words box-border bg-white shadow-custom-strong">
					<div className="relative flex flex-col justify-center items-center min-w-56 min-h-64 w-56 h-64 rounded-xl bg-gray-aneuk opacity">
						<input
							id="file-upload"
							className="mt-2 w-52 hidden"
							type="file"
							accept=".heic, .heif, image/*"
							onChange={handleImageChange}
						/>
						<label
							htmlFor="file-upload"
							className="cursor-pointer w-full h-full"
						>
							{previewUrl ? (
								<img
									src={previewUrl}
									alt="Preview"
									className="w-full h-full object-cover rounded-xl"
								/>
							) : (
								<div className="flex flex-col justify-center items-center min-w-56 min-h-64 w-max h-max text-white font-medium">
									<IconProvider.ImageIcon className="mb-2 w-10 h-10" />
									사진 추가하기
								</div>
							)}
						</label>
					</div>
				</div>
			</div>
			<div className="text-xs text-gray-aneuk pl-1">{formattedTime}</div>
		</div>
	);
};

export default ImageReceiver;
