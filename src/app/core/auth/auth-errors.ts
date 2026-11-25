/**
 * Traduit une erreur Firebase Auth en message arabe affichable.
 * Retourne '' quand l'erreur ne mérite pas d'être affichée (ex. fenêtre Google fermée par l'utilisateur).
 */
export function authErrorMessage(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error ? String((error as { code: unknown }).code) : '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/invalid-login-credentials':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      // Même message dans les trois cas : on ne révèle pas si l'adresse existe.
      return 'البريد الإلكتروني أو كلمة السر غير صحيحة.';
    case 'auth/invalid-email':
      return 'صيغة البريد الإلكتروني غير صحيحة.';
    case 'auth/email-already-in-use':
      return 'يوجد حساب بهذا البريد الإلكتروني. جرّب تسجيل الدخول.';
    case 'auth/weak-password':
    case 'auth/password-does-not-meet-requirements':
      return 'كلمة السر لا تحقّق الشروط المطلوبة (8 أحرف، حرف كبير، حرف صغير، رقم).';
    case 'auth/user-disabled':
      return 'هذا الحساب موقوف. تواصل معنا لمعرفة السبب.';
    case 'auth/too-many-requests':
      return 'محاولات كثيرة. انتظر قليلًا ثم أعد المحاولة.';
    case 'auth/network-request-failed':
      return 'تعذّر الاتصال بالإنترنت. تحقّق من اتصالك ثم أعد المحاولة.';
    case 'auth/popup-blocked':
      return 'المتصفّح منع نافذة Google. اسمح بالنوافذ المنبثقة ثم أعد المحاولة.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return '';
    case 'auth/invalid-action-code':
    case 'auth/expired-action-code':
      return 'الرابط غير صالح أو انتهت صلاحيته. اطلب رابطًا جديدًا.';
    case 'auth/operation-not-allowed':
      return 'طريقة تسجيل الدخول هذه غير مفعّلة بعد.';
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
    case 'auth/configuration-not-found':
      return 'إعداد Firebase غير مكتمل. راجع ملف البيئة (environment).';
    case 'auth/unauthorized-domain':
      return 'هذا النطاق غير مسموح به في إعدادات Firebase (Authorized domains).';
    default:
      return 'حدث خطأ غير متوقّع. أعد المحاولة بعد قليل.';
  }
}
