// ============================================================
// 校园闲置交易平台 - 主逻辑（已移除登录注册功能）
// ============================================================

// 商品数据
const ALL_GOODS = [
  { id: 1, title: '高等数学教材 上下册', price: 25, originalPrice: 68, condition: '8成新', category: '教材', seller: '李同学', school: '计算机学院', distance: '0.5km', time: '3天前', img: 'https://picsum.photos/seed/book1/400/300' },
  { id: 2, title: 'iPad Air 4 256G WiFi版', price: 2800, originalPrice: 4999, condition: '9成新', category: '数码', seller: '陈同学', school: '电子学院', distance: '1.2km', time: '1天前', img: 'https://picsum.photos/seed/ipad/400/300' },
  { id: 3, title: '台灯 LED护眼学习灯', price: 35, originalPrice: 89, condition: '9成新', category: '生活', seller: '王同学', school: '机械学院', distance: '0.8km', time: '5天前', img: 'https://picsum.photos/seed/lamp/400/300' },
  { id: 4, title: '运动休闲双肩包', price: 45, originalPrice: 120, condition: '全新', category: '穿搭', seller: '赵同学', school: '经管学院', distance: '1.5km', time: '2天前', img: 'https://picsum.photos/seed/bag/400/300' },
  { id: 5, title: '考研数学复习全书', price: 30, originalPrice: 85, condition: '8成新', category: '备考', seller: '刘同学', school: '数学学院', distance: '0.3km', time: '1周前', img: 'https://picsum.photos/seed/math/400/300' },
  { id: 6, title: '无线蓝牙耳机', price: 120, originalPrice: 299, condition: '9成新', category: '数码', seller: '周同学', school: '通信学院', distance: '2.0km', time: '4天前', img: 'https://picsum.photos/seed/earphone/400/300' },
  { id: 7, title: '床上书桌折叠桌', price: 55, originalPrice: 150, condition: '8成新', category: '生活', seller: '吴同学', school: '材料学院', distance: '1.0km', time: '6天前', img: 'https://picsum.photos/seed/desk/400/300' },
  { id: 8, title: '英语四六级真题卷', price: 15, originalPrice: 45, condition: '7成新', category: '备考', seller: '郑同学', school: '外语学院', distance: '0.6km', time: '2周前', img: 'https://picsum.photos/seed/english/400/300' },
  { id: 9, title: '小米充电宝20000mAh', price: 65, originalPrice: 149, condition: '9成新', category: '数码', seller: '孙同学', school: '自动化学院', distance: '1.8km', time: '3天前', img: 'https://picsum.photos/seed/powerbank/400/300' },
  { id: 10, title: '大学物理教材', price: 28, originalPrice: 72, condition: '8成新', category: '教材', seller: '钱同学', school: '物理学院', distance: '0.4km', time: '5天前', img: 'https://picsum.photos/seed/physics/400/300' },
  { id: 11, title: '加湿器超声波静音', price: 40, originalPrice: 99, condition: '9成新', category: '生活', seller: '冯同学', school: '计算机学院', distance: '0.9km', time: '1天前', img: 'https://picsum.photos/seed/humidifier/400/300' },
  { id: 12, title: '卡西欧计算器', price: 55, originalPrice: 120, condition: '8成新', category: '备考', seller: '褚同学', school: '数学学院', distance: '1.1km', time: '4天前', img: 'https://picsum.photos/seed/calculator/400/300' }
];

// ============================================================
// 初始化 - 直接进入应用
// ============================================================

window.onload = function() {
  // 直接显示主界面，无需登录
  initApp();
};

function initApp() {
  initMySubData();      // 初始化【我的】各功能示例数据
  updateMenuCounts();   // 更新角标数字
  switchTab('home');
  renderGoodsList();
  renderShopGoods();
  loadUserProfile();
  renderQQMsgList();
}

// ============================================================
// Tab切换
// ============================================================

function switchTab(tab, btn) {
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // 显示目标页面
  const targetPage = document.getElementById('page-' + tab);
  if (targetPage) {
    targetPage.classList.add('active');
  }
  
  // 更新 tab 按钮状态
  document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  
  // 渲染对应页面数据
  if (tab === 'home') renderGoodsList();
  // 分类页由外部或 selectCategory 控制，避免切 tab 时重置筛选
  if (tab === 'category') {
    const countEl = document.getElementById('category-count');
    if (countEl && countEl.textContent === '0件') renderShopGoods();
  }
}

// ============================================================
// 渲染首页商品
// ============================================================

function renderGoodsList() {
  const container = document.getElementById('goods-list');
  if (!container) return;
  
  container.innerHTML = ALL_GOODS.slice(0, 6).map(g => goodsCard(g)).join('');
}

// ============================================================
// 渲染分类商品
// ============================================================

function renderShopGoods(category) {
  const container = document.getElementById('shop-goods');
  if (!container) return;
  
  const goods = category && category !== '全部' 
    ? ALL_GOODS.filter(g => g.category === category)
    : ALL_GOODS;
  
  const countEl = document.getElementById('category-count');
  if (countEl) countEl.textContent = goods.length + '件';
  
  if (goods.length === 0) {
    container.innerHTML = '<div class="no-result"><i class="fa fa-box-open"></i><p>暂无商品</p></div>';
    return;
  }
  
  container.innerHTML = goods.map(g => goodsCard(g)).join('');
}

// ============================================================
// 商品卡片 HTML
// ============================================================

