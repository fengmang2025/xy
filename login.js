// ==================== 登录页面 ====================

function showLoginPage() {
  document.getElementById('page-login').style.display = 'block';
  document.getElementById('page-register').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  document.querySelectorAll('.page').forEach(p => {
    if (p.id !== 'page-login' && p.id !== 'page-register') {
      p.style.display = 'none';
    }
  });
  // 重置表单
  document.getElementById('login-form').reset();
  document.getElementById('reg-form').reset();
  clearAuthError();
}

function goRegister() {
  document.getElementById('page-login').style.display = 'none';
  document.getElementById('page-register').style.display = 'block';
  resetRegister();
}

function goLogin() {
  document.getElementById('page-register').style.display = 'none';
  document.getElementById('page-login').style.display = 'block';
}

function toggleAccountType(el) {
  document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function doLogin() {
  const account = document.getElementById('login-account').value.trim();
  const password = document.getElementById('login-password').value;
  
  if (!account) {
    setAuthError('login-error', '请输入手机号或学号');
    return;
  }
  if (!/^1\d{10}$/.test(account) && !/^\d{6,10}$/.test(account)) {
    setAuthError('login-error', '手机号或学号格式不正确');
    return;
  }
  if (!password || password.length < 6) {
    setAuthError('login-error', '密码至少6位');
    return;
  }
  
  clearAuthError('login-error');
  // 模拟登录 - 游客模式
  localStorage.setItem('campus_logged_in', 'true');
  localStorage.setItem('campus_user', JSON.stringify({
    id: 'visitor_' + Date.now(),
    name: '游客',
    phone: account,
    avatar: '👤',
    school: '未认证',
    verified: false,
    isVisitor: true
  }));
  showToast('登录成功');
  enterApp();
}

function doQuickLogin() {
  // 快速登录（演示用）- 游客模式
  localStorage.setItem('campus_logged_in', 'true');
  localStorage.setItem('campus_user', JSON.stringify({
    id: 'visitor_quick',
    name: '游客',
    phone: '138****0000',
    avatar: '👤',
    school: '未认证',
    verified: false,
    isVisitor: true
  }));
  showToast('登录成功');
  enterApp();
}

function resetRegister() {
  document.getElementById('reg-form').reset();
  document.querySelectorAll('.reg-step').forEach((s, i) => {
    s.style.display = i === 0 ? 'block' : 'none';
  });
  document.getElementById('reg-phone-group').style.display = 'flex';
  document.getElementById('reg-code-group').style.display = 'none';
  document.getElementById('reg-pwd-group').style.display = 'none';
  document.getElementById('code-timer').textContent = '获取验证码';
  document.getElementById('code-timer').disabled = false;
  clearAuthError();
}

let codeInterval = null;

function sendCode() {
  const phone = document.getElementById('reg-phone').value.trim();
  if (!phone || !/^1\d{10}$/.test(phone)) {
    setAuthError('reg-error', '请输入正确的手机号');
    return;
  }
  clearAuthError('reg-error');
  // 模拟发送验证码
  showToast('验证码已发送：123456');
  document.getElementById('code-timer').textContent = '60秒后重发';
  document.getElementById('code-timer').disabled = true;
  let seconds = 60;
  codeInterval = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(codeInterval);
      document.getElementById('code-timer').textContent = '获取验证码';
      document.getElementById('code-timer').disabled = false;
    } else {
      document.getElementById('code-timer').textContent = seconds + '秒后重发';
    }
  }, 1000);
}

function resendCode() {
  clearInterval(codeInterval);
  sendCode();
}

function verifyCode() {
  const code = document.getElementById('reg-code').value.trim();
  if (!code) {
    setAuthError('reg-error', '请输入验证码');
    return;
  }
  if (code !== '123456') {
    setAuthError('reg-error', '验证码错误，请输入123456');
    return;
  }
  clearAuthError('reg-error');
  showToast('验证成功');
  goRegStep(2);
}

function goRegStep(step) {
  if (step === 2) {
    document.getElementById('reg-phone-group').style.display = 'none';
    document.getElementById('reg-code-group').style.display = 'flex';
    document.getElementById('reg-pwd-group').style.display = 'none';
    document.getElementById('reg-step1').classList.remove('active');
    document.getElementById('reg-step2').classList.add('active');
  } else if (step === 3) {
    document.getElementById('reg-phone-group').style.display = 'none';
    document.getElementById('reg-code-group').style.display = 'none';
    document.getElementById('reg-pwd-group').style.display = 'flex';
    document.getElementById('reg-step2').classList.remove('active');
    document.getElementById('reg-step3').classList.add('active');
  }
}

function checkPwdStrength(pwd) {
  const strength = document.getElementById('pwd-strength');
  if (!strength) return;
  if (pwd.length === 0) {
    strength.textContent = '';
  } else if (pwd.length < 6) {
    strength.textContent = '弱';
    strength.style.color = '#ff4d4f';
  } else if (pwd.length < 10) {
    strength.textContent = '中';
    strength.style.color = '#faad14';
  } else {
    strength.textContent = '强';
    strength.style.color = '#52c41a';
  }
}

function doRegister() {
  const password = document.getElementById('reg-password').value;
  const confirmPwd = document.getElementById('reg-confirm-password').value;
  
  if (!password || password.length < 6) {
    setAuthError('reg-error', '密码至少6位');
    return;
  }
  if (password !== confirmPwd) {
    setAuthError('reg-error', '两次密码输入不一致');
    return;
  }
  
  clearAuthError('reg-error');
  // 模拟注册成功
  const phone = document.getElementById('reg-phone').value.trim();
  localStorage.setItem('campus_logged_in', 'true');
  localStorage.setItem('campus_user', JSON.stringify({
    id: 'user_' + Date.now(),
    name: '校园用户',
    phone: phone,
    avatar: '👤',
    school: '浙江理工大学',
    verified: false
  }));
  showToast('注册成功');
  enterApp();
}

function togglePwd(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.type = input.type === 'password' ? 'text' : 'password';
  }
}

function setAuthError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
    el.previousElementSibling && el.previousElementSibling.classList.add('error');
  }
}

function clearAuthError(id) {
  if (id) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = '';
      el.style.display = 'none';
    }
  } else {
    document.querySelectorAll('.auth-error').forEach(e => {
      e.textContent = '';
      e.style.display = 'none';
    });
    document.querySelectorAll('.auth-input.error').forEach(i => i.classList.remove('error'));
  }
}
