// ==UserScript==
// @name         UCAS Class Enrollment Assistant
// @version      1.5
// @description  这是一个方便抢课界面操作的脚本。包括的功能有：1.自动跳转： 进入选课系统后，会自动跳转到选择课程页面。（如需查看通知公告 需要临时把脚本禁用）2.一键筛选/定位： 点击🚀即可自动筛选学院/滚动到对应课程所在位置（在筛选学院页面也可以直接点击课程编号等按钮一键跳转）。3.快速提交： 选课页面添加提交选课按钮。目前为自用版，而且由于需要赶在抢课之前完成，时间比较紧张，故配置待抢课程需要手动修改代码里的config。
// @author       BarryZZJ
// @namespace    https://github.com/barryZZJ/
// @match        http*://jwxk.ucas.ac.cn/*
// @icon         https://sep.ucas.ac.cn/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.jsdelivr.net/npm/draggable@4.2.0/src/draggable.js
// @run-at document-end
// @license      MIT
// ==/UserScript==

var config = {
  'wishList': {
    // 选课系统中学院名称的前两个字
    '外语': [
      // 一个课程一个花括号
      {
        'name': '日语',
        'wishes': [ // 可以为空列表
          // 每个班用一个花括号，notes里可以随意填写，给自己看的。
          {
            'courseid': '050200MGX014H-01',
            'notes': '周二周四(3-4)'
          },
          {
            'courseid': '050200MGX014H-02',
            'notes': '周二周四(5-6)'
          }
        ]
      }
    ],
    '体育': [
      {
        'name': '男子自由泳',
        'wishes': [
          {
            'courseid': '045200MGX008H-01',
            'notes': '周一(1-2)'
          },
          {
            'courseid': '045200MGX008H-03',
            'notes': '周二(7-8)'
          },
          {
            'courseid': '045200MGX008H-05',
            'notes': '周二(5-6)'
          }
        ]
      }
    ],
    '心理': [
      {
        'name': '文化社会心理学',
        'wishes': [
          {
            'courseid': '040200MGX006H',
            'notes': '周三(5-7)'
          }
        ]
      },
      {
        'name': '环境心理学',
        'wishes': [
          {
            'courseid': '040200MGX009H',
            'notes': '备 周五(2-4)'
          }
        ]
      },
    ],
    '马克': [
      {
        'name': '新时代中国特色社会主义理论与实践研究',
        'wishes': [
          {
            'courseid': '030500MGB001H-10',
            'notes': '2-10周 周四(9-12)'
          },
          {
            'courseid': '030500MGB001H-34',
            'notes': '11-18周 周四(9-12)'
          }
        ]
      },
      {
        'name': '自然辩证法概论',
        'wishes': [
          {
            'courseid': '010108MGB001H-16',
            'notes': '周三(9-12)'
          },
          {
            'courseid': '010108MGB001H-30',
            'notes': '周六(9-12)'
          },
          {
            'courseid': '010108MGB001H-31',
            'notes': '周六(9-12)'
          }
        ]
      },
    ],
    '艺术': [
      {
        'name': '音乐基础修养',
        'wishes': [
          {
            'courseid': '130200MGX002H',
            'notes': '备 周二(5-7)',
          }
        ]
      }
    ],
    '公管': [
      {
        'name': '高科技企业管理',
        'wishes': [
          {
            'courseid': '120100MGX003H',
            'notes': '备 周二(10-12)',
          }
        ]
      },
      {
        'name': '通论',
        'wishes': []
      },

    ],
    //核心课
    '网络': [
      {
        'name': '机器学习',
        'wishes': [
          {
            'courseid': '083900M01004H-01',
            'notes': '核 周五(5-7)'
          },
          {
            'courseid': '083900M01004H-02',
            'notes': '核 周五(9-11)'
          },
          {
            'courseid': '083900M01004H-03',
            'notes': '核 周六(1-3)'
          }
        ]
      },
      {
        'name': '安全协议与形式化方法',
        'wishes': [
          {
            'courseid': '0839X5M04001H',
            'notes': '核 周一(9-11)'
          }
        ]
      },
      {
        'name': '网络与系统安全',
        'wishes': [
          {
            'courseid': '083900M01002H',
            'notes': '核 周五(10-12)'
          }
        ]
      },
      {
        'name': '网络溯源取证',
        'wishes': [
          {
            'courseid': '0839X6M05005H',
            'notes': '普 周二周四(1-2)'
          }
        ]
      },
      {
        'name': '信息隐藏',
        'wishes': [
          {
            'courseid': '0839X1M05006H',
            'notes': '普 周一(5-7)'
          }
        ]
      },
      {
        'name': '网络协议安全',
        'wishes': [
          {
            'courseid': '0839X5M05001H',
            'notes': '普 周四(5-7)'
          }
        ]
      },
      {
        'name': 'Web安全技术',
        'wishes': [
          {
            'courseid': '0839X6M05006H',
            'notes': '普 周二周四(3-4)'
          }
        ]
      },
      {
        'name': '分论',
        'wishes': [
          {
            'courseid': '083900MGB001H-01',
            'notes': '公必 周二(9-10)'
          },
          {
            'courseid': '083900MGB001H-02',
            'notes': '公必 周三(1-2)'
          },
        ]
      },
    ],
  },
};


