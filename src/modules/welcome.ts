import { Request, Response, Express } from 'express';


export const sayWelcome = (req: Request, res: Response) => {
    res.status(200).send("Welcome 🙌");
} 


// get mower position

// npm install path, multer, knex

export const getMowerPosition = (req: Request, res: Response) => {
    const { filename } = req.params
    const dirname = path.resolve()
    const fullfilepath = path.join(dirname, 'images/'+ filename)
    console.log("The fullfile path is: ", fullfilepath)
    res.sendFile(fullfilepath)
}

export const storeMowerPosition = (req: Request, res: Response) =>{
    const { filename, mimetype, size } = req.file
    const filepath = req.file.path
    const toDatabase = {
        filename,
        filepath,
        mimetype,
        size,
    }
    db
        .insert(toDatabase)
        .into('image_files')
        .then(() => res.json({ success: true, filename }))
        .catch(
            err => res
                .json({ 
                    success: false,
                    message: 'upload failed',
                    stack: err.stack,
                })
        )
}