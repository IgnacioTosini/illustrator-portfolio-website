'use client';

import { PointerEvent, useEffect, useRef, useState } from 'react';
import './_imageCropEditor.scss';

interface Props {
    src: string;
    fileName: string;
    onCancel: () => void;
    onSave: (file: File) => void | Promise<void>;
}

type Point = { x: number; y: number };

export default function ImageCropEditor({ src, fileName, onCancel, onSave }: Props) {
    const imageRef = useRef<HTMLImageElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<{ pointerId: number; start: Point; offset: Point } | null>(null);
    const [naturalSize, setNaturalSize] = useState<Point | null>(null);
    const [stageSize, setStageSize] = useState<Point>({ x: 0, y: 0 });
    const [viewportSize, setViewportSize] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const updateViewportSize = () => setViewportSize({ x: window.innerWidth, y: window.innerHeight });
        updateViewportSize();
        window.addEventListener('resize', updateViewportSize);
        return () => window.removeEventListener('resize', updateViewportSize);
    }, []);

    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;

        const observer = new ResizeObserver(([entry]) => {
            setStageSize({ x: entry.contentRect.width, y: entry.contentRect.height });
        });
        observer.observe(stage);
        return () => observer.disconnect();
    }, [naturalSize]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isSaving) onCancel();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isSaving, onCancel]);

    const scale = naturalSize && stageSize.x ? (stageSize.x / naturalSize.x) * zoom : 0;
    const imageWidth = naturalSize ? naturalSize.x * scale : 0;
    const imageHeight = naturalSize ? naturalSize.y * scale : 0;

    const clampOffset = (point: Point, nextZoom: number): Point => {
        if (!stageSize.x || !stageSize.y) return point;
        return {
            x: Math.max(stageSize.x - stageSize.x * nextZoom, Math.min(0, point.x)),
            y: Math.max(stageSize.y - stageSize.y * nextZoom, Math.min(0, point.y)),
        };
    };

    const updateZoom = (value: number) => {
        const nextZoom = Math.max(1, Math.min(4, value));
        setZoom(nextZoom);
        setOffset((current) => clampOffset({
            x: (stageSize.x - stageSize.x * nextZoom) / 2 + (current.x - (stageSize.x - stageSize.x * zoom) / 2) * nextZoom / zoom,
            y: (stageSize.y - stageSize.y * nextZoom) / 2 + (current.y - (stageSize.y - stageSize.y * zoom) / 2) * nextZoom / zoom,
        }, nextZoom));
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        if (zoom <= 1) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = { pointerId: event.pointerId, start: { x: event.clientX, y: event.clientY }, offset };
    };

    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== event.pointerId) return;
        setOffset(clampOffset({
            x: drag.offset.x + event.clientX - drag.start.x,
            y: drag.offset.y + event.clientY - drag.start.y,
        }, zoom));
    };

    const handleSave = () => {
        const image = imageRef.current;
        if (!image || !naturalSize || !stageSize.x) return;

        setIsSaving(true);
        setError('');

        const sourceScale = stageSize.x / naturalSize.x * zoom;
        const sourceX = Math.max(0, Math.min(naturalSize.x - stageSize.x / sourceScale, -offset.x / sourceScale));
        const sourceY = Math.max(0, Math.min(naturalSize.y - stageSize.y / sourceScale, -offset.y / sourceScale));
        const sourceWidth = Math.min(naturalSize.x, stageSize.x / sourceScale);
        const sourceHeight = Math.min(naturalSize.y, stageSize.y / sourceScale);
        const maxOutputDimension = 4000;
        const outputScale = Math.min(1, maxOutputDimension / sourceWidth, maxOutputDimension / sourceHeight);
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(sourceWidth * outputScale));
        canvas.height = Math.max(1, Math.round(sourceHeight * outputScale));

        const context = canvas.getContext('2d');
        if (!context) {
            setIsSaving(false);
            setError('No se pudo preparar el recorte.');
            return;
        }

        try {
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
            const outputType = 'image/webp';
            canvas.toBlob(async (blob) => {
                if (!blob) {
                    setIsSaving(false);
                    setError('No se pudo exportar la imagen. Comprueba que el archivo sea accesible y vuelve a intentarlo.');
                    return;
                }
                const baseName = fileName.replace(/\.[^.]+$/, '') || 'imagen';
                const extension = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/png' ? 'png' : 'jpg';
                try {
                    await onSave(new File([blob], `${baseName}-recortada.${extension}`, { type: blob.type || outputType }));
                } catch {
                    setIsSaving(false);
                    setError('No se pudo aplicar el recorte. Vuelve a intentarlo.');
                }
            }, outputType, .96);
        } catch {
            setIsSaving(false);
            setError('No se pudo editar esta imagen desde su origen. Vuelve a subir el archivo para ajustar el encuadre.');
        }
    };

    const aspectRatio = naturalSize ? naturalSize.x / naturalSize.y : 1;
    const viewportWidth = viewportSize.x || 460;
    const viewportHeight = viewportSize.y || 750;
    const maxFrameWidth = Math.max(1, Math.min(460, viewportWidth - 72));
    const maxFrameHeight = Math.min(360, viewportHeight * .48);
    const frameWidth = naturalSize
        ? Math.max(1, Math.min(maxFrameWidth, 360 * aspectRatio, maxFrameHeight * aspectRatio))
        : Math.min(360, maxFrameWidth);

    return (
        <div className="imageCropOverlay" onMouseDown={(event) => event.target === event.currentTarget && !isSaving && onCancel()}>
            <section className="imageCropDialog" role="dialog" aria-modal="true" aria-labelledby="image-crop-title">
                <header className="imageCropHeader">
                    <div>
                        <span>AJUSTE DE IMAGEN</span>
                        <h2 id="image-crop-title">Encuadra tu imagen</h2>
                        <p>Arrastra para cambiar la posición y usa el control para ajustar el zoom.</p>
                    </div>
                    <button type="button" className="imageCropClose" onClick={onCancel} aria-label="Cerrar editor" disabled={isSaving}>×</button>
                </header>

                <div className="imageCropWorkspace">
                    <div
                        ref={stageRef}
                        className={`imageCropStage ${zoom > 1 ? 'is-draggable' : ''}`}
                        style={{ width: `${frameWidth}px`, aspectRatio }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={() => { dragRef.current = null; }}
                        onPointerCancel={() => { dragRef.current = null; }}
                    >
                        <img
                            ref={imageRef}
                            crossOrigin="anonymous"
                            src={src}
                            alt="Vista previa del recorte"
                            onLoad={(event) => setNaturalSize({ x: event.currentTarget.naturalWidth, y: event.currentTarget.naturalHeight })}
                            onError={() => setError('No se pudo cargar esta imagen para editarla.')}
                            style={naturalSize ? { width: imageWidth, height: imageHeight, left: offset.x, top: offset.y } : undefined}
                        />
                        {!naturalSize && <span className="cropLoading">Cargando imagen…</span>}
                    </div>
                </div>

                <div className="imageCropControls">
                    <label htmlFor="image-crop-zoom">Zoom <output>{zoom.toFixed(1)}×</output></label>
                    <input
                        id="image-crop-zoom"
                        type="range"
                        min="1"
                        max="4"
                        step="0.01"
                        value={zoom}
                        onChange={(event) => updateZoom(Number(event.target.value))}
                        disabled={!naturalSize || isSaving}
                    />
                    <div className="imageCropRangeLabels"><span>Ajustar</span><span>Acercar</span></div>
                </div>

                {error && <p className="imageCropError" role="alert">{error}</p>}
                <footer className="imageCropActions">
                    <button type="button" className="cropCancelButton" onClick={onCancel} disabled={isSaving}>Cancelar</button>
                    <button type="button" className="cropSaveButton" onClick={handleSave} disabled={!naturalSize || isSaving}>
                        {isSaving ? 'Aplicando…' : 'Aplicar recorte'}
                    </button>
                </footer>
            </section>
        </div>
    );
}