const DeptIdMap = {
  '数学': "id_910", '物理': "id_911", '天文': "id_957", '化学': "id_912", '材料': "id_928",
  '生命': "id_913", '地球': "id_914", '资环': "id_921", '计算': "id_951", '电子': "id_952",
  '工程': "id_958", '经管': "id_917", '公管': "id_945", '人文': "id_927", '马克': "id_964",
  '外语': "id_915", '中丹': "id_954", '国际': "id_955", '存济': "id_959", '体育': "id_946",
  '微电': "id_961", '未来': "id_962", '网络': "id_963", '心理': "id_968", '人工': "id_969",
  '纳米': "id_970", '艺术': "id_971", '光电': "id_972", '创新': "id_967", '核学': "id_973",
  '现代': "id_974", '化学': "id_975", '海洋': "id_976", '航空': "id_977", '杭州': "id_979",
  '南京': "id_985", '应急': "id_987",
};

// 设置样式
const mycss = `
  .transp{
    background:transparent;
    border-width:0;
    outline:none;
  }
  .notes{
  }
  .nowrap{
    white-space: nowrap;
  }
  .zzjbtn.jump{
    background:transparent;
    border-width:0;
    outline:none;
    padding: 0;
    margin: 0;
  }
  .zzjbtn.dept{
    border-width: 1px;
    padding: 2px;
    margin: 0;
    margin-left: 1px;
  }
  .zzjbtn.dept.checked{
    background-color: darkgray;
  }
  .zzjbtn.course{
    max-width: 150px;
    border-width: 1px;
    padding: 1px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .zzjbtn.courseid{
    border-width: 1px;
    padding: 2px;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .zzjbtn.highlight{
    background-color: yellow;
  }
  .zzjbtn:active{
    background-color: gray;
  }
  #movediv{
    cursor:move;
  }
`
var sty = document.createElement("style");
sty.type = "text/css";
sty.appendChild(document.createTextNode(mycss));
document.body.appendChild(sty);

var divCourseWish;
var alreadyHighlighted;
function prefix (...data) {
  return ['[抢课辅助]', ...data];
}

