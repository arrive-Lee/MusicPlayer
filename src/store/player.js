export default {
  namespaced: true,
  actions: {
    //在播放完过后切换下一首歌曲
    changeSong(context) {
      //获取当前播放音乐的索引
      const { current, playStyle } = context.state;
      //获取音乐总长度
      const { getNumOfSong: length } = context.getters;
      let value;
      //根据播放模式选择切换下一首歌曲的方式
      if (playStyle == 1) {
        value = (current + 1) % length;
      } else if (playStyle == 2) {
        value = current;
        while (value == current) {
          value = Number.parseInt(Math.random() * length);
        }
      } else {
        value = current;
      }
      context.commit("CHANGE_SONG", value);
    },
    //改变收藏状态
    changeCollectedStatus(context, value) {
      if (context.state.musicList[value].isCollected) {
        context.commit("CHANGE_COLLECTED_STATUS_TO_False", value);
      } else {
        const sortedIndex = context.state.musicList.findIndex(
          (item) => !item.isCollected
        );
        context.commit("CHANGE_COLLECTED_STATUS_TO_TRUE", [value, sortedIndex]);
      }
    },
  },
  mutations: {
    //切换播放状态
    SET_PLAY_STATUS(state, value) {
      state.isPlay = value;
    },
    //切换歌曲
    CHANGE_SONG(state, value) {
      state.current = value;
    },
    //切换播放模式
    CHANGE_PLAY_STYLE(state, value) {
      state.playStyle = value;
    },
    //改变收藏状态为不喜欢
    CHANGE_COLLECTED_STATUS_TO_False(state, value) {
      state.musicList[value].isCollected = false;
      const task = state.musicList[value];
      state.musicList.splice(value, 1);
      state.musicList.push(task);
    },
    //改变收藏状态为喜欢
    CHANGE_COLLECTED_STATUS_TO_TRUE(state, value) {
      state.musicList[value[0]].isCollected = true;
      const task = state.musicList[value[0]];
      state.musicList.splice(value[0], 1);
      state.musicList.splice(value[1], 0, task);
    },
    //当从歌曲列表点击的时候播放
    PLAY(state, value) {
      //当双击同一首歌曲的时候停止播放
      if (state.isPlay && state.current == value) {
        state.isPlay = false;
      } else {
        state.current = value;
        state.isPlay = true;
      }
    },
  },
  state: {
    musicList: JSON.parse(localStorage.getItem("musicList")) || [
      {
        id: "001",
        musicName: "迷人的危险",
        singer: "蔡黄汝",
        url: require("../assets/songs/蔡黄汝 - 迷人的危险.mp3"),
        image: require("../assets/images/迷人的危险.png"),
        playTime: "3:24",
        isCollected: true,
      },
      {
        id: "002",
        musicName: "不再见",
        singer: "陈学冬",
        url: require("../assets/songs/陈学冬 - 不再见.mp3"),
        image: require("../assets/images/不再见.png"),
        playTime: "4:04",
        isCollected: true,
      },
      {
        id: "003",
        musicName: "我可以",
        singer: "房东的猫",
        url: require("../assets/songs/房东的猫 - 我可以.mp3"),
        image: require("../assets/images/我可以.png"),
        playTime: "4:31",
        isCollected: true,
      },
      {
        id: "004",
        musicName: "海色",
        singer: "小柔Channel",
        url: require("../assets/songs/小柔Channel - 海色.mp3"),
        image: require("../assets/images/海色.png"),
        playTime: "4:33",
        isCollected: true,
      },
      {
        id: "005",
        musicName: "你是路过的风",
        singer: "邓阿九",
        url: require("../assets/songs/邓阿九 - 你是路过的风.mp3"),
        image: require("../assets/images/邓阿九 - 你是路过的风.png"),
        playTime: "2:34",
        isCollected: true,
      },
      {
        id: "006",
        musicName: "一时兴起",
        singer: "李心月",
        url: require("../assets/songs/李心玥 - 一时兴起.mp3"),
        image: require("../assets/images/李心玥 - 一时兴起.png"),
        playTime: "3:37",
        isCollected: true,
      },
      {
        id: "007",
        musicName: "起风了",
        singer: "买辣椒也用券",
        url: require("../assets/songs/买辣椒也用券 - 起风了 (旧版).mp3"),
        image: require("../assets/images/起风了.png"),
        playTime: "5:12",
        isCollected: true,
      },
      {
        id: "008",
        musicName: "在你的身边",
        singer: "盛哲",
        url: require("../assets/songs/盛哲 - 在你的身边.mp3"),
        image: require("../assets/images/盛哲 - 在你的身边.png"),
        playTime: "4:22",
        isCollected: true,
      },
      {
        id: "009",
        musicName: "Yoohsic Roomz",
        singer: "Eutopia",
        url: require("../assets/songs/Yoohsic Roomz - Eutopia.mp3"),
        image: require("../assets/images/Yoohsic Roomz - Eutopia.png"),
        playTime: "4:52",
        isCollected: true,
      },
    ],
    //当前播放的歌曲的索引
    current: +localStorage.getItem("current") || 0,
    //是否播放
    isPlay: false,
    // 播放模式，三种，单曲循环，随机播放，顺序播放
    playStyle: +localStorage.getItem("playStyle") || 1,
  },
  getters: {
    getNumOfSong(state) {
      return state.musicList.length;
    },
  },
};