function goodsCard(g) {
  return `
    <div class="goods-card" onclick="openDetail(${g.id})">
      <img class="goods-img" src="${g.img}" alt="${g.title}" onerror="this.src='https://picsum.photos/seed/${g.id}/400/300'" />
      <div class="goods-info">
        <div class="goods-title">${g.title}</div>
        <div class="goods-bottom">
          <span class="goods-price">¥${g.price}</span>
          <span class="goods-meta">${g.distance}</span>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// 分类筛选
// ============================================================

function filterByCategory(cat) {
  switchTab('category', document.getElementById('tab-category'));
  // 找到对应的侧边栏项（通过 onclick 属性匹配分类名）
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  let targetEl = null;
  sidebarItems.forEach(item => {
    const onclick = item.getAttribute('onclick') || '';
    if (onclick.includes(`'${cat}'`)) targetEl = item;
  });
  selectCategory(targetEl || sidebarItems[0], cat);
}

function selectCategory(el, cat) {
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active'));
  if (el) el.classList.add('active');
  
  const titleEl = document.getElementById('category-title');
  if (titleEl) titleEl.textContent = cat === '全部' ? '全部商品' : cat;
  
  renderShopGoods(cat);
}

// ============================================================
// 打开商品详情
// ============================================================

let currentDetailSeller = '';

function openDetail(id) {
  // 支持数字id（ALL_GOODS）和字符串id（我的发布/买到/卖出）
  const g = ALL_GOODS.find(item => item.id === id || item.id === parseInt(id));
  if (!g) {
    showToast('商品已下架或不存在');
    return;
  }
  
  currentDetailSeller = g.seller;
  
  const content = document.getElementById('detail-content');
  if (content) {
    content.innerHTML = `
      <img class="detail-img" src="${g.img}" alt="${g.title}" onerror="this.src='https://picsum.photos/seed/${g.id}/400/300'" />
      <div class="detail-info">
        <div class="detail-price">¥${g.price}</div>
        <div class="detail-title">${g.title}</div>
        <div class="detail-tags">
          <span class="detail-tag">${g.condition}</span>
          <span class="detail-tag">${g.distance}</span>
          <span class="detail-tag">${g.time}</span>
        </div>
      </div>
      <div class="detail-seller">
        <div class="seller-avatar"><i class="fa fa-user"></i></div>
        <div class="seller-info">
          <div class="seller-name">${g.seller}</div>
          <div class="seller-school">${g.school}</div>
        </div>
      </div>
      <div class="detail-desc">
        <h4>商品描述</h4>
        <p>本人因为${g.category === '教材' ? '毕业/换专业' : '升级换代/闲置'}，现出售此商品。商品来源可靠，使用时间不长，成色较好，价格可小刀，欢迎联系~</p>
      </div>
    `;
  }
  
  const detailPage = document.getElementById('page-detail');
  if (detailPage) detailPage.classList.add('show');
}

// 关闭详情
function closeDetail() {
  const detailPage = document.getElementById('page-detail');
  if (detailPage) detailPage.classList.remove('show');
}

// ============================================================
// 收藏切换
// ============================================================

let isFavorited = false;

function toggleFavorite() {
  isFavorited = !isFavorited;
  const icon = document.getElementById('detail-favorite-icon');
  if (icon) {
    icon.style.color = isFavorited ? '#FF6B8A' : '#999';
    icon.className = isFavorited ? 'fa fa-heart' : 'fa fa-heart-o';
  }
  showToast(isFavorited ? '已收藏' : '取消收藏');
}

// ============================================================
// 发布商品
// ============================================================

function doPublish() {
  // 获取表单数据
  const title = document.querySelector('#page-publish input[type="text"]')?.value.trim() || '';
  const price = document.querySelector('#page-publish input[type="number"]')?.value || '';
  const category = document.querySelector('.category-tags .tag.active')?.textContent || '其他';
  const condition = document.querySelector('.condition-tags .tag.active')?.textContent || '全新';
  const location = document.querySelector('.location-tags .tag.active')?.textContent.replace(/\s/g, '') || '校内';
  const desc = document.querySelector('#page-publish textarea')?.value.trim() || '';
  const originalPrice = document.querySelectorAll('#page-publish input[type="number"]')[1]?.value || price;

  if (!title) {
    showToast('请输入商品标题');
    return;
  }
  if (!price) {
    showToast('请输入售价');
    return;
  }

  // 使用上传的图片或默认图片
  const img = uploadedImages.length > 0 ? uploadedImages[0] : 'https://picsum.photos/seed/' + Date.now() + '/400/300';
  const images = uploadedImages.length > 0 ? uploadedImages : [img];

  // 创建新商品
  const newGood = {
    id: Date.now(),
    title: title,
    price: parseInt(price),
    originalPrice: parseInt(originalPrice) || parseInt(price) * 2,
    condition: condition,
    category: category,
    seller: userProfile.nickname || '游客',
    school: userProfile.school || '校园',
    distance: '0km',
    time: '刚刚',
    img: img,
    images: images
  };

  // 添加到商品列表
  ALL_GOODS.unshift(newGood);

  // 保存到我的发布
  const myPublished = getMyPublished();
  myPublished.unshift({ ...newGood, status: 'selling' });
  saveMyPublished(myPublished);

  // 清空表单
  document.querySelector('#page-publish input[type="text"]').value = '';
  document.querySelectorAll('#page-publish input[type="number"]').forEach(i => i.value = '');
  document.querySelector('#page-publish textarea').value = '';
  
  // 清空图片
  uploadedImages = [];
  const container = document.getElementById('publish-images');
  container.querySelectorAll('.publish-img-item').forEach(el => el.remove());

  // 重置标签选择
  document.querySelectorAll('#page-publish .tag').forEach((t, i) => {
    if (i === 0) t.classList.add('active');
    else t.classList.remove('active');
  });

  // 更新显示
  updateMenuCounts();
  showToast('发布成功！');

  // 跳转到首页
  setTimeout(() => {
    switchTab('home', document.getElementById('tab-home'));
    renderGoodsList();
  }, 1000);
}

// 标签选择
function selectTag(el, containerClass) {
  const container = el.parentElement;
  container.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

// 图片上传
let uploadedImages = [];

function handleImageUpload(input) {
  const container = document.getElementById('publish-images');
  const addBtn = container.querySelector('.publish-img-add');
  
  if (input.files) {
    Array.from(input.files).forEach(file => {
      if (uploadedImages.length >= 9) {
        showToast('最多上传9张图片');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = function(e) {
        const imgData = e.target.result;
        uploadedImages.push(imgData);
        
        const imgDiv = document.createElement('div');
        imgDiv.className = 'publish-img-item';
        imgDiv.innerHTML = `
          <img src="${imgData}" />
          <span class="publish-img-remove" onclick="removePublishImage(this, '${imgData}')">&times;</span>
        `;
        container.insertBefore(imgDiv, addBtn);
      };
      reader.readAsDataURL(file);
    });
  }
}

function removePublishImage(el, imgData) {
  uploadedImages = uploadedImages.filter(i => i !== imgData);
  el.parentElement.remove();
}

// ============================================================
// Toast提示
// ============================================================

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ============================================================
// 个人资料编辑
// ============================================================

let userProfile = {
  nickname: '游客',
  school: '',
  avatar: ''
};

// 加载用户资料
function loadUserProfile() {
  const saved = localStorage.getItem('campus_user_profile');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      userProfile = {
        nickname: data.nickname || '校园用户',
        school: data.school || '',
        avatar: data.avatar || ''
      };
    } catch(e) {
      console.error('Failed to load user profile:', e);
    }
  }
  updateMyPageDisplay();
}

// 更新"我的"页面显示
function updateMyPageDisplay() {
  const nameEl = document.getElementById('user-name');
  const schoolEl = document.getElementById('user-school');
  const avatarEl = document.querySelector('.my-avatar');
  
  if (nameEl) nameEl.textContent = userProfile.nickname || '校园用户';
  if (schoolEl) schoolEl.textContent = userProfile.school || '点击编辑资料';
  
  if (avatarEl) {
    if (userProfile.avatar && userProfile.avatar.startsWith('http')) {
      avatarEl.innerHTML = `<img src="${userProfile.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.outerHTML='<i class=\\'fa fa-user\\'></i>'" />`;
    } else {
      avatarEl.innerHTML = '<i class="fa fa-user"></i>';
    }
  }
}

// 打开编辑弹窗
function openProfileEditor() {
  const nicknameInput = document.getElementById('edit-nickname');
  const schoolInput = document.getElementById('edit-school');
  const avatarPreview = document.getElementById('edit-avatar');
  
  if (nicknameInput) nicknameInput.value = userProfile.nickname || '';
  if (schoolInput) schoolInput.value = userProfile.school || '';
  
  if (avatarPreview) {
    if (userProfile.avatar && userProfile.avatar.startsWith('http')) {
      avatarPreview.innerHTML = `<img src="${userProfile.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.outerHTML='<i class=\\'fa fa-user\\'></i>'" />`;
    } else {
      avatarPreview.innerHTML = '<i class="fa fa-user"></i>';
    }
  }
  
  const editor = document.getElementById('profile-editor');
  if (editor) editor.classList.add('show');
}

// 关闭编辑弹窗
function closeProfileEditor(e) {
  if (e && e.target !== e.currentTarget) return;
  const editor = document.getElementById('profile-editor');
  if (editor) editor.classList.remove('show');
}

// 更换头像
function changeAvatar() {
  const seed = 'avatar_' + Date.now();
  const newAvatar = `https://picsum.photos/seed/${seed}/200/200`;
  userProfile.avatar = newAvatar;
  
  const avatarPreview = document.getElementById('edit-avatar');
  if (avatarPreview) {
    avatarPreview.innerHTML = `<img src="${newAvatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" onerror="this.outerHTML='<i class=\\'fa fa-user\\'></i>'" />`;
  }
  showToast('头像已更换，记得保存');
}

