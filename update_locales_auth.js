const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'internarea', 'src', 'locales');

const authTranslations = {
  en: {
    login: {
      title: "Welcome Back",
      subtitle: "Login to continue to your account",
      identifierLabel: "Email or Phone Number",
      identifierPlaceholder: "Enter email or phone",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      forgotPassword: "Forgot Password?",
      submit: "Login",
      submitting: "Logging in...",
      or: "OR",
      continueWithGoogle: "Continue with Google",
      noAccount: "Don't have an account?",
      registerLink: "Register",
      fillAllFields: "Please fill all fields",
      loginSuccess: "Login Successfully",
      loginFailed: "Login Failed",
      somethingWrong: "Something went wrong",
      otpRequired: {
        title: "Verify Your Email",
        description: "We've sent a verification code to",
        otpLabel: "Enter 6-digit OTP",
        verifyBtn: "Verify OTP",
        resendBtn: "Resend OTP",
        backBtn: "← Back to Login",
        incompleteOtp: "Please enter the complete OTP",
        resendFailed: "Failed to resend OTP",
        otpFailed: "OTP verification failed"
      }
    },
    register: {
      title: "Create Your Account",
      subtitle: "Register to get started",
      fullNameLabel: "Full Name",
      fullNamePlaceholder: "Enter your full name",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      phoneLabel: "Phone Number",
      phonePlaceholder: "Enter your phone number",
      passwordLabel: "Password",
      passwordPlaceholder: "Create a password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      submit: "Create Account",
      submitting: "Creating account...",
      haveAccount: "Already have an account?",
      loginLink: "Login",
      fillAllFields: "Please fill all fields",
      passwordsMismatch: "Passwords do not match",
      somethingWrong: "Something went wrong"
    },
    forgotPassword: {
      backToLogin: "Back to Login",
      title: "Forgot Password?",
      subtitle: "Enter your registered email or phone number to reset your password.",
      identifierLabel: "Email or Phone Number",
      identifierPlaceholder: "Enter email or phone",
      submit: "Reset Password",
      submitting: "Resetting...",
      resetSuccess: "Password Reset Successful",
      newPasswordIs: "Your new password is:",
      saveSecurely: "Please save this password securely and use it to log in.",
      rememberPassword: "Remember your password?",
      loginLink: "Login",
      enterIdentifier: "Please enter email or phone number",
      showPassword: "Show password",
      hidePassword: "Hide password",
      somethingWrong: "Something went wrong"
    }
  },
  es: {
    login: {
      title: "Bienvenido de nuevo",
      subtitle: "Inicia sesión para continuar en tu cuenta",
      identifierLabel: "Correo electrónico o número de teléfono",
      identifierPlaceholder: "Ingresa correo o teléfono",
      passwordLabel: "Contraseña",
      passwordPlaceholder: "Ingresa tu contraseña",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      submit: "Iniciar Sesión",
      submitting: "Iniciando sesión...",
      or: "O",
      continueWithGoogle: "Continuar con Google",
      noAccount: "¿No tienes una cuenta?",
      registerLink: "Regístrate",
      fillAllFields: "Por favor completa todos los campos",
      loginSuccess: "Inicio de sesión exitoso",
      loginFailed: "Error al iniciar sesión",
      somethingWrong: "Algo salió mal",
      otpRequired: {
        title: "Verifica tu Correo",
        description: "Hemos enviado un código de verificación a",
        otpLabel: "Ingresa el código OTP de 6 dígitos",
        verifyBtn: "Verificar OTP",
        resendBtn: "Reenviar OTP",
        backBtn: "← Volver al inicio de sesión",
        incompleteOtp: "Por favor ingresa el OTP completo",
        resendFailed: "Error al reenviar el OTP",
        otpFailed: "Falló la verificación del OTP"
      }
    },
    register: {
      title: "Crea tu Cuenta",
      subtitle: "Regístrate para comenzar",
      fullNameLabel: "Nombre Completo",
      fullNamePlaceholder: "Ingresa tu nombre completo",
      emailLabel: "Correo Electrónico",
      emailPlaceholder: "Ingresa tu correo",
      phoneLabel: "Número de Teléfono",
      phonePlaceholder: "Ingresa tu número de teléfono",
      passwordLabel: "Contraseña",
      passwordPlaceholder: "Crea una contraseña",
      confirmPasswordLabel: "Confirmar Contraseña",
      confirmPasswordPlaceholder: "Confirma tu contraseña",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      submit: "Crear Cuenta",
      submitting: "Creando cuenta...",
      haveAccount: "¿Ya tienes una cuenta?",
      loginLink: "Iniciar Sesión",
      fillAllFields: "Por favor completa todos los campos",
      passwordsMismatch: "Las contraseñas no coinciden",
      somethingWrong: "Algo salió mal"
    },
    forgotPassword: {
      backToLogin: "Volver al inicio de sesión",
      title: "¿Olvidaste tu Contraseña?",
      subtitle: "Ingresa tu correo o número de teléfono registrado para restablecer tu contraseña.",
      identifierLabel: "Correo electrónico o número de teléfono",
      identifierPlaceholder: "Ingresa correo o teléfono",
      submit: "Restablecer Contraseña",
      submitting: "Restableciendo...",
      resetSuccess: "Restablecimiento de contraseña exitoso",
      newPasswordIs: "Tu nueva contraseña es:",
      saveSecurely: "Guarda esta contraseña de forma segura y úsala para iniciar sesión.",
      rememberPassword: "¿Recuerdas tu contraseña?",
      loginLink: "Iniciar Sesión",
      enterIdentifier: "Por favor ingresa correo o número de teléfono",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      somethingWrong: "Algo salió mal"
    }
  },
  fr: {
    login: {
      title: "Bon retour",
      subtitle: "Connectez-vous pour continuer sur votre compte",
      identifierLabel: "E-mail ou numéro de téléphone",
      identifierPlaceholder: "Entrez votre e-mail ou téléphone",
      passwordLabel: "Mot de passe",
      passwordPlaceholder: "Entrez votre mot de passe",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      submit: "Se connecter",
      submitting: "Connexion en cours...",
      or: "OU",
      continueWithGoogle: "Continuer avec Google",
      noAccount: "Vous n'avez pas de compte ?",
      registerLink: "S'inscrire",
      fillAllFields: "Veuillez remplir tous les champs",
      loginSuccess: "Connexion réussie",
      loginFailed: "Échec de la connexion",
      somethingWrong: "Une erreur s'est produite",
      otpRequired: {
        title: "Vérifiez votre e-mail",
        description: "Nous avons envoyé un code de vérification à",
        otpLabel: "Entrez le code OTP à 6 chiffres",
        verifyBtn: "Vérifier le code OTP",
        resendBtn: "Renvoyer le code OTP",
        backBtn: "← Retour à la connexion",
        incompleteOtp: "Veuillez entrer le code OTP complet",
        resendFailed: "Échec du renvoi du code OTP",
        otpFailed: "Échec de la vérification du code OTP"
      }
    },
    register: {
      title: "Créez votre compte",
      subtitle: "Inscrivez-vous pour commencer",
      fullNameLabel: "Nom complet",
      fullNamePlaceholder: "Entrez votre nom complet",
      emailLabel: "E-mail",
      emailPlaceholder: "Entrez votre e-mail",
      phoneLabel: "Numéro de téléphone",
      phonePlaceholder: "Entrez votre numéro de téléphone",
      passwordLabel: "Mot de passe",
      passwordPlaceholder: "Créez un mot de passe",
      confirmPasswordLabel: "Confirmer le mot de passe",
      confirmPasswordPlaceholder: "Confirmez votre mot de passe",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      submit: "Créer un compte",
      submitting: "Création du compte...",
      haveAccount: "Vous avez déjà un compte ?",
      loginLink: "Se connecter",
      fillAllFields: "Veuillez remplir tous les champs",
      passwordsMismatch: "Les mots de passe ne correspondent pas",
      somethingWrong: "Une erreur s'est produite"
    },
    forgotPassword: {
      backToLogin: "Retour à la connexion",
      title: "Mot de passe oublié ?",
      subtitle: "Entrez votre e-mail ou numéro de téléphone enregistré pour réinitialiser votre mot de passe.",
      identifierLabel: "E-mail ou numéro de téléphone",
      identifierPlaceholder: "Entrez votre e-mail ou téléphone",
      submit: "Réinitialiser le mot de passe",
      submitting: "Réinitialisation...",
      resetSuccess: "Réinitialisation du mot de passe réussie",
      newPasswordIs: "Votre nouveau mot de passe est :",
      saveSecurely: "Veuillez conserver ce mot de passe en sécurité et l'utiliser pour vous connecter.",
      rememberPassword: "Vous vous souvenez de votre mot de passe ?",
      loginLink: "Se connecter",
      enterIdentifier: "Veuillez entrer votre e-mail ou numéro de téléphone",
      showPassword: "Afficher le mot de passe",
      hidePassword: "Masquer le mot de passe",
      somethingWrong: "Une erreur s'est produite"
    }
  },
  hi: {
    login: {
      title: "वापसी पर स्वागत है",
      subtitle: "अपने खाते में जारी रखने के लिए लॉगिन करें",
      identifierLabel: "ईमेल या फ़ोन नंबर",
      identifierPlaceholder: "ईमेल या फ़ोन दर्ज करें",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "पासवर्ड दर्ज करें",
      showPassword: "पासवर्ड दिखाएं",
      hidePassword: "पासवर्ड छुपाएं",
      forgotPassword: "पासवर्ड भूल गए?",
      submit: "लॉगिन करें",
      submitting: "लॉगिन हो रहा है...",
      or: "या",
      continueWithGoogle: "Google के साथ जारी रखें",
      noAccount: "खाता नहीं है?",
      registerLink: "रजिस्टर करें",
      fillAllFields: "कृपया सभी फ़ील्ड भरें",
      loginSuccess: "सफलतापूर्वक लॉगिन हुआ",
      loginFailed: "लॉगिन विफल रहा",
      somethingWrong: "कुछ गलत हो गया",
      otpRequired: {
        title: "अपना ईमेल सत्यापित करें",
        description: "हमने सत्यापन कोड भेजा है",
        otpLabel: "6 अंकों का OTP दर्ज करें",
        verifyBtn: "OTP सत्यापित करें",
        resendBtn: "OTP पुनः भेजें",
        backBtn: "← वापस लॉगिन पर जाएं",
        incompleteOtp: "कृपया पूरा OTP दर्ज करें",
        resendFailed: "OTP पुनः भेजने में विफल",
        otpFailed: "OTP सत्यापन विफल रहा"
      }
    },
    register: {
      title: "अपना खाता बनाएं",
      subtitle: "शुरुआत करने के लिए रजिस्टर करें",
      fullNameLabel: "पूरा नाम",
      fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
      emailLabel: "ईमेल",
      emailPlaceholder: "अपना ईमेल दर्ज करें",
      phoneLabel: "फ़ोन नंबर",
      phonePlaceholder: "अपना फ़ोन नंबर दर्ज करें",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "एक पासवर्ड बनाएं",
      confirmPasswordLabel: "पासवर्ड की पुष्टि करें",
      confirmPasswordPlaceholder: "अपने पासवर्ड की पुष्टि करें",
      showPassword: "पासवर्ड दिखाएं",
      hidePassword: "पासवर्ड छुपाएं",
      submit: "खाता बनाएं",
      submitting: "खाता बनाया जा रहा है...",
      haveAccount: "पहले से खाता है?",
      loginLink: "लॉगिन करें",
      fillAllFields: "कृपया सभी फ़ील्ड भरें",
      passwordsMismatch: "पासवर्ड मेल नहीं खाते",
      somethingWrong: "कुछ गलत हो गया"
    },
    forgotPassword: {
      backToLogin: "वापस लॉगिन पर जाएं",
      title: "पासवर्ड भूल गए?",
      subtitle: "अपना पासवर्ड रीसेट करने के लिए अपना पंजीकृत ईमेल या फ़ोन नंबर दर्ज करें।",
      identifierLabel: "ईमेल या फ़ोन नंबर",
      identifierPlaceholder: "ईमेल या फ़ोन दर्ज करें",
      submit: "पासवर्ड रीसेट करें",
      submitting: "रीसेट हो रहा है...",
      resetSuccess: "पासवर्ड सफलतापूर्वक रीसेट हुआ",
      newPasswordIs: "आपका नया पासवर्ड है:",
      saveSecurely: "कृपया इस पासवर्ड को सुरक्षित रखें और लॉगिन करने के लिए इसका उपयोग करें।",
      rememberPassword: "क्या आपको अपना पासवर्ड याद है?",
      loginLink: "लॉगिन करें",
      enterIdentifier: "कृपया ईमेल या फ़ोन नंबर दर्ज करें",
      showPassword: "पासवर्ड दिखाएं",
      hidePassword: "पासवर्ड छुपाएं",
      somethingWrong: "कुछ गलत हो गया"
    }
  },
  pt: {
    login: {
      title: "Bem-vindo de Volta",
      subtitle: "Faça login para continuar em sua conta",
      identifierLabel: "E-mail ou Número de Telefone",
      identifierPlaceholder: "Digite seu e-mail ou telefone",
      passwordLabel: "Senha",
      passwordPlaceholder: "Digite sua senha",
      showPassword: "Exibir senha",
      hidePassword: "Ocultar senha",
      forgotPassword: "Esqueceu a Senha?",
      submit: "Entrar",
      submitting: "Entrando...",
      or: "OU",
      continueWithGoogle: "Continuar com o Google",
      noAccount: "Não tem uma conta?",
      registerLink: "Cadastre-se",
      fillAllFields: "Por favor, preencha todos os campos",
      loginSuccess: "Login realizado com sucesso",
      loginFailed: "Falha no login",
      somethingWrong: "Algo deu errado",
      otpRequired: {
        title: "Verifique seu E-mail",
        description: "Enviamos um código de verificação para",
        otpLabel: "Digite o código OTP de 6 dígitos",
        verifyBtn: "Verificar OTP",
        resendBtn: "Reenviar OTP",
        backBtn: "← Voltar para o Login",
        incompleteOtp: "Por favor, digite o OTP completo",
        resendFailed: "Falha ao reenviar OTP",
        otpFailed: "Falha na verificação do OTP"
      }
    },
    register: {
      title: "Crie sua Conta",
      subtitle: "Cadastre-se para começar",
      fullNameLabel: "Nome Completo",
      fullNamePlaceholder: "Digite seu nome completo",
      emailLabel: "E-mail",
      emailPlaceholder: "Digite seu e-mail",
      phoneLabel: "Número de Telefone",
      phonePlaceholder: "Digite seu número de telefone",
      passwordLabel: "Senha",
      passwordPlaceholder: "Crie uma senha",
      confirmPasswordLabel: "Confirmar Senha",
      confirmPasswordPlaceholder: "Confirme sua senha",
      showPassword: "Exibir senha",
      hidePassword: "Ocultar senha",
      submit: "Criar Conta",
      submitting: "Criando conta...",
      haveAccount: "Já tem uma conta?",
      loginLink: "Entrar",
      fillAllFields: "Por favor, preencha todos os campos",
      passwordsMismatch: "As senhas não coincidem",
      somethingWrong: "Algo deu errado"
    },
    forgotPassword: {
      backToLogin: "Voltar para o Login",
      title: "Esqueceu a Senha?",
      subtitle: "Digite seu e-mail ou telefone cadastrado para redefinir sua senha.",
      identifierLabel: "E-mail ou Número de Telefone",
      identifierPlaceholder: "Digite seu e-mail ou telefone",
      submit: "Redefinir Senha",
      submitting: "Redefinindo...",
      resetSuccess: "Senha redefinida com sucesso",
      newPasswordIs: "Sua nova senha é:",
      saveSecurely: "Por favor, guarde esta senha com segurança e use-a para fazer login.",
      rememberPassword: "Lembra da sua senha?",
      loginLink: "Entrar",
      enterIdentifier: "Por favor, digite seu e-mail ou telefone",
      showPassword: "Exibir senha",
      hidePassword: "Ocultar senha",
      somethingWrong: "Algo deu errado"
    }
  },
  zh: {
    login: {
      title: "欢迎回来",
      subtitle: "登录以继续访问您的账户",
      identifierLabel: "邮箱或手机号",
      identifierPlaceholder: "请输入邮箱或手机号",
      passwordLabel: "密码",
      passwordPlaceholder: "请输入密码",
      showPassword: "显示密码",
      hidePassword: "隐藏密码",
      forgotPassword: "忘记密码？",
      submit: "登录",
      submitting: "正在登录...",
      or: "或",
      continueWithGoogle: "使用 Google 登录",
      noAccount: "还没有账户？",
      registerLink: "立即注册",
      fillAllFields: "请填写所有必填项",
      loginSuccess: "登录成功",
      loginFailed: "登录失败",
      somethingWrong: "出现了一些问题",
      otpRequired: {
        title: "验证您的邮箱",
        description: "我们已向以下邮箱发送了验证码",
        otpLabel: "请输入 6 位数验证码",
        verifyBtn: "验证验证码",
        resendBtn: "重新发送验证码",
        backBtn: "← 返回登录",
        incompleteOtp: "请输入完整的验证码",
        resendFailed: "重新发送验证码失败",
        otpFailed: "验证码验证失败"
      }
    },
    register: {
      title: "创建您的账户",
      subtitle: "注册以开启您的求职之旅",
      fullNameLabel: "姓名",
      fullNamePlaceholder: "请输入您的全名",
      emailLabel: "邮箱",
      emailPlaceholder: "请输入您的邮箱",
      phoneLabel: "手机号",
      phonePlaceholder: "请输入您的手机号",
      passwordLabel: "密码",
      passwordPlaceholder: "请设置密码",
      confirmPasswordLabel: "确认密码",
      confirmPasswordPlaceholder: "请再次输入密码",
      showPassword: "显示密码",
      hidePassword: "隐藏密码",
      submit: "创建账户",
      submitting: "正在创建账户...",
      haveAccount: "已有账户？",
      loginLink: "立即登录",
      fillAllFields: "请填写所有必填项",
      passwordsMismatch: "两次输入的密码不一致",
      somethingWrong: "出现了一些问题"
    },
    forgotPassword: {
      backToLogin: "返回登录",
      title: "忘记密码？",
      subtitle: "请输入您注册的邮箱或手机号以重置密码。",
      identifierLabel: "邮箱或手机号",
      identifierPlaceholder: "请输入邮箱或手机号",
      submit: "重置密码",
      submitting: "正在重置...",
      resetSuccess: "密码重置成功",
      newPasswordIs: "您的新密码是：",
      saveSecurely: "请妥善保管此密码并用于登录。",
      rememberPassword: "记起密码了？",
      loginLink: "立即登录",
      enterIdentifier: "请输入邮箱或手机号",
      showPassword: "显示密码",
      hidePassword: "隐藏密码",
      somethingWrong: "出现了一些问题"
    }
  }
};

