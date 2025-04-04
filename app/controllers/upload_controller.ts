import { uploadImageSchema } from "#validators/upload_schema";
import type { HttpContext } from "@adonisjs/core/http";
import app from "@adonisjs/core/services/app";
import sharp from "sharp";
import type { ConvertedImage } from "../../types/types.js";
import AdmZip from "adm-zip";

export default class UploadController {
	async image({ request, inertia }: HttpContext) {
		// Validate input and get an array of files
		const { files, format, quality } =
			await request.validateUsing(uploadImageSchema);

		const convertedPath = app.makePath("storage/converted");
		const convertedImages: ConvertedImage[] = [];
		const zip = new AdmZip();

		for (const file of files) {
			const image = sharp(file.tmpPath);
			const fileName = file.clientName.split(".").slice(0, -1).join(".");
			const pathOut = `${convertedPath}/${fileName}.${format}`;

			if (format === "webp") {
				image.webp({ quality });
			} else if (format === "avif") {
				image.avif({ quality });
			}
			await image.toFile(pathOut);
			convertedImages.push({
				name: `${fileName}.${format}`,
				url: `/storage/converted/${fileName}.${format}`,
			});
			if (files.length > 1) {
				zip.addLocalFile(pathOut);
			}
		}

		// Save the zip file
		if (files.length > 1) {
			const zipPath = `${convertedPath}/converted_images.zip`;
			zip.writeZip(zipPath);
		}

		return inertia.render("home", {
			convertedImages,
			zipUrl:
				files.length > 1
					? `/storage/converted/converted_images.zip`
					: null,
		});
	}
}
