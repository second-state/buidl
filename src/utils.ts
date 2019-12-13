import { Vue } from "vue-property-decorator";
import { CreateElement } from "vue";
import { RenderContext } from "vue/types/options";

const isServer = Vue.prototype.$isServer;

export function findComponentsDownward(
  context: Vue,
  componentName: string
): Vue[] {
  return context.$children.reduce<Vue[]>((components, child) => {
    if (child.$options.name === componentName) {
      components.push(child);
    }
    const foundChilds = findComponentsDownward(child, componentName);
    return components.concat(foundChilds);
  }, []);
}

export const MutationObserver = isServer
  ? false
  : (window as any).MutationObserver ||
    (window as any).WebKitMutationObserver ||
    (window as any).MozMutationObserver ||
    false;

export const Render = {
  name: "RenderCell",
  functional: true,
  props: {
    render: Function
  },
  render: (h: CreateElement, ctx: RenderContext) => {
    return ctx.props.render(h);
  }
};

export const PQ: any = {};
const s = window.location.search;
if (s && s.indexOf("?") == 0) {
  const qs = s.substring(1).split("&");
  for (let i = 0; i < qs.length; i++) {
    const qss = qs[i].split("=");
    if (qss.length === 2) {
      PQ[qss[0]] = qss[1] && decodeURIComponent(qss[1]);
    }
  }
}
