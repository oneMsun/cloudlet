// 加载文件的数据
// ----------------------------------------------------------------------------
var data = user_data.files;  // ajax 
var menudata = user_data.fileRightMenu;

// ----------------------------------------------------------------------------
// 用来初始化页面的一些变量。

// 树状菜单的父级
var listTree = document.querySelector('.weiyun-list-tree');
// 面包削导航的父级
var filesNavs = document.querySelector('.file-navs-list');
// 文件区域的父级
var filesList = document.querySelector('.weiyun-list-file');

// 全选按钮
var fileCheckboxAll = document.querySelector('.file-checkbox-all');
// 重命名按钮
var renameFiles = document.querySelector('.rename-files');
// 新建文件夹按钮
var createNewFolderBtn = document.querySelector('.create-new-folder');
// 移动文件夹按钮
var moveListBtn = document.querySelector('.move-files-to');
// 删除文件按钮
var deleteFiles = document.querySelector('.delete-files');

// 当前层级，初始化为根目录 0
var current = 0;

// 用来缓存当前层级的所有子数据，提高查找效率
var currentData = null;

// 用来关联全选功能、新建功能的变量
var isNameing = false;

// 右键菜单和画框的状态控制
var isRightMenu = false;

// 初始化页面结构
currentData = view(data, current);

// ----------------------------------------------------------------------------
// 给三个部分添加交互事件

// 左侧树状菜单点击
listTree.addEventListener('click', function (e){
  var target = e.target;
  if(target.nodeName.toUpperCase() === 'H2' || target.classList.contains('add')){
    var id = getDataSetId(target);
    // 如果当前点击的文件的id就是这个层级的那么就不执行后面的逻辑
    if(current === id) return;
    // 进入目标文件夹之前，取消全选
    initChecked();
    // 切换当要进入的目录
    // console.log(id);
    currentData = view(data, current = id);
  }
});

// 右侧面包屑导航点击
filesNavs.addEventListener('click', function (e){
  var target = e.target;
  if(target.nodeName.toUpperCase() === 'SPAN'){
    var id = getDataSetId(target);
    if(current === id) return;
    initChecked();
    currentData = view(data, current = id);
  }
});

// 右侧点击文件列表
filesList.addEventListener('click', function (e){
  var target = e.target;
  if(target.classList.contains('weiyun-file') || target.classList.contains('file-img')){
    var id = getDataSetId(target);
    initChecked();
    currentData = view(data, current = id);
  }
  // ----------------------------------------
  // 重命名
  if(target.classList.contains('file-show-name')){
    initChecked();
    // 点击要重命名文件的这个显示名i的元素
    // 以及这个元素身上对应的它自己的数据id
    rename(target, getDataSetId(target));
  }
  // ----------------------------------------
  // 选中文件
  if(target.classList.contains('file-checkbox')){
    // 选中和取消选中同时更新数据
    checkedItem(target.parentNode);
  }
  
  removeRightMenu()
  isRightMenu = false;
  
});

// 重命名文件
function rename(ele, id){
  isNameing = true;
  var nextSibling = ele.nextElementSibling; // 获取到下一个兄弟节点 input
  ele.classList.remove('active'); // 让当前的ele隐藏
  nextSibling.classList.add('active'); // 让input显示
  nextSibling.value = ele.title; // 让input的默认value值就是之前的名字
  nextSibling.select();
  // 添加失去焦点事件
  nextSibling.onblur = function (){
    var val = this.value.trim();
    if(val === '' || val === ele.title){
      nextSibling.classList.remove('active');
      ele.classList.add('active');
      alertMessage('取消重命名！', 'fail');
      isNameing = false;
    }else{
      if(nameCanUse(currentData, val)){
        var currentItem = getItemById(currentData, id);
        currentItem.name = val;
        ele.title = ele.innerHTML = val;
        nextSibling.classList.remove('active');
        ele.classList.add('active');
        isNameing = false;
        alertMessage('重命名成功！', 'succ');
      }else{
        // console.log('命名冲突');
        alertMessage('命名冲突！', 'fail');
        this.select();
      }
    }
  };
  window.onkeydown = function (e){
    if(e.keyCode === 13){
      nextSibling.blur();
    }
  };
}

