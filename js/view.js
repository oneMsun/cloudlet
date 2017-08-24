/**
 * 页面渲染函数
 * @param  {Object} data 数据
 * @param  {Number} id   数字
 * @return {undefined}    
 */
function view(data, id){
  // console.log(data);
  // 将来有排序的需求的时候
  // sort(data,type); 
  viewTree(data, id);
  viewNavs(data, id);
  return viewFiles(data, id);
}

// 生成左侧的树状菜单
function viewTree(data, id){
  var html = createTreeHtml(data, id);
  listTree.innerHTML = html;
  return data;
}

// 生成文件导航菜单
function viewNavs(data, id){
  // 找到自己以及自己的所有的父级
  var parents = getParentsById(data, id);
  var html = createNavsHtml(parents, id);
  filesNavs.innerHTML = html;
  return parents;
}

// 生成所有的文件
function viewFiles(data, id){
  // 获取当前id数据的所有的children里面的所有的数据
  var filesData = getChildrenById(data, id);
  var html = createFilesHtml(filesData, id);
  filesList.innerHTML = html;
  return filesData;
}

//生成移动文件结构
function createMoveListMenuHtml(data, id){
  var html = createTreeHtml(data, id);
  var moveListMenu = document.querySelector('.move-list-menu');
  moveListMenu.innerHTML = html;
}


