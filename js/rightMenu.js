// <div class="fileRightMenu">
//   <a href="">打开</a>
//   <a href="" class="botbor"></a>
//   <a href="">移动到</a>
//   <a href="">重命名</a>
//   <a href="" class="botbor"></a>
//   <a href="">删除</a>
//   <a href="">属性</a>
// </div>

function createRightMenu(data, id, isFile){
  var fileRightMenu = document.createElement('div');
  fileRightMenu.className = 'fileRightMenu';
  for(var i=0; i<data.length; i++){
    var item = document.createElement('a');
    item.href = 'javascript:;';
    if(typeof data[i].name === 'function'){
      item.innerHTML = data[i].name(isFile);
      item.onclick = data[i].click.bind(null, id, isFile);
    }else{
      if(typeof data[i].click === 'function'){
        item.onclick = data[i].click.bind(null, id);
      }
    }
    if(data[i].name === 0){
      item.className = 'botbor';
    }
    if(typeof data[i].name === 'string'){
      item.innerHTML = data[i].name;
    }
    fileRightMenu.appendChild(item);
  }
  return fileRightMenu;
}