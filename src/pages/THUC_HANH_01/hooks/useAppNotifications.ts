import { message, notification, Modal } from 'antd';

export const useAppNotifications = () => {
  return { message, notification, modal: Modal };
};
