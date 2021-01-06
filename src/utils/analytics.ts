import { Window } from 'components/models';

declare let window: Window;

export default function useAnalytics() {
  // Log event `eventName` with goatcounter
  function logEvent(eventName: string) {
    const t = setInterval(function () {
      if (window.goatcounter && window.goatcounter.count) {
        clearInterval(t);
        window.goatcounter.count({
          path: eventName,
          event: true,
        });
      }
    }, 100);
  }

  return { logEvent };
}
