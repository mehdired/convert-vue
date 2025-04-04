import vine from "@vinejs/vine";

export const uploadImageSchema = vine.compile(
	vine.object({
		files: vine.array(
			vine.file({
				size: "3mb",
				extnames: ["jpg", "jpeg", "png"],
			}),
		),
		format: vine.string(),
		quality: vine.number().min(0).max(100),
	}),
);
