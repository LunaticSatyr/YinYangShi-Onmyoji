# YinYangShi-Onmyoji
A project I make to help my girlfriend experiment with the game

Note: I wrote variables in Chinese to help my girlfriend develop a better understanding to what these mess of words actually do, and I'm sorry if you can't read Chinese 😅

若我的小程序能够帮助到你，我很荣幸
有意见的地方，随时都可以反馈到我的邮箱 😁
不过不担保我会马上修改哦 🤣😜

I felt genuine surprise from what I've learned from this project!
1.  I know that I will be using fetch and async/await, dealing with promises and array functions,
    but using async/await in tandem with Promise.all() and Array.map is simply AMAZING! Just like magic! 🤩
    Just to clarify, I'm already familiar with all their usage before this project.
    I always thought the for-of loop implemented in ES6 as the "cool kid" created to replace forEach loop to reduce callback usage,
    but essentially has the same function and serve the same purpose, BUT BOY WAS I WRONG! 🤣
    Apparently, async/await in for-of loop and forEach loop behaves differently!
    Based on what I've done in this project, using async/await on forEach loop like that:
    `
    (async () => {
      Array.forEach( async element => {
        /*
          code block with some await statements (Part A)
        */
      });
      // Code after forEach loop (Part B)
    })();            <-------------------------- wrapping the function with parentheses followed by parentheses causes the function to run once.
    // Code after function is run (Part C)
    `
    causes Part B and Part C to run before Part A.
    In other words, the code after forEach loop and the function itself DOES NOT WAIT for the code block inside the forEach loop,
    which isn't preferable in my case as I needed Part B and C to process the results I got from Part A.
    I then tried:
    `
    (async () => {
      Array.forEach( async element => {
        /*
          code block with some await statements (Part A)
        */
      });
      // Code after forEach loop (Part B)
      return a promise
    })()
    .then( res => something (Part C))
    `
    but the then statement changed nothing as Part B and C still run before Part A.
    
    I changed my function to:
    `
    (async () => {
      for await (let element of Array) {
        /*
          code block with some await statements (Part A)
        */
      }
      // Code after for-of loop (Part B)
    })();
    // Code after function is run (Part C)
    `
    and this time, it works as expected! (well... sort of but not really... but better than the last one)
    Everything inside Part A is run first, then processed by codes in Part B, then by codes in Part C. (the bright side)
    However, the await statements in Part A was running sequentially, which kind of kills the purpose of "await".
    
    After researching on StackOverflow, I reached this page: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    and I implemented:
    `
    (async () => {
      await Promise.all(Array.map(element => {
        /*
          code block with some await statements (Part A)
        */
      }));
      // Code after array map function (Part B)
    })();
    // Code after function is run (Part C)
    `
    THIS IS AMAZING! Every promise in Part A is processed at the same time! Even better,
    The program will WAIT for ALL the promises in Part A to be resolved first before proceeding to Part B and then Part C!
    I actually wrapped Part A with console.time() and console.timeEnd(), and the efficiency of the code was boosted by about 10 times!
    for-of loop takes 324.156 seconds but Promise.all(Array.map()) takes only 31.392 seconds!
    The time fluctuates a little, and it is affected by internet speed as well but yeah, THIS IS AMAZING! 🤩
    
2.  I know that it is not preferable or rarely used, but I have my quirks and I enjoy exploring what I'm familiar with,
    so I implemented dynamic variable names 😍😝
    With a prior understanding to string literal, after learning how the function eval() works, it's actually really simple to implement.
    For people interested, these helped me in understanding
    String Literals: (I actually forgot where I learned it first but this guide is very good too!) 
                     https://developers.google.com/web/updates/2015/01/ES6-Template-Strings
    Dynamic variable names: https://www.geeksforgeeks.org/how-to-use-dynamic-variable-names-in-javascript/
