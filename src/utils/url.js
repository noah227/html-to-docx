import imageToBase64 from 'image-to-base64';

const isValidUrl = (urlString) => {
  const urlRegex = /http(s)?:\/\/(\w+:?\w*@)?(\S+)(:\d+)?((?<=\.)\w+)+(\/([\w#!:.?+=&%@!\-/])*)?/gi;

  return Boolean(urlRegex.test(urlString));
};

const LOCAL_FILE_SCHEMA_REG = new RegExp('^file:///');
const isLocalFileSchema = (urlString) => LOCAL_FILE_SCHEMA_REG.test(urlString);

const BASE64_REG = /^data:([A-Za-z-+/]+);base64,(.+)$/;
const isBase64Source = (urlString) => BASE64_REG.test(urlString);

const fetchImage = async (urlString) => {
  let imageResource = urlString;
  let base64String = '';
  let shouldDownload;
  if (isBase64Source(imageResource)) {
    shouldDownload = false;
    // eslint-disable-next-line no-useless-escape, prefer-destructuring
    base64String = base64String.match(BASE64_REG)[2];
  } else {
    shouldDownload = true;
    // When it's not a base64 resource, just try to download it! 🚀
    if (isLocalFileSchema(imageResource)) {
      imageResource = imageResource.replace(LOCAL_FILE_SCHEMA_REG, '');
    }
    base64String = await imageToBase64(imageResource).catch((error) => {
      // eslint-disable-next-line no-console
      console.warn(`skipping image download and conversion due to ${error}`);
    });
  }
  return [base64String, shouldDownload];
};

// eslint-disable-next-line import/prefer-default-export
export { isValidUrl, fetchImage };
