import vine from "@vinejs/vine";

export const convertSchema = vine.compile(
	vine.object({
		file: vine.file(),
		formats: vine.array(vine.enum(["webp", "avif"])),
	}),
);
