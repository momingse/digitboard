export const isMac = () => {
  if (typeof navigator !== "undefined" && navigator.platform) {
    return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  }

  const macosPlatform = /(macintosh|macintel|macppx|mac68k|macos)/i;
  const userAgent = navigator.userAgent.toLowerCase();
  return macosPlatform.test(userAgent);
};
