export default defineCachedEventHandler(
  () => {
    return {
      name: "Girish Nakur Sweets API",
      version: "0.1.0",
      status: "ok",
      time: new Date().toISOString(),
    };
  },
  { maxAge: 0 }
);
