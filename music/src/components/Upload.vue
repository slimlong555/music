<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
          border-gray-400 text-gray-400 transition duration-500 hover:text-white
          hover:bg-green-400 hover:border-green-400 hover:border-solid"
           :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
           @drag.prevent.stop=""
           @dragstart.prevent.stop=""
           @dragend.prevent.stop="is_dragover = false"
           @dragover.prevent.stop="is_dragover = true"
           @dragenter.prevent.stop="is_dragover = true"
           @dragleave.prevent.stop="is_dragover = false"
           @drop.prevent.stop="upload($event)">
        <h5>Drop your files here</h5>
      </div>
      <input type="file"
             multiple
             @change="upload($event)" /> <!-- 文件输入可以接受多个上传。 -->
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4"
           v-for="upload in uploads"
           :key="upload.name">
        <!-- File Name -->
        <div class="font-bold text-sm"
             :class="upload.text_class">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div class="transition-all progress-bar"
               :class="upload.variant"
               :style="{ width: upload.current_progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase';

export default {
  name: 'Upload',
  data () {
    return {
      is_dragover: false,
      uploads: [],
    };
  },
  props: ['addSong'],
  methods: {
    upload ($event) {
      this.is_dragover = false;

      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files] // 这种语法是将对象转换为数组的一种巧妙方法，我们正在传播对象属性
        : [...$event.target.files];
      // 此属性已定义事件是拖放事件，如果它是不同的，它将不存在
      // 如果这个条件为真，将要将文件变量设置为事件，
      files.forEach((file) => {
        if (file.type !== 'audio/ogg') {
          return;
        } // 回调函数将在每次迭代中接收文件。一共有三个参数，分别是file,index,array。
        // 接下来，我们要在循环当前迭代中对单个文件执行验证，如果用户尝试上传音频文件以外的文件将拒绝该文件.
        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: "100",
            name: file.name,
            variant: "bg-red-400",
            icon: "fas fa-times",
            text_class: "text-red-400",
          });
          return;
        } // 处理离线时上传

        const storageRef = storage.ref(); // 我们正在创建对存储的引用，该引用代表我们存储中的路径，也就是music-c9b05.appspot.com
        const songsRef = storageRef.child(`songs/${file.name}`); // child方法会创建另一个引用，child和reference的主要区别是子函数将创建一个相对于父引用的路径。
        //而这个例子，父引用是存储引用。与上次不同的是，我们正在专门为用户上传的音频文件创建一个单独的参考。此路径将导致指向我们的Bucket的引用，并附有路径。也就是music-c9b05.appspot.com/songs.example.mp3
        const task = songsRef.put(file); // Firebase在创建任务变量后立即将函数返回的对象称为任务快照。

        const uploadIndex = this.uploads.push({
          task,
          current_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        }) - 1; // 我们将其推入是因为我们可能需要在循环之外引用任务，例如取消上传或从中检索数据。
        //我们可以从长度中减去一个来获得数组中最新项目的索引。
        task.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // 这两个属性都会帮助我们计算上传的进度。
          this.uploads[uploadIndex].current_progress = progress;
        },// 这个函数会让我们监听对象上的事件
          (error) => {
            this.uploads[uploadIndex].variant = 'bg-red-400';
            this.uploads[uploadIndex].icon = 'fas fa-times';
            this.uploads[uploadIndex].text_class = 'text-red-400';
            console.log(error);
          }, async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0,
            };
            // 如果他们更新名称，那么我们将不得不向firebase发出两次请求，一次向数据库发出请求,另一个到存储重命名文件以将这些请求减半。
            // 我们可以让一个属性保存原始名称，另一个属性保存修改后的名称
            song.url = await task.snapshot.ref.getDownloadURL(); // 这个函数将返回一个promise，我们将使用async方法来处理
            const songRef = await songsCollection.add(song);
            const songSnapshot = await songRef.get();
            // 添加歌曲功能需要Snapshot，而不是reference。可以用get获取
            this.addSong(songSnapshot);
            // 通过传递文件，引用将能够将其数据推送到这些歌曲的托管中


            // 有两个函数可以将文档添加到集合中,set和add,该功能是我们用来将用户添加到用户集合中的功能。
            // 两者之间的区别在于set函数将允许您将自定义id分配给文档
            // add函数将指示Firebase为您生成一个id


            this.uploads[uploadIndex].variant = 'bg-green-400';
            this.uploads[uploadIndex].icon = 'fas fa-check';
            this.uploads[uploadIndex].text_class = 'text-green-400';
          });
      });

      console.log(files);
    },
    cancelUploads () {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    },
  },
  beforeUnmount () {
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  }, // 此函数将在卸载组件之前运行，将可以访问数据方法和计算存储在组件中的属性将要在卸载组件之前取消上传
};
</script>

<!-- reference是指向应用程序中某个位置的对象。到目前为止，我们已经了解到我们可以通过指向一个位置来创建对数据库或存储的引用。
在应用程序中，我们可以对该位置执行读写等操作。我们使用reference将文件上传到存储并将数据添加到数据库。
reference可以创建其他reference。 -->
<!-- snapshot是objects，是应用程序中某个位置的copy，只读且不可变。不可变意味着它们无法更新。
每当我们对应用程序进行更改时，这些更改都不会反映在Firebase中。Firebase通常会使用快照进行响应。
snapshot的一个例子是当我们最初上传到Firebase时，我们能够使用snapshot以收集有关正在进行的上传的信息。 -->
<!-- snapshot可以使应用程序运行得更快 -->
<!-- 每当您使用reference监听更改时，您都无法直接创建snapshot。它是在活动期间为您创建的。
 -->