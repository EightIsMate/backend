import multer from "multer";
import { picture_storing, picture_fetching } from "../modules/pictures"
import { Router } from "express";

// configure multer for file upload
const upload = multer({ dest: "uploads/" });
const router : Router = Router();

// create GET request route for fetching images
router.get("/image", picture_fetching);

// create POST request route for uploading images
router.post("/upload", upload.single("file"), picture_storing);

export default router;