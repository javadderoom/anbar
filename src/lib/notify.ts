'use client';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

type ToastListener = (toasts: ToastItem[]) => void;
type ConfirmListener = (dialog: (ConfirmOptions & { resolve: (val: boolean) => void }) | null) => void;

class NotifyService {
  private toasts: ToastItem[] = [];
  private toastListeners: Set<ToastListener> = new Set();
  private confirmListener: ConfirmListener | null = null;

  subscribeToasts(listener: ToastListener) {
    this.toastListeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.toastListeners.delete(listener);
    };
  }

  subscribeConfirm(listener: ConfirmListener) {
    this.confirmListener = listener;
    return () => {
      this.confirmListener = null;
    };
  }

  private emitToasts() {
    this.toastListeners.forEach((l) => l([...this.toasts]));
  }

  show(message: string, type: ToastType = 'info', duration = 3500) {
    const id = 't-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5);
    const item: ToastItem = { id, type, message };
    this.toasts = [...this.toasts, item];
    this.emitToasts();

    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== id);
      this.emitToasts();
    }, duration);
  }

  success(message: string) {
    this.show(message, 'success');
  }

  error(message: string) {
    this.show(message, 'error', 4500);
  }

  info(message: string) {
    this.show(message, 'info');
  }

  warning(message: string) {
    this.show(message, 'warning');
  }

  confirm(options: string | ConfirmOptions): Promise<boolean> {
    const opts: ConfirmOptions = typeof options === 'string' ? { message: options } : options;
    return new Promise((resolve) => {
      if (this.confirmListener) {
        this.confirmListener({
          ...opts,
          resolve: (val: boolean) => {
            if (this.confirmListener) this.confirmListener(null);
            resolve(val);
          },
        });
      } else {
        // Fallback safety if component not mounted
        resolve(true);
      }
    });
  }
}

export const notify = new NotifyService();