const languages = ['en', 'es', 'fr', 'hi', 'pt', 'zh'];

for (const lang of languages) {
  const filePath = path.join(localesDir, `${lang}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  content.auth = authTranslations[lang];
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
  console.log(`Updated ${lang}.json`);
}

// Parity Check
const keySets = {};
function extractKeys(obj, prefix = '') {
  let keys = [];
  for (const k of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      keys = keys.concat(extractKeys(obj[k], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

for (const lang of languages) {
  const filePath = path.join(localesDir, `${lang}.json`);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  keySets[lang] = new Set(extractKeys(content));
  console.log(`${lang} total keys: ${keySets[lang].size}`);
}

const enKeys = keySets['en'];
let allMatch = true;
for (const lang of languages) {
  if (lang === 'en') continue;
  const currentKeys = keySets[lang];
  for (const k of enKeys) {
    if (!currentKeys.has(k)) {
      console.error(`Missing key in ${lang}: ${k}`);
      allMatch = false;
    }
  }
  for (const k of currentKeys) {
    if (!enKeys.has(k)) {
      console.error(`Extra key in ${lang}: ${k}`);
      allMatch = false;
    }
  }
}

if (allMatch) {
  console.log("ALL 6 LOCALE FILES HAVE 100% KEY PARITY!");
}
