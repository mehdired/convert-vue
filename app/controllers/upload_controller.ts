import { ImageConversionServce } from "#services/image_conversion_service";
import { uploadImageSchema } from "#validators/upload_schema";
import type { HttpContext } from "@adonisjs/core/http";

export default class UploadController {
  async image({ request, inertia }: HttpContext) {
    try {
      const { files, format, quality } =
        await request.validateUsing(uploadImageSchema);
      const conversionService = new ImageConversionServce();
      const result = await conversionService.convertImages(
        files,
        format,
        quality,
      );

      return inertia.render("home", result);
    } catch (error) {
      console.error("An error during conversion:", error);
      return inertia.render("home", {
        error: "An error occurred during conversion",
      });
    }
  }
}
