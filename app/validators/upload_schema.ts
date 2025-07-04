import vine from "@vinejs/vine";

export const uploadImageSchema = vine.compile(
  vine.object({
    files: vine
      .array(
        vine.file({
          size: "5mb",
          extnames: ["jpg", "jpeg", "png"],
        }),
      )
      .minLength(1)
      .maxLength(10),
    format: vine.enum(["webp", "avif"]),
    quality: vine.number().min(1).max(100),
  }),
);