// 选中文件夹
function checkedItem(obj, selected){
  var checked = false;
  obj.classList.toggle('active');
  var checked = obj.classList.contains('active');
  if(selected && !obj.classList.contains('active')){
    obj.classList.add('active');
    checked = true;
  }
  // 获取到当前这一层点击的这个文件夹的数据然后改变它的checked属性
  var targetData = getItemById(currentData, getDataSetId(obj));
  targetData.checked = checked;
  // 判断当这层数据里面的每一个checked是否为true
  if(isCheckedAll(currentData)){
    // 如果是true就给全选打勾
    fileCheckboxAll.classList.add('active');
  }else{
    // 如果是false就取消全选的勾
    fileCheckboxAll.classList.remove('active');
  }
}

// 全选
fileCheckboxAll.onclick = function (){
  removeRightMenu();
  if(isNameing) return;
  this.classList.toggle('active');
  for(var i=0; i<currentData.length; i++){
    if(this.classList.contains('active')){
      currentData[i].checked = true;
      filesList.children[i].classList.add('active');
    }else{
      currentData[i].checked = false;
      filesList.children[i].classList.remove('active');
    }
  }
};

// 取消全选
function initChecked(){
  fileCheckboxAll.classList.remove('active');
  for(var i=0; i<currentData.length; i++){
    currentData[i].checked = false;
    filesList.children[i].classList.remove('active');
  }
}

// ----------------------------------------------------------------------------
// 重命名文件夹
renameFiles.onclick = function (){
  removeRightMenu();
  // 获取到被选中的数据
  var checkedItems = isCheckedFile(currentData);
  if(!checkedItems.length){ // 如果没有一个是被选中的
    alertMessage('请选择文件！', 'fail');
    return;
  }
  // 如果选中的文件数量超过1个
  if(checkedItems.length > 1){
    alertMessage('只能选择一个文件！', 'fail');
    return;
  }
  // 如果选手那种的是一个文件
  if(checkedItems.length === 1){
    initChecked();
    // 通过当前选中的这个数据的id找到数据对应的DOM节点
    var reNameChild = getChildNode(filesList, checkedItems[0].id);
    var showName = reNameChild.querySelector('.file-show-name');
    rename(showName, getDataSetId(showName));
  }
}

// ----------------------------------------------------------------------------
// 新建文件夹
createNewFolderBtn.onclick = function (){
  removeRightMenu();
  // 如果这个条件成立，说明正在重命名
  if(isNameing) return;
  createFolder_();
};

function createFolder_(){
  isNameing = true; // 开始重命名，意味着正在重命名过程中...
  initChecked(); // 取消全选
  var newFolderNode = createFileNode(); // 创建文件夹节点
  // 放到当前区域所有节点的最前面
  filesList.insertBefore(newFolderNode, filesList.firstElementChild);
  // 放到最前后要针对命名进行操作
  renameFile(newFolderNode, data);
}

// 新建重命名功能
function renameFile(fileNode, data){
  // 获取到显示名字的元素
  var showName = fileNode.querySelector('.file-show-name');
  // 获取到用来修改文本框的input
  var renameInput = fileNode.querySelector('.file-change-name');
  // 让之前的显示名字的元素隐藏
  showName.classList.remove('active');
  // 让当前修改元素名字的文本框显示
  renameInput.classList.add('active');
  // 让input文本框获取焦点
  renameInput.focus();
  // 失去焦点
  renameInput.onblur = function (){
    // 去掉命名的前后空格
    var val = this.value.trim();
    if(val === ''){
      fileNode.parentNode.removeChild(fileNode);
      // 名字操作完成要变回false，证明当前命名状态结束!
      isNameing = false;
      alertMessage('取消创建文件夹！', 'fail');
    }else{
      if(nameCanUse(currentData, val)){ // 如果这个名字能用
        var filesData = {
          name: val,
          id: maxId(data),
          pId: current,
          type: 'folder',
          checked: false,
          children: []
        };
        currentData.unshift(filesData);
        currentData = view(data, current);
        isNameing = false;
        alertMessage('新建文件夹成功！', 'succ');
      }else{
        alertMessage('文件命名冲突！', 'fail');
        this.select();
      }
    }
  };
  
  // 回车键
  window.onkeydown = function (e){
    if(e.keyCode === 13 && renameInput.value !== ''){
      renameInput.blur();
    }
  };
}

// ----------------------------------------------------------------------------
// 删除功能
deleteFiles.onclick = function (){
  removeRightMenu();
  var checked = isCheckedFile(currentData);
  if(checked.length){
    var isDelete = confirm('确定要删除嘛?');
    if(!isDelete) return;
    deleteCheckedFile(currentData);
    currentData = view(data, current);
    initChecked();
    alertMessage('删除小秘密成功！', 'succ');
  }else{
    // alert('请选择要删除的内容!');
    alertMessage('请选择要删除的内容！', 'fail');
  }
};

