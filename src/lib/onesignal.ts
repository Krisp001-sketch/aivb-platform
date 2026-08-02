import * as OneSignal from "@onesignal/node-onesignal";

// Fix: Change 'appKey' to 'restApiKey'
const configuration = OneSignal.createConfiguration({
  restApiKey: process.env.ONESIGNAL_REST_API_KEY || "",
});

const client = new OneSignal.DefaultApi(configuration);

export async function sendLicenseEmail(userEmail: string, licenseKey: string) {
  const appId = process.env.ONESIGNAL_APP_ID || "";

  const notification = new OneSignal.Notification();
  notification.app_id = appId;
  notification.email_to = [userEmail];
  notification.email_subject = "Your AIVB Studio License Key";
  notification.email_body = `
    <div style="font-family: sans-serif; background: #0d1117; color: #ffffff; padding: 20px; border-radius: 8px;">
      <h2 style="color: #2f81f7;">Welcome to AIVB Studio</h2>
      <p>Your official license key has been generated:</p>
      <div style="background: #161b22; padding: 12px; border: 1px solid #30363d; border-radius: 6px; font-family: monospace; font-size: 16px; color: #a371f7;">
        ${licenseKey}
      </div>
      <p style="margin-top: 16px; color: #8b949e; font-size: 12px;">Use this key inside the desktop app to bind your Windows HWID.</p>
    </div>
  `;

  try {
    const response = await client.createNotification(notification);
    return { success: true, response };
  } catch (error) {
    console.error("OneSignal Dispatch Error:", error);
    return { success: false, error };
  }
}