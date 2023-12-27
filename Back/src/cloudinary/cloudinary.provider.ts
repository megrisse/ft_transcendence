import { ConfigOptions, v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: 'dvmxfvju3',
      api_key: '479127925312421',
      api_secret: 'JUxXYMloO9Tg9VdidYDedw24QTo',
    });
  },
};