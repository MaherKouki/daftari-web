import { Injectable, computed, inject, signal } from '@angular/core';
import {
  GoogleAuthProvider, User, applyActionCode, confirmPasswordReset, createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification,
  sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, verifyPasswordResetCode,
} from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase/firebase-auth.token';

/** Copie immuable de l'utilisateur Firebase : les signals ne détectent pas les mutations de l'objet `User`. */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
}

function toAuthUser(user: User | null): AuthUser | null {
  return user
    ? { uid: user.uid, email: user.email, displayName: user.displayName, emailVerified: user.emailVerified }
    : null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(FIREBASE_AUTH);
  private readonly current = signal<AuthUser | null>(null);
  private readonly ready: Promise<void>;

  readonly user = this.current.asReadonly();
  readonly isEmailVerified = computed(() => this.current()?.emailVerified === true);

  constructor() {
    this.ready = new Promise<void>((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        this.current.set(toAuthUser(user));
        resolve();
      });
    });
  }

  /** Se résout quand Firebase a restauré (ou non) la session au chargement de la page. */
  whenReady(): Promise<void> {
    return this.ready;
  }

  async register(name: string, email: string, password: string): Promise<void> {
    const credential = await createUserWithEmailAndPassword(this.auth, email, password);
    await updateProfile(credential.user, { displayName: name.trim() });
    try {
      await sendEmailVerification(credential.user);
    } catch {
      // Le compte existe déjà : l'utilisateur pourra renvoyer le lien depuis la page de vérification.
    }
    this.current.set(toAuthUser(credential.user));
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async loginWithGoogle(): Promise<void> {
    await signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async sendPasswordReset(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async resendVerification(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('not-signed-in');
    await sendEmailVerification(user);
  }

  /** Recharge le profil depuis Firebase ; renvoie true si l'e-mail est désormais vérifié. */
  async refreshUser(): Promise<boolean> {
    const user = this.auth.currentUser;
    if (!user) return false;
    await user.reload();
    if (user.emailVerified) {
      // Force un nouveau token : l'API verra email_verified = true.
      await user.getIdToken(true);
    }
    this.current.set(toAuthUser(this.auth.currentUser));
    return user.emailVerified;
  }

  /** Valide le lien reçu par e-mail (mode=verifyEmail). Fonctionne même depuis un autre navigateur. */
  async applyVerificationCode(code: string): Promise<void> {
    await applyActionCode(this.auth, code);
    // Si la même personne est connectée dans ce navigateur, on met son profil à jour.
    if (this.auth.currentUser) await this.refreshUser();
  }

  /** Contrôle un lien de réinitialisation (mode=resetPassword) et renvoie l'adresse concernée. */
  checkPasswordResetCode(code: string): Promise<string> {
    return verifyPasswordResetCode(this.auth, code);
  }

  async resetPasswordWithCode(code: string, newPassword: string): Promise<void> {
    await confirmPasswordReset(this.auth, code, newPassword);
  }

  async getIdToken(): Promise<string | null> {
    return (await this.auth.currentUser?.getIdToken()) ?? null;
  }
}
