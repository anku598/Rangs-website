console.log(process.env);
export const HOST: string = process.env.VUE_APP_DEVHOST
  ? process.env.VUE_APP_DEVHOST
  : process.env.NODE_ENV === 'development'
  ? 'http://localhost:8000'
  : '';
export const API_URL: string = `${HOST}/api/v2`;
export const GMAP_KEY: string = 'AIzaSyBMsTZnGiQchkPm1LbG39fwpdO9Jh0vZ34';
