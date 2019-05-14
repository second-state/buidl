import { Vue } from 'vue-property-decorator';

export function findComponentsDownward (context: Vue, componentName: string): Vue[] {
  return context.$children.reduce<Vue[]>((components, child) => {
      if (child.$options.name === componentName) components.push(child);
      const foundChilds = findComponentsDownward(child, componentName);
      return components.concat(foundChilds);
  }, []);
}