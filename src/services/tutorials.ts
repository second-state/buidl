import axios from "axios";
import { PQ } from "../utils";

const repo = PQ["tutorial"];

let GHA_BASE =
  "https://api.github.com/repos/second-state/opendapps/contents/tutorials/";

if (repo) {
  const repoMatch = repo.match(/([^/]+\/[^/]+)\/(.+)/);
  if (repoMatch && repoMatch.length === 3) {
    GHA_BASE = `https://api.github.com/repos/${repoMatch[1]}/contents/${
      repoMatch[2]
    }/`;
  }
}

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
    if (!file) {
      cb("");
      return;
    }
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