// 保存资料
function saveProfile() {
  const nicknameInput = document.getElementById('edit-nickname');
  const schoolInput = document.getElementById('edit-school');
  
  const nickname = nicknameInput ? nicknameInput.value.trim() : '';
  const school = schoolInput ? schoolInput.value.trim() : '';
  
  if (!nickname) {
    showToast('请输入昵称');
    return;
  }

  // 如果输入的是默认值，保持为"游客"
  if (nickname === '游客') {
    userProfile.nickname = '游客';
  } else {
    userProfile.nickname = nickname;
  }
  
  userProfile.nickname = nickname;
  userProfile.school = school;
  
  // 保存到 localStorage
  localStorage.setItem('campus_user_profile', JSON.stringify(userProfile));
  
  updateMyPageDisplay();
  closeProfileEditor();
  showToast('资料已保存');
}

// ============================================================
// 消息功能 — QQ风格
// ============================================================

let currentChatName = '';
let chatMessages = [];

// 预定义的自动回复
const chatReplies = [
  '你好，在的～',
  '可以的，价格可以商量',
  '这已经是很实惠的价格了',
  '什么时候方便交易？',
  '好的，那我们约个时间吧！',
  '在的，有什么问题可以问哦',
  '商品还在的，欢迎来看看',
  '可以校内当面交易',
  '谢谢理解～',
  '嗯嗯，可以的',
  '明天下午有空吗？食堂门口见？',
  '好的，收到！',
  '不好意思，这个价格不能再低了',
  '没问题，那我们就这样说定了'
];

// 颜色池
const avatarColors = ['#FF9500','#3DBE8E','#4A90E2','#FF6B8A','#9B59B6','#1ABC9C','#E67E22','#3498DB'];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

// ---- 通知数据 ----
const noticeData = [
  { icon: 'fa-bullhorn', color: '#4A90E2', title: '系统通知', text: '欢迎使用校园闲置交易平台，祝您交易愉快！', time: '刚刚', unread: true },
  { icon: 'fa-gift', color: '#FF9500', title: '活动提醒', text: '开学季活动火热进行中，教材类商品满30减5！', time: '2小时前', unread: true },
  { icon: 'fa-shield-alt', color: '#3DBE8E', title: '安全提示', text: '请使用平台内沟通，勿私下转账，谨防诈骗', time: '1天前', unread: false },
  { icon: 'fa-star', color: '#FF6B8A', title: '收藏提醒', text: '您收藏的「iPad Air 4」已降价，快来看看吧！', time: '2天前', unread: false }
];

// ---- 新朋友数据 ----
const newFriendsData = [
  { name: '张同学', school: '计算机学院', color: '#4A90E2', time: '刚刚', status: 'pending' },
  { name: '林同学', school: '外语学院', color: '#FF6B8A', time: '1小时前', status: 'pending' },
  { name: '何同学', school: '数学学院', color: '#9B59B6', time: '昨天', status: 'accepted' },
  { name: '黄同学', school: '电子学院', color: '#FF9500', time: '3天前', status: 'accepted' }
];

