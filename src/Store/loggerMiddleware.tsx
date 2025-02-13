import { Middleware } from '@reduxjs/toolkit';

const loggerMiddleware: Middleware = () => (next) => (action) => {
  return next(action);
};

export default loggerMiddleware;