// 删除被选中的文件
function deleteCheckedFile(data){
  for(var i=0; i<data.length; i++){
    if(data[i].checked){
      data.splice(i, 1);
      i--;
    }
  }
  return data;
}

// ----------------------------------------------------------------------------
// 鼠标画框
filesList.onmousedown = function (e){
  if(e.buttons !== 1) return;
  if(isNameing) return;  // 重命名的时候不允许画框
  if(isRightMenu) return;
  e.preventDefault();
  
  var target = e.target;
  if(!target.classList.contains('weiyun-list-file')){
    return;
  }
  
  initChecked();
  
  var div = document.createElement('div');
  div.className = 'frame';
  this.appendChild(div);
  
  var startX = e.pageX, startY = e.pageY;
  
  filesList.onmousemove = function (e){
    var currentX = e.pageX, currentY = e.pageY;

    var L = Math.min(currentX - getRect(this, 'left'), startX - getRect(this, 'left'));
    var T = Math.min(currentY - getRect(this, 'top'), startY - getRect(this, 'top'));
    var W = Math.abs(currentX - startX);
    var H = Math.abs(currentY - startY);
    
    selectDuang(div);
    
    div.style.left = L + 'px';
    div.style.top = T + 'px';
    div.style.width = W + 'px';
    div.style.height = H + 'px';
  }
  
  document.onmouseup = () => {
    document.onmouseup = this.onmousemove = null;
    this.removeChild(div);
  };
}

// 碰撞检测函数
function selectDuang(obj){
  var checked = false;
  for(var i=0; i<filesList.children.length; i++){
    var currentCheckedData = getItemById(currentData, getDataSetId(filesList.children[i]));
    if(duang(obj, filesList.children[i]) && filesList.children[i] !== obj){
      filesList.children[i].classList.add('active');
      currentCheckedData.checked = true;
      if(isCheckedAll(currentData)){
        fileCheckboxAll.classList.add('active');
      }else{
        fileCheckboxAll.classList.remove('active');
      }
    }else{
      if(filesList.children[i].classList.contains('active')){
        filesList.children[i].classList.remove('active');
        currentCheckedData.checked = false;
      }
    }
  }
}

// ----------------------------------------------------------------------------
// 移动文件功能
var moveListWrap = document.querySelector('.move-list-wrap');
moveListBtn.onclick = function (){
  removeRightMenu();
  // 获取选中的数据
  var isCheckedItems = isCheckedFile(currentData);
  // 如果层级只有一个文件夹
  if((currentData.length <= 1 && getParentsById(data, current).length < 2) || (current === 0 && currentData.length === isCheckedItems.length)){
    alertMessage('没有可移动到的目标目录！', 'fail');
    return;
  }
  // 如果没有选中的数据
  if(!isCheckedItems.length){
    alertMessage('请选择要移动的内容！', 'fail');
    return;
  }
  // 创建可以移动的列表
  createMoveListMenuHtml(data, current)
  // 让移动遮罩层显示出来
  moveListWrap.classList.add('active');
  moveItemsFn(data);
};

function moveItemsFn(data){
  // 获取当前弹出的头部
  var moveListHeader = moveListWrap.querySelector('.move-list-header');
  // 关闭x按钮
  var closeMoveList = moveListWrap.querySelector('.move-list-header span');
  // 树状菜单
  var moveListMenu = moveListWrap.querySelector('.move-list-menu');
  // 确定
  var moveSure = moveListWrap.querySelector('.move-list-wrap .sure');
  // 取消
  var moveCancel = moveListWrap.querySelector('.move-list-wrap .cancel');
  
  // 当前要移动到的目录，一开始默认显示当前这一层
  var currentMove = current;
  
  // 拖拽弹窗
  dragElement(moveListHeader, moveListHeader.parentNode, true);
  
  // 点击对应菜单，切换对应class
  moveListMenu.onclick = function (e){
    var target = e.target;
    if(target.nodeName === 'H2' || target.classList.contains('add')){
      currentMove = getDataSetId(target);
      createMoveListMenuHtml(data, currentMove);
    }
  };
  // 确定按钮
  moveSure.onclick = function (){
    // 如果要移动的目标目录的id和当前的相等那么证明要移动到
    // 的是当前这一层目录
    if(current === currentMove){
      alertMessage('不能移动到同一级目录!', 'fail');
      return;
    }
    // 找到要移动到的目标目录的所有的子数据
    var targetMoveData = getChildrenById(data, currentMove);
    // 关闭弹窗
    moveListWrap.classList.remove('active');
    
    moveItemsData(targetMoveData, currentMove);
    
    if(currentData.length === 0){
      initChecked();
    }
    currentData = view(data, current);
    alertMessage('移动完成!', 'succ');
    clearEvent();
  };
  // 取消按钮和关闭窗口
  moveCancel.onclick = closeMoveList.onclick = function (){
    moveListWrap.classList.remove('active');
    clearEvent();
  };
  // 清除事件，释放内存
  function clearEvent(){
    moveListMenu.onclick = moveSure.onclick = null;
    moveCancel.onclick = closeMoveList.onclick = null;
    moveListHeader.onmousedown = null;
  }
}

