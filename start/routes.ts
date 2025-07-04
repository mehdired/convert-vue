/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UploadController = () => import("#controllers/upload_controller");

import app from "@adonisjs/core/services/app";
import router from "@adonisjs/core/services/router";
import { normalize } from "node:path";

const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/;

router.on("/").renderInertia("home");

router.post("/", [UploadController, "image"]);

router.get("/storage/converted/:fileName", ({ response, params }) => {
  const normalisedPath = normalize(params.fileName);

  if (PATH_TRAVERSAL_REGEX.test(normalisedPath)) {
    return response.badRequest("Malformed path");
  }

  return response.download(app.makePath(`storage/converted/${normalisedPath}`));
});
