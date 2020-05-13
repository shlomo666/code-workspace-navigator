exports.replaceText = (selector, text) => {
  const element = document.getElementById(selector);
  if (element) element.innerHTML = text;
};
