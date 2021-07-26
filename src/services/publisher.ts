import axios from "axios";

const GHP_BASE = "https://opendapps.secondstate.io/";
const GHA_BASE = "https://api.github.com/repos/second-state/opendapps/git/";

const GHA_URL = {
  REFS: GHA_BASE + "refs/heads/master",
  TREES: GHA_BASE + "trees",
  COMMITS: GHA_BASE + "commits"
};

const GHA_TOKEN =
  "token " + process.env.VUE_APP_DAPPS_COMMIT_TOKEN;

axios.defaults.headers.common["Authorization"] = GHA_TOKEN;
axios.defaults.headers.post["Content-Type"] = "application/json";

function ErrorHandler(step: string, cb: Function) {
  return (error: any) => {
    console.log(`Error occured on step ${step}`);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
    cb(error);
  };
}

export default function(title: string, content: string, cb: Function) {
  const pageName =
    title.replace(/\s+/g, "_").replace(/\W/g, "") +
    "_" +
    new Date().getTime() +
    ".html";
  axios
    .get(GHA_URL.REFS)
    .then(response => {
      cb(null, { progress: 20 });
      const commitUrl = response.data.object.url;
      axios
        .get(commitUrl)
        .then(response => {
          cb(null, { progress: 40 });
          const baseCommitSha = response.data.sha;
          const baseTreeSha = response.data.tree.sha;
          axios
            .post(GHA_URL.TREES, {
              base_tree: baseTreeSha,
              tree: [
                {
                  path: `${pageName}`,
                  mode: "100644",
                  type: "blob",
                  content: content
                }
              ]
            })
            .then(response => {
              cb(null, { progress: 60 });
              const newTreeSha = response.data.sha;
              axios
                .post(GHA_URL.COMMITS, {
                  message: title,
                  parents: [baseCommitSha],
                  tree: newTreeSha
                })
                .then(response => {
                  cb(null, { progress: 80 });
                  const newCommitSha = response.data.sha;
                  axios
                    .patch(GHA_URL.REFS, {
                      sha: newCommitSha
                    })
                    .then(response => {
                      setTimeout(() => {
                        cb(null, { progress: 100, url: GHP_BASE + pageName });
                      }, 15 * 1000);
                    })
                    .catch(ErrorHandler("Update Refs", cb));
                })
                .catch(ErrorHandler("Create Commit", cb));
            })
            .catch(ErrorHandler("Create Tree", cb));
        })
        .catch(ErrorHandler("Get Commit", cb));
    })
    .catch(ErrorHandler("Get Refs", cb));
}
