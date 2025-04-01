/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UploadController = () => import("#controllers/upload_controller");

import router from "@adonisjs/core/services/router";
router.on("/").renderInertia("home");

router.post("/", [UploadController, "image"]);
