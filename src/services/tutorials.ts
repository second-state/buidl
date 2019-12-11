import axios from "axios";

const GHA_BASE =
  "https://api.github.com/repos/second-state/opendapps/contents/tutorials/";

export default {
  getAll(cb: Function) {
    axios
      .get(GHA_BASE + "all.json")
      .then(response => {
        if (response.status === 200) {
          cb(JSON.parse(atob(response.data.content)));
        } else {
          cb(false);
        }
      })
      .catch((e: Error) => {
        console.error(e);
        cb(false);
      });
  },

  getFile(file: String, cb: Function) {
    axios
      .get(GHA_BASE + file)
      .then(response => {
        if (response.status === 200) {
          cb(atob(response.data.content));
        } else {
          cb(false);
        }
      })
      .catch((e: Error) => {
        console.error(e);
        cb(false);
      });
  }
};
