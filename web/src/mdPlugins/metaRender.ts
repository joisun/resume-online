import yaml from "js-yaml";

export default (md: any, fm: string) => {
  // 解析 YAML 字符串为对象
  let fmObject;
  try {
    fmObject = yaml.load(fm);
  } catch (e) {
    console.error("Failed to parse YAML:", e);
    fmObject = {}; // 如果解析失败，使用一个空对象
  }

  // 注册一个新的 block-level 插件
  md.core.ruler.push("render_yaml_meta", (state: any) => {
    // 检查是否已经处理过，避免重复执行
    if (state.fmRendered) return;
    // 确保 fmObject 是一个有效的对象
    if (typeof fmObject === "object" && fmObject !== null) {
      // 将 fmObject 转换为 HTML 内容
      const metaHtml = render(fmObject);

      // 将生成的 HTML 插入到渲染流的开头
      state.tokens.unshift({
        type: "html_block",
        content: `<div class="meta-info">${metaHtml}</div>`,
        block: true,
        level: 0,
      });

      // 标记已经处理过，避免重复执行
      state.fmRendered = true;
    }
  });
};

function render(obj: object) {
  return Object.entries(obj)
    .map(([key, value]) => {
      const type = value.type;
      switch (type) {
        case "profile":
          return renderProfile(key, value);
        case "list":
          return renderList(key, value);
        default:
          throw new Error("meta 未知类型");
      }
    })
    .join("");
}
function renderProfile(_key: string, value: any) {
  const title = value.title;
  const subtitle = value.subtitle;
  return `<div class="meta-profile">
  <h2>${title}</h2>
  <ul class="meta-profile-list">${subtitle
    .map(({ label, value }: any, index: number) => {
      return `<li class="meta-profile-item">${
        label ? `<strong>${label}:</strong>` : ""
      } ${value}${`${
        index === subtitle.length - 1 ? "" : "&nbsp;<i>|</i>&nbsp;"
      }`}</li>`;
    })
    .join("")}</ul>
</div>`;
}
function renderList(_key: string, value: any) {
  const set = value.set;
  return `
<ul class="meta-list">
    ${set
      .map(
        (
          { label, value, isLink, hideValue, icon, iconInside }: any,
          index: number
        ) => {
          return `<li class="meta-list-item">${
            iconInside ? " " : icon ? icon : ""
          }${label ? `<strong>${label}:</strong>` : ""}${
            isLink
              ? `<a href="${value}" target='_blank'>${
                  icon && iconInside ? icon : ""
                } ${hideValue ? " " : value}</a>`
              : value
          }${`${index === set.length - 1 ? "" : "&nbsp;<i>|</i>&nbsp;"}`}</li>`;
        }
      )
      .join("")}
</ul>`;
}
