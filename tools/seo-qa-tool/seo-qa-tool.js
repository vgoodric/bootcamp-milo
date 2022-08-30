
const [setConfig, getConfig] = (() => {
  let config = {};
  return [
    (c) => {
      config = { ...config, ...c };
      return config;
    },
    () => config,
  ];
})();

const seaQaTool = ({url=''} = {}) => {
console.log("hi")
setConfig({url});
console.log(url);
};
export default seaQaTool;