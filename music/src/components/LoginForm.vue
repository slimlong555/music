<template>
  <div class="text-white text-center font-bold p-4 mb-4"
       v-if="login_show_alert"
       :class="login_alert_variant">
    {{ login_alert_msg }}
  </div>
  <vee-form :validation-schema="loginSchema"
            @submit="login"> <!-- submit event：首先，它会在运行表达式中的函数之前强制执行验证，如果在任何字段中验证失败，它将不会运行表达式。其次，它会阻止页面在提交表单时刷新。 -->
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field name="email"
                 type="email"
                 class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                 placeholder="Enter Email" />
      <ErrorMessage class="text-red-600"
                    name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password"
                 type="password"
                 class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                 placeholder="Password" />
      <ErrorMessage class="text-red-600"
                    name="password" />
    </div>
    <button type="submit"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            :disabled="login_in_submission">
      Submit
    </button>
  </vee-form>
</template>


<script>
import { mapActions } from "pinia";
import useUserStore from "@/stores/user";

export default {
  name: "LoginForm",
  data () {
    return {
      loginSchema: {
        email: "required|email",
        password: "required|min:9|max:100",
      },
      login_in_submission: false,
      login_show_alert: false,
      login_alert_variant: "bg-blue-500",
      login_alert_msg: "Please wait! We are logging you in.",
    };
  },
  methods: {
    ...mapActions(useUserStore, ["authenticate"]),
    async login (values) {
      this.login_show_alert = true;
      this.login_in_submission = true;
      this.login_alert_variant = "bg-blue-500";
      this.login_alert_msg = "Please wait! We are logging you in.";

      try {
        await this.authenticate(values);
      } catch (error) {
        this.login_in_submission = false;
        this.login_alert_variant = "bg-red-500";
        this.login_alert_msg = "Invalid login details.";
        return;
      }

      this.login_alert_variant = "bg-green-500";
      this.login_alert_msg = "Success! You are now logged in.";
      window.location.reload();
    },
    // value参数是我们保存电子邮件和密码输入值的地方。
  },
};
</script>
