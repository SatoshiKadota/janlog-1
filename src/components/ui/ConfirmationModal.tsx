import { Button } from './Button';

interface ConfirmationModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmationModal({ isOpen, title = '確認', message, onConfirm, onCancel }: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6 space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{message}</p>
                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" onClick={onCancel}>
                        キャンセル
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        削除する
                    </Button>
                </div>
            </div>
        </div>
    );
}
