import { JSDOM } from 'jsdom';

/**
 * Parses HTML content and updates image sources with the URLs provided in the files array.
 * @param {string} htmlContent - The HTML content to parse.
 * @param {Array} files - Array of files that have been uploaded, each with a 'path' property.
 * @returns {string} - The updated HTML content with the correct image URLs.
 */
export const parseHTMLAndUploadImages = (htmlContent, files) => {
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  const images = [...document.querySelectorAll('img')];

  images.forEach((img) => {
    const file = files.find(f => img.getAttribute('src') === f.originalname);
    if (file) {
      // Replace the 'src' attribute with the Cloudinary URL from the uploaded file
      const cloudinaryUrl = file.path; // Assuming 'path' contains the Cloudinary URL
      img.setAttribute('src', cloudinaryUrl);
    }
  });

  return dom.serialize();
};