function drawPanel (page) {
  let isCourseSelection = page == 'selectCourse' || page == 'debug';
  let isMain = page == 'main';
  // 待选课程表格
  let tab = '';
  let wishList = config.wishList;
  let zzjBtnId = 1;
  for (const dept in wishList) {
    let courses = wishList[dept];
    let deptid = DeptIdMap[dept];
    let firstdept = true;
    for (const course of courses) {
      // 一门课
      let name = course.name;
      let wishes = course.wishes;
      let firstrow = true;
      if (wishes.length > 0) {
        // wishes里配置了具体的内容
        for (let wish of wishes) {
          tab += '<tr>';
          if (firstrow) {
            if (firstdept) {
              tab += `<td rowspan="${wishes.length}"><button id="zzjbtn${zzjBtnId++}" class="zzjbtn dept jumpdept nowrap" deptid="${deptid}">${dept}🚀</button></td>`;
              firstdept = false;
            } else {
              tab += `<td rowspan="${wishes.length}"></td>`;
            }
            tab += `<td rowspan="${wishes.length}"><button id="zzjbtn${zzjBtnId++}" class="zzjbtn course copyable jumpcourse" deptid="${deptid}" name="${name}">${name}🚀</button></td>`;
            firstrow = false;
          }
          tab += `<td><button id="zzjbtn${zzjBtnId++}" class="zzjbtn courseid copyable nowrap jumpcourseid" deptid="${deptid}" courseid="${wish.courseid}">${wish.courseid}🚀</button></td>`;
          tab += `<td class="notes">${wish.notes}</td>`;
          tab += '</tr>';
        }
      } else {
        // wishes为空列表
        tab += '<tr>';
        tab += `<td><button id="zzjbtn${zzjBtnId++}" class="zzjbtn dept jumpdept" deptid="${deptid}">${dept}🚀</button></td>`;
        tab += `<td><button id="zzjbtn${zzjBtnId++}" class="zzjbtn course copyable jumpcourse" deptid="${deptid}" name="${name}">${name}🚀</button></td>`;
        tab += `<td></td>`;
        tab += `<td></td>`;
        tab += '</tr>';
      }
    }
  }

  let appendix = '';
  if (isCourseSelection) {
    // 进入选课页面
    var appendixDiv = document.createElement('div');
    appendixDiv.id = 'zzjappendix';
    appendixDiv.style = 'margin: 5px; max-height: 300px; overflow-y: auto;';

    // 插入验证码 加在onload事件里保证验证码加载出来
    let zzjValiImg = document.createElement('img');
    zzjValiImg.id = 'zzjValiImg';
    zzjValiImg.title = '点击更换验证码';
    zzjValiImg.align = 'bottom';
    zzjValiImg.style.cursor = 'pointer';
    appendixDiv.appendChild(zzjValiImg);
    // img.width = ValidateImg.width;
    // img.height = ValidateImg.height;

    // 插入验证码输入框
    let zzjValiInput = document.createElement('input');
    zzjValiInput.id = 'zzjvcode';
    zzjValiInput.type = 'text';
    zzjValiInput.style.width = '50px';
    zzjValiInput.style.marginLeft = '5px';
    zzjValiInput.style.marginRight = '5px';
    appendixDiv.appendChild(zzjValiInput);
    
    // 添加"确定提交选课"按钮
    let zzjSubmit = document.createElement('button');
    zzjSubmit.id = 'zzjsubmit';
    zzjSubmit.type = 'submit';
    zzjSubmit.className = 'btn btn-primary';
    zzjSubmit.textContent = '确定提交选课';
    appendixDiv.appendChild(zzjSubmit);

    appendix = appendixDiv.outerHTML;
  }

  let panel = $(
    '<div id="zzjpanel" style="border: 1px solid; width: fit-content; position: fixed; top: 65px; right: 0; z-index: 99999; background-color: rgba(220,221,192,0.6); overflow-x: auto;">' +
    '<div id="movediv" style="min-width: 150px; font-size:20px;font-weight: bold;text-align: center;position: fixed;width: 100%;height: 25px;border-bottom: 1px solid;">待选课程</div>'+
    '<div id="divCourseWish" style="margin-top: 25px; max-height: 300px; overflow-y: auto;">' +
    '<table id="courseWish" border="1" style="font-size: 14px;">' +
    '<tbody>' +
    tab +
    '</tbody>' +
    '</table>' +
    '</div>' +
    appendix +
    '<div draggable="true" id="dragDiv" style="bottom: 0; width:100%; height:5px; background-color:#999; cursor:n-resize;"></div>' +
    '</div >'
  ).appendTo('body');

  // 配置各种listener
  if (isMain) {
    // 进入筛选学院页面
    // 一键筛选学院
    $(".zzjbtn.dept").click(function () {
      $(this).addClass('highlight');
      let deptid = $(this).attr('deptid');
      sumbitFilterDept(deptid);
    });
    // 复制课程代码和课程名称逻辑
    // $(".copyable").click(function () {
    //   $(".copyable").removeClass("copied");
    //   GM_setClipboard($(this).text().replace('🚀', ''));
    //   $(this).addClass("copied");
    // });
    
    // 一键跳转到课程：单击课程名，自动筛选学院后，自动定位到匹配到的第一行，并且匹配项高亮
    $('.jumpcourse').click(function () {
      $('.jumpcourse').removeClass('highlight');
      $('.jumpcourseid').removeClass('highlight');
      $(this).addClass('highlight');
      let deptid = $(this).attr('deptid');
      let coursename = $(this).attr('name');
      let scrollTop = divCourseWish.scrollTop;  // 一键跳转功能跳转后，插件页面保持之前滚动条的位置
      let btnId = $(this).attr('id');  // 方便跳转后高亮
      let behavior = setBehavior('coursename', coursename, scrollTop, btnId);
      sumbitFilterDept(deptid, behavior);
    });

    // 一键跳转到课程id：单击课程id，自动筛选学院后，自动定位到匹配行，并且匹配项高亮
    $('.jumpcourseid').click(function () {
      $('.jumpcourse').removeClass('highlight');
      $('.jumpcourseid').removeClass('highlight');
      $(this).addClass('highlight');
      let deptid = $(this).attr('deptid');
      let courseid = $(this).attr('courseid');
      let scrollTop = divCourseWish.scrollTop;  // 一键跳转功能跳转后，插件页面保持之前滚动条的位置
      let btnId = $(this).attr('id');  // 方便跳转后高亮
      let behavior = setBehavior('courseid', courseid, scrollTop, btnId);
      sumbitFilterDept(deptid, behavior);
    });

  }else if (isCourseSelection) {
    // 进入选课页面

    // 单击课程名，自动定位到匹配到的第一行，并且匹配项高亮
    $('.jumpcourse').click(function () {
      let coursename = $(this).attr('name');
      let btnid = $(this).attr('id');
      let behavior = setBehavior('coursename', coursename, null, btnid);
      alreadyHighlighted = resolveBehavior(behavior, alreadyHighlighted);
    });

    // 单击课程id，自动定位到所在行，并且匹配项高亮
    $('.jumpcourseid').click(function () {
      let courseid = $(this).attr('courseid');
      let btnid = $(this).attr('id');
      let behavior = setBehavior('courseid', courseid, null, btnid);
      alreadyHighlighted = resolveBehavior(behavior, alreadyHighlighted);
    });

    // 修复原网站中"点击切换验证码"没反应的bug
    let valiImg = document.getElementById('adminValidateImg');
    valiImg.onclick = function(){
      document.getElementById("adminValidateImg").src = '/captchaImage' + "?" + Math.random();
    };
    // 验证码显示及点击刷新时同步
    document.getElementById('zzjValiImg').onclick = function () {
      console.log('zzjValiImg clicked');
      valiImg.onclick();
    }
    valiImg.addEventListener('load', () => {
      document.getElementById('zzjValiImg').src = getBase64Image(valiImg);
    });
    // 有时刚进去图片就加载了，不会触发onload，需要手动设置src
    let dataurl = getBase64Image(valiImg);
    if (dataurl != 'data:,') {
      document.getElementById('zzjValiImg').src = dataurl;
    }
  
    // 同步两个验证码框的输入
    $("#zzjvcode").keyup(function(){
      $("#vcode").val($("#zzjvcode").val());
    });
  
    $("#vcode").keyup(function(){
      $("#zzjvcode").val($("#vcode").val());
    });

    // ui里的提交按钮与原来的按钮同步
    $("#zzjpanel button[type='submit']").click(function () {
      $('#regfrm button[type="submit"]').click();
    });
  }
  
  //可拖动
  let dragopts = {
    setCursor: false,
    setPosition: false,
    handle: document.getElementById("movediv"),
  };
  new Draggable(panel.get(0), dragopts);

  // 手动调整ui高度，并记录在storage
  divCourseWish = document.getElementById("divCourseWish");
  // 读取高度记录
  let frmheight = GM_getValue('frmheight');
  if (frmheight) {
    divCourseWish.style.maxHeight = frmheight;
  }
  // 绑定需要拖拽改变大小的元素对象
  bindResize(divCourseWish);

  function bindResize(el) {
    //初始化参数
    var els = el.style;
    //鼠标的 X 和 Y 轴坐标
    var y = 0;
    //邪恶的食指
    $("#dragDiv").mousedown(function (e) {
      //按下元素后，计算当前鼠标与对象计算后的坐标
      (y = e.clientY - el.offsetHeight);
      //在支持 setCapture 做些东东
      //绑定事件
      $(el).bind("mousemove", mouseMove).bind("mouseup", mouseUp);
      $(document.body).bind("mousemove", mouseMove).bind("mouseup", mouseUp);
      //防止默认事件发生
      e.preventDefault();
    });
    //移动事件
    function mouseMove(e) {
      //宇宙超级无敌运算中...
      els.maxHeight = e.clientY - y + "px";
    }
    //停止事件
    function mouseUp() {
      // 存储高度
      GM_setValue('frmheight', divCourseWish.style.maxHeight); // 包含"px"
      //卸载事件
      $(el)
        .unbind("mousemove", mouseMove)
        .unbind("mouseup", mouseUp);
      $(document.body)
        .unbind("mousemove", mouseMove)
        .unbind("mouseup", mouseUp);
    }
  }

  return panel;
}

