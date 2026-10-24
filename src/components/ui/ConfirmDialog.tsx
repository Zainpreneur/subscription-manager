import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  loading?: boolean;
}

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Confirm', message = 'Are you sure?', loading }: ConfirmProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} width="max-w-md">
      <p className="text-sm text-slate-300 mb-5">{message}</p>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>Delete</Button>
      </div>
    </Modal>
  );
}