// ---- 渲染QQ风格消息列表 ----
function renderQQMsgList(filter) {
  const container = document.getElementById('qq-msg-list');
  if (!container) return;

  const sessions = getChatSessions();
  let names = Object.keys(sessions);

  // 搜索过滤
  if (filter && filter.trim()) {
    const kw = filter.trim().toLowerCase();
    names = names.filter(n => n.toLowerCase().includes(kw));
  }

  // 按最后消息时间排序
  names.sort((a, b) => {
    const ta = sessions[a].messages && sessions[a].messages.length > 0 ? sessions[a].messages[sessions[a].messages.length-1].ts || 0 : 0;
    const tb = sessions[b].messages && sessions[b].messages.length > 0 ? sessions[b].messages[sessions[b].messages.length-1].ts || 0 : 0;
    return tb - ta;
  });

  if (names.length === 0) {
    container.innerHTML = `
      <div class="qq-msg-empty">
        <i class="fa fa-comment-slash"></i>
        <p>暂无消息</p>
        <span>在商品详情页点击"私信"开始聊天吧</span>
      </div>`;
    return;
  }

  container.innerHTML = names.map(name => {
    const s = sessions[name];
    const lastMsg = s.lastMsg || '';
    const lastTime = s.lastTime || '';
    const unread = s.unread || 0;
    const color = getAvatarColor(name);
    return `
      <div class="qq-msg-item" data-name="${name}" onclick="openChat('${name}')">
        <div class="qq-msg-avatar-wrap">
          <div class="qq-msg-avatar" style="background:${color}">${name.charAt(0)}</div>
          ${unread > 0 ? `<div class="qq-msg-unread-dot">${unread > 99 ? '99+' : unread}</div>` : ''}
        </div>
        <div class="qq-msg-body">
          <div class="qq-msg-top-row">
            <div class="qq-msg-name">${name}</div>
            <div class="qq-msg-time">${lastTime}</div>
          </div>
          <div class="qq-msg-preview">${lastMsg}</div>
        </div>
        <div class="qq-swipe-actions">
          <div class="qq-swipe-btn mark-read" onclick="event.stopPropagation();markMsgRead('${name}')">
            <i class="fa fa-check-circle"></i>
            <span>${unread > 0 ? '已读' : '删除'}</span>
          </div>
          <div class="qq-swipe-btn delete" onclick="event.stopPropagation();deleteMsgSession('${name}')">
            <i class="fa fa-trash"></i>
            <span>删除</span>
          </div>
        </div>
      </div>`;
  }).join('');

  // 绑定左滑手势
  bindSwipeEvents();
}

// ---- 左滑手势 ----
function bindSwipeEvents() {
  let startX = 0, currentX = 0, swiping = false, currentItem = null;
  const items = document.querySelectorAll('.qq-msg-item');

  items.forEach(item => {
    item.addEventListener('touchstart', function(e) {
      // 关闭其他已打开的滑动
      document.querySelectorAll('.qq-msg-item.swiped').forEach(el => {
        if (el !== item) el.classList.remove('swiped');
      });
      startX = e.touches[0].clientX;
      currentItem = item;
      swiping = false;
    }, { passive: true });

    item.addEventListener('touchmove', function(e) {
      currentX = e.touches[0].clientX;
      const diff = startX - currentX;
      if (diff > 30) {
        swiping = true;
        item.classList.add('swiped');
      } else if (diff < -30) {
        item.classList.remove('swiped');
        swiping = false;
      }
    }, { passive: true });

    item.addEventListener('touchend', function(e) {
      if (swiping) {
        e.preventDefault();
      }
    });
  });

  // 点击空白关闭滑动
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.qq-msg-item')) {
      document.querySelectorAll('.qq-msg-item.swiped').forEach(el => el.classList.remove('swiped'));
    }
  });
}

// ---- 标记已读 ----
function markMsgRead(name) {
  const sessions = getChatSessions();
  if (sessions[name]) {
    if (sessions[name].unread > 0) {
      sessions[name].unread = 0;
    } else {
      delete sessions[name];
    }
    saveChatSessions(sessions);
    renderQQMsgList();
  }
}

// ---- 删除会话 ----
function deleteMsgSession(name) {
  const sessions = getChatSessions();
  delete sessions[name];
  saveChatSessions(sessions);
  renderQQMsgList();
  showToast('已删除');
}

// ---- 搜索过滤 ----
function filterMsgList(val) {
  renderQQMsgList(val);
}

function focusMsgSearch() {
  const input = document.getElementById('msg-search-input');
  if (input) input.focus();
}

// ---- 聊天会话存储 ----
function getChatSessions() {
  try {
    return JSON.parse(localStorage.getItem('campus_chat_sessions') || '{}');
  } catch(e) {
    return {};
  }
}

function saveChatSessions(sessions) {
  localStorage.setItem('campus_chat_sessions', JSON.stringify(sessions));
}

function getChatSession(name) {
  const sessions = getChatSessions();
  return sessions[name] || { messages: [], lastMsg: '', lastTime: '', unread: 0 };
}

function saveChatSession(name, session) {
  const sessions = getChatSessions();
  sessions[name] = session;
  saveChatSessions(sessions);
}

// ---- 新朋友 ----
function openNewFriends() {
  renderNewFriends();
  const panel = document.getElementById('new-friends-panel');
  if (panel) panel.classList.add('show');
}

function closeNewFriends(e) {
  if (e && e.target !== e.currentTarget) return;
  const panel = document.getElementById('new-friends-panel');
  if (panel) panel.classList.remove('show');
}

