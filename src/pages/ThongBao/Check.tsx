import queryString from 'query-string';
import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

const CheckOneSignalSubscription = () => {
	
	const sendMessage = async (isEnable: boolean) => {
		const parsed = queryString.parse(window.location.search);
		
		
		
		if (parsed.source) window.parent.postMessage(isEnable, parsed.source.toString());
	};

	useEffect(() => {
		window.addEventListener('load', () => {
			OneSignal.isPushNotificationsEnabled((isEnabled) => {
				
				sendMessage(isEnabled);
			});
		});
	}, []);

	return <>Hello </>;
};

export default CheckOneSignalSubscription;
