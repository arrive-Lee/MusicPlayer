<template>
  <div id="app">
    <MusicPlayer class="player"></MusicPlayer>
    <PlayerList></PlayerList>
  </div>
</template>

<script>
import MusicPlayer from "./components/MusicPlayer.vue";
import PlayerList from "./components/PlayerList.vue";
export default {
  name: "App",
  components: {
    MusicPlayer,
    PlayerList,
  },
};
</script>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #845ec2;
  background: url("./assets/images/海边 船 树 靠在树上的女孩3440x1440带鱼屏动漫壁纸_彼岸图网.jpg")
    no-repeat center;
  overflow: hidden;
  background-size: cover;
}
.player {
  margin-right: 20px;
}
</style>
