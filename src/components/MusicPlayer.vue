<template>
  <div class="player-container">
    <div class="music-player-container">
      <audio
        v-change-volume="volume"
        v-muted="isMuted"
        v-switch-play="isPlay"
        v-current-time
        :src="musicList[current].url"
        ref="player"
        preload
      ></audio>
      <img :src="musicList[current].image" class="music-image" />
      <p class="music-name">{{ musicList[current].musicName }}</p>
      <p class="music-singer">{{ musicList[current].singer }}</p>
      <div class="volume">
        <span class="iconfont" @mousedown.prevent="volumeLower()"
          >&#xf018c;</span
        >
        <el-progress
          :percentage="volume"
          :stroke-width="4"
          :show-text="false"
          color="#D266F1"
          class="volume-level"
        ></el-progress>
        <span class="iconfont" @mousedown.prevent="volumeHigher()"
          >&#xf018b;</span
        >
      </div>
      <div class="function-area">
        <span
          class="iconfont"
          v-show="playStyle == 1"
          @mousedown.prevent="changePlayStyle(2)"
          >&#xe68c;</span
        >
        <span
          class="iconfont"
          v-show="playStyle == 2"
          @mousedown.prevent="changePlayStyle(3)"
          >&#xe622;</span
        >
        <span
          class="iconfont"
          v-show="playStyle == 3"
          @mousedown.prevent="changePlayStyle(1)"
          >&#xe604;</span
        >
        <span
          class="iconfont collected"
          v-show="musicList[current].isCollected"
          @mousedown.prevent="changeCollectedStatus(current)"
          >&#xeca1;</span
        >
        <span
          class="iconfont collected"
          v-show="!musicList[current].isCollected"
          @mousedown.prevent="changeCollectedStatus(current)"
          >&#xeca2;</span
        >
        <span v-show="!isMuted" class="iconfont" @mousedown.prevent="mute"
          >&#xeca5;</span
        >
        <span v-show="isMuted" @mousedown.prevent="mute" class="iconfont"
          >&#xe65e;</span
        >
      </div>
      <div class="play-progress">
        <span class="time current-time">0:00</span>
        <el-progress
          :percentage="playProgress"
          :stroke-width="4"
          :show-text="false"
          color="#4BA35F"
          class="progress-play-time"
        ></el-progress>
        <span class="time total-time">{{ musicList[current].playTime }}</span>
      </div>
      <div class="switch-play">
        <span
          class="iconfont broadcast"
          @mousedown.prevent="play"
          v-show="!isPlay"
          >&#xe62b;</span
        >
        <span
          class="iconfont broadcast"
          @mousedown.prevent="stop"
          v-show="isPlay"
          >&#xea81;</span
        >
      </div>
    </div>
    <div class="blur-container"></div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      //音量
      volume: +localStorage.getItem("volume") || 80,
      //是否静音
      isMuted: false,
      //进度
      playProgress: 0,
    };
  },
  methods: {
    //减少音量
    volumeLower() {
      this.volume = this.volume == 0 ? 0 : this.volume - 5;
    },
    //增加音量
    volumeHigher() {
      this.volume = this.volume == 100 ? 100 : this.volume + 5;
    },
    //设置静音
    mute() {
      this.isMuted = !this.isMuted;
    },
    //播放
    play() {
      this.$store.commit("player/SET_PLAY_STATUS", true);
    },
    //暂停
    stop() {
      this.$store.commit("player/SET_PLAY_STATUS", false);
    },
    ...mapMutations("player", {
      changePlayStyle: "CHANGE_PLAY_STYLE",
      changeCollectedStatus: "CHANGE_COLLECTED_STATUS",
    }),
  },
  computed: {
    ...mapState("player", ["musicList", "current", "isPlay", "playStyle"]),
  },
  directives: {
    // 该指令用于设置音量
    "change-volume"(element, binding) {
      element.volume = binding.value / 100;
    },
    // 此指令用于静音
    muted(element, binding) {
      element.muted = binding.value;
    },
    //此指令用来设置播放状态
    "switch-play"(element, binding) {
      if (binding.value) {
        element.play();
      } else {
        element.pause();
      }
    },
    //此指令用于获取当前播放时长,并设置显示
    "current-time"(element) {
      let timeid = null;
      //获取需要设置显示时间的元素
      let current = document.querySelector(".current-time");
      if (!element.paused) {
        //设置计时器不断获取当前播放时间
        timeid = setInterval(() => {
          //获取当前音频时长
          let { currentTime } = element;
          let minutes = Number.parseInt(currentTime / 60);
          let seconds = Number.parseInt(currentTime % 60);
          current.textContent =
            seconds < 10 ? minutes + ":0" + seconds : minutes + ":" + seconds;
        }, 1000);
      } else {
        clearInterval(timeid);
      }
    },
  },
  watch: {
    //对播放状态进行监测，若处于播放状态则开始计算进度
    isPlay(newVal) {
      if (newVal) {
        //获取播放进度
        this.timeid1 = setInterval(() => {
          let { currentTime, duration } = this.$refs["player"];
          this.playProgress = Number.parseInt(
            (currentTime / duration).toFixed(2) * 100
          );
        }, 2000);
      } else {
        clearTimeout(this.timeid1);
      }
    },
    musicList: {
      deep: true,
      handler(newVal) {
        localStorage.setItem("musicList", JSON.stringify(newVal));
      },
    },
    volume(newVal) {
      localStorage.setItem("volume", newVal);
    },
    current(newVal) {
      localStorage.setItem("current", newVal);
    },
    playStyle(newVal) {
      localStorage.setItem("playStyle", newVal);
    },
  },
  mounted() {
    //设置事件监听，监听播放器是否播放结束，播放结束则切换下一歌曲
    this.$refs["player"].addEventListener("ended", () => {
      this.$store.dispatch("player/changeSong");
    });
  },
  beforeDestroy() {
    //取消定时器
    clearInterval(this.timeid1);
    //取消事件绑定
    this.$refs["player"].onended = null;
  },
};
</script>

