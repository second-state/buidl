interface PromFunc {
  (): Promise<any>;
}

export default {
  leastDelay: (f: PromFunc, delay: number, done: Function): void => {
    let delayReached = false;
    let funcResolved = false;
    setTimeout(() => {
      if (funcResolved) {
        done();
        return;
      }
      delayReached = true;
    }, delay);

    f().then(() => {
      if (delayReached) {
        done();
        return;
      }
      funcResolved = true;
    });
  }
};
