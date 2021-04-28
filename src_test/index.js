import printMe from './print.js';
import './style.css';
import { cube } from './math.js';

function component() {
  var element = document.createElement('div');
  var btn = document.createElement('button');

  element.innerHTML = ['Hello', 'webpack'].join();
  element.classList.add('hello');

  btn.innerHTML = 'Click me and check the console!' + cube(5);
  btn.onclick = printMe;

  element.appendChild(btn);

  return element;
}

document.body.appendChild(component());

// console.log(module);

if (module.hot) {
  module.hot.accept('./print.js', function () {
    console.log('Accepting the updated printMe module!');
    printMe();
  })
}