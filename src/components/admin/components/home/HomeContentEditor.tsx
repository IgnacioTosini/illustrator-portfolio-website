'use client';

import { type FormEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import type { HomeContent, HomeLocale, ProcessIconKey } from '@/types/home-content';
import type { Project } from '@/types';
import ImageCropEditor from '@/components/admin/components/ui/ImageCropEditor/ImageCropEditor';
import { PROCESS_ICON_OPTIONS } from '@/utils/process-icons';
import { saveHomeContent } from '@/actions/home/saveHomeContent';
import HeroSection from '@/components/sections/HeroSection/HeroSection';
import WorkSection from '@/components/sections/WorkSection/WorkSection';
import AboutSection from '@/components/sections/AboutSection/AboutSection';
import ProcessSection from '@/components/sections/ProcessSection/ProcessSection';
import ContactSection from '@/components/sections/ContactSection/ContactSection';
import Header from '@/components/layout/Header/Header';
import Footer from '@/components/layout/Footer/Footer';
import './_homeContentEditor.scss';
import { dataUrlToImageFile, deleteUploadedImageUrls, uploadImageFiles } from '@/lib/client/project-images';

type LocaleCode = 'es' | 'en';
type LocaleSection = keyof HomeLocale;
type EditableImage = 'hero' | 'about';

interface CropTarget {
    image: EditableImage;
    src: string;
    fileName: string;
}

interface Props {
    initialContent: HomeContent;
    projects: Project[];
}

function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('No se pudo leer la imagen.'));
        reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
        reader.readAsDataURL(file);
    });
}