function renderNewFriends() {
  const body = document.getElementById('new-friends-body');
  if (!body) return;

  const pendingCount = newFriendsData.filter(f => f.status === 'pending').length;
  const badge = document.getElementById('new-friend-badge');
  if (badge) {
    if (pendingCount > 0) {
      badge.textContent = pendingCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  body.innerHTML = newFriendsData.map((f, i) => `
    <div class="qq-notice-item">
      <div class="qq-notice-avatar" style="background:${f.color}">${f.name.charAt(0)}</div>
      <div class="qq-notice-content">
        <div class="qq-notice-title">${f.name}</div>
        <div class="qq-notice-text">${f.school}</div>
      </div>
      <div class="qq-notice-right">
        <div class="qq-notice-time">${f.time}</div>
        <button class="qq-notice-btn ${f.status === 'accepted' ? 'accepted' : 'accept'}"
          onclick="acceptFriend(${i})">${f.status === 'accepted' ? '已添加' : '接受'}</button>
      </div>
    </div>
  `).join('');
}

function acceptFriend(idx) {
  if (newFriendsData[idx].status === 'accepted') return;
  newFriendsData[idx].status = 'accepted';
  renderNewFriends();
  showToast('已添加 ' + newFriendsData[idx].name);
}

// ---- 系统通知 ----
function openSystemNotice() {
  renderSystemNotice();
  const panel = document.getElementById('sys-notice-panel');
  if (panel) panel.classList.add('show');
}

function closeSystemNotice(e) {
  if (e && e.target !== e.currentTarget) return;
  const panel = document.getElementById('sys-notice-panel');
  if (panel) panel.classList.remove('show');
}

function renderSystemNotice() {
  const body = document.getElementById('sys-notice-body');
  if (!body) return;

  const unreadCount = noticeData.filter(n => n.unread).length;
  const badge = document.getElementById('sys-notice-badge');
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }

  body.innerHTML = noticeData.map((n, i) => `
    <div class="qq-notice-item">
      <div class="qq-notice-avatar" style="background:${n.color}">
        <i class="fa ${n.icon}"></i>
      </div>
      <div class="qq-notice-content">
        <div class="qq-notice-title">${n.title}</div>
        <div class="qq-notice-text">${n.text}</div>
      </div>
      <div class="qq-notice-right">
        <div class="qq-notice-time">${n.time}</div>
        ${n.unread ? `<button class="qq-notice-btn read" onclick="markNoticeRead(${i})">已读</button>` : ''}
      </div>
    </div>
  `).join('');
}

function markNoticeRead(idx) {
  noticeData[idx].unread = false;
  renderSystemNotice();
  showToast('已标记为已读');
}

function openGroupNotice() {
  showToast('暂无群通知');
}

// ---- 打开聊天窗口 ----
function openChat(name) {
  currentChatName = name;
  const session = getChatSession(name);
  chatMessages = session.messages || [];

  const titleEl = document.getElementById('chat-title');
  const messagesEl = document.getElementById('chat-messages');
  const inputEl = document.getElementById('chat-input');

  if (titleEl) titleEl.textContent = name;
  if (messagesEl) messagesEl.innerHTML = '';
  if (inputEl) inputEl.value = '';

  // 清除该会话的未读
  session.unread = 0;
  saveChatSession(name, session);

  // 渲染历史消息
  renderChatMessages();

  const chatWindow = document.getElementById('chat-window');
  if (chatWindow) chatWindow.classList.add('open');

  // 聚焦输入框
  setTimeout(() => { if (inputEl) inputEl.focus(); }, 350);
}

// ---- 关闭聊天窗口 ----
function closeChat() {
  const chatWindow = document.getElementById('chat-window');
  if (chatWindow) chatWindow.classList.remove('open');
  currentChatName = '';
  // 刷新消息列表
  renderQQMsgList();
}

// ---- 发送消息 ----
function sendChatMsg() {
  const input = document.getElementById('chat-input');
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  const now = Date.now();
  const timeStr = formatChatTime(now);

  // 添加用户消息
  const msg = { type: 'user', text: text, time: timeStr, ts: now };
  chatMessages.push(msg);
  renderChatMessages();
  input.value = '';

  // 保存到会话
  saveCurrentChat(text, timeStr, now);

  // 模拟对方回复
  const chatName = currentChatName;
  setTimeout(() => {
    if (currentChatName !== chatName) return;
    const reply = chatReplies[Math.floor(Math.random() * chatReplies.length)];
    const replyNow = Date.now();
    const replyTime = formatChatTime(replyNow);
    const replyMsg = { type: 'other', text: reply, time: replyTime, ts: replyNow };
    chatMessages.push(replyMsg);
    renderChatMessages();

    // 保存回复到会话
    const session = getChatSession(currentChatName);
    session.messages = chatMessages;
    session.lastMsg = reply;
    session.lastTime = replyTime;
    saveChatSession(currentChatName, session);
  }, 800 + Math.random() * 1200);
}

// ---- 保存当前聊天消息 ----
function saveCurrentChat(lastMsg, timeStr, ts) {
  const session = getChatSession(currentChatName);
  session.messages = chatMessages;
  session.lastMsg = lastMsg;
  session.lastTime = timeStr;
  saveChatSession(currentChatName, session);
}

// ---- 从商品详情打开聊天（带商品卡片） ----
function openDetailChat() {
  const name = currentDetailSeller || '卖家';
  const session = getChatSession(name);

  // 如果是新会话，添加一条商品相关消息
  if (!session.messages || session.messages.length === 0) {
    session.messages = session.messages || [];
    const good = ALL_GOODS.find(g => g.seller === name);
    if (good) {
      const now = Date.now();
      session.messages.push({
        type: 'system',
        text: `你对「${good.title}」感兴趣，开始聊天吧`,
        ts: now,
        goodId: good.id
      });
      session.lastMsg = `[商品] ${good.title}`;
      session.lastTime = formatChatTime(now);
      saveChatSession(name, session);
    }
  }

  // 切换到消息Tab
  switchTab('message', document.getElementById('tab-message'));

  openChat(name);
}

// ---- 私信功能（兼容旧调用） ----
function openPrivateChat(name) {
  openChat(name);
}

// ---- 渲染聊天消息 ----
function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  container.innerHTML = chatMessages.map(msg => {
    if (msg.type === 'system') {
      const good = msg.goodId ? ALL_GOODS.find(g => g.id === msg.goodId) : null;
      let goodCard = '';
      if (good) {
        goodCard = `
          <div class="chat-good-card" onclick="closeChat();setTimeout(()=>openDetail(${good.id}),350)">
            <img src="${good.img}" alt="${good.title}" onerror="this.src='https://picsum.photos/seed/${good.id}/200/150'" />
            <div class="chat-good-info">
              <div class="chat-good-title">${good.title}</div>
              <div class="chat-good-price">¥${good.price}</div>
            </div>
          </div>`;
      }
      return `<div class="chat-system">
        <span>${msg.text}</span>
        ${goodCard}
      </div>`;
    }

    if (msg.type === 'user') {
      return `<div class="chat-msg user">
        <div class="chat-bubble user">${msg.text}</div>
        <div class="chat-time">${msg.time}</div>
      </div>`;
    } else {
      return `<div class="chat-msg other">
        <div class="chat-avatar" style="background:${getAvatarColor(currentChatName)}">${currentChatName.charAt(0)}</div>
        <div>
          <div class="chat-bubble other">${msg.text}</div>
          <div class="chat-time">${msg.time}</div>
        </div>
      </div>`;
    }
  }).join('');

  container.scrollTop = container.scrollHeight;
}

