export const success = (res, data, status = 200) => {
  res.status(status).json({ success: true, data });
};

export const failure = (res, error, status = 500) => {
  const message = error instanceof Error ? error.message : error;
  res.status(status).json({ success: false, error: message });
};