// 移动数据
function moveItemsData(moveTargetData, targetId){
  for(var i=0; i<currentData.length; i++){
    if(currentData[i].checked){
      if(!nameCanUse(moveTargetData, currentData[i].name)){
        let repeatMessage = confirm('有相同名字文件是否覆盖?');
        if(repeatMessage){
          // 把当前这一层级相同的名字的数据替换掉
          replaceSameNameData(moveTargetData, currentData[i]);
          // console.log(currentData);
          currentData.splice(i, 1);
          // console.log(currentData);
          i--;
          continue;
        }
        let confirmMessage = confirm('是否保留两者?');
        if(!confirmMessage) continue;
        currentData[i].name = currentData[i].name + '(副本)';
      }
      // 修改自身的pId为目标目录的id
      currentData[i].pId = targetId;
      currentData[i].checked = false;
      moveTargetData.push(currentData.splice(i, 1)[0]);
      i--;
    }
  }
}

// ----------------------------------------------------------------------------

/**
 * 用来拖拽物体的函数
 * @param  {ele} eleDown   鼠标按下的元素
 * @param  {ele} eleMove   鼠标移动要拖拽的元素
 * @return undefined             
 */
function dragElement(eleDown, eleMove, scope){
  eleDown.onmousedown = function (e){
    e.preventDefault();
    var dx = e.pageX - getRect(eleMove, 'left');
    var dy = e.pageY - getRect(eleMove, 'top');
    document.onmousemove = function (e){
      var L = e.pageX - dx - getRect(eleMove.offsetParent, 'left');
      var T = e.pageY - dy - getRect(eleMove.offsetParent, 'top');
      if(scope){
        L = L <= 0 ? 0 : L;
        T = T <= 0 ? 0 : T;
        L = L >= eleMove.offsetParent.clientWidth - eleMove.offsetWidth ? eleMove.offsetParent.clientWidth - eleMove.offsetWidth : L;
        T = T >= eleMove.offsetParent.clientHeight - eleMove.offsetHeight ? eleMove.offsetParent.clientHeight - eleMove.offsetHeight : T;
      }
      eleMove.style.left = L + 'px';
      eleMove.style.top = T + 'px';
    };
    document.onmouseup = function (){
      this.onmouseup = this.onmousemove = null;
    }
  };
}

// 提示框
function alertMessage(val, type){
  var tip = document.querySelector('.tip');
  tip.innerHTML = val;
  tip.classList.add(type);
  setTimeout(() => {
    tip.classList.remove(type);
  }, 1000);
}

// ----------------------------------------------------------------------------
// 右键菜单
filesList.oncontextmenu = function (e){
  removeRightMenu();
  isRightMenu = true;
  e.preventDefault();
  var L = e.pageX - getRect(filesList, 'left'), T = e.pageY - getRect(filesList, 'top');
  var target = e.target;
  var checkedItems = isCheckedFile(currentData);
  if(target.classList.contains('weiyun-list-file')){
    var rigthMenuNode = createRightMenu(menudata, id);
  }
  if(target.classList.contains('weiyun-file') || target.classList.contains('file-img') || target.classList.contains('file-show-name')){
    var id = getDataSetId(target);
    var itemData = getItemById(currentData, id);
    if(checkedItems.indexOf(itemData) == -1){
      initChecked();
    }
    var itemNode = getChildNode(this, id);
    checkedItem(itemNode, true);
    var rigthMenuNode = createRightMenu(menudata, id, true);
  }
  rigthMenuNode.style.left = L + 'px';
  rigthMenuNode.style.top = T + 'px';
  this.appendChild(rigthMenuNode);
};

function removeRightMenu(){
  if(isRightMenu && filesList.lastElementChild && filesList.lastElementChild.classList.contains('fileRightMenu')) {
    filesList.removeChild(filesList.lastElementChild);
  }  
}

