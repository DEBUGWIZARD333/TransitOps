const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4 py-6">
    <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <button onClick={onClose} className="text-sm text-slate-500">Close</button>
      </div>
      {children}
    </div>
  </div>
);

export default Modal;
