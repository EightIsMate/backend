const { ImageAnnotatorClient } = require('@google-cloud/vision');

// configure client
const CONFIG = {
  credentials: {
    private_key: process.env.private_key,
    client_email: process.env.client_email
  }
};

/**
 * This TypeScript function takes in an image link, uses the Google Cloud Vision API to annotate the
 * image with label detection, and returns a string of the labels.
 * @param {Request} req - The request object from the client making the API call.
 * @param {Response} res - The response object that will be sent back to the client making the request.
 * @param {String} imageLink - The URL or file path of the image that needs to be annotated.
 * @returns a string of comma-separated labels that were detected in the image.
 */

export const annotate_image = async(imageLink: String) => {
        const filePath = imageLink;
        var items: any[] = []
        if (filePath) {
            const client = new ImageAnnotatorClient(CONFIG);
            // Make API request to annotate the image
            const [result] = await client.annotateImage({
                image: {source: { imageUri: filePath } },
                features: [{ type: 'LABEL_DETECTION' }]
            });
            
            const labels = result.labelAnnotations;
            labels.forEach((label: { description: any; }) => 
                items.push(label.description)
            );
            return items   
        }
        return items
  }


