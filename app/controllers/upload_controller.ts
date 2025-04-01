import { uploadImageSchema } from "#validators/upload_schema";
import type { HttpContext } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";
import sharp from "sharp";

export default class UploadController {
	async image({ request, inertia }: HttpContext) {
		const { files, format, quality } =
			await request.validateUsing(uploadImageSchema);

		//await delay(1000000)
		const image = sharp(files.tmpPath);

		const convertedPath = app.makePath("storage/converted");
		const fileName = files.clientName.split(".").slice(0, -1).join(".");
		const pathOut = `${convertedPath}/${fileName}.${format}`;

		if (format === "webp") {
			image.webp({ quality });
		} else if (format === "avif") {
			image.avif({ quality });
		}
		await image.toFile(pathOut);

		return inertia.render("home", {
			info: `/storage/converted/${fileName}.${format}`,
		});
	}
}
