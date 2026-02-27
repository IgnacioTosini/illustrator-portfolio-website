import './_adminModal.scss';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
}

export const AdminModal = ({ isOpen, onClose, children }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="adminModalOverlay" onClick={onClose}>
            <div className="adminModal" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}
