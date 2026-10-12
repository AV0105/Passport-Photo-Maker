import { useCallback, useEffect, useRef, useState } from 'react';
import LandingPage from './components/LandingPage.jsx';
import PhotoUploader from './components/PhotoUploader.jsx';
import PhotoPreview from './components/PhotoPreview.jsx';
import ValidationResults from './components/ValidationResults.jsx';
import PhotoSizeSelector from './components/PhotoSizeSelector.jsx';
import CropEditor from './components/CropEditor.jsx';
import DownloadPanel from './components/DownloadPanel.jsx';
import { loadImageFromFile, validateImage } from './utils/imageValidation.js';
import { findPreset } from './data/photoPresets.js';
import { useHashRoute } from './hooks/usehashRoute.js';
import GuidePage from './components/GuidePage.jsx';

const STEPS = ['Upload', 'Preview', 'Check', 'Size', 'Crop', 'Download'];

export default function App() {
  const [step, setStep] = useState(0); // 0..5
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [validation, setValidation] = useState(null);
  const [presetId, setPresetId] = useState('in-passport-35x45');
  const [crop, setCrop] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const urlRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => () => releaseUrl(), []);

  function releaseUrl() {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }
  }

  const clearPhoto = useCallback(() => {
    releaseUrl();
    setFile(null);
    setImg(null);
    setImageUrl(null);
    setValidation(null);
    setCrop(null);
    setError(null);
    setBusy(false);
    setStep(0);
  }, []);

  useEffect(() => {
    const onBeforeUnload = (e) => {
      if (file) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [file]);

  const handleFile = useCallback(async (chosenFile) => {
    setError(null);
    setBusy(true);
    try {
      const { img: decoded, url } = await loadImageFromFile(chosenFile);
      releaseUrl();
      urlRef.current = url;
      setFile(chosenFile);
      setImg(decoded);
      setImageUrl(url);
      setValidation(null);
      setCrop(null);
      setStep(1);
    } catch (err) {
      setError(err.message || 'Could not read this image.');
    } finally {
      setBusy(false);
    }
  }, []);

  const handleValidate = useCallback(async () => {
    if (!img) return;
    setBusy(true);
    setError(null);
    try {
      const result = await validateImage({ file, img });
      setValidation(result);
      setStep(2);
    } catch (err) {
      setError('Something went wrong while checking the photo. Please try again.');
    } finally {
      setBusy(false);
    }
  }, [file, img]);

  const handleContinueToSize = () => {
    if (validation && validation.canContinue) setStep(3);
  };

  const preset = findPreset(presetId);
  const faceBox = validation && validation.primaryFace ? validation.primaryFace.box : null;

  const handleContinueToCrop = () => {
    if (preset) setStep(4);
  };

  const handlePreviewFinal = () => {
    if (crop) setStep(5);
  };

  const hash = useHashRoute();
  const guideMatch = hash.match(/^#\/guide\/([\w-]+)/);

  useEffect(() => {
    const handlePopState = () => setStarted(false);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const startApplication = () => {
    if (guideMatch) window.location.hash = '#';
    window.history.pushState(
      { ...window.history.state, passportPhotoMakerView: 'application' },
      '',
      window.location.href
    );
    setStarted(true);
    window.scrollTo(0, 0);
  };

  const returnToLanding = () => window.history.back();

  // If the URL is #/guide/<slug>, render the guide page and stop.
  if (guideMatch && !started) {
    const goHome = () => {
      window.location.hash = '#';
      setStarted(false);
    };
    return <GuidePage slug={guideMatch[1]} onStart={startApplication} onGoHome={goHome} />;
  }

  // Show the marketing landing page until the user chooses to start.
  if (!started) {
    return <LandingPage onStart={startApplication} />;
  }

  let screen = null;
  if (step === 0) {
    screen = <PhotoUploader onFile={handleFile} busy={busy} />;
  } else if (step === 1 && file && img) {
    screen = (
      <PhotoPreview
        file={file}
        img={img}
        imageUrl={imageUrl}
        onValidate={handleValidate}
        onReplaceRequest={clearPhoto}
        onRemove={clearPhoto}
        busy={busy}
      />
    );
  } else if (step === 2 && validation) {
    screen = (
      <ValidationResults
        result={validation}
        busy={busy}
        onContinue={handleContinueToSize}
        onReplace={clearPhoto}
      />
    );
  } else if (step === 3) {
    screen = (
      <PhotoSizeSelector
        presetId={presetId}
        onPresetChange={setPresetId}
        onNext={handleContinueToCrop}
        onBack={() => setStep(2)}
      />
    );
  } else if (step === 4 && img && preset) {
    screen = (
      <CropEditor
        key={`${preset.id}`}
        img={img}
        imageUrl={imageUrl}
        preset={preset}
        faceBox={faceBox}
        onCropChange={setCrop}
        onNext={handlePreviewFinal}
        onBack={() => setStep(3)}
        onReplaceRequest={clearPhoto}
      />
    );
  } else if (step === 5 && img && preset && crop) {
    screen = (
      <DownloadPanel
        img={img}
        fileName={file ? file.name : undefined}
        crop={crop}
        preset={preset}
        onEditCrop={() => setStep(4)}
        onStartOver={clearPhoto}
      />
    );
  }

  return (
    <div className="app">
      <header className="site-header app-header">
        <div className="app-brand">
          <span className="logo-dot" aria-hidden="true" />
          <h1>Passport Photo Maker</h1>
        </div>
        <button type="button" className="back-button" onClick={returnToLanding}>
          &larr; Back to home
        </button>
      </header>
      
      <p className="disclaimer">
        This tool helps you prepare a well-cropped passport-size photo, Always
        verify the latest official requirements before submitting an application.
      </p>
      
      <nav className="stepper" aria-label="Progress">
        {STEPS.map((label, i) => (
          <div
            key={label}
            className={`step${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}
            aria-current={i === step ? 'step' : undefined}
          >
            {i + 1}. {label}
          </div>
        ))}
      </nav>
      
      {error && (
        <div className="error-banner" role="alert">
          {error}{' '}
          <button onClick={() => setError(null)} style={{ marginLeft: 8 }}>Dismiss</button>
        </div>
      )}
      
      {screen}
      
      {step > 0 && !busy && (
        <p className="hint" style={{ textAlign: 'center' }}>
          Your photo stays on this device.{' '}
          <button onClick={clearPhoto} style={{ padding: '2px 6px', fontSize: '0.8rem' }}>
            Reset &amp; remove photo
          </button>
        </p>
      )}
      
      <footer className="site-footer">
        All processing happens locally in your browser · No uploads · No account needed
      </footer>
    </div>
  );
}