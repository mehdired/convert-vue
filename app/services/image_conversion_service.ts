import { ConvertedImage } from "../../types/types.js";
import { MultipartFile } from "@adonisjs/core/bodyparser";
import stringHelpers from "@adonisjs/core/helpers/string";
import app from "@adonisjs/core/services/app";
import sharp from "sharp";

import AdmZip from "adm-zip";
import { DateTime } from "luxon";

export class ImageConversionServce {
  private sanitizeFileName(fileName: string): string {
    return stringHelpers.slug(fileName);
  }

  async convertImages(
    files: MultipartFile[],
    format: string,
    quality: number,
  ): Promise<{ convertedImages: ConvertedImage[]; zipUrl: string | null }> {
    const convertedPath = app.makePath("storage/converted");
    const convertedImages: ConvertedImage[] = [];
    const zip = new AdmZip();
    const datePrefix = DateTime.now().toFormat("yyyy-MM-dd-HHmm");

    for (const file of files) {
      const image = sharp(file.tmpPath);
      const originalName = file.clientName.split(".").slice(0, -1).join(".");
      const cleanName = this.sanitizeFileName(originalName);

      const outputName = `${cleanName}-${datePrefix}`;
      const pathOut = `${convertedPath}/${outputName}.${format}`;

      if (format === "webp") {
        image.webp({ quality });
      } else if (format === "avif") {
        image.avif({ quality });
      }
      await image.toFile(pathOut);
      convertedImages.push({
        name: `${outputName}.${format}`,
        url: `/storage/converted/${outputName}.${format}`,
      });
      if (files.length > 1) {
        zip.addLocalFile(pathOut);
      }
    }

    // Save the zip file
    if (files.length > 1) {
      const zipFileName = `converted_images-${datePrefix}.zip`;
      const zipPath = `${convertedPath}/converted_images-${datePrefix}.zip`;
      zip.writeZip(zipPath);

      return {
        convertedImages,
        zipUrl: `/storage/converted/${zipFileName}`,
      };
    }

    return {
      convertedImages,
      zipUrl: null,
    };
  }
}
