// some convenient shorthands
function $id(x) {
  return document.getElementById(x);
}
function $class(x){
  return document.getElementsByClassName(x);
}
function $tag(x){
  return document.getElementsByTagName(x);
}
// I'm still not 100% sure how this works, will come back to this after everything is done.
const sleep = s => new Promise(res => setTimeout(res, s*1000));

背景动图: {
  
  /*  This is the old method I used to directly get image from official 阴阳师 server.
  I then learn that if I want to make my website live, I'll get error 403 when request image using the same method
  I proceed to download and upload all those necessary images to my github profile for easy access
  */
  /*
  class imgSrc {
    constructor(a, b, c, d, e){
      this.folder = a;
      this.subfolder = b;
      this.first = c;
      this.last = d;
      this.format = e;
    }
  }
  const imgSources = [new imgSrc(20220311, null, 1, 11, "jpg"),
                      new imgSrc(20220224, null, 1, 25, "jpg"),
                      new imgSrc(20220210, null, 1, 27, "jpg"),
                      new imgSrc(20211130, null, 1, 14, "png"),
                      new imgSrc(20210826, null, 1, 11, "jpg"),
                      new imgSrc(20210720, null, 1, 16, "jpg"),
                      new imgSrc(20210527, null, 1, 18, "jpg"),
                      new imgSrc(20210421, null, 1, 14, "jpg"),
                      new imgSrc(20210317, null, 1, 13, "jpg"),
                      new imgSrc(20210106, null, 1, 12, "jpg"),
                      new imgSrc(20201201, null, 1, 4, "jpg"),
                      new imgSrc(20201027, null, 1, 22, "jpg"),
                      new imgSrc(20200923, null, 2, 21, "jpg"),
                      new imgSrc(20200729, null, 1, 13, "jpg"),
                      new imgSrc(20200628, null, 1, 21, "jpg"),
                      new imgSrc(20200609, "1/", 1, 11, "jpg"),
                      new imgSrc(20200609, "2/", 1, 11, "jpg"),
                      new imgSrc(20200609, "3/", 1, 16, "jpg"),
                      new imgSrc(20200609, "4/", 1, 6, "jpg"),
                      new imgSrc(20200609, "5/", 1, 8, "jpg")];
  */
  
  const max = 282;
  // const fadeTime = 3;
  let stayTime = 30;
  let opacity = 0.3;
  function loadImg(x) {
    let randImg = Math.floor(Math.random() * max) + 1;
    let format = randImg <= 14 ? "png" : "jpg";
    x.src = `https://raw.githubusercontent.com/LunaticSatyr/YinYangShi-Onmyoji/main/images/background/${randImg}.${format}`;
  }
  loadImg(img1);
  async function changeImage(oldImg, newImg) {
    // oldImg.dataset.opacity = "0";    // dataset is for lines 74-80
    oldImg.style.opacity = 0;
    // await sleep(fadeTime); // 如果要背景图完全消失才换下一张就用这个
    // newImg.dataset.opacity = "1";
    newImg.style.opacity = opacity;
    await sleep(stayTime);
    loadImg(oldImg);
  }
  img1.addEventListener("load", () => changeImage(img2, img1));
  img2.addEventListener("load", () => changeImage(img1, img2));

  // const srcObserver = new MutationObserver( mutations => {
  //   for(let mutation of mutations){
  //     console.log("source changed");
  //     img1.style.opacity = 0;
  //   }
  // });
  // srcObserver.observe(img1, {attributeFilter: ["src"]});

  // window.addEventListener("offline", () => {
  //   console.log("I'm offline now");
  //   window.addEventListener("online", () => {
  //     console.log("I'm online now");
  //     loadImg(background.querySelector('img[data-opacity="0"]'))
  //   });
  // });
  

}
// I think named scope is nice to segregate codes by their purposes / functions
var 式神录, 式神总数, 编号对照位置表, 名字对照位置表 = new Map();
获取式神资料: {
  (async () => {
    let rawData = await fetch("https://raw.githubusercontent.com/LunaticSatyr/YinYangShi-Onmyoji/main/data/%E5%BC%8F%E7%A5%9E%E5%BD%95v3");
    let parsedData = await rawData.json();
    式神录 = parsedData.data;
    式神总数 = parsedData.amount;
    编号对照位置表 = new Map(Object.entries(parsedData.map));
    let count = 0;
    for await(let 式神 of 式神录) {
      let option = document.createElement("option");
      option.textContent = 式神.名字;
      option.value = count++;
      option.dataset.编号 = 式神.编号;
      option.dataset.拼音 = 式神.拼音;
      // using a CSS property instead to achieve multiple background-image at once
      // option.style.backgroundImage = `url("https://yys.res.netease.com/pc/zt/20161108171335/data/shishen/${式神.编号}.png")`;
      option.style.setProperty("--URL", `url(https://yys.res.netease.com/pc/zt/20161108171335/data/shishen/${式神.编号}.png`)
      $tag("template")[1].content.querySelector("datalist").appendChild(option);
      名字对照位置表.set(option.textContent, option.value);
    }
  })().then(generateNewTemplate);
}
// 
function generateNewTemplate() {
  let container = $id("main-grid");
  let template = $tag("template")[0];
  let content = template.content.cloneNode(true);
  container.appendChild(content);
}
// initialization and all kinds of eventlisteners will be added in this function
function get式神名单() {
  let container = $id("main-grid");
  let gridCell = container.lastElementChild; // the latest one
  let circledPlus = gridCell.firstElementChild;
  let template = $tag("template")[1];
  let content = template.content.cloneNode(true);
  gridCell.appendChild(content);

  // ===== some helper variables =====
  let 式神query = gridCell.lastElementChild;
  let input = 式神query.querySelector("input.search-bar");
  let searchIcon = input.previousElementSibling;
  let goIcon = input.nextElementSibling;
  let 式神名单 = 式神query.lastElementChild;
  // a variable that stores the position of the targetted option in the datalist
  let target式神位置 = -1;
  // a variable that stores the select-able options based on user input
  let filtered式神名单 = [];
  // =================================

  // ===== some helper functions =====
  function setTarget式神() {
    if(target式神位置 >= filtered式神名单.length)
      target式神位置 = 0;
    else if(target式神位置 < 0)
      target式神位置 = filtered式神名单.length - 1;
    // really wanted to use Array.at() but it's not supported by older browsers
    let target式神 = 式神名单.options[filtered式神名单[target式神位置]];
    target式神.classList.add("target");
    input.placeholder = target式神.textContent;
    return target式神;
  }
  function removeTarget式神() {
    let target式神 = 式神名单.options[filtered式神名单[target式神位置]];
    target式神?.classList.remove("target");
  }
  function filter式神名单() {
    target式神位置 = -1;
    filtered式神名单 = [];
    input.placeholder = "";
    let text = input.value.toLowerCase();
    for(let option of 式神名单.options) {
      if(option.textContent.includes(text) || option.dataset.拼音.includes(text)) {
        option.style.display = "block";
        filtered式神名单.push(option.value);
      }
      else
        option.style.display = "none";
    }
  }
  function verifyUserInput() {
    if(target式神位置 !== -1)
      return 式神名单.options[filtered式神名单[target式神位置]]?.click();
    if(!input.value && input.placeholder)
      return 式神名单.options[名字对照位置表.get(input.placeholder)].click();
    for(let position of filtered式神名单) {
      let option = 式神名单.options[position];
      if(option.textContent === input.value || option.dataset.拼音 === input.value)
        return option.click();
    }
  }
  // =================================

  // I start by styling the container 式神query,
  let 随机位置 = Math.floor(Math.random() * 式神总数);
  let 随机式神 = 式神录[随机位置];
  let bgImg = document.createElement("img");
  bgImg.setAttribute("class", "background");
  bgImg.src = `https://raw.githubusercontent.com/LunaticSatyr/YinYangShi-Onmyoji/main/images/beforeAwake/${随机式神.编号}.png`;
  bgImg.alt = `${随机式神.名字}.png`;
  bgImg.addEventListener("load", () => {
    // need this if-statement because if the image is loaded after it is removed, it messes with the style of grid-cell
    if(gridCell.lastElementChild === bgImg)
      gridCell.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
    document.activeElement === input ? "" : bgImg.style.opacity = 1;
  });
  gridCell.insertAdjacentElement("beforeend", bgImg);

  // then I add event listeners to options in datalist,
  for(let option of 式神名单.options) {
    filtered式神名单.push(option.value);
    option.addEventListener("mouseenter", () => {
      removeTarget式神();
      target式神位置 = filtered式神名单.indexOf(option.value);
      setTarget式神();
    });
    option.addEventListener("click", (event) => {
      input.value = option.textContent;
      input.blur();
      式神query.classList.add("completed");
      bgImg.style.opacity = 0;
      gridCell.classList.add("no-border");
      gridCell.style.backgroundColor = "transparent";
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
      sleep(1).then(() => {
        // remove 式神query after 1 second
        gridCell.firstElementChild.remove();
      });
      get式神情报(gridCell, 式神录[option.value]);
    });
  }

  // followed by the datalist itself,
  式神名单.addEventListener("mouseleave", () => {
    removeTarget式神();
  });

  // here comes the most important part---the input box,
  input.placeholder = 随机式神.名字;
  input.addEventListener("focus", () => {
    sleep(0.5).then(() => input.placeholder = "");
    bgImg.style.opacity = 0;
    if(input.value !== "")
      filter式神名单();
  });
  input.addEventListener("blur", () => {
    removeTarget式神();
    target式神位置 = -1;
    sleep(0.5).then(() => input.placeholder = 随机式神.名字);
    bgImg.complete ? bgImg.style.opacity = 1 : "";
  });
  input.addEventListener("input", () => {
    filter式神名单();
  });
  input.addEventListener("keydown", event => {
    let target式神, targetRect, container;
    removeTarget式神();
    switch(event.key) {
      case "Escape":
        input.blur();
        break;
      case "Enter":
        verifyUserInput();
        break;
      case "ArrowUp":
        event.preventDefault(); /* I needed preventDefault to make the scrollIntoView works.
        Maybe it's because pressing arrow keys changes the position of the cursor in the input as default, thus hindering the scroll.
        How does it hinder tho, I have absolutely no idea */
        target式神位置--;
        target式神 = setTarget式神();
        if(target式神位置 === filtered式神名单.length - 1)
          return target式神.scrollIntoView({behavior: "smooth", block: "nearest"});
        targetRect = target式神.getBoundingClientRect();
        container = 式神名单.getBoundingClientRect();
        if(targetRect.top < container.top)
          target式神.scrollIntoView({behavior: "smooth", block: "nearest"});
        break;
      case "ArrowDown":
        event.preventDefault();
        target式神位置++;
        target式神 = setTarget式神();
        if(target式神位置 === 0)
          return target式神.scrollIntoView({behavior: "smooth", block: "nearest"});
        targetRect = target式神.getBoundingClientRect();
        container = 式神名单.getBoundingClientRect();
        if(targetRect.bottom > container.bottom)
          target式神.scrollIntoView({behavior: "smooth", block: "nearest"});
        break;
    }
  });

  // and finally, the 2 icons
  searchIcon.addEventListener("click", () => {
    input.focus();
  });
  goIcon.addEventListener("click", () => {
    verifyUserInput();
  });

  generateNewTemplate();
  // circledPlus.remove(); I have no idea why this result to no animation
  // (() => circledPlus.remove())();
  sleep(0.000000000001).then(() => circledPlus.remove());
}

