import { FC, PropsWithChildren, ReactNode, ChangeEvent } from 'react';
import { LockClosedIcon } from './icons';

export const Card: FC<PropsWithChildren<{ className?: string }>> = ({ children, className = '' }) => (
  <div className={`bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

export const Section: FC<PropsWithChildren<{ title: string; icon: ReactNode; id: string }>> = ({
  title,
  icon,
  id,
  children,
}) => (
  <div id={id} className="mt-8">
    <h2 className="text-3xl font-bold mb-4 text-green-400 flex items-center gap-3">
      {icon} {title}
    </h2>
    <Card>{children}</Card>
  </div>
);

export const LoadingSpinner: FC<{ size?: number }> = ({ size = 24 }) => (
  <svg className="animate-spin text-green-400" style={{ width: size, height: size }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export const ErrorMessage: FC<{ error: string | null | undefined }> = ({ error }) => {
  if (!error) return null;
  return <div className="p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg mt-4">{error}</div>;
};

export const FormInput: FC<{
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  name?: string;
}> = ({ label, value, onChange, placeholder, type = 'text', required = false, name }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      name={name}
      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
    />
  </div>
);

export const FormTextArea: FC<{
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  name?: string;
}> = ({ label, value, onChange, placeholder, rows = 4, required = false, name }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      name={name}
      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
    />
  </div>
);

export const ActionButton: FC<PropsWithChildren<{ onClick: (e?: any) => void; loading?: boolean; disabled?: boolean; className?: string }>> = ({
  onClick,
  loading,
  disabled = false,
  className = '',
  children,
}) => (
  <button
    onClick={onClick}
    disabled={loading || disabled}
    className={`w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition ${className}`}
  >
    {loading ? (
      <>
        <LoadingSpinner size={20} /> Generating...
      </>
    ) : (
      children
    )}
  </button>
);

export const ToolCard: FC<
  PropsWithChildren<{
    icon: ReactNode;
    title: string;
    description: string;
    isUnlocked: boolean;
    missingDeps?: string[];
  }>
> = ({ icon, title, description, isUnlocked, missingDeps = [], children }) => (
  <Card className="flex flex-col h-full">
    <div className="flex items-center gap-4">
      <div className="text-green-400">{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm mt-2 mb-4 flex-grow">{description}</p>
    {isUnlocked ? <div>{children}</div> : (
      <div className="mt-auto pt-4 border-t border-gray-700 text-center">
        <div className="flex items-center justify-center text-yellow-400 text-sm">
          <LockClosedIcon />
          <span className="ml-2">Requires: {missingDeps.join(', ')}</span>
        </div>
      </div>
    )}
  </Card>
);
