/**
 * IntroVideo Component: Plays the EXACT uploaded intro video from 0:00 to completion.
 * No modifications, no cropping, no looping, no timeout cuts.
 */
import { VideoSoundControl } from './VideoSoundControl.js';

export function IntroVideo({ onVideoEnded }) {
  const videoRef = React.useRef(null);
  const [showSoundPrompt, setShowSoundPrompt] = React.useState(false);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Handle natural video completion
    const handleEnded = () => {
      if (onVideoEnded) {
        onVideoEnded();
      }
    };

    video.addEventListener('ended', handleEnded);

    // Initial attempt: Play with audio
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        // Autoplay with audio blocked by browser policy -> fallback to muted autoplay
        console.log('Autoplay with sound blocked, starting muted with sound control prompt');
        video.muted = true;
        video.play().then(() => {
          setShowSoundPrompt(true);
        }).catch((e) => {
          console.warn('Muted autoplay error:', e);
          setShowSoundPrompt(true);
        });
      });
    }

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [onVideoEnded]);

  const handleEnableSound = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.volume = 1.0;
      setShowSoundPrompt(false);
    }
  };

  return React.createElement(
    'div',
    { className: 'relative w-full h-full flex items-center justify-center bg-black overflow-hidden' },
    React.createElement('video', {
      ref: videoRef,
      src: './public/assets/ganesha-intro.mp4',
      autoPlay: true,
      playsInline: true,
      preload: 'auto',
      className: 'w-full h-full max-w-full max-h-full object-contain sm:object-cover bg-black',
      'aria-label': 'Ganesha 21 Modaks Cinematic Intro'
    }),
    showSoundPrompt && React.createElement(VideoSoundControl, { onEnableSound: handleEnableSound })
  );
}
