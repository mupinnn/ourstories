import CONFIG from "../config";
import {
  subscribePushNotification,
  unsubscribePushNotification,
} from "../data/api";
import { convertBase64ToUint8Array } from "./index";

export function isNotificationAvailable() {
  return "Notification" in window;
}

export function isNotificationGranted() {
  return Notification.permission === "granted";
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error("Notification API unsupported.");
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === "denied") {
    alert("Notification permission denied.");
    return false;
  }

  if (status === "default") {
    alert("Notification permission ignored.");
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistrations();
  return await registration?.[0]?.pushManager?.getSubscription?.();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export function generateSubscribeOptions() {
  return {
    userVisibleOnly: true,
    applicationServerKey: convertBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
  };
}

export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  if (await isCurrentPushSubscriptionAvailable()) {
    alert("Already subscribed to notification");
    return;
  }

  console.log("Starting to subscribe push notification");

  const failureSubsMessage =
    "Push notification subscription failed to activate";
  const successSubsMessage =
    "Push notification subscription activated successfully";

  let pushSubscription;

  try {
    const registration = await navigator.serviceWorker.getRegistrations();
    pushSubscription = await registration?.[0]?.pushManager?.subscribe?.(
      generateSubscribeOptions(),
    );

    console.log(pushSubscription.toJSON());
    const { endpoint, keys } = pushSubscription.toJSON();
    console.log({ keys });
    const response = await subscribePushNotification({ endpoint, keys });

    if (!response.ok) {
      console.error("Subscribe to push notification error: ", response);
      alert(failureSubsMessage);

      await pushSubscription.unsubscribe();

      return;
    }

    alert(successSubsMessage);
  } catch (error) {
    console.error("Subscribe to push notification error: ", error);
    alert(failureSubsMessage);

    await pushSubscription.unsubscribe();
  }
}

export async function unsubscribe() {
  const failureUnsubscribeMessage =
    "Langganan push notification gagal dinonaktifkan.";
  const successUnsubscribeMessage =
    "Langganan push notification berhasil dinonaktifkan.";

  try {
    const pushSubscription = await getPushSubscription();

    if (!pushSubscription) {
      alert(
        "Tidak bisa memutus langganan push notification karena belum berlangganan sebelumnya.",
      );
      return;
    }

    const { endpoint, keys } = pushSubscription.toJSON();
    const response = await unsubscribePushNotification({ endpoint });

    if (!response.ok) {
      alert(failureUnsubscribeMessage);
      console.error("unsubscribe: response:", response);
      return;
    }

    const unsubscribed = await pushSubscription.unsubscribe();

    if (!unsubscribed) {
      alert(failureUnsubscribeMessage);
      await subscribePushNotification({ endpoint, keys });
      return;
    }

    alert(successUnsubscribeMessage);
  } catch (error) {
    alert(failureUnsubscribeMessage);
    console.error("unsubscribe: error:", error);
  }
}