function get式神情报(gridCell, 式神, delay=1, isAwake=0) {
  let template = $tag("template")[2];
  let content = template.content.cloneNode(true);
  // insert 式神情报wrapper as the last child
  gridCell.appendChild(content);
  let 式神情报wrapper = gridCell.lastElementChild;
  sleep(delay).then(() => {
    gridCell.style.border = "3px solid transparent";
    gridCell.style.backgroundColor = "transparent";
    // remove the image
    gridCell.firstElementChild.remove();
  });

  let banner = 式神情报wrapper.firstElementChild;
  banner.firstElementChild.textContent = 式神.名字;

  let 式神情报 = banner.nextElementSibling;
  式神情报.style.backgroundImage = `URL("https://raw.githubusercontent.com/LunaticSatyr/YinYangShi-Onmyoji/main/images/beforeAwake/${式神.编号}.png")`;
  let stats = ["攻击", "生命", "防御", "速度", "暴击", "暴击伤害", "效果命中", "效果抵抗"];
  let data = new Map();
  // a function that processes and stores necessary info that will be displayed into a map
  (() => {
    let 攻击 = [], 生命 = [], 防御 = [], 速度 = [], 暴击 = [], 暴击伤害 = [], 效果命中 = [], 效果抵抗 = [], icons = [[], [], [], [], []];
    let storeData = x => {
      let info = 式神.情报[x];
      for(let i=0; i<5; i++)
        icons[i].push(info[stats[i]].评分);
      攻击.push(Math.floor(info.攻击.数值));
      生命.push(Math.floor(info.生命.数值));
      防御.push(Math.floor(info.防御.数值));
      速度.push(Math.floor(info.速度.数值));
      暴击.push(Math.floor(info.暴击.数值 * 100));
      暴击伤害.push(Math.floor(info.暴击伤害 * 100 + 100));
      效果命中.push(Math.floor(info.效果命中 * 100));
      效果抵抗.push(Math.floor(info.效果抵抗 * 100));
    }
    storeData("觉醒前");
    if(式神.稀有度 !== "SP" && 式神.稀有度 !== "N")
      storeData("觉醒后");
    data.set("攻击", 攻击);
    data.set("生命", 生命);
    data.set("防御", 防御);
    data.set("速度", 速度);
    data.set("暴击", 暴击);
    data.set("暴击伤害", 暴击伤害);
    data.set("效果命中", 效果命中);
    data.set("效果抵抗", 效果抵抗);
    data.set("icons", icons);
  })();
  // a function that gets necessary data to be displayed from the map
  function getData(x) {
    for(let i=0; i<stats.length; i++){
      if(i < 5) {
        let icon = 式神情报.querySelector(`div.${stats[i]} i.score`);
        while(icon.classList.length > 1)
          icon.classList.remove(icon.classList[1]);
        icon.classList.add(data.get("icons")[i][x]);
      }
      let value = 式神情报.querySelector(`div.${stats[i]} div.right > span.initialValue`);
      value.textContent = data.get(stats[i])[x];
    }
  };
  getData(isAwake);
  式神情报.classList.add("fetched");

  // now we add the remove function to the close button
  let closeButton = 式神情报wrapper.querySelector("div.式神情报-wrapper > div.dark-brown-border > i.fa-xmark");
  closeButton.addEventListener("click", () => {
    式神情报wrapper.classList.add("completed");
    sleep(1.75).then(() => gridCell.remove());
  });
  // Next we add event listeners to the lanterns.
  // First we declare them,
  let lanterns = 式神情报wrapper.querySelector("div.lantern-wrapper");
  let 情报灯笼 = lanterns.children[2];  // wood and ribbon are the 1st and 2nd
  let 御魂灯笼 = lanterns.children[3];
  let 复制灯笼 = lanterns.children[4];
  let 觉醒灯笼 = lanterns.lastElementChild;

  // and we start with 情报灯笼
  // code

  // followed by 御魂灯笼
  // code

  // next is 复制灯笼
  复制灯笼.addEventListener("mousedown", () => {
    复制灯笼.classList.add("focused");
  });
  复制灯笼.addEventListener("mouseleave", () => {
    复制灯笼.classList.remove("focused");
  });
  复制灯笼.addEventListener("mouseup", () => {
    复制灯笼.classList.remove("focused");
    let newGridCell = document.createElement("div");
    newGridCell.classList.add("grid-cell", "no-border");
    // need this filler for the function to remove something so that 
    // 式神情报 becomes the first-child and triggers the transition effect
    let filler = document.createElement("div");
    newGridCell.appendChild(filler);
    gridCell.insertAdjacentElement("afterend", newGridCell);
    let isAwake = 觉醒灯笼.classList.value.includes("focused") ? 1 : 0;
    get式神情报(newGridCell, 式神, 0.0000001, isAwake);
  });

  // lastly the 觉醒灯笼
  if(isAwake) {
    觉醒灯笼.classList.add("focused");
  }
  if(式神.稀有度 === "SP" || 式神.稀有度 === "N" )
    觉醒灯笼.classList.add("unavailable");
  else
    觉醒灯笼.addEventListener("click", () => {
      觉醒灯笼.classList.toggle("focused");
      getData(觉醒灯笼.classList.value.includes("focused") ? 1 : 0);
    });
}
