/* eslint-disable @typescript-eslint/no-explicit-any */
// import { FileEdit } from "lucide-react";
import { Image } from "lucide-react";
import { Controller, SubmitHandler, UseFormReturn } from "react-hook-form";
import cls from "classnames";
import { IsEncrypt, mergeFileLists } from "../../utils/file";
import { isNil } from "ramda";
import CustomFeerate from "../CustomFeerate";
import { toast } from "react-toastify";

export interface AttachmentItem {
	fileName: string;
	fileType: string;
	data: string;
	encrypt: IsEncrypt;
	sha256: string;
	size: number;
	url: string;
}

type IProps = {
	// onSubmit: (buzz: { content: string; images: AttachmentItem[] }) => void;
	onCreateSubmit: SubmitHandler<BuzzData>;
	buzzFormHandle: UseFormReturn<BuzzData, any, BuzzData>;
	onClearImageUploads: () => void;
	filesPreview: string[];
	feeRateOptions: {
		name: string;
		number: number;
	}[];
	selectFeeRate: {
		name: string;
		number: number;
	};
	setSelectFeeRate: React.Dispatch<
		React.SetStateAction<{
			name: string;
			number: number;
		}>
	>;
	handleCustomFeeChange: (v: string) => void;
	customFee: string;
};

export type BuzzData = {
	content: string;
	images: FileList;
};

const renderImages = (data: string[]) => {
	return (
		<div className="grid grid-cols-3 gap-2 place-items-center">
			{data.map((image) => {
				return (
					<img
						className="image w-[150px] h-[150px]"
						style={{
							objectFit: "cover",
						}}
						src={image}
						alt=""
						key={image}
					/>
				);
			})}
		</div>
	);
};

const BuzzForm = ({
	onCreateSubmit,
	buzzFormHandle,
	onClearImageUploads,
	filesPreview,

	feeRateOptions,
	handleCustomFeeChange,
	customFee,
	selectFeeRate,
	setSelectFeeRate,
}: IProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		getValues,
	} = buzzFormHandle;
	// const content = watch("content");
	// const [gas, setGas] = useState<null | number>(null);

	// const getGas = async () => {
	// 	const fileArr = !isNil(files) && files?.length !== 0 ? await image2Attach(files) : [];
	// 	const fileGas = isEmpty(fileArr) ? 0 : sum(fileArr.map((d) => d.size)) * 2;
	// 	const contentGas = (content?.length ?? 0) * 2;
	// 	setGas(fileGas + contentGas);
	// };

	// useEffect(() => {
	// 	getGas();
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [files, content]);

	return (
		<form onSubmit={handleSubmit(onCreateSubmit)} className="mt-8 flex flex-col gap-6">
			<div className="flex flex-col gap-2 ">
				<div className="relative">
					<textarea
						className={cls(
							"textarea textarea-bordered border-white text-white bg-[black] textarea-sm h-[160px] w-full ",
							{
								"textarea-error": errors.content,
							}
						)}
						{...register("content", { required: true })}
					/>
					{errors.content && (
						<span className="text-error absolute left-0 top-[175px] text-sm">
							Buzz content can't be empty.
						</span>
					)}
				</div>
				<div className="flex items-center self-end gap-2">
					{!isNil(filesPreview) && filesPreview.length !== 0 && (
						<div
							className="btn btn-xs btn-outline font-normal text-white"
							onClick={onClearImageUploads}
						>
							clear current uploads
						</div>
					)}
					<div
						onClick={() => {
							document.getElementById("addImage")!.click();
						}}
						className="btn btn-xs btn-outline font-normal text-white "
					>
						<Image size={16} />
						Select Image(s)
					</div>
				</div>
				<Controller
					control={buzzFormHandle.control}
					name="images"
					render={({ field: { onChange } }) => (
						<input
							type="file"
							multiple
							id="addImage"
							className="hidden"
							{...register("images")}
							onChange={(e) => {
								const files = e.target.files;
								if (!isNil(files) && files.length > 0) {
									for (const item of Array.from(files ?? [])) {
										if (item.size > 200 * 1024) {
											toast.error(
												`File size cannot be greater than 200kb (filename: ${item.name})`
											);
											e.target.value = ""; // clear file input value
											console.log("bcccccc");
											return;
										}
									}
									if (getValues("images").length > 0) {
										const mergeRes = mergeFileLists(
											getValues("images"),
											files!
										);
										// console.log("current get files", getValues("images"));
										// console.log("current change files", files);
										// console.log("mergeFileLists", mergeRes);
										onChange(mergeRes);
									} else {
										onChange(files);
									}
								}
							}}
						/>
					)}
				/>
				{/* <input
					type="file"
					multiple
					id="addImage"
					className="hidden"
					{...register("images")}
					onChange={(e) => {
						console.log("current change files", e.target.files);
						console.log("current get files", getValues("images"));
						if (!isNil(e.target.files)) {
							onImageChange(e.target.files);
						}
					}}
				/> */}
				{filesPreview && renderImages(filesPreview)}
			</div>
			{/* set price */}
			{/* <div className="flex flex-col gap-2">
				<div className="text-white font-normal text-[14px]">Set Price</div>
				<div className="relative">
					<input
						type="number"
						className="input input-bordered w-full text-white border-white bg-[black]"
					/>
					<select className="absolute right-2 top-3 select select-bordered select-xs  max-w-xs border-white text-white bg-[black] ">
						<option>BTC</option>
						<option>MVC</option>
					</select>
				</div>
			</div> */}

			<CustomFeerate
				customFee={customFee}
				setSelectFeeRate={setSelectFeeRate}
				selectFeeRate={selectFeeRate}
				handleCustomFeeChange={handleCustomFeeChange}
				feeRateOptions={feeRateOptions}
			/>

			<button
				className="btn btn-primary btn-sm rounded-full font-medium w-[80px] flex self-center"
				type="submit"
			>
				Post
			</button>
		</form>
	);
};

export default BuzzForm;
