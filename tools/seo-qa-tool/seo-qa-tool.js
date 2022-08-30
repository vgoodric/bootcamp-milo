
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
console.log(window.location.href)
setConfig({url});
};
export default seaQaTool;