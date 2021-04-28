import { Vue } from "./observer/index";
// import { evaluate } from 'mathjs'
// import * as math from "mathjs";

const el = document.getElementById("main");
console.log(el);
const vue$ = new Vue(
  {
    main: "Hello Vue",
  },
  el,
  "main"
);

console.log(vue$);
// console.log(math);

// console.log(math);
// console.log(math.chain(math.bignumber(12.11)).add(math.bignumber(12.2)).done());
// console.log(
//   math.format(
//     math.chain(math.bignumber(12.11)).add(math.bignumber(12.2)).done()
//   )
// );
// console.log(
//   math.format(
//     math.chain(math.bignumber("12.11")).add(math.bignumber("12.2")).done()
//   )
// );
// console.log(
//   math.chain(math.bignumber(12.11)).multiply(math.bignumber(12.2)).done()
// );

window.setTimeout(() => {
  vue$.data.main = "Hello SelfVue";
  console.log("main changed");
}, 1000);

export { Vue };
