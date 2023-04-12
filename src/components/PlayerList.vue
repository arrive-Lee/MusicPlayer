<template>
  <div class="player-list-container">
    <div class="player-list">
      <h1 class="title" v-prevent>我的音乐</h1>
      <ul class="music-info" v-prevent>
        <li>歌曲名</li>
        <li>歌手</li>
        <li>专辑</li>
      </ul>
      <ul class="music-list">
        <li
          v-for="(music, index) in musicList"
          :key="music.id"
          class="music"
          @dblclick="play(index)"
          v-prevent
        >
          <div class="music-section">
            <span
              class="iconfont collected"
              v-show="!music.isCollected"
              @mousedown="changeCollectedStatus(index)"
              >&#xeca2;</span
            >
            <span
              class="iconfont collected"
              v-show="music.isCollected"
              @mousedown="changeCollectedStatus(index)"
              >&#xeca1;</span
            >
            <span class="music-name">{{ music.musicName }}</span>
          </div>
          <div class="singer-section">
            <span class="singer-name">{{ music.singer }}</span>
          </div>
          <div class="album-section">
            <span class="album-name">{{ music.musicName }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="blur-container"></div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Player-List",
  data() {
    return {};
  },
  computed: {
    ...mapState("player", ["musicList", "isPlay"]),
  },
  methods: {
    ...mapMutations("player", {
      play: "PLAY",
    }),
    ...mapActions("player", ["changeCollectedStatus"]),
  },
  directives: {
    prevent(element) {
      element.onmousedown = function () {
        return false;
      };
    },
  },
};
</script>

<style scoped>
.player-list-container {
  width: 700px;
  height: 580px;
}
.player-list {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px,
    rgba(0, 0, 0, 0.22) 0px 15px 12px;
  backdrop-filter: blur(16px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.title {
  margin: 30px 0 0 50px;
  font-size: 40px;
}

.music-info {
  display: flex;
  width: 590px;
  margin: 20px 0 0 55px;
}

.music-info li {
  font-size: 25px;
  flex: 1;
}

.music-list {
  display: flex;
  flex-direction: column;
  width: 590px;
  height: 408px;
  margin: 10px 0 0 55px;
  overflow: auto;
}

.music-list::-webkit-scrollbar {
  display: none;
}
.music {
  display: flex;
  font-size: 18px;
  height: 34px;
  line-height: 34px;
}

.music div {
  flex: 1;
}

.music:hover {
  background: rgba(0, 0, 0, 0.2);
}
.music-section {
  display: flex;
}
.collected {
  margin: 0 5px;
  color: #ff4c76;
}
</style>
