/**
 * 微云的用来操作数据的工具方法
 */

// 通过指定的id获取到对应的数据
function getItemById(data, id){
  var current = null;
  for(var i=0; i<data.length; i++){
    if(data[i].id === id){
      current = data[i];
      break;
    }
    if(!current && data[i].children){
      current = getItemById(data[i].children, id);
      if(current){
        break;
      }
    }
  }
  return current;
}

// 获取到一组数据data中指定id的所有的子集
function getChildrenById(data, id){
  var current = getItemById(data, id);
  return current.children;
}

// 通过指定的id获取到自己以及自己所有的父级
function getParentsById(data, id){
  var parents = [];
  var current = getItemById(data, id);
  if(current){
    parents.push(current);
    parents = parents.concat(getParentsById(data, current.pId));
  }
  return parents;
}

// 判断名字是否可用
function nameCanUse(data, name){
  for(var i=0; i<data.length; i++){
    if(data[i].name === name){
      return false;
    }
  }
  return true;
}

// 重名替换数据
function replaceSameNameData(data, replaceData){
  for(var i=0; i<data.length; i++){
    if(data[i].name === replaceData.name){
      replaceData.pId = data[i].pId;
      replaceData.checked = false;
      data[i] = replaceData;
      data[i].name = data[i].name + '(新)';
      break;
    }
  }
}

// 获取根节点
function getRoot(data){
  for(var i=0; i<data.length; i++){
    if(data[i].type === 'root'){
      return data[i];
    }
  }
}

// 设置并返回最大id
function maxId(data){
  return getRoot(data).maxId = getRoot(data).maxId + 1;
}

// 判断是否全选
function isCheckedAll(data){
  for(var i=0; i<data.length; i++){
    if(!data[i].checked){
      return false;
    }
  }
  return true;
}

// 获取被选中的数据
function isCheckedFile(data){
  var arr = [];
  // var index = 0;
  for(var i=0; i<data.length; i++){
    if(data[i].checked){
      arr.push(data[i]);
      // index++;
    }
  }
  // return index;
  return arr;
}

// 根据数据查找对应的节点
function getChildNode(parentNode, id){
  var children = parentNode.children;
  for(var i=0; i<children.length; i++){
    if(getDataSetId(children[i]) === id){
      return children[i];
    }
  }
  return null;
}

// 获取到元素身上dataset里面的id，并转换为数字类型
function getDataSetId(obj){
  return obj.dataset.id * 1;
}

// 碰撞检测函数
function duang(current, target){
  var currentRect = current.getBoundingClientRect();
  var targetRect = target.getBoundingClientRect();
  var currentLeft = currentRect.left, 
      currentTop = currentRect.top,
      currentRight = currentRect.right,
      currentBottom = currentRect.bottom;
  var targetLeft = targetRect.left, 
      targetTop = targetRect.top,
      targetRight = targetRect.right,
      targetBottom = targetRect.bottom;
  return currentRight > targetLeft && currentBottom > targetTop && currentLeft < targetRight && currentTop < targetBottom;
};

// 获取元素的绝对位置
function getRect(obj, type){
  var rect = obj.getBoundingClientRect();
  switch(type){
    case 'left':
      return rect.left;
    break;
    case 'top':
      return rect.top;
    break;
    case 'right':
      return rect.right;
    break;
    case 'bottom':
      return rect.bottom;
    break;
  }
};



