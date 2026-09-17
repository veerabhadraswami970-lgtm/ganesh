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

  const handleSkip = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    if (onVideoEnded) {
      onVideoEnded();
    }
  };

  return React.createElement(
    'div',
    { className: 'relative w-full h-full flex items-center justify-center bg-black overflow-hidden' },
    React.createElement('video', {
      ref: videoRef,
      src: './public/assets/a_i_need_this_image_3d.mp4',
      autoPlay: true,
      playsInline: true,
      preload: 'auto',
      className: 'w-full h-full max-w-full max-h-full object-contain sm:object-cover bg-black',
      'aria-label': 'Ganesha 3D Cinematic Intro'
    }),
    // Skip Button
    React.createElement(
      'button',
      {
        onClick: handleSkip,
        className: 'absolute top-6 right-6 z-40 px-4 py-2 rounded-full bg-black/60 hover:bg-black/80 border border-amber-400/40 text-amber-300 font-semibold text-xs tracking-widest uppercase backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.8)]'
      },
      'Skip Intro ➔'
    ),
    showSoundPrompt && React.createElement(VideoSoundControl, { onEnableSound: handleEnableSound })
  );
}
