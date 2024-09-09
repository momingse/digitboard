export const copyToClipboard = (text: string): boolean => {
  const isNavigatorAvailable =
    typeof navigator !== "undefined" && navigator.clipboard;

  try {
    if (!isNavigatorAvailable) {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      textArea.style.color = "transparent";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      document.execCommand("copy");

      document.body.removeChild(textArea);
    } else {
      navigator.clipboard.writeText(text);
    }
  } catch (err) {
    console.error("Unable to copy", err);
    return false;
  }

  return true;
};
