// console.time('var')
//     var v = 1
// console.timeEnd('var')
// console.time('let')
//     let l = 1
// console.timeEnd('let')
// console.time('without type');
//     h = 1;
// console.timeEnd('without type');
// console.time('const')
//     const variable = 1
// console.timeEnd('const')
// console.time('old')
// function old(){
//     console.log('hello')
// }
// console.timeEnd('old')
// console.time('variable')
// const variableF = function(){
//     console.log('hello')
// }
// console.timeEnd('variable')
// console.time('arrow')
// const arrow = () => {
//     console.log('hello')
// }
// console.timeEnd('arrow')

let t = new Date(1583193600000).toISOString().slice(0, 10)
console.log(t)