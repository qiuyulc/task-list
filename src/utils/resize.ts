(function () {
  const handleResize = () => {
    const baseWidth = 1920; // 设计稿基准宽度
    const baseFontSize = 16; // 基准字号
    const minWidth = 1200; // 最大宽度，可根据需求调整

    const screenWidth =
      window.innerWidth < minWidth ? minWidth : window.innerWidth;
    const rem = (screenWidth * baseFontSize) / baseWidth;

    document.documentElement.style.fontSize = rem + "px";
  };
  handleResize();
  window.addEventListener("resize", handleResize);
})();
