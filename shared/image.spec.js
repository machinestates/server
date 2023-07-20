const Image = require('./image');
const cloudinary = require('cloudinary').v2;

const uploadMock = jest
    .spyOn(cloudinary.uploader, 'upload')
    .mockImplementation(() => {
        return [
          { secure_url: 'https://www.cloudinary.com/1.png' }
        ]
});

describe('uploadDataUrl', () => {
    test('should upload photo to Cloudinary', async () => {
      const dataUrl = 'data:image/gif;base64,R0l';
      await Image.uploadDataUrl(dataUrl);
      expect(uploadMock).toHaveBeenCalled();
    });
});