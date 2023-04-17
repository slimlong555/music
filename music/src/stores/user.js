import { defineStore } from "pinia";
import { auth, usersCollection } from "@/includes/firebase";



export default defineStore("user", {
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async register(values) {
      const userCred = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      await usersCollection.doc(userCred.user.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      });
			/* 文档功能允许您选择集合中的文档。如果文档不存在，文档函数将创建该文档。这个函数让我们有机会为文档分配一个id */
			/* 该对象没有附带一个名为id的函数，并表示我们需要将其更改为set */
      /* set 函数将添加或修改文档中的现有属性。*/      
      await userCred.user.updateProfile({
        displayName: values.name,
      }); 

      this.userLoggedIn = true;
    },
    async authenticate(values) {
      await auth.signInWithEmailAndPassword(values.email, values.password);

      this.userLoggedIn = true;
    },
    async signOut() {
      await auth.signOut();

      this.userLoggedIn = false;
    },
  },
});