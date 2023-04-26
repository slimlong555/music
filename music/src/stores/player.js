import { defineStore } from "pinia";
import { Howl } from "howler";
import helper from "@/includes/helper";

export default defineStore("player", {
  state: () => ({
    current_song: {},
    sound: {},
    seek: "00:00",
    duration: "00:00",
    playerProgress: "0%",
  }), // 这几个属性将具有相同的值以表明当前没有音频存在。
  actions: {
    async newSong(song) {
      if (this.sound instanceof Howl) {
        this.sound.unload();
      }

      this.current_song = song;

      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });
     // 默认情况下，howler将使用Ajax请求音频文件。但是，这会导致源策略错误
		// 因为音频文件存储在外部,通过将此属性设置为true来定位。
		// 该库将切换到HTML5音频API来检索音频文件。
      this.sound.play(); // 用于播放音频

      this.sound.on("play", () => {
        requestAnimationFrame(this.progress);
      }); // on函数的第二个参数传入一个箭头函数来处理事件。在函数内部调用请求动画帧函数。
    },
    async toggleAudio() {
      if (!this.sound.playing) {
        return;
      }

      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    }, // 最初，我们的应用程序会将声音属性加载为一个空对象。
		  // 检查该对象是howl对象还是普通的空对象是个好主意。
    progress() {
      this.seek = helper.formatTime(this.sound.seek());
      this.duration = helper.formatTime(this.sound.duration());

      this.playerProgress = `${
        (this.sound.seek() / this.sound.duration()) * 100
      }%`;

      if (this.sound.playing()) {
        requestAnimationFrame(this.progress);// 如果是，我们可以调用请求动画帧函数来调度进度操作。
      } 
    }, // progress函数将执行两个任务。
		   // 它将为播放器中使用的两个状态属性提交一个突变。
			 // 第二个任务是再次调度进度函数。
    updateSeek(event) {
      if (!this.sound.playing) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();
      // Document = 2000, Timeline = 1000, clientX = 1000, Distance = 500
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);
      this.sound.once("seek", this.progress);
    },
  },
  getters: {
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
  },// getters函数提供状态对象作为第一个参数。
	 // 在调用播放函数之前，我们要检查它是否存在。
});
