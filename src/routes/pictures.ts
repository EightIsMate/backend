import multer from "multer";
import { pictureStoring } from "../modules/pictures"
import { Router } from "express";

// configure multer for file upload
const upload = multer({ dest: "uploads/" });
const router : Router = Router();

// create POST request route for uploading images
router.post("/upload", upload.single("file"), pictureStoring);

export default router;