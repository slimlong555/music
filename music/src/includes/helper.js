export default {
  formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.round(time - minutes * 60 || 0);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  },
};
// formatTime函数将接受以秒为单位的时间。它将返回格式化的时间。