// ---- 时间格式化 ----
function formatChatTime(ts) {
  const d = new Date(ts);
  const now = new Date();
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  const timeStr = h + ':' + m;

  if (d.toDateString() === now.toDateString()) return timeStr;

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return '昨天 ' + timeStr;

  return (d.getMonth()+1) + '/' + d.getDate() + ' ' + timeStr;
}

// ============================================================
// "我的"子页面功能
// ============================================================

// ---- 数据存储 ----

// 我的发布
function getMyPublished() {
  try { return JSON.parse(localStorage.getItem('campus_my_published') || '[]'); } catch(e) { return []; }
}
function saveMyPublished(list) { localStorage.setItem('campus_my_published', JSON.stringify(list)); }

// 我的收藏
function getMyFavorites() {
  try { return JSON.parse(localStorage.getItem('campus_my_favorites') || '[]'); } catch(e) { return []; }
}
function saveMyFavorites(list) { localStorage.setItem('campus_my_favorites', JSON.stringify(list)); }

// 我买到的
function getMyBought() {
  try { return JSON.parse(localStorage.getItem('campus_my_bought') || '[]'); } catch(e) { return []; }
}
function saveMyBought(list) { localStorage.setItem('campus_my_bought', JSON.stringify(list)); }

// 我卖出的
function getMySold() {
  try { return JSON.parse(localStorage.getItem('campus_my_sold') || '[]'); } catch(e) { return []; }
}
function saveMySold(list) { localStorage.setItem('campus_my_sold', JSON.stringify(list)); }

// ---- 初始化示例数据（首次打开时） ----
function initMySubData() {
  // 发布：2件商品
  if (getMyPublished().length === 0) {
    saveMyPublished([
      { id: 1, title: '高等数学教材 上下册', price: 25, originalPrice: 68, condition: '8成新', category: '教材', img: 'https://picsum.photos/seed/book1/400/300', status: 'selling', time: '3天前' },
      { id: 3, title: '台灯 LED护眼学习灯', price: 35, originalPrice: 89, condition: '9成新', category: '生活', img: 'https://picsum.photos/seed/lamp/400/300', status: 'sold', time: '5天前' }
    ]);
  }
  // 收藏：3件商品
  if (getMyFavorites().length === 0) {
    saveMyFavorites([
      { id: 2, title: 'iPad Air 4 256G WiFi版', price: 2800, condition: '9成新', category: '数码', img: 'https://picsum.photos/seed/ipad/400/300', seller: '陈同学', time: '1天前' },
      { id: 6, title: '无线蓝牙耳机', price: 120, condition: '9成新', category: '数码', img: 'https://picsum.photos/seed/earphone/400/300', seller: '周同学', time: '4天前' },
      { id: 9, title: '小米充电宝20000mAh', price: 65, condition: '9成新', category: '数码', img: 'https://picsum.photos/seed/powerbank/400/300', seller: '孙同学', time: '3天前' }
    ]);
  }
  // 买到的：2件
  if (getMyBought().length === 0) {
    saveMyBought([
      { id: 8, title: '英语四六级真题卷', price: 15, condition: '7成新', category: '备考', img: 'https://picsum.photos/seed/english/400/300', seller: '郑同学', time: '2周前', status: 'done' },
      { id: 4, title: '运动休闲双肩包', price: 45, condition: '全新', category: '穿搭', img: 'https://picsum.photos/seed/bag/400/300', seller: '赵同学', time: '1周前', status: 'done' }
    ]);
  }
  // 卖出的：1件
  if (getMySold().length === 0) {
    saveMySold([
      { id: 3, title: '台灯 LED护眼学习灯', price: 35, condition: '9成新', category: '生活', img: 'https://picsum.photos/seed/lamp/400/300', buyer: '王同学', time: '5天前', status: 'done' }
    ]);
  }
}

// ---- 更新菜单角标数字 ----
function updateMenuCounts() {
  const published = getMyPublished();
  const favorites = getMyFavorites();
  const bought = getMyBought();
  const sold = getMySold();

  const setCount = (id, count) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = count;
      el.setAttribute('data-count', count);
    }
  };

  setCount('count-published', published.length);
  setCount('count-favorites', favorites.length);
  setCount('count-bought', bought.length);
  setCount('count-sold', sold.length);

  // 更新统计数字
  const sellingCount = published.filter(p => p.status === 'selling').length;
  const statNums = document.querySelectorAll('.stat-num');
  if (statNums.length >= 4) {
    statNums[0].textContent = published.length;
    statNums[1].textContent = sold.length;
    statNums[2].textContent = bought.length;
    statNums[3].textContent = favorites.length;
  }
}

// ---- 打开子页面 ----
function openMySubPage(type) {
  const titles = {
    published: '我的发布',
    favorites: '我的收藏',
    bought: '我买到的',
    sold: '我卖出的',
    help: '帮助与反馈',
    about: '关于我们',
    settings: '设置'
  };

  const titleEl = document.getElementById('my-sub-title');
  const bodyEl = document.getElementById('my-sub-body');
  if (titleEl) titleEl.textContent = titles[type] || '';

  switch(type) {
    case 'published': renderMyPublished(bodyEl); break;
    case 'favorites': renderMyFavorites(bodyEl); break;
    case 'bought': renderMyBought(bodyEl); break;
    case 'sold': renderMySold(bodyEl); break;
    case 'help': renderHelp(bodyEl); break;
    case 'about': renderAbout(bodyEl); break;
    case 'settings': renderSettings(bodyEl); break;
  }

  const overlay = document.getElementById('my-sub-overlay');
  if (overlay) overlay.classList.add('show');
}