function setBehavior(type, data, scrollTop, btnId) {
  // 设置跨网页json数据
  let behavior = {
    'type': type,  // 'courseid' or 'coursename'
    'data': data,
    'scrollTop': scrollTop,
    'btnId': btnId,
  }
  return behavior;
}

function resolveBehavior (behavior, alreadyHighlighted=null) {
  // 解析json数据
  if (behavior.btnId) {
    // 清空其他按钮高亮
    $('.jumpcourse').removeClass('highlight');
    $('.jumpcourseid').removeClass('highlight');
    // 高亮按钮
    $(`#${behavior.btnId}`).addClass('highlight');
  }
  if (behavior.scrollTop) {
    // 插件面板滚动条恢复到之前位置
    divCourseWish.scrollTop = behavior.scrollTop;
  }
  let highlighted;  // 待高亮DOM
  if (behavior.type) {
    // 自动滚动定位+高亮课程/课程号
    if (behavior.type == 'courseid') {
      let courseid = behavior.data;
      let courseidspan = getElementsByText($("#regfrm span"), courseid);
      // 如果找到
      if (courseidspan.length > 0) {
        // 跳转到指定位置，并高亮对应行
        highlighted = courseidspan.eq(0);
      }
    } else if (behavior.type == 'coursename') {
      let coursename = behavior.data;
      let coursenametag = getElementsByText($("#regfrm a"), coursename, true);
      // 如果找到
      if (coursenametag.length > 0) {
        // 跳转到指定位置，并高亮对应行
        highlighted = coursenametag.eq(0);
      }
    }
    if (highlighted) {
      // 清空其他高亮
      if (alreadyHighlighted) {
        alreadyHighlighted.css('background-color', '');
      } else {
        $('#regfrm span[style*=yellow]').css('background-color', '');
        $('#regfrm a[style*=yellow]').css('background-color', '');
      }
      // 高亮匹配项
      highlighted.css('background-color', 'yellow');
      scrollto(highlighted);
    } else {
      error('未搜索到课程 ' + behavior.data);
    }
  }
  return highlighted;
}

