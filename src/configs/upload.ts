import * as crypto from 'crypto';
import { extname } from 'path';

export const setFileName = (req, file, callback) => {
  const fileHash = crypto.randomBytes(10).toString('hex');
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);

  callback(null, `${fileHash}-${name}${fileExtName}`);
};

export const onlyImageEnabled = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