<style scoped>
.player-container {
  width: 330px;
  height: 580px;
  position: relative;
}
.blur-container {
  width: 330px;
  height: 580px;
  position: absolute;
  z-index: 2;
  filter: blur(15px);
}
.music-player-container {
  width: 330px;
  height: 580px;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
    rgba(0, 0, 0, 0.22) 0px 15px 12px;
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.music-image {
  width: 290px;
  height: 290px;
  margin-top: 20px;
  object-fit: cover;
  border-radius: 5px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}

.music-name {
  font-size: 30px;
  margin-top: 25px;
  letter-spacing: 2px;
  color: #7c32f6;
  transition: all 0.5s ease;
}

.music-name:hover {
  transform: translateY(-10px);
}

.music-singer {
  margin-top: 10px;
  font-size: 20px;
  color: #845ec2;
  transition: all 0.5s ease;
}

.music-singer:hover {
  transform: translateY(-5px);
}

.volume {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}

.volume-level {
  margin: 0 10px;
}
.volume .iconfont {
  transition: all 0.5s ease;
}

.volume .iconfont:hover {
  transform: scale(1.3);
}

.function-area {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 170px;
  margin-top: 10px;
  height: 20px;
}

.function-area .iconfont {
  color: #ff4c76;
  height: 20px;
  width: 20px;
  text-align: center;
  line-height: 18px;
}

.function-area .iconfont:nth-child(n) {
  font-size: 18px;
}

.function-area .iconfont:nth-child(3) {
  font-size: 20px;
}

.function-area .collected {
  font-size: 20px;
}

.play-progress {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
}

.time {
  width: 30px;
  font-size: 12px;
}
.time:nth-child(3) {
  text-align: right;
}

.switch-play {
  margin-top: 20px;
}

.broadcast {
  height: 35px;
  width: 35px;
  font-size: 18px;
  text-align: center;
  line-height: 35px;
  background: #9dc7fb;
  border-radius: 50%;
  color: #203069;
}
</style>

<style>
.volume-level .el-progress-bar {
  width: 120px;
}

.progress-play-time .el-progress-bar {
  width: 200px;
}
</style>