function closeMySubPage() {
  const overlay = document.getElementById('my-sub-overlay');
  if (overlay) overlay.classList.remove('show');
  // 刷新消息列表和角标
  updateMenuCounts();
}

// ---- 我的发布 ----
function renderMyPublished(container) {
  const list = getMyPublished();
  if (list.length === 0) {
    container.innerHTML = `
      <div class="sub-empty">
        <i class="fa fa-box-open"></i>
        <p>还没有发布商品</p>
        <span>点击底部"发布"开始闲置交易吧</span>
      </div>`;
    return;
  }

  container.innerHTML = list.map((item, idx) => {
    const statusText = item.status === 'selling' ? '在售' : item.status === 'sold' ? '已售' : '已下架';
    const statusClass = item.status === 'selling' ? 'selling' : item.status === 'sold' ? 'sold' : 'off';
    return `
      <div class="sub-goods-item" onclick="openDetail(${item.id})">
        <img class="sub-goods-img" src="${item.img}" onerror="this.src='https://picsum.photos/seed/${item.id}/200/150'" />
        <div class="sub-goods-info">
          <div class="sub-goods-title">${item.title}</div>
          <div class="sub-goods-meta">
            <span>${item.condition}</span><span>${item.time}</span>
          </div>
        </div>
        <span class="sub-status-tag ${statusClass}">${statusText}</span>
        <span class="sub-goods-price">¥${item.price}</span>
      </div>`;
  }).join('');
}

// ---- 我的收藏 ----
function renderMyFavorites(container) {
  const list = getMyFavorites();
  if (list.length === 0) {
    container.innerHTML = `
      <div class="sub-empty">
        <i class="fa fa-heart"></i>
        <p>还没有收藏商品</p>
        <span>在商品详情页点击"收藏"添加</span>
      </div>`;
    return;
  }

  container.innerHTML = list.map((item, idx) => `
    <div class="sub-goods-item" onclick="closeMySubPage();setTimeout(()=>openDetail(${item.id}),350)">
      <img class="sub-goods-img" src="${item.img}" onerror="this.src='https://picsum.photos/seed/${item.id}/200/150'" />
      <div class="sub-goods-info">
        <div class="sub-goods-title">${item.title}</div>
        <div class="sub-goods-meta">
          <span>${item.condition}</span><span>${item.seller || ''}</span>
        </div>
      </div>
      <span class="sub-goods-price">¥${item.price}</span>
      <button class="sub-action-btn remove" onclick="event.stopPropagation();removeFavorite(${idx})">取消</button>
    </div>
  `).join('');
}

function removeFavorite(idx) {
  const list = getMyFavorites();
  if (idx >= 0 && idx < list.length) {
    const name = list[idx].title;
    list.splice(idx, 1);
    saveMyFavorites(list);
    const bodyEl = document.getElementById('my-sub-body');
    renderMyFavorites(bodyEl);
    showToast('已取消收藏「' + name + '」');
  }
}

// ---- 我买到的 ----
function renderMyBought(container) {
  const list = getMyBought();
  if (list.length === 0) {
    container.innerHTML = `
      <div class="sub-empty">
        <i class="fa fa-shopping-bag"></i>
        <p>还没有买到商品</p>
        <span>完成交易后商品会出现在这里</span>
      </div>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="sub-goods-item">
      <img class="sub-goods-img" src="${item.img}" onerror="this.src='https://picsum.photos/seed/${item.id}/200/150'" />
      <div class="sub-goods-info">
        <div class="sub-goods-title">${item.title}</div>
        <div class="sub-goods-meta">
          <span>${item.condition}</span><span>卖家: ${item.seller || ''}</span><span>${item.time}</span>
        </div>
      </div>
      <span class="sub-goods-price">¥${item.price}</span>
    </div>
  `).join('');
}

// ---- 我卖出的 ----
function renderMySold(container) {
  const list = getMySold();
  if (list.length === 0) {
    container.innerHTML = `
      <div class="sub-empty">
        <i class="fa fa-coins"></i>
        <p>还没有卖出商品</p>
        <span>商品售出后会自动出现在这里</span>
      </div>`;
    return;
  }

  container.innerHTML = list.map(item => `
    <div class="sub-goods-item">
      <img class="sub-goods-img" src="${item.img}" onerror="this.src='https://picsum.photos/seed/${item.id}/200/150'" />
      <div class="sub-goods-info">
        <div class="sub-goods-title">${item.title}</div>
        <div class="sub-goods-meta">
          <span>${item.condition}</span><span>买家: ${item.buyer || ''}</span><span>${item.time}</span>
        </div>
      </div>
      <span class="sub-goods-price">¥${item.price}</span>
    </div>
  `).join('');
}

// ---- 帮助与反馈 ----
const faqData = [
  { q: '如何发布闲置商品？', a: '点击底部导航栏"发布"按钮，填写商品标题、分类、价格、成色和描述等信息，点击"立即发布"即可。发布后商品会出现在首页和分类页中。' },
  { q: '如何购买商品？', a: '浏览商品后点击进入详情页，可以通过"私信"或"立即联系"与卖家沟通，协商好交易方式和时间后线下当面交易即可。' },
  { q: '如何修改或删除已发布的商品？', a: '进入"我的"→"我的发布"，找到对应商品进行编辑或下架操作。下架后商品将不再展示给其他用户。' },
  { q: '交易安全提示', a: '请尽量选择校内当面交易，验货后再付款。不要提前转账或泄露个人账户信息。如遇可疑情况，请及时通过"帮助与反馈"联系我们。' },
  { q: '如何收藏商品？', a: '在商品详情页点击底部"收藏"按钮即可收藏商品。收藏后可在"我的"→"我的收藏"中查看。' }
];