function injectJsonToAction (selector, json) {
  let action = $(selector).prop("action");
  let jsonstr = JSON.stringify(json);
  action = action.replace(/#.+/, '');
  action += "#zzjbehavior" + jsonstr;
  $(selector).prop("action", action);
}

function sumbitFilterDept (deptid, behavior) {
  // 清空所有勾选情况
  $("#regfrm2 input[type='checkbox']").prop('checked', false);
  // 勾选当前学院
  $(`#${deptid}`).prop("checked", true);
  if (behavior) {
    injectJsonToAction('#regfrm2', behavior)
  }
  // 提交
  $("#regfrm2 button[type='submit']").submit();
}

function getElementsByText(elems, value, isFuzzy=false){
  return elems.filter(function (index) {
    if (isFuzzy) {
      return $(this).text().includes(value);
    } else {
      return $(this).text() == value;
    }
  });
}
function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
function scrollto(jqele) {
  // offset header which is 60px in height
  let buffer = document.createElement('div');
  buffer.id = randomString(5);
  buffer.style.display = 'block';
  buffer.style.height = '65px';
  buffer.style.marginTop = '-65px';
  buffer.style.visibility = 'hidden';
  $(buffer).insertBefore(jqele);

  let a = document.createElement('a');
  a.href = "#" + buffer.id;
  a.click();
}

function getBase64Image(img) {
	// Create an empty canvas element
	var canvas = document.createElement("canvas");
	canvas.width = img.naturalWidth;
	canvas.height = img.naturalHeight;

	// Copy the image contents to the canvas
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);

	// Get the data-URL formatted image
	// Firefox supports PNG and JPEG. You could check img.src to
	// guess the original format, but be aware the using "image/jpg"
	// will re-encode the image.
	var dataURL = canvas.toDataURL("image/png");
	return dataURL;
}

function error (msg) {
  // 解析时错误处理，错误提示使用选课系统自带的方法
  $.jBox.tip(msg);
}


(function () {
  'use strict';

  // 登录jwxk.ucas.ac.cn后，自动跳转到选课页面
  if (window.location.href == 'https://jwxk.ucas.ac.cn/notice/view/1') {
    window.location.href = 'https://jwxk.ucas.ac.cn/courseManage/main';
    console.log(...prefix('跳转到选课页面'));
  }

  
  if (window.location.href.startsWith('https://jwxk.ucas.ac.cn/courseManage/main')) {
    // 进入筛选学院页面
    let panel = drawPanel('main');

  }

  if (window.location.href.startsWith('https://jwxk.ucas.ac.cn/courseManage/selectCourse')) {
    // 进入选课页面
    let panel = drawPanel('selectCourse');

    // 解析跨页json参数(如果有)
    let url = window.location.href;
    let ind = url.indexOf('#zzjbehavior');
    if (ind != -1) {
      let data = url.substring(ind + '#zzjbehavior'.length);
      data = decodeURI(data);
      let behavior = JSON.parse(data);
      alreadyHighlighted = resolveBehavior(behavior, alreadyHighlighted);
    }
  }
})();