<template>
  <!-- Registration Form,它将帮助我们验证表单中的每个输入字段是否有效，表单组件将生成一个默认情况下将包装组件的标签。 -->
  <div class="text-white text-center font-bold p-4 rounded mb-4"
       v-if="reg_show_alert"
       :class="reg_alert_variant">
    {{ reg_alert_msg }}
  </div>
  <vee-form :validation-schema="schema"
            @submit="register"
            :initial-values="userData">
    <!-- validation-schema允许我们将规则外包到一个对象中。 -->
    <!-- Name  字段组件负责验证单个输入，它会默认生成一个输入标签。-->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field type="text"
                 name="name"
                 class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                 placeholder="Enter Name" />
      <ErrorMessage class="text-red-600"
                    name="name" />
    </div>
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
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field name="age"
                 type="number"
                 class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded" />
      <ErrorMessage class="text-red-600"
                    name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password"
                 :bails="false"
                 v-slot="{ field, errors }">
        <input class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
               type="password"
               placeholder="Password"
               v-bind="field" />
        <div class="text-red-600"
             v-for="error in errors"
             :key="error">
          {{ error }}
        </div>
      </vee-field>
    </div>
    <!-- bails 属性将告诉字段组件不要使用快速退出。这意味着将检查每条规则，即使先前的规则被破坏。 -->
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field name="confirm_password"
                 type="password"
                 class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
                 placeholder="Confirm Password" />
      <ErrorMessage class="text-red-600"
                    name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field as="select"
                 name="country"
                 class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="China">China</option>
        <option value="Antarctica">Antarctica</option>
      </vee-field>
      <ErrorMessage class="text-red-600"
                    name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field name="tos"
                 value="1"
                 type="checkbox"
                 class="w-4 h-4 float-left -ml-6 mt-1 rounded" />
      <label class="inline-block">Accept terms of service</label>
      <ErrorMessage class="text-red-600 block"
                    name="tos" />
      <!--  加了block使得错误提示在新的一行 -->
    </div>
    <button type="submit"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
            :disabled="reg_in_submission">
      Submit
    </button>
  </vee-form>
</template>

<script>
export default {
  name: "RegisterForm",
  data () {
    return {
      tab: "login",
      schema: {
        name: "required|min:3|max:100|alpha_spaces",
        email: "required|min:3|max:100|email",
        age: "required|min_value:18|max_value:100",
        password: "required|min:9|max:100|excluded:password",
        confirm_password: "passwords_mismatch:@password",
        country: "required|country_excluded:Antarctica",
        tos: "tos",
      },
      userData: {
        country: "China",
      },
      reg_in_submission: false,
      reg_show_alert: false,
      reg_alert_variant: "bg-blue-500",
      reg_alert_msg: "Please wait! Your account is being created.",
    };
  },
  methods: {
    register (values) {
      this.reg_show_alert = true;
      this.reg_in_submission = true;
      this.reg_alert_variant = "bg-blue-500";
      this.reg_alert_msg = "Please wait! Your account is being created.";

      this.reg_alert_variant = "bg-green-500";
      this.reg_alert_msg = "Success! Your account has been created.";
      console.log(values);
    },
  },
};
</script>

