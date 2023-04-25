<template>
  <!-- Main Content -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload"
                    :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <composition-item v-for="(song, i) in songs"
                              :key="song.docID"
                              :song="song"
                              :updateSong="updateSong"
                              :index="i"
                              :removeSong="removeSong"
                              :updateUnsavedFlag="updateUnsavedFlag" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import useUserStore from "@/stores/user";
import AppUpload from "@/components/Upload.vue";
import { songsCollection, auth } from "@/includes/firebase";
import CompositionItem from "@/components/CompositionItem.vue";

export default {
  name: "Manage",
  components: {
    AppUpload,
    CompositionItem,
  },
  data () {
    return {
      songs: [],
      unsavedFlag: false,
    };
  },
  async created () {
    const snapshot = await songsCollection
      .where("uid", "==", auth.currentUser.uid) // where函数帮助我们在一天结束时过滤文档。
      .get();
    // 从数据库请求数据

    snapshot.forEach(this.addSong);
  },
  methods: {
    updateSong (i, values) {
      this.songs[i].modified_name = values.modified_name;
      this.songs[i].genre = values.genre;
    }, // i参数将是更新Manege组件的对象的索引，不知道是哪首歌更新。
    // values参数将是带有歌曲名称和流派的表单数据。
    removeSong (i) {
      this.songs.splice(i, 1); // splice函数将从数组中删除项目
    },
    addSong (document) {
      const song = {
        ...document.data(),
        docID: document.id,
      }; // 这个函数会暂时中断页面，因为我们没有在创建的内容中推送任何内容

      this.songs.push(song);
    },
    updateUnsavedFlag (value) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave (to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const leave = confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      next(leave);
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancelUploads();
  //   next();
  // },
  // beforeRouteEnter(to, from, next) {
  //   const store = useUserStore();

  //   if (store.userLoggedIn) {
  //     next();
  //   } else {
  //     next({ name: "home" });
  //   }
  // },
};
</script>
