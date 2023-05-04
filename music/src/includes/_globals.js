import upperFirst from "lodash/upperFirst";
import  camelCase  from "lodash/camelCase";

export default {
  install(app) {
    const baseComponents = import.meta.glob("../components/base/*.vue", {
      eager: true, // 启用此选项将强制函数立即加载模块。
    });

    Object.entries(baseComponents).forEach(([path, module]) => {
      const componentName = upperFirst(
        camelCase(
          path
            .split("/") // split函数会将字符串拆分为一个数组。
            .pop()  // pop函数抓住最后一项。
            .replace(/\.\w+$/, "") // 正则表达式将从文件名中删除扩展名。
        ) // path变量将包含文件的完整路径。
      ); // Object.entries会将每个属性转换为一个数组，其中数组中的第一项包含键，第二项包含值。
      //console.log(path, componentName);

      // export default
      app.component(`Base${componentName}`, module.default);
    }); // Base前缀将有助于防止与其他组件发生命名冲突。
  }, // low dash
};
