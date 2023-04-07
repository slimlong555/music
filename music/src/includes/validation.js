import {Form as VeeForm, Field as VeeField} from "vee-validate";

export default {
   install(app){
		 app.component("VeeForm", VeeForm)
		 app.component("VeeField", VeeField)
     
	 },
} // app参数是对vue的引用，options参数是从vue传递到插件的附加数据