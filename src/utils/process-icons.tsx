import {
    IoChatbubbleEllipsesOutline,
    IoCheckmarkDoneOutline,
    IoColorPaletteOutline,
    IoDocumentTextOutline,
    IoImagesOutline,
    IoPencilOutline,
    IoRocketOutline,
} from 'react-icons/io5';
import { LuSend } from 'react-icons/lu';
import type { IconType } from 'react-icons';
import type { ProcessIconKey } from '@/types/home-content';

export const PROCESS_ICON_OPTIONS: { key: ProcessIconKey; label: string; Icon: IconType }[] = [
    { key: 'document', label: 'Brief', Icon: IoDocumentTextOutline },
    { key: 'pencil', label: 'Boceto', Icon: IoPencilOutline },
    { key: 'images', label: 'Arte final', Icon: IoImagesOutline },
    { key: 'send', label: 'Entrega', Icon: LuSend },
    { key: 'palette', label: 'Color', Icon: IoColorPaletteOutline },
    { key: 'check', label: 'Aprobación', Icon: IoCheckmarkDoneOutline },
    { key: 'chat', label: 'Conversación', Icon: IoChatbubbleEllipsesOutline },
    { key: 'rocket', label: 'Lanzamiento', Icon: IoRocketOutline },
];

export function getProcessIcon(key?: ProcessIconKey): IconType {
    return PROCESS_ICON_OPTIONS.find((option) => option.key === key)?.Icon ?? IoDocumentTextOutline;
}