export default function HomeContentEditor({ initialContent, projects }: Props) {
    const router = useRouter();
    const [content, setContent] = useState(initialContent);
    const [locale, setLocale] = useState<LocaleCode>('es');
    const [heroImageDraft, setHeroImageDraft] = useState<string | null>(null);
    const [aboutImageDraft, setAboutImageDraft] = useState<string | null>(null);
    const [cropTarget, setCropTarget] = useState<CropTarget | null>(null);
    const [isPreview, setIsPreview] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [imageError, setImageError] = useState('');

    const localeContent = content[locale];
    const previewContent: HomeContent = {
        ...content,
        heroImage: heroImageDraft ?? content.heroImage,
        aboutImage: aboutImageDraft ?? content.aboutImage,
    };

    const updateSectionField = (section: LocaleSection, field: string, value: string) => {
        setContent((current) => {
            const sectionValue = current[locale][section] as unknown as Record<string, unknown>;
            return {
                ...current,
                [locale]: {
                    ...current[locale],
                    [section]: { ...sectionValue, [field]: value },
                },
            };
        });
    };

    const updateAboutList = (field: 'paragraphs' | 'abilities' | 'tools', values: string[]) => {
        setContent((current) => {
            return { ...current, [locale]: { ...current[locale], about: { ...current[locale].about, [field]: values } } };
        });
    };

    const updateProcessStep = (index: number, field: 'title' | 'description' | 'icon', value: string) => {
        setContent((current) => {
            const steps = current[locale].process.steps.map((step, stepIndex) => {
                if (stepIndex !== index) return step;
                if (field === 'icon') return { ...step, icon: value as ProcessIconKey };
                if (field === 'title') return { ...step, title: value };
                return { ...step, description: value };
            });
            return { ...current, [locale]: { ...current[locale], process: { ...current[locale].process, steps } } };
        });
    };

    const addProcessStep = () => {
        setContent((current) => ({
            ...current,
            [locale]: {
                ...current[locale],
                process: { ...current[locale].process, steps: [...current[locale].process.steps, { title: '', description: '', icon: 'document' }] },
            },
        }));
    };

    const removeProcessStep = (index: number) => {
        setContent((current) => ({
            ...current,
            [locale]: {
                ...current[locale],
                process: { ...current[locale].process, steps: current[locale].process.steps.filter((_, stepIndex) => stepIndex !== index) },
            },
        }));
    };

    const readImageFile = async (file: File | undefined, image: EditableImage) => {
        if (!file) return;
        setImageError('');
        if (!file.type.startsWith('image/')) {
            setImageError('Selecciona un archivo de imagen.');
            return;
        }
        if (file.size > 12 * 1024 * 1024) {
            setImageError('Cada imagen debe pesar menos de 12 MB.');
            return;
        }
        try {
            const dataUrl = await readFile(file);
            setCropTarget({ image, src: dataUrl, fileName: file.name });
        } catch (error) {
            setImageError(error instanceof Error ? error.message : 'No se pudo cargar la imagen.');
        }
    };

    const openImageEditor = (image: EditableImage, src: string) => {
        setImageError('');
        setCropTarget({ image, src, fileName: `home-${image}.webp` });
    };

    const applyImageCrop = async (file: File) => {
        if (!cropTarget) return;
        const dataUrl = await readFile(file);
        if (cropTarget.image === 'hero') setHeroImageDraft(dataUrl);
        else setAboutImageDraft(dataUrl);
        setCropTarget(null);
    };

    const saveChanges = async () => {
        setIsSaving(true);
        let uploadedUrls: string[] = [];
        try {
            const pendingDrafts = [
                ...(heroImageDraft?.startsWith('data:image/') ? [{ key: 'heroImage' as const, draft: heroImageDraft }] : []),
                ...(aboutImageDraft?.startsWith('data:image/') ? [{ key: 'aboutImage' as const, draft: aboutImageDraft }] : []),
            ];
            const files = await Promise.all(pendingDrafts.map(({ key, draft }) => dataUrlToImageFile(draft, `home-${key}`)));
            uploadedUrls = await uploadImageFiles(files);
            const uploadedByKey = new Map(pendingDrafts.map(({ key }, index) => [key, uploadedUrls[index]]));
            const contentToSave = {
                ...previewContent,
                heroImage: uploadedByKey.get('heroImage') ?? previewContent.heroImage,
                aboutImage: uploadedByKey.get('aboutImage') ?? previewContent.aboutImage,
            };

            const saved = await saveHomeContent(contentToSave);
            uploadedUrls = [];
            setContent(saved);
            setHeroImageDraft(null);
            setAboutImageDraft(null);
            toast.success('El contenido del inicio se guardó correctamente.');
            router.refresh();
            setIsPreview(false);
        } catch (error) {
            await deleteUploadedImageUrls(uploadedUrls);
            toast.error(error instanceof Error ? error.message : 'No se pudieron guardar los cambios.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await saveChanges();
    };

    if (isPreview) {
        return (
            <div className="homeDraftPreview">
                <div className="homePreviewToolbar">
                    <div><span>VISTA PREVIA</span><strong>Borrador sin guardar</strong></div>
                    <div className="homePreviewActions">
                        <button type="button" className="previewBackButton" onClick={() => setIsPreview(false)}>Volver a editar</button>
                        <button type="button" className="previewPublishButton" onClick={saveChanges} disabled={isSaving}>{isSaving ? 'Guardando…' : 'Guardar cambios'}</button>
                    </div>
                </div>
                <Header />
                <main className="home homePreviewCanvas" id="top">
                    <HeroSection homeContent={previewContent} preview localeOverride={locale} />
                    <WorkSection projects={projects} homeContent={previewContent} localeOverride={locale} preview />
                    <AboutSection homeContent={previewContent} localeOverride={locale} />
                    <ProcessSection homeContent={previewContent} localeOverride={locale} preview />
                    <ContactSection homeContent={previewContent} preview localeOverride={locale} />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <main className="homeContentEditor">
            <header className="homeEditorHeader">
                <div>
                    <span className="homeEditorEyebrow">CONTENIDO DEL SITIO</span>
                    <h1>Editar inicio</h1>
                    <p>Actualiza textos e imágenes del home en español e inglés.</p>
                </div>
                <Link href="/" target="_blank" className="openHomeLink">Abrir sitio <span aria-hidden="true">↗</span></Link>
            </header>

            <form id="home-content-form" className="homeEditorForm" onSubmit={handleSubmit}>
                <div className="homeEditorToolbar">
                    <div className="localeTabs" role="tablist" aria-label="Idioma del contenido">
                        <button type="button" role="tab" aria-selected={locale === 'es'} className={locale === 'es' ? 'is-active' : ''} onClick={() => setLocale('es')}>Español</button>
                        <button type="button" role="tab" aria-selected={locale === 'en'} className={locale === 'en' ? 'is-active' : ''} onClick={() => setLocale('en')}>English</button>
                    </div>
                    <span className="unsavedNote">Los cambios se publican al guardar.</span>
                </div>

                <section className="homeEditorSection">
                    <div className="homeEditorSectionHeading"><span>01</span><div><h2>Portada</h2><p>Imagen principal, presentación y botones.</p></div></div>
                    <div className="homeEditorGrid">
                        <TextField id="hero-title" label="Título corto" value={localeContent.hero.title} onChange={(value) => updateSectionField('hero', 'title', value)} />
                        <TextField id="hero-proof" label="Texto de respaldo" value={localeContent.hero.proof} onChange={(value) => updateSectionField('hero', 'proof', value)} />
                        <TextField id="hero-subtitle" label="Descripción principal" value={localeContent.hero.subtitle} onChange={(value) => updateSectionField('hero', 'subtitle', value)} multiline />
                        <TextField id="hero-cta-works" label="Botón de trabajos" value={localeContent.hero.ctaViewWorks} onChange={(value) => updateSectionField('hero', 'ctaViewWorks', value)} />
                        <TextField id="hero-cta-contact" label="Botón de contacto" value={localeContent.hero.ctaContact} onChange={(value) => updateSectionField('hero', 'ctaContact', value)} />
                        <ImageField label="Imagen principal" src={heroImageDraft ?? content.heroImage} onChange={(file) => readImageFile(file, 'hero')} onEdit={() => openImageEditor('hero', heroImageDraft ?? content.heroImage)} />
                    </div>
                </section>

                <section className="homeEditorSection">
                    <div className="homeEditorSectionHeading"><span>02</span><div><h2>Trabajos</h2><p>Títulos de la sección de proyectos destacados.</p></div></div>
                    <div className="homeEditorGrid">
                        <TextField id="works-title" label="Título" value={localeContent.workSection.title} onChange={(value) => updateSectionField('workSection', 'title', value)} />
                        <TextField id="works-subtitle" label="Subtítulo" value={localeContent.workSection.subtitle} onChange={(value) => updateSectionField('workSection', 'subtitle', value)} />
                    </div>
                </section>

                <section className="homeEditorSection">
                    <div className="homeEditorSectionHeading"><span>03</span><div><h2>Sobre mí</h2><p>Imagen, presentación, habilidades y herramientas.</p></div></div>
                    <div className="homeEditorGrid">
                        <TextField id="about-title" label="Título" value={localeContent.about.title} onChange={(value) => updateSectionField('about', 'title', value)} />
                        <TextField id="about-subtitle" label="Subtítulo" value={localeContent.about.subtitle} onChange={(value) => updateSectionField('about', 'subtitle', value)} />
                        <TextField id="about-alt" label="Texto alternativo de la imagen" value={localeContent.about.imageAlt} onChange={(value) => updateSectionField('about', 'imageAlt', value)} />
                        <ImageField label="Imagen de Sobre mí" src={aboutImageDraft ?? content.aboutImage} onChange={(file) => readImageFile(file, 'about')} onEdit={() => openImageEditor('about', aboutImageDraft ?? content.aboutImage)} />
                        {localeContent.about.paragraphs.map((paragraph, index) => (
                            <TextField key={`paragraph-${index}`} id={`about-paragraph-${index}`} label={`Párrafo ${index + 1}`} value={paragraph} onChange={(value) => updateAboutList('paragraphs', localeContent.about.paragraphs.map((item, itemIndex) => itemIndex === index ? value : item))} multiline full />
                        ))}
                        <TextField id="abilities-title" label="Título de habilidades" value={localeContent.about.abilitiesTitle} onChange={(value) => updateSectionField('about', 'abilitiesTitle', value)} />
                        <EditableList
                            label="Habilidades"
                            items={localeContent.about.abilities}
                            addLabel="Agregar habilidad"
                            itemLabel="Habilidad"
                            onChange={(items) => updateAboutList('abilities', items)}
                        />
                        <TextField id="tools-title" label="Título de herramientas" value={localeContent.about.toolsTitle} onChange={(value) => updateSectionField('about', 'toolsTitle', value)} />
                        <EditableList
                            label="Herramientas"
                            items={localeContent.about.tools}
                            addLabel="Agregar herramienta"
                            itemLabel="Herramienta"
                            onChange={(items) => updateAboutList('tools', items)}
                        />
                    </div>
                </section>

                <section className="homeEditorSection">
                    <div className="homeEditorSectionHeading"><span>04</span><div><h2>Proceso</h2><p>Pasos que describen cómo trabajas.</p></div></div>
                    <div className="homeEditorGrid">
                        <TextField id="process-title" label="Título" value={localeContent.process.title} onChange={(value) => updateSectionField('process', 'title', value)} />
                        <TextField id="process-subtitle" label="Subtítulo" value={localeContent.process.subtitle} onChange={(value) => updateSectionField('process', 'subtitle', value)} />
                        {localeContent.process.steps.map((step, index) => (
                            <div className="stepEditorGroup" key={`step-${index}`}>
                                <div className="stepEditorHeading">
                                    <span className="stepEditorNumber">PASO {String(index + 1).padStart(2, '0')}</span>
                                    <button type="button" className="removeEditorItem" onClick={() => removeProcessStep(index)} aria-label={`Eliminar paso ${index + 1}`}>Eliminar</button>
                                </div>
                                <TextField id={`step-${index}-title`} label="Título" value={step.title} onChange={(value) => updateProcessStep(index, 'title', value)} />
                                <TextField id={`step-${index}-description`} label="Descripción" value={step.description} onChange={(value) => updateProcessStep(index, 'description', value)} multiline />
                                <ProcessIconPicker value={step.icon} stepNumber={index + 1} onChange={(value) => updateProcessStep(index, 'icon', value)} />
                            </div>
                        ))}
                        <button type="button" className="addEditorItem" onClick={addProcessStep} disabled={localeContent.process.steps.length >= 12}>＋ Agregar paso</button>
                    </div>
                </section>

                <section className="homeEditorSection">
                    <div className="homeEditorSectionHeading"><span>05</span><div><h2>Contacto</h2><p>Texto de invitación al formulario de contacto.</p></div></div>
                    <div className="homeEditorGrid">
                        <TextField id="contact-title" label="Título" value={localeContent.contact.title} onChange={(value) => updateSectionField('contact', 'title', value)} />
                        <TextField id="contact-subtitle" label="Subtítulo" value={localeContent.contact.subtitle} onChange={(value) => updateSectionField('contact', 'subtitle', value)} />
                        <TextField id="contact-description" label="Descripción" value={localeContent.contact.description} onChange={(value) => updateSectionField('contact', 'description', value)} multiline full />
                    </div>
                </section>

                {imageError && <p className="homeEditorError" role="alert">{imageError}</p>}
            </form>
            <footer className="homeEditorActions">
                <button type="button" className="homePreviewButton" onClick={() => {
                    setIsPreview(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}>Vista previa</button>
                <button type="submit" form="home-content-form" className="homeSaveButton" disabled={isSaving}>{isSaving ? 'Guardando…' : 'Guardar cambios'}</button>
            </footer>
            {cropTarget && (
                <ImageCropEditor
                    key={`${cropTarget.image}-${cropTarget.src.slice(0, 80)}`}
                    src={cropTarget.src}
                    fileName={cropTarget.fileName}
                    onCancel={() => setCropTarget(null)}
                    onSave={applyImageCrop}
                />
            )}
        </main>
    );
}

function TextField({ id, label, value, onChange, multiline = false, full = false }: {
    id: string; label: string; value: string; onChange: (value: string) => void; multiline?: boolean; full?: boolean;
}) {
    return (
        <div className={`homeEditorField ${full ? 'is-full' : ''}`}>
            <label htmlFor={id}>{label}</label>
            {multiline
                ? <textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} rows={3} required />
                : <input id={id} value={value} onChange={(event) => onChange(event.target.value)} required />}
        </div>
    );
}

function ImageField({ label, src, onChange, onEdit }: { label: string; src: string; onChange: (file: File | undefined) => void; onEdit: () => void }) {
    return (
        <div className="homeEditorImageField">
            <span>{label}</span>
            <button type="button" className="homeImagePreview" onClick={onEdit} aria-label={`Ajustar zoom y posición de ${label}`}>
                <Image src={src} alt={`Vista previa: ${label}`} width={480} height={290} unoptimized />
                <span>Ajustar encuadre</span>
            </button>
            <label className="homeChooseImage">Cambiar imagen<input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => {
                onChange(event.target.files?.[0]);
                event.target.value = '';
            }} /></label>
        </div>
    );
}

function EditableList({ label, items, addLabel, itemLabel, onChange }: {
    label: string;
    items: string[];
    addLabel: string;
    itemLabel: string;
    onChange: (items: string[]) => void;
}) {
    const maxItems = 30;
    return (
        <div className="homeEditableList">
            <div className="homeEditableListHeader">
                <span>{label}</span>
                <button type="button" className="addEditorItem" onClick={() => onChange([...items, ''])} disabled={items.length >= maxItems}>＋ {addLabel}</button>
            </div>
            {items.length === 0 && <p className="emptyEditorList">Todavía no hay elementos. Agrega el primero.</p>}
            {items.map((item, index) => (
                <div className="editableListRow" key={`${label}-${index}`}>
                    <label className="visuallyHidden" htmlFor={`${label}-${index}`}>{itemLabel} {index + 1}</label>
                    <input id={`${label}-${index}`} value={item} onChange={(event) => onChange(items.map((value, itemIndex) => itemIndex === index ? event.target.value : value))} required />
                    <button type="button" className="removeEditorItem" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Eliminar ${itemLabel.toLowerCase()} ${index + 1}`}>Eliminar</button>
                </div>
            ))}
        </div>
    );
}

function ProcessIconPicker({ value, stepNumber, onChange }: { value: ProcessIconKey; stepNumber: number; onChange: (value: ProcessIconKey) => void }) {
    return (
        <div className="processIconPicker" role="group" aria-label={`Icono para el paso ${stepNumber}`}>
            <span>Icono del paso</span>
            <div className="processIconOptions">
                {PROCESS_ICON_OPTIONS.map(({ key, label, Icon }) => (
                    <button
                        key={key}
                        type="button"
                        className={value === key ? 'is-selected' : ''}
                        aria-pressed={value === key}
                        title={label}
                        onClick={() => onChange(key)}
                    >
                        <Icon aria-hidden="true" />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
