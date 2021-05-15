import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: `${process.cwd()}/src/config/.env` });
}

export default {
  ...process.env,
};
