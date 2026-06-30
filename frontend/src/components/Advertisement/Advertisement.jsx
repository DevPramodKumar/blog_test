import { useEffect, useRef } from 'react';
import { AD_SLOTS } from '../../config/ads';
import './Advertisement.css';

const definedSlots = new Set();

const Advertisement = ({ position }) => {
  const slotRef = useRef(null);
  const config = AD_SLOTS[position];

  useEffect(() => {
    if (!config) return;

    const initAd = () => {
      if (!window.googletag) return;

      window.googletag.cmd = window.googletag.cmd || [];

      window.googletag.cmd.push(() => {
        if (definedSlots.has(config.id)) {
          window.googletag.display(config.id);
          return;
        }

        window.googletag.defineSlot(config.adUnit, config.sizes, config.id)
          .addService(window.googletag.pubads());

        window.googletag.pubads().enableSingleRequest();
        window.googletag.pubads().collapseEmptyDivs();
        window.googletag.enableServices();

        definedSlots.add(config.id);
        window.googletag.display(config.id);
      });
    };

    if (window.googletag) {
      initAd();
    } else {
      const interval = setInterval(() => {
        if (window.googletag) {
          clearInterval(interval);
          initAd();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [config]);

  if (!config) return null;

  const className = [
    'ad-container',
    config.sticky ? 'ad-sticky' : '',
    `ad-${position}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className} ref={slotRef}>
      <span className="ad-label">Advertisement</span>
      <div id={config.id} className="ad-slot" />
    </div>
  );
};

export default Advertisement;
