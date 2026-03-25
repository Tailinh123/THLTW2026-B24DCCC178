import { initOneSignal } from '@/services/base/api';
import { unitName } from '@/services/base/constant';
import { useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import OneSignal from 'react-onesignal';

const SubscribeOneSignal = () => {
	const auth = useAuth();

	useEffect(() => {
		document.title = `Đăng ký nhận thông báo | ${unitName.toUpperCase()}`;
	}, []);

	
	useEffect(() => {
		if (auth.user?.access_token)
			OneSignal.getUserId().then((playerId) => {
				
				if (playerId)
					initOneSignal({ playerId }).then(() => {
						window.opener = null;
						window.open('', '_self');
						window.close();
					});
			});
	}, [auth.user?.access_token]);

	
	return <div>SubscribeOneSignal</div>;
};

export default SubscribeOneSignal;
