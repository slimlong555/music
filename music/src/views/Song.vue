<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
           style="background-image: url(/assets/img/song-header.png)"></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button @click.prevent="newSong(song)"
                type="button"
                class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none">
          <i class="fas fa-play"></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modified_name }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(1, "currency", "zh") }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6"
             id="comments">
      <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">{{ $tc("song.comment_count", song.comment_count,{ count: song.comment_count}) }}</span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i> <!-- 第二个参数将用于确定要使用的路径中的哪条消息将传入歌曲和计数。最后一个参数是占位符的值。 -->
        </div>
        <div class="p-6">
          <div class="text-white text-center font-bold p-4 mb-4"
               v-if="comment_show_alert"
               :class="comment_alert_variant">
            {{ comment_alert_message }}
          </div>
          <vee-form :validation-schema="schema"
                    @submit="addComment"
                    v-if="userLoggedIn"><!-- 表单检验 --> <!-- @submit="addComment"监听提交事件 -->
            <vee-field as="textarea"
                       name="comment"
                       class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
                       placeholder="Your comment here..."></vee-field> <!-- 这将验证输入，字段组件将与任何HTML表单输入元素一起使用 -->
            <ErrorMessage class="text-red-600"
                          name="comment" />
            <button type="submit"
                    class="py-1.5 px-3 rounded text-white bg-green-600 block"
                    :disabled="comment_in_submission">
              Submit
            </button>
          </vee-form>
          <!-- Sort Comments -->
          <select v-model="sort"
                  class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li class="p-6 bg-gray-50 border border-gray-200"
          v-for="comment in sortedComments"
          :key="comment.docID">
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>{{ comment.content }}</p> <!-- 我们使用我们赋予它们属性的名称来访问数据库中的正确值。 -->
      </li>
    </ul>
  </main>
</template>

<script>
import { songsCollection, auth, commentsCollection } from "@/includes/firebase";
import { mapState, mapActions } from "pinia";
import useUserStore from "@/stores/user";
import usePlayerStore from "@/stores/player";

export default {
  name: "Song",
  data () {
    return {
      song: {},
      schema: {
        comment: "required|min:3", // 验证评论最少三个
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500",
      comment_alert_message: "Please wait! Your comment is being submitted",
      comments: [],
      sort: "1",
    };
  },
  computed: {
    ...mapState(useUserStore, ["userLoggedIn"]),// 在计算对象内部，使用扩展运算符调用映射状态函数。
    sortedComments () {
      return this.comments.slice().sort((a, b) => {
        if (this.sort === "1") {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        // 在进行适当的比较之前，必须将日期转换为字符串进行存储。
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    }, // 计算机属性将返回，评论是排序的，我们可以对数组进行排序
  },
  async created () {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get();

    if (!docSnapshot.exists) {
      this.$router.push({ name: "home" });
      return;
    }

    const { sort } = this.$route.query;

    this.sort = sort === "1" || sort === "2" ? sort : "1";

    this.song = docSnapshot.data();
    this.getComments();
  },
  methods: {
    ...mapActions(usePlayerStore, ["newSong"]),
    async addComment (values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = "bg-blue-500";
      this.comment_alert_message =
        "Please wait! Your comment is being submitted";

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,  /* 歌曲的名字 */
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,  /* 我们存储用户的id作为额外的预防措施。 */
      };

      await commentsCollection.add(comment);

      this.song.comment_count += 1;
      await songsCollection.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count,
      });

      this.getComments();

      this.comment_in_submission = false;
      this.comment_alert_variant = "bg-green-500";
      this.comment_alert_message = "Comment added!";

      resetForm();
    },
    async getComments () {
      const snapshots = await commentsCollection
        .where("sid", "==", this.$route.params.id)
        .get();

      this.comments = [];

      snapshots.forEach((doc) => {
        this.comments.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    },
  },
  watch: {
    sort (newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }

      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};
</script>