function renderHelp(container) {
  container.innerHTML = `
    <div class="help-section">
      <div class="help-section-title">常见问题</div>
      ${faqData.map((item, idx) => `
        <div class="help-faq-item">
          <div class="help-faq-q" onclick="toggleFaq(this)">
            <span>${item.q}</span>
            <i class="fa fa-chevron-down"></i>
          </div>
          <div class="help-faq-a">${item.a}</div>
        </div>
      `).join('')}
    </div>
    <div class="help-section">
      <div class="help-section-title">意见反馈</div>
      <div class="help-form">
        <textarea id="feedback-text" placeholder="请描述您遇到的问题或建议，我们会尽快处理..."></textarea>
        <button class="help-form-btn" onclick="submitFeedback()">提交反馈</button>
      </div>
    </div>`;
}

function toggleFaq(el) {
  const answer = el.nextElementSibling;
  const isOpen = el.classList.contains('open');
  // 关闭其他
  document.querySelectorAll('.help-faq-q.open').forEach(q => {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
  });
  if (!isOpen) {
    el.classList.add('open');
    answer.classList.add('open');
  }
}

function submitFeedback() {
  const textarea = document.getElementById('feedback-text');
  if (!textarea) return;
  const text = textarea.value.trim();
  if (!text) {
    showToast('请输入反馈内容');
    return;
  }
  // 保存反馈
  const feedbacks = JSON.parse(localStorage.getItem('campus_feedbacks') || '[]');
  feedbacks.push({ text: text, time: new Date().toISOString() });
  localStorage.setItem('campus_feedbacks', JSON.stringify(feedbacks));
  textarea.value = '';
  showToast('感谢您的反馈！');
}

// ---- 关于我们 ----
function renderAbout(container) {
  container.innerHTML = `
    <div class="about-container">
      <div class="about-logo"><i class="fa fa-exchange-alt"></i></div>
      <div class="about-name">校园闲置交易平台</div>
      <div class="about-version">Version 1.0.0</div>
      <div class="about-desc">
        校园闲置交易平台致力于为高校学生提供安全、便捷的二手物品交易服务。<br>
        让闲置物品找到新主人，让每一件好物都不被浪费。
      </div>
      <div class="about-links">
        <div class="about-link-item">
          <span>官方网站</span>
          <span>www.campustrade.cn</span>
        </div>
        <div class="about-link-item">
          <span>客服邮箱</span>
          <span>support@campustrade.cn</span>
        </div>
        <div class="about-link-item">
          <span>微信公众号</span>
          <span>校园闲置交易</span>
        </div>
        <div class="about-link-item">
          <span>用户协议</span>
          <i class="fa fa-chevron-right" style="color:#ccc;font-size:12px"></i>
        </div>
        <div class="about-link-item">
          <span>隐私政策</span>
          <i class="fa fa-chevron-right" style="color:#ccc;font-size:12px"></i>
        </div>
        <div class="about-link-item">
          <span>开源许可</span>
          <i class="fa fa-chevron-right" style="color:#ccc;font-size:12px"></i>
        </div>
      </div>
    </div>`;
}

// ---- 设置 ----
let settingsData = {
  notifyNewMsg: true,
  notifyPriceDrop: true,
  cacheAutoClean: false
};

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('campus_settings') || '{}');
    settingsData = { ...settingsData, ...saved };
  } catch(e) {}
}

function saveSettings() {
  localStorage.setItem('campus_settings', JSON.stringify(settingsData));
}

function renderSettings(container) {
  loadSettings();
  const profile = JSON.parse(localStorage.getItem('campus_user_profile') || '{}');

  container.innerHTML = `
    <div class="settings-group">
      <div class="settings-group-title">账号</div>
      <div class="settings-item" onclick="closeMySubPage();setTimeout(()=>openProfileEditor(),350)">
        <span>个人资料</span>
        <span class="settings-value">${profile.nickname || '校园用户'}</span>
        <i class="fa fa-chevron-right"></i>
      </div>
    </div>
    <div class="settings-group">
      <div class="settings-group-title">通知</div>
      <div class="settings-item">
        <span>新消息通知</span>
        <div class="settings-toggle ${settingsData.notifyNewMsg ? 'on' : ''}" onclick="toggleSetting(this,'notifyNewMsg')"></div>
      </div>
      <div class="settings-item">
        <span>降价提醒</span>
        <div class="settings-toggle ${settingsData.notifyPriceDrop ? 'on' : ''}" onclick="toggleSetting(this,'notifyPriceDrop')"></div>
      </div>
    </div>
    <div class="settings-group">
      <div class="settings-group-title">通用</div>
      <div class="settings-item">
        <span>自动清理缓存</span>
        <div class="settings-toggle ${settingsData.cacheAutoClean ? 'on' : ''}" onclick="toggleSetting(this,'cacheAutoClean')"></div>
      </div>
      <div class="settings-item" onclick="clearAppCache()">
        <span>清理缓存</span>
        <span class="settings-value">12.3 MB</span>
        <i class="fa fa-chevron-right"></i>
      </div>
      <div class="settings-item" onclick="showToast('当前已是最新版本')">
        <span>检查更新</span>
        <span class="settings-value">v1.0.0</span>
        <i class="fa fa-chevron-right"></i>
      </div>
    </div>
    <div class="settings-group">
      <div class="settings-group-title">其他</div>
      <div class="settings-item" onclick="openMySubPage('about')">
        <span>关于我们</span>
        <i class="fa fa-chevron-right"></i>
      </div>
      <div class="settings-item" onclick="openMySubPage('help')">
        <span>帮助与反馈</span>
        <i class="fa fa-chevron-right"></i>
      </div>
    </div>
    <div class="settings-logout" onclick="resetAppData()">
      <i class="fa fa-trash-alt"></i> 清除所有数据
    </div>`;
}

function toggleSetting(el, key) {
  settingsData[key] = !settingsData[key];
  el.classList.toggle('on');
  saveSettings();
  showToast(settingsData[key] ? '已开启' : '已关闭');
}

function clearAppCache() {
  // 仅清除临时缓存，保留用户数据
  showToast('缓存已清理');
}

function resetAppData() {
  if (confirm('确定要清除所有数据吗？此操作不可恢复。')) {
    localStorage.clear();
    showToast('数据已清除');
    setTimeout(() => location.reload(), 1000);
  }
}


