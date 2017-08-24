/**
 * 创建树状文件结构菜单
 * @param  {Object} data 数据
 * @param  {Number} id   当前层级的id
 * @return {String}      html字符串
 */

function createTreeHtml(data, id){
  var str = `<ul>`;
  for(var i=0; i<data.length; i++){
    if(data[i].checked) continue;
    str += `<li class="clear">
              <h2 class="${data[i].id === id ? 'active' : ''}" data-id="${data[i].id}">
                <span class="add ${data[i].id === id ? 'active' : ''}" data-id="${data[i].id}"></span>
                <i class="add ${data[i].id === id ? 'active' : ''}" data-id="${data[i].id}"></i>
                ${data[i].name}
              </h2>`;
    // 判断当前数据是否有子数据
    str += data[i].children ? createTreeHtml(data[i].children, id) : '';
    str += `</li>`;
  }
  str += `</ul>`;
  return str;
}

/**
 * 创建面包削导航条
 * @param  {Object} data 数据来源
 * @param  {Number} id   id
 * @return {String}      html字符串
 */
function createNavsHtml(data, id){
  var str = '';
  for(var i=data.length-1; i>=0; i--){
    str += `<span class="${data[i].id === 0 ? 'active' : ''}" data-id="${data[i].id}">${data[i].name}</span>`;
  }
  return str;
}

/**
  * 创建文件结构字符串
  * @param  {Object} data 数据
  * @param  {Number} id   id
  * @return {String}      html字符串
  */
function createFilesHtml(data, id){
  var str = ``;
  for(var i=0; i<data.length; i++){
    str += `<div class="weiyun-file" data-id="${data[i].id}">
              <span class="file-checkbox"></span>
              <div class="file-img" data-id="${data[i].id}"></div>
              <div class="file-name">
                <span class="file-show-name active" title="${data[i].name}" data-id="${data[i].id}">${data[i].name}</span>
                <input type="text" class="file-change-name" data-id="${data[i].id}">
              </div>
            </div>`;
  }
  return str;
}

/**
 * 创建单个文件节点
 * @return {Dom Node}  文件节点
 */
function createFileNode(){
  // 创建文件的最外层结构
  var weiyunFile = document.createElement('div');
  weiyunFile.className = 'weiyun-file';
  
  // 创建自定义勾选框
  var fileCheckbox = document.createElement('span');
  fileCheckbox.className = `file-checkbox`;
  
  // 创建文件的图标
  var fileImg = document.createElement('div');
  fileImg.className = 'file-img';
  
  // 创建文件的名字和修改名字的文本框
  var fileName = document.createElement('div');
  fileName.className = 'file-name';
  
  // 创建文件夹名字（由于创建文件夹默认隐藏，所以可以删除这个节点）
  var fileShowName = document.createElement('span');
  fileShowName.className = 'file-show-name active';
  fileShowName.innerHTML = fileShowName.title = '';
  
  // 创建修改文件夹名字的文本框（创建文件夹默认显示的，class里面的active为显示）
  var fileChangeName = document.createElement('input');
  fileChangeName.className = 'file-change-name';
  fileChangeName.type = 'text';
  
  fileName.appendChild(fileShowName);
  fileName.appendChild(fileChangeName);
  
  // 将创建好的文件节点全部放入父级
  weiyunFile.appendChild(fileCheckbox);
  weiyunFile.appendChild(fileImg);
  weiyunFile.appendChild(fileName);
  
  return weiyunFile;
